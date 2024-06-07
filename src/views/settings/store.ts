import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthConfig {
  ip: string;
  port: string;
  username: string;
  password: string;
}

interface SettingsStore {
  authConfig: AuthConfig;
  editAuthConfig: (authConfig: Partial<AuthConfig>) => void;
}

const SettingsStoreStorageKey = 'settings-store-storage';

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => {
      return {
        authConfig: {
          ip: '',
          port: '',
          username: '',
          password: '',
        },
        editAuthConfig(authConfig) {
          const oldAuthConfig = get().authConfig;
          set({
            authConfig: {
              ...oldAuthConfig,
              ...authConfig,
            },
          });
        },
      };
    },
    {
      name: SettingsStoreStorageKey,
      version: 1,
    },
  ),
);
