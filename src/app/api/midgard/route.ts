import { NextResponse } from 'next/server';
import { THORMAIL_ADDRESS } from '@/lib/constants';
import { MidgardActionListDTO } from '@/types/midgard';
import { kv } from '@vercel/kv';

const midgardUrl = "https://midgard.ninerealms.com";
const customHeaders = { "x-client-id": "thormail" };

export async function GET() {
  try {
    // Check cache first
    const cached = await kv.get<MidgardActionListDTO>('midgard-actions');
    if (cached) {
      return NextResponse.json(cached);
    }

    const response = await fetch(
      `${midgardUrl}/v2/actions?address=${THORMAIL_ADDRESS}`,
      {
        method: 'GET',
        headers: {
          ...customHeaders,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    const data: MidgardActionListDTO = await response.json();
    // Set cache with 30 second TTL
    await kv.setex('midgard-actions', 30, data);
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error) {
    console.error('Midgard API error:', error);
    // Return cached data if available
    const cached = await kv.get<MidgardActionListDTO>('midgard-actions');
    if (cached) {
      return NextResponse.json(cached);
    }
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
