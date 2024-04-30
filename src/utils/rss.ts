import RSSParser from 'rss-parser';
import { ResponseType, fetch } from '@tauri-apps/api/http';

export interface RSSFeed {
  title: string;
  description: string;
  link: string;
  items: RSSFeedItem[];
}

interface RSSFeedItem {
  title: string;
  link: string;
  enclosure: RSSFeedEnclosure;
}

interface RSSFeedEnclosure {
  length: string;
  type: string;
  url: string;
}

const rssParser = new RSSParser();
export async function fetchRSS(url: string) {
  const res = await fetch<string>(url, {
    method: 'GET',
    timeout: 10000,
    responseType: ResponseType.Text,
  });
  const rssObj = await rssParser.parseString(res.data);
  return rssObj as unknown as RSSFeed;
}
