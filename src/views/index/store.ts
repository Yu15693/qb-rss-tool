import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RSSFeed } from '@/utils/rss';

export interface SubItem {
  title: string;
  link: string;
  mustContain: string;
  mustNotContain: string;
  rssFeed: RSSFeed;
}

interface IndexState {
  subList: SubItem[];
  selectedLink: string;
  setLink: (link: string) => void;
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
        selectedLink: '',
        setLink(link) {
          set({
            selectedLink: link,
          });
        },
        addSubItem(subItem: SubItem) {
          const newSubList = [...get().subList, subItem];
          set({ subList: newSubList });
        },
        removeSubItem(link) {
          const newSubList = get().subList.filter(v => v.link !== link);
          if (link === this.selectedLink) {
            set({
              selectedLink: '',
            });
          }
          set({
            subList: newSubList,
          });
        },
        clearSubList() {
          set({ subList: [], selectedLink: '' });
        },
        findSubItem(link) {
          return get().subList.find(v => v.link === link);
        },
      };
    },
    {
      name: indexStoreStorageKey,
    },
  ),
);
