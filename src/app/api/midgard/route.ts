import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { THORMAIL_ADDRESS } from '@/lib/constants';
import { MidgardActionListDTO } from '@/types/midgard';

const midgardUrl = "https://midgard.ninerealms.com";
const customHeaders = { "x-client-id": "thormail" };

export async function GET() {
  try {
    // Check cache in Postgres
    const { rows } = await sql`
      SELECT value FROM message_cache 
      WHERE key = 'midgard-actions' 
      AND expires_at > NOW() 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    if (rows.length > 0) {
      return NextResponse.json(rows[0].value);
    }

    const response = await fetch(
      `${midgardUrl}/v2/actions?address=${THORMAIL_ADDRESS}`,
      { headers: { ...customHeaders, 'Accept': 'application/json' } }
    );

    const data: MidgardActionListDTO = await response.json();
    
    // Store in Postgres with TTL
    await sql`
      INSERT INTO message_cache (key, value, expires_at) 
      VALUES ('midgard-actions', ${data}, NOW() + INTERVAL '30 seconds')
    `;

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
