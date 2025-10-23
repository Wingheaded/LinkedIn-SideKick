import * as cheerio from 'cheerio';

export async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 LinkedInSidekick' } });
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);
    const og = $('meta[property="og:image"]').attr('content')
           || $('meta[name="twitter:image"]').attr('content')
           || $('link[rel="image_src"]').attr('href');
    return og || null;
  } catch {
    return null;
  }
}