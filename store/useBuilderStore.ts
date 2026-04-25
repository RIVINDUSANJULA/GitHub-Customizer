import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StatTheme = 'default' | 'dark' | 'radical' | 'tokyonight' | 'gruvbox' | 'synthwave' | 'dracula' | 'custom';

export interface BuilderState {
  username: string;
  showStats: boolean;
  showStreak: boolean;
  showTrophies: boolean;
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
  languageLayout: 'compact' | 'pie' | 'list' | 'modern-bar' | 'soft-cards' | 'minimalist-line';
  blockRadius: number;
  elementRadius: number;
  showGlow: boolean;
  animationSpeed: number;
  donutHoleSize: number;
  startAngle: number;
  barHeight: number;
  lineThickness: number;
  cardsPerRow: number;
  shadowDepth: number;
  bgType: 'solid' | 'gradient';
  bgColor2: string;
  widgetOrder: string[];

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
  setLanguageOption: (key: 'includeContributions' | 'languageLimit' | 'languageLayout' | 'blockRadius' | 'elementRadius' | 'showGlow' | 'animationSpeed' | 'donutHoleSize' | 'startAngle' | 'barHeight' | 'lineThickness' | 'cardsPerRow' | 'shadowDepth' | 'bgType' | 'bgColor2', value: any) => void;
  setWidgetOrder: (order: string[]) => void;
  setLanguageDisplayType: (type: 'analytics' | 'badges') => void;
  addManualSkill: (skill: string) => void;
  removeManualSkill: (skill: string) => void;
  toggleLanguageVisibility: (lang: string) => void;
  toggleSkillVisibility: (skill: string) => void;
  setBadgeColorMode: (mode: 'brand' | 'custom') => void;
  setBadgeSize: (size: 'sm' | 'md') => void;
  setAutoLanguages: (langs: { name: string, color: string, percentage: number }[]) => void;
  setActiveWidgetTab: (tab: 'analytics' | 'badges' | 'stats' | 'streak' | 'trophies') => void;
  toggleModule: (module: 'showStats' | 'showStreak' | 'showTrophies' | 'showTopRepos' | 'showCustomLanguages') => void;
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
      blockRadius: 20,
      elementRadius: 10,
      showGlow: true,
      animationSpeed: 1,
      donutHoleSize: 60,
      startAngle: 0,
      barHeight: 18,
      lineThickness: 6,
      cardsPerRow: 2,
      shadowDepth: 5,
      bgType: 'solid',
      bgColor2: 'f1f5f9',
      widgetOrder: ['stats', 'streak', 'trophies', 'languages', 'badges'],

      theme: 'default',
      customBgColor: '000000',
      customTextColor: 'ffffff',
      customIconColor: '79ff97',
      customBorderColor: '333333',
      hideBorder: false,
      layout: 'grid',

      setUsername: (username: string) => set({ username }),
      toggleModule: (module: 'showStats' | 'showStreak' | 'showTrophies' | 'showTopRepos' | 'showCustomLanguages') => 
        set((state) => ({ [module]: !state[module] })),
      setTheme: (theme: StatTheme) => set({ theme }),
      setCustomColor: (key: keyof Pick<BuilderState, 'customBgColor' | 'customTextColor' | 'customIconColor' | 'customBorderColor'>, color: string) => 
        set({ [key]: color.replace('#', '') }), // Store without #
      setHideBorder: (hideBorder: boolean) => set({ hideBorder }),
      setLayout: (layout: 'stacked' | 'grid') => set({ layout }),
      setWidgetOrder: (widgetOrder: string[]) => set({ widgetOrder }),
      setLanguageOption: (key: keyof Pick<BuilderState, 'includeContributions' | 'languageLimit' | 'languageLayout' | 'borderRadius' | 'showGlow' | 'animationSpeed' | 'donutHoleSize' | 'startAngle' | 'barHeight' | 'cardsPerRow'>, value: any) => 
        set({ [key]: value }),
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
