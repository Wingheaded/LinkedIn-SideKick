export function cleanTracking(url: string): string {
  try {
    const u = new URL(url);
    // Remove tracking params
    [...u.searchParams.keys()].forEach(k => {
      if (k.startsWith('utm_') || k === 'fbclid' || k === 'gclid') u.searchParams.delete(k);
    });
    return u.toString();
  } catch {
    return url;
  }
}
export function isApproved(url: string, approved: Set<string>): boolean {
  try {
    const u = new URL(url);
    return approved.has(u.hostname.replace('www.', ''));
  } catch {
    return false;
  }
}
export function isWithinDays(isoDate?: string, days=14) {
  if (!isoDate) return false;
  const d = new Date(isoDate);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / (1000*60*60*24);
  return diff >= 0 && diff <= days;
}