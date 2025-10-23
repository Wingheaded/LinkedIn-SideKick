import Parser from 'rss-parser';

export type FeedItem = {
  title?: string;
  link?: string;
  isoDate?: string;
  contentSnippet?: string;
};

const parser = new Parser();

export async function fetchRss(url: string) {
  const feed = await parser.parseURL(url);
  return feed.items as FeedItem[];
}