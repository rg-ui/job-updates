import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import webpush from 'web-push';

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_EMAIL = process.env.VAPID_EMAIL || 'mailto:support@jobniti.in';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

export async function POST(request: Request) {
  try {
    // Verify admin secret
    const authHeader = request.headers.get('authorization');
    const adminSecret = process.env.PUSH_ADMIN_SECRET;
    if (!adminSecret || authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      return NextResponse.json({ error: 'VAPID keys not configured' }, { status: 503 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const body = await request.json();
    const { title, body: notificationBody, url, tag } = body;

    if (!title || !notificationBody) {
      return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
    }

    // Fetch all subscriptions
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('endpoint, p256dh, auth');

    if (error || !subscriptions) {
      return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
    }

    const payload = JSON.stringify({
      title,
      body: notificationBody,
      url: url || '/',
      tag: tag || 'jobniti-push',
      icon: '/jobniti-favicon.png',
      badge: '/jobniti-favicon-48.png',
    });

    let sentCount = 0;
    let failedEndpoints: string[] = [];

    const sendPromises = subscriptions.map(async (sub) => {
      try {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        await webpush.sendNotification(pushSubscription, payload);
        sentCount++;
      } catch (err: any) {
        // 404 or 410 = subscription expired, remove it
        if (err.statusCode === 404 || err.statusCode === 410) {
          failedEndpoints.push(sub.endpoint);
        }
        console.error(`Push failed for ${sub.endpoint}:`, err.message);
      }
    });

    await Promise.allSettled(sendPromises);

    // Clean up expired subscriptions
    if (failedEndpoints.length > 0) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .in('endpoint', failedEndpoints);
    }

    return NextResponse.json({
      success: true,
      sent: sentCount,
      total: subscriptions.length,
      cleaned: failedEndpoints.length,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
