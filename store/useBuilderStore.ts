import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StatTheme = 'default' | 'dark' | 'radical' | 'tokyonight' | 'gruvbox' | 'synthwave' | 'dracula' | 'custom';

export interface BuilderState {
  username: string;
  showStats: boolean;
  showLanguages: boolean;
  showStreak: boolean;
  showTrophies: boolean;
  showTopRepos: boolean;
  
  // Customization
  theme: StatTheme;
  customBgColor: string;
  customTextColor: string;
  customIconColor: string;
  customBorderColor: string;
  hideBorder: boolean;
  layout: 'stacked' | 'grid';
  
  // Actions
  setUsername: (username: string) => void;
  toggleModule: (module: keyof Pick<BuilderState, 'showStats' | 'showLanguages' | 'showStreak' | 'showTrophies' | 'showTopRepos'>) => void;
  setTheme: (theme: StatTheme) => void;
  setCustomColor: (key: keyof Pick<BuilderState, 'customBgColor' | 'customTextColor' | 'customIconColor' | 'customBorderColor'>, color: string) => void;
  setHideBorder: (hide: boolean) => void;
  setLayout: (layout: 'stacked' | 'grid') => void;
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set) => ({
      username: '',
      showStats: true,
      showLanguages: true,
      showStreak: false,
      showTrophies: false,
      showTopRepos: false,
      
      theme: 'default',
      customBgColor: '000000',
      customTextColor: 'ffffff',
      customIconColor: '79ff97',
      customBorderColor: '333333',
      hideBorder: false,
      layout: 'grid',

      setUsername: (username) => set({ username }),
      toggleModule: (module) => set((state) => ({ [module]: !state[module] })),
      setTheme: (theme) => set({ theme }),
      setCustomColor: (key, color) => set({ [key]: color.replace('#', '') }), // Store without #
      setHideBorder: (hideBorder) => set({ hideBorder }),
      setLayout: (layout) => set({ layout }),
    }),
    {
      name: 'github-customizer-storage',
    }
  )
);
