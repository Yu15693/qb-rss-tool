import path from 'path';
import RSSParser from 'rss-parser';
import { ResponseType, fetch } from '@tauri-apps/api/http';
import { open, confirm } from '@tauri-apps/api/dialog';
import { writeTextFile, exists, createDir } from '@tauri-apps/api/fs';
import { fileNameLimitRegExp } from './format';
import { SubItem } from '@/views/index/store';

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

export async function exportRuleFile(subList: SubItem[]): Promise<string> {
  // check rules
  if (subList.length === 0) {
    throw new Error('订阅列表为空');
  }
  for (const subItem of subList) {
    const { title } = subItem;
    if (!title) {
      throw new Error('订阅标题不能为空');
    }
    if (fileNameLimitRegExp.test(title)) {
      throw new Error(`标题含特殊字符：${title}`);
    }
  }
  const titleList = subList.map(v => v.title);
  if (new Set(titleList).size !== titleList.length) {
    throw new Error('标题不能重复');
  }

  // get dir path
  const dirPath = await open({
    directory: true,
  });
  if (!dirPath || Array.isArray(dirPath)) {
    return '';
  }
  const confirmed = await confirm(`导出路径为 ${dirPath} ,你确定吗？`, {
    title: '请确认导出路径',
    type: 'info',
    okLabel: '确定',
    cancelLabel: '取消',
  });
  if (!confirmed) {
    return '';
  }

  // generate rule obj
  const ruleRecord: Record<string, object> = {};
  for (const subItem of subList) {
    const { link, title, mustContain, mustNotContain, useRegex } = subItem;
    ruleRecord[title] = {
      addPaused: null,
      affectedFeeds: [link],
      assignedCategory: '',
      enabled: true,
      episodeFilter: '',
      ignoreDays: 0,
      // TODO: check
      lastMatch: '',
      mustContain,
      mustNotContain,
      previouslyMatchedEpisodes: [],
      savePath: path.join(dirPath, title),
      smartFilter: false,
      torrentContentLayout: null,
      useRegex,
    };
  }

  // write files
  const linkText = subList.map(v => `${v.title}\n${v.link}`).join('\n');
  await writeTextFile(`${dirPath}\\rule.json`, JSON.stringify(ruleRecord), {
    append: false,
  });
  await writeTextFile(`${dirPath}\\link.txt`, linkText, {
    append: false,
  });
  const taskList = titleList.map(async title => {
    const path = `${dirPath}\\${title}`;
    const isExisted = await exists(path);
    if (!isExisted) {
      await createDir(path);
    }
  });
  await Promise.all(taskList);
  return '导出数据成功';
}
