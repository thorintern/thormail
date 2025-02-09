import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { THORMAIL_ADDRESS } from '@/lib/constants';
import { MidgardActionListDTO, MidgardActionDTO } from '@/types/midgard';

const midgardUrl = "https://midgard.ninerealms.com";
const customHeaders = { "x-client-id": "thormail" };

export async function GET() {
  try {
    // Check cache in Postgres
    // Fetch cached value with error handling
    const { rows } = await sql`
      SELECT value FROM message_cache 
      WHERE key = 'midgard-actions' 
      AND expires_at > NOW()
      ORDER BY created_at DESC 
      LIMIT 1
    `.catch((error) => {
      console.error('Cache read error:', error);
      return { rows: [] };
    });
    
    if (rows.length > 0) {
      return NextResponse.json(rows[0].value, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=30'
        }
      });
    }

    const response = await fetch(
      `${midgardUrl}/v2/actions?address=${THORMAIL_ADDRESS}`,
      { headers: { ...customHeaders, 'Accept': 'application/json' } }
    );

    const data: MidgardActionListDTO = await response.json();
    
    // Get existing cached actions and their txIDs
    const { rows: existingRows } = await sql`
      SELECT value FROM message_cache 
      WHERE key = 'midgard-actions'
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    const existingTxIDs = new Set(
      existingRows[0]?.value?.actions
        ?.flatMap((action: MidgardActionDTO) => action.metadata?.send?.txID)
        .filter(Boolean) || []
    );

    // Filter new actions that aren't in the cache
    const newActions = data.actions.filter(
      (action) => !existingTxIDs.has(action.metadata?.send?.txID)
    );

    // Only update cache if we found new actions
    if (newActions.length > 0) {
      const mergedActions = [
        ...newActions,
        ...(existingRows[0]?.value?.actions || [])
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      await sql`
        INSERT INTO message_cache (key, value, expires_at) 
        VALUES (
          'midgard-actions', 
          ${JSON.stringify({ ...data, actions: mergedActions })}, 
          NOW() + INTERVAL '30 seconds'
        )
      `.catch((error) => {
        console.error('Cache write error:', error);
      });
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Midgard API error:', error);
    
    // Fallback to latest cached value even if expired
    const { rows } = await sql`
      SELECT value FROM message_cache 
      WHERE key = 'midgard-actions'
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    return rows.length > 0 
      ? NextResponse.json(rows[0].value) 
      : NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
