import { ResponseType, fetch, Body } from '@tauri-apps/api/http';
import { RSSDownloadRule } from './rss';
import { AuthConfig } from '@/views/settings/store';

export class QbApiWrapper {
  authConfig: AuthConfig;

  urlPrefix: string;

  cookieSID: string;

  constructor(authConfig: AuthConfig) {
    this.authConfig = authConfig;
    this.urlPrefix = `http://${authConfig.ip}:${authConfig.port}/api/v2`;
    this.cookieSID = '';
  }

  async login() {
    const path = '/auth/login';
    const data = new FormData();
    data.append('username', this.authConfig.username);
    data.append('password', this.authConfig.password);
    const loginRes = await fetch<string>(this.urlPrefix + path, {
      method: 'POST',
      timeout: 10000,
      responseType: ResponseType.Text,
      body: Body.form(data),
    });
    if (!loginRes.ok) {
      throw new Error(loginRes.data);
    }
    if (loginRes.data.includes('Fail')) {
      throw new Error('验证失败，请检查用户名和密码是否输入错误');
    }
    this.cookieSID = loginRes.headers['set-cookie'].split(';')[0];
  }

  async getVersion() {
    const path = '/app/version';
    const res = await fetch<string>(this.urlPrefix + path, {
      method: 'GET',
      timeout: 10000,
      responseType: ResponseType.Text,
      headers: {
        cookie: this.cookieSID,
      },
    });
    return res.data;
  }

  async getApiVersion() {
    const path = '/app/webapiVersion';
    const res = await fetch<string>(this.urlPrefix + path, {
      method: 'GET',
      timeout: 10000,
      responseType: ResponseType.Text,
      headers: {
        cookie: this.cookieSID,
      },
    });
    return res.data;
  }

  async rssGetAll() {
    const path = '/rss/items';
    const res = await fetch<Record<string, any>>(this.urlPrefix + path, {
      method: 'GET',
      timeout: 10000,
      responseType: ResponseType.JSON,
      headers: {
        cookie: this.cookieSID,
      },
    });
    return res.data;
  }

  async rssGetAllLink() {
    const data = await this.rssGetAll();
    return getRSSLinkList(data);
  }

  async rssAdd(url: string) {
    const path = '/rss/addFeed';
    const data = new FormData();
    data.append('url', url);
    data.append('path', '');
    const res = await fetch<string>(this.urlPrefix + path, {
      method: 'POST',
      timeout: 10000,
      responseType: ResponseType.Text,
      headers: {
        cookie: this.cookieSID,
      },
      body: Body.form(data),
    });
    if (!res.ok) {
      throw new Error(res.data);
    }
  }

  async rssRuleGetAll() {
    const path = '/rss/rules';
    const res = await fetch<Record<string, RSSDownloadRule>>(
      this.urlPrefix + path,
      {
        method: 'GET',
        timeout: 10000,
        responseType: ResponseType.JSON,
        headers: {
          cookie: this.cookieSID,
        },
      },
    );
    return res.data;
  }

  async rssRuleAdd(ruleName: string, ruleDef: RSSDownloadRule) {
    const path = '/rss/setRule';
    const data = new FormData();
    data.append('ruleName', ruleName);
    data.append('ruleDef', JSON.stringify(ruleDef));
    const res = await fetch<string>(this.urlPrefix + path, {
      method: 'POST',
      timeout: 10000,
      responseType: ResponseType.Text,
      headers: {
        cookie: this.cookieSID,
      },
      body: Body.form(data),
    });
    if (!res.ok) {
      throw new Error(res.data);
    }
  }
}

function getRSSLinkList(rssItemData: Record<string, any>) {
  const list: string[] = [];
  const keyList = Object.keys(rssItemData);
  for (const key of keyList) {
    const val = rssItemData[key];
    if ('uid' in val) {
      list.push(val.url);
    } else {
      list.push(...getRSSLinkList(val));
    }
  }
  return list;
}
