import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import webpush from 'web-push';
import crypto from 'crypto';

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_EMAIL = process.env.VAPID_EMAIL || 'mailto:support@jobniti.in';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

// Timing-safe auth comparison
function verifyAuth(authHeader: string | null): boolean {
  if (!authHeader) return false;
  const adminSecret = process.env.PUSH_ADMIN_SECRET;
  if (!adminSecret) return false;

  const token = authHeader.replace('Bearer ', '');
  const expected = Buffer.from(token);
  const actual = Buffer.from(adminSecret);

  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
}

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string, limit = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

function isValidPushUrl(url: string): boolean {
  if (!url || url.length > 500) return false;
  try {
    const parsed = new URL(url, 'https://jobniti.in');
    return parsed.origin === 'https://jobniti.in';
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // Auth check with timing-safe comparison
    if (!verifyAuth(request.headers.get('authorization'))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(clientIp, 10, 60000)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      return NextResponse.json({ error: 'Push notifications not configured' }, { status: 503 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    const body = await request.json();
    const { title, body: notificationBody, url, tag } = body;

    if (!title || typeof title !== 'string' || title.length > 200) {
      return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
    }
    if (!notificationBody || typeof notificationBody !== 'string' || notificationBody.length > 500) {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }
    if (url && !isValidPushUrl(url)) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
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
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
        sentCount++;
      } catch (err: any) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          failedEndpoints.push(sub.endpoint);
        }
      }
    });

    await Promise.allSettled(sendPromises);

    // Clean up expired subscriptions
    if (failedEndpoints.length > 0) {
      await supabase.from('push_subscriptions').delete().in('endpoint', failedEndpoints);
    }

    return NextResponse.json({
      success: true,
      sent: sentCount,
      total: subscriptions.length,
      cleaned: failedEndpoints.length,
    });
  } catch {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}
