import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StatTheme = 'default' | 'dark' | 'radical' | 'tokyonight' | 'gruvbox' | 'synthwave' | 'dracula' | 'custom';

export interface BuilderState {
  username: string;
  showStats: boolean;
  showTopRepos: boolean;
  showCustomLanguages: boolean;
  activeWidgetTab: 'analytics' | 'badges' | 'stats' | 'streak' | 'trophies';
  languageDisplayType: 'analytics' | 'badges';
  manualSkills: string[];
  hiddenLanguages: string[];
  hiddenSkills: string[];
  badgeColorMode: 'brand' | 'custom';
  badgeSize: 'sm' | 'md';
  autoLanguages: { name: string, color: string, percentage: number }[];
  includeContributions: boolean;
  languageLimit: number;
  languageLayout: 'compact' | 'pie' | 'list';

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
  setTheme: (theme: StatTheme) => void;
  setCustomColor: (key: keyof Pick<BuilderState, 'customBgColor' | 'customTextColor' | 'customIconColor' | 'customBorderColor'>, color: string) => void;
  setHideBorder: (hide: boolean) => void;
  setLayout: (layout: 'stacked' | 'grid') => void;
  setLanguageOption: (key: keyof Pick<BuilderState, 'includeContributions' | 'languageLimit' | 'languageLayout'>, value: any) => void;
  setLanguageDisplayType: (type: 'analytics' | 'badges') => void;
  addManualSkill: (skill: string) => void;
  removeManualSkill: (skill: string) => void;
  toggleLanguageVisibility: (lang: string) => void;
  toggleSkillVisibility: (skill: string) => void;
  setBadgeColorMode: (mode: 'brand' | 'custom') => void;
  setBadgeSize: (size: 'sm' | 'md') => void;
  setAutoLanguages: (langs: { name: string, color: string, percentage: number }[]) => void;
  setActiveWidgetTab: (tab: 'analytics' | 'badges' | 'stats' | 'streak' | 'trophies') => void;
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set) => ({
      username: '',
      showStats: true,
      showStreak: false,
      showTrophies: false,
      showTopRepos: false,
      showCustomLanguages: false,
      activeWidgetTab: 'analytics',
      languageDisplayType: 'analytics',
      manualSkills: [],
      hiddenLanguages: [],
      hiddenSkills: [],
      badgeColorMode: 'brand',
      badgeSize: 'md',
      autoLanguages: [],
      includeContributions: true,
      languageLimit: 5,
      languageLayout: 'compact',

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
      setLanguageOption: (key, value) => set({ [key]: value }),
      setLanguageDisplayType: (languageDisplayType) => set({ languageDisplayType }),
      addManualSkill: (skill) => set((state) => ({
        manualSkills: state.manualSkills.includes(skill) ? state.manualSkills : [...state.manualSkills, skill]
      })),
      removeManualSkill: (skill) => set((state) => ({
        manualSkills: state.manualSkills.filter(s => s !== skill)
      })),
      toggleLanguageVisibility: (lang) => set((state) => ({
        hiddenLanguages: state.hiddenLanguages.includes(lang)
          ? state.hiddenLanguages.filter(l => l !== lang)
          : [...state.hiddenLanguages, lang]
      })),
      toggleSkillVisibility: (skill) => set((state) => ({
        hiddenSkills: state.hiddenSkills.includes(skill)
          ? state.hiddenSkills.filter(s => s !== skill)
          : [...state.hiddenSkills, skill]
      })),
      setBadgeColorMode: (badgeColorMode) => set({ badgeColorMode }),
      setBadgeSize: (badgeSize) => set({ badgeSize }),
      setAutoLanguages: (autoLanguages) => set({ autoLanguages }),
      setActiveWidgetTab: (activeWidgetTab) => set({ activeWidgetTab }),
    }),
    {
      name: 'github-customizer-storage',
    }
  )
);
