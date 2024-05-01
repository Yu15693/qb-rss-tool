import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  removeSubItem: (link: string) => void;
  clearSubList: () => void;
  findSubItem: (link: string) => SubItem | undefined;
}

const indexStoreStorageKey = 'index-store-storage';

export const useIndexStore = create<IndexState>()(
  persist(
    (set, get) => {
      return {
        subList: [],
        addSubItem(subItem: SubItem) {
          const newSubList = [...get().subList, subItem];
          set({ subList: newSubList });
        },
        removeSubItem(link) {
          const newSubList = get().subList.filter(v => v.rssFeed.link !== link);
          set({
            subList: newSubList,
          });
        },
        clearSubList() {
          set({ subList: [] });
        },
        findSubItem(link) {
          return get().subList.find(v => v.rssFeed.link === link);
        },
      };
    },
    {
      name: indexStoreStorageKey,
    },
  ),
);
