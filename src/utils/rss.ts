import path from 'path';
import RSSParser from 'rss-parser';
import { ResponseType, fetch } from '@tauri-apps/api/http';
import { open, confirm } from '@tauri-apps/api/dialog';
import { exists, createDir } from '@tauri-apps/api/fs';
import { intersection } from 'lodash-es';
import { fileNameLimitRegExp } from './format';
import { QbApiWrapper } from './qb-api';
import { recordLog } from './log';
import { SubItem } from '@/views/index/store';
import { AuthConfig } from '@/views/settings/store';

export interface RSSDownloadRule {
  enabled: boolean;
  mustContain: string;
  mustNotContain: string;
  useRegex: boolean;
  episodeFilter: string;
  smartFilter: boolean;
  previouslyMatchedEpisodes: any[];
  affectedFeeds: string[];
  ignoreDays: number;
  lastMatch: string;
  addPaused: boolean;
  assignedCategory: string;
  savePath: string;
}

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
    timeout: 20000,
    responseType: ResponseType.Text,
  });
  if (!res.ok) {
    throw new Error(res.data);
  }
  const rssObj = await rssParser.parseString(res.data);
  return rssObj as unknown as RSSFeed;
}

export async function injectRuleData(
  authConfig: AuthConfig,
  subList: SubItem[],
): Promise<string> {
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
  // check qb status
  if (!authConfig.ip || !authConfig.port) {
    throw new Error('请先填写设置页的ip地址和端口');
  }

  const qbApiWrapper = new QbApiWrapper(authConfig);
  await qbApiWrapper.login();
  const version = await qbApiWrapper.getVersion();
  const apiVersion = await qbApiWrapper.getApiVersion();
  recordLog('info', 'injectRuleData-qb', { version, apiVersion });

  const rssLinkList = await qbApiWrapper.rssGetAllLink();
  const subItemLinkList = subList.map(v => v.link);
  const sameLinkList = intersection(rssLinkList, subItemLinkList);
  if (sameLinkList.length > 0) {
    throw new Error(
      `qb 中含有相同地址的 rss 订阅：${sameLinkList.join(' ; ')}`,
    );
  }
  const ruleList = await qbApiWrapper.rssRuleGetAll();
  const ruleTitleList = Object.keys(ruleList);
  const sameTitleList = intersection(ruleTitleList, titleList);
  if (sameTitleList.length > 0) {
    throw new Error(
      `qb 中含有相同标题的下载规则：${sameTitleList.join(' ; ')}`,
    );
  }

  // get dir path
  const dirPath = await open({
    directory: true,
  });
  if (!dirPath || Array.isArray(dirPath)) {
    return '';
  }
  const confirmed = await confirm(`存储路径为 ${dirPath} ,你确定吗？`, {
    title: '请确认存储路径',
    type: 'info',
    okLabel: '确定',
    cancelLabel: '取消',
  });
  if (!confirmed) {
    return '';
  }

  // write files
  const taskList = titleList.map(async title => {
    const curPath = path.join(dirPath, title);
    const isExisted = await exists(curPath);
    if (!isExisted) {
      await createDir(curPath);
    }
  });
  await Promise.all(taskList);

  // inject rss and rule
  const rssTaskList = subItemLinkList.map(v => qbApiWrapper.rssAdd(v));
  await Promise.all(rssTaskList);
  const ruleTaskList = subList.map(subItem => {
    const { link, title, mustContain, mustNotContain, useRegex } = subItem;
    const rule: RSSDownloadRule = {
      addPaused: false,
      affectedFeeds: [link],
      assignedCategory: '',
      enabled: true,
      episodeFilter: '',
      ignoreDays: 0,
      lastMatch: '',
      mustContain,
      mustNotContain,
      previouslyMatchedEpisodes: [],
      savePath: path.join(dirPath, title),
      smartFilter: false,
      useRegex,
    };
    return qbApiWrapper.rssRuleAdd(title, rule);
  });
  await Promise.all(ruleTaskList);

  return '导出数据成功';
}
