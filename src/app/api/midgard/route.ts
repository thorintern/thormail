import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { THORMAIL_ADDRESS } from '@/lib/constants';
import { MidgardActionListDTO, MidgardActionDTO } from '@/types/midgard';

const midgardUrl = "https://midgard.ninerealms.com";
const customHeaders = { "x-client-id": "thormail" };

async function fetchAllPages(baseUrl: string): Promise<MidgardActionDTO[]> {
  let allActions: MidgardActionDTO[] = [];
  let nextPageToken: string | undefined = undefined;

  do {
    const url = nextPageToken ? `${baseUrl}&pageToken=${nextPageToken}` : baseUrl;
    const response = await fetch(url, { headers: { ...customHeaders, 'Accept': 'application/json' } });
    const data: MidgardActionListDTO = await response.json();

    if (data.actions) {
      allActions = allActions.concat(data.actions);
      nextPageToken = data.meta?.nextPageToken;
    } else {
      nextPageToken = undefined;
    }
  } while (nextPageToken);

  return allActions;
}

export async function GET() {
  try {
    // Check the cache in Postgres
    const { rows: cachedRows } = await sql`
      SELECT value FROM message_cache 
      WHERE key = 'midgard-actions' 
      ORDER BY created_at DESC 
      LIMIT 1
    `.catch((error) => {
      console.error('Cache read error:', error);
      return { rows: [] };
    });

    const cachedActions: MidgardActionDTO[] = cachedRows.length > 0 ? JSON.parse(cachedRows[0].value) : [];

    // Fetch new actions from Midgard
    const newActions = await fetchAllPages(`${midgardUrl}/v2/actions?address=${THORMAIL_ADDRESS}`);
    
    // Merge new actions with cached actions, ensuring uniqueness by transaction ID (txID)
    const mergedActions = [
      ...new Map([...newActions, ...cachedActions].map(action => [action.in[0]?.txID, action])).values()
    ].sort((a, b) => Number(b.date) - Number(a.date)); // Sort by date in descending order

    // Store merged actions in Postgres with TTL
    await sql`
      INSERT INTO message_cache (key, value, expires_at) 
      VALUES ('midgard-actions', ${JSON.stringify(mergedActions)}, NOW() + INTERVAL '30 seconds')
    `.catch((error) => {
      console.error('Cache write error:', error);
    });

    return NextResponse.json(mergedActions, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Midgard API error:', error);

    // Fallback to latest cached value if API fails
    const { rows } = await sql`
      SELECT value FROM message_cache 
      WHERE key = 'midgard-actions'
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    
    return rows.length > 0 
      ? NextResponse.json(JSON.parse(rows[0].value)) 
      : NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
