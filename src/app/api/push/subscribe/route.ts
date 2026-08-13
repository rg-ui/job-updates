import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const MAX_ENDPOINT_LENGTH = 2048;
const MAX_KEY_LENGTH = 256;

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidBase64(str: string): boolean {
  return /^[A-Za-z0-9+/=]+$/.test(str) && str.length <= MAX_KEY_LENGTH;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { endpoint, keys } = body;

    // Input validation
    if (!endpoint || typeof endpoint !== 'string') {
      return NextResponse.json({ error: 'Invalid subscription data' }, { status: 400 });
    }
    if (!keys?.p256dh || !keys?.auth) {
      return NextResponse.json({ error: 'Invalid subscription data' }, { status: 400 });
    }
    if (!isValidUrl(endpoint)) {
      return NextResponse.json({ error: 'Invalid endpoint URL' }, { status: 400 });
    }
    if (endpoint.length > MAX_ENDPOINT_LENGTH) {
      return NextResponse.json({ error: 'Endpoint too long' }, { status: 400 });
    }
    if (!isValidBase64(keys.p256dh) || !isValidBase64(keys.auth)) {
      return NextResponse.json({ error: 'Invalid key format' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    const { error } = await supabase
      .from('push_subscriptions')
      .upsert(
        {
          endpoint,
          p256dh: keys.p256dh,
          auth: keys.auth,
          user_agent: (request.headers.get('user-agent') || '').slice(0, 500),
          created_at: new Date().toISOString(),
        },
        { onConflict: 'endpoint' }
      );

    if (error) {
      console.error('Subscription save error');
      return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
