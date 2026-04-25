import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StatTheme = 'default' | 'dark' | 'radical' | 'tokyonight' | 'gruvbox' | 'synthwave' | 'dracula' | 'custom';

export interface AnalyticsConfig {
  includeContributions: boolean;
  languageLimit: number;
  layout: 'compact' | 'pie' | 'list' | 'modern-bar' | 'soft-cards' | 'minimalist-line';
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
  pieShowHoverLabels: boolean;
  pieLabelPosition: 'inside' | 'floating';
  pieHideLegend: boolean;
  bgType: 'solid' | 'gradient';
  bgColor2: string;
}

export interface BadgesConfig {
  blockRadius: number;
  elementRadius: number;
  badgeSize: 'sm' | 'md';
  badgeColorMode: 'brand' | 'custom';
  useOfficialColors: boolean;
  badgeStyle: 'premium' | 'shields';
}

export interface BuilderState {
  username: string;
  showStats: boolean;
  showStreak: boolean;
  showTrophies: boolean;
  showTopRepos: boolean;
  showLanguages: boolean; // Renamed from showCustomLanguages
  showBadges: boolean;    // New separate toggle for badges
  activeWidgetTab: 'analytics' | 'badges' | 'stats' | 'streak' | 'trophies';
  
  analyticsConfig: AnalyticsConfig;
  badgesConfig: BadgesConfig;

  manualSkills: string[];
  hiddenLanguages: string[];
  hiddenSkills: string[];
  autoLanguages: { name: string, color: string, percentage: number }[];
  widgetOrder: string[];

  // Global Theme
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
  setWidgetOrder: (order: string[]) => void;
  
  setAnalyticsOption: (key: keyof AnalyticsConfig, value: any) => void;
  setBadgesOption: (key: keyof BadgesConfig, value: any) => void;
  
  addManualSkill: (skill: string) => void;
  removeManualSkill: (skill: string) => void;
  toggleLanguageVisibility: (lang: string) => void;
  toggleSkillVisibility: (skill: string) => void;
  setAutoLanguages: (langs: { name: string, color: string, percentage: number }[]) => void;
  setActiveWidgetTab: (tab: 'analytics' | 'badges' | 'stats' | 'streak' | 'trophies') => void;
  toggleModule: (module: 'showStats' | 'showStreak' | 'showTrophies' | 'showTopRepos' | 'showLanguages' | 'showBadges') => void;
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set) => ({
      username: '',
      showStats: true,
      showStreak: false,
      showTrophies: false,
      showTopRepos: false,
      showLanguages: true,
      showBadges: true,
      activeWidgetTab: 'analytics',
      
      analyticsConfig: {
        includeContributions: true,
        languageLimit: 5,
        layout: 'compact',
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
        pieShowHoverLabels: true,
        pieLabelPosition: 'inside',
        pieHideLegend: false,
        bgType: 'solid',
        bgColor2: 'f1f5f9',
      },

      badgesConfig: {
        blockRadius: 20,
        elementRadius: 8,
        badgeSize: 'md',
        badgeColorMode: 'brand',
        useOfficialColors: true,
        badgeStyle: 'premium',
      },

      manualSkills: [],
      hiddenLanguages: [],
      hiddenSkills: [],
      autoLanguages: [],
      widgetOrder: ['stats', 'streak', 'trophies', 'languages', 'badges'],

      theme: 'default',
      customBgColor: '000000',
      customTextColor: 'ffffff',
      customIconColor: '79ff97',
      customBorderColor: '333333',
      hideBorder: false,
      layout: 'grid',

      setUsername: (username: string) => set({ username }),
      toggleModule: (module) => 
        set((state) => ({ [module]: !state[module] })),
      setTheme: (theme: StatTheme) => set({ theme }),
      setCustomColor: (key, color) => 
        set({ [key]: color.replace('#', '') }),
      setHideBorder: (hideBorder: boolean) => set({ hideBorder }),
      setLayout: (layout: 'stacked' | 'grid') => set({ layout }),
      setWidgetOrder: (widgetOrder: string[]) => set({ widgetOrder }),
      
      setAnalyticsOption: (key, value) => 
        set((state) => ({
          analyticsConfig: { ...state.analyticsConfig, [key]: value }
        })),
      
      setBadgesOption: (key, value) => 
        set((state) => ({
          badgesConfig: { ...state.badgesConfig, [key]: value }
        })),

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
      setAutoLanguages: (autoLanguages) => set({ autoLanguages }),
      setActiveWidgetTab: (activeWidgetTab) => set({ activeWidgetTab }),
    }),
    {
      name: 'github-customizer-storage',
    }
  )
);
