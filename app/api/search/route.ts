import { NextRequest, NextResponse } from 'next/server';
import { SOURCES, APPROVED_DOMAINS } from '@/lib/sources';
import { fetchRss, FeedItem } from '@/lib/rss';
import { cleanTracking, isApproved, isWithinDays } from '@/lib/url';
import { fetchOgImage } from '@/lib/og';
import { isUrlUsedWithin } from '@/lib/store';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').toLowerCase();
  const domains = SOURCES; // could filter by query later

  // Pull 4–8 feeds in parallel
  const results: any[] = [];
  await Promise.all(domains.map(async (src) => {
    for (const feed of src.rss) {
      try {
        const items = await fetchRss(feed);
        for (const it of items.slice(0, 30)) {
          const link = it.link ? cleanTracking(it.link) : '';
          if (!link || !isApproved(link, new Set([src.domain]))) continue;
          if (!isWithinDays(it.isoDate, 14)) continue;
          const hay = (it.title || '') + ' ' + (it.contentSnippet || '');
          if (q && !hay.toLowerCase().includes(q)) continue;
          results.push({
            source: src.name,
            domain: src.domain,
            title: it.title,
            url: link,
            isoDate: it.isoDate,
            summary: it.contentSnippet
          });
        }
      } catch (e) {
        // ignore failing feed
      }
    }
  }));

  // Deduplicate by URL
  const unique = new Map<string, any>();
  for (const r of results) {
    if (!unique.has(r.url)) unique.set(r.url, r);
  }

  // Attach OG image (best-effort, not blocking)
  const arrAll = Array.from(unique.values()).slice(0, 50);
  // Filter out URLs used within last 14 days unless forceUsed=true
  const forceUsed = (searchParams.get('forceUsed') || '').toLowerCase() === 'true';
  const arrFiltered = [] as any[];
  for (const it of arrAll) {
    const used = await isUrlUsedWithin(it.url, 14);
    if (forceUsed || !used) arrFiltered.push(it);
  }

  const arr = arrFiltered.slice(0, 25);
  await Promise.all(arr.map(async item => {
    item.image = await fetchOgImage(item.url);
  }));

  return NextResponse.json({ ok: true, count: arr.length, items: arr });
}