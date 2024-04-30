import { create } from 'zustand';
import { RSSFeed } from '@/utils/rss';

export interface SubItem {
  title: string;
  mustContain: string;
  mustNotContain: string;
  rssFeed: RSSFeed;
}

interface IndexState {
  subList: SubItem[];
  addSubItem: (subItem: SubItem) => void;
  findSubItem: (link: string) => SubItem | undefined;
  clearSubList: () => void;
}

const subItemStorageKey = 'sub-item-storage';

export const useIndexStore = create<IndexState>(set => {
  let subList: SubItem[] = [];
  const initSubListStr = localStorage.getItem(subItemStorageKey);
  if (initSubListStr) {
    try {
      subList = JSON.parse(initSubListStr);
    } catch (err) {
      console.error(err);
    }
  }
  const syncStorage = (subList: SubItem[]) => {
    localStorage.setItem(subItemStorageKey, JSON.stringify(subList));
  };
  return {
    subList,
    addSubItem(subItem: SubItem) {
      set(state => {
        const newSubList = [...state.subList, subItem];
        syncStorage(newSubList);
        return { subList: newSubList };
      });
    },
    clearSubList() {
      syncStorage([]);
      set({ subList: [] });
    },
    findSubItem(link) {
      return subList.find(v => v.rssFeed.link === link);
    },
  };
});
