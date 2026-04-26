import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StatTheme = 'default' | 'dark' | 'radical' | 'tokyonight' | 'gruvbox' | 'synthwave' | 'dracula' | 'custom';

export interface AnalyticsConfig {
  languageLimit: number;
  includeContributions: boolean;
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
  badgeStyle: 'premium' | 'shields' | 'skillicons' | 'artistic';
  skillIconTheme: 'dark' | 'light';
  skillIconsPerRow: number;
  artisticIconSize: number;
  shadowDepth: number;
  showGlow: boolean;
  customBgColor: string;
  customIconColor: string;
}

export interface SocialsConfig {
  blockRadius: number;
  elementRadius: number;
  showGlow: boolean;
  layout: 'list' | 'bento' | 'inline' | 'header';
  cardStyle: 'standard' | 'glass' | 'minimal' | 'identity';
  useAvatar: boolean;
  showBlurBackground: boolean;
  shadowDepth: number;
  syncAvatarColor: boolean;
}

export interface SocialProfile {
  platform: 'youtube' | 'discord' | 'twitter' | 'instagram' | 'linkedin' | 'github' | 'tiktok' | 'career' | 'gmail' | 'email';
  username: string;
  label?: string;
  isVisible: boolean;
  style?: 'badge' | 'counter' | 'activity' | 'identity';
  customColor?: string;
  isVerified?: boolean;
  isDefault?: boolean;
  avatarUrl?: string;
  avatarMode?: 'auto' | 'custom';
  customAvatarUrl?: string;
  liveData?: {
    followers?: string;
    status?: string;
    latestItem?: string;
  };
}

export interface ManualSkill {
  name: string;
  iconUrl?: string;
  color?: string;
}

export interface BuilderState {
  username: string;
  showStats: boolean;
  showStreak: boolean;
  showTrophies: boolean;
  showTopRepos: boolean;
  showLanguages: boolean;
  showBadges: boolean;
  showSocials: boolean;
  
  analyticsConfig: AnalyticsConfig;
  badgesConfig: BadgesConfig;

  manualSkills: ManualSkill[];
  hiddenLanguages: string[];
  hiddenSkills: string[];
  autoLanguages: { name: string, color: string, percentage: number }[];
  allSkillsOrder: string[];
  socialsConfig: SocialsConfig;
  socialProfiles: SocialProfile[];
  widgetOrder: string[];

  theme: StatTheme;
  customBgColor: string;
  customTextColor: string;
  customIconColor: string;
  customBorderColor: string;
  hideBorder: boolean;
  layout: 'stacked' | 'grid';
  activeWidgetTab: string;

  setUsername: (username: string) => void;
  toggleModule: (module: keyof BuilderState) => void;
  setTheme: (theme: StatTheme) => void;
  setCustomColor: (key: 'customBgColor' | 'customTextColor' | 'customIconColor' | 'customBorderColor', color: string) => void;
  setHideBorder: (hideBorder: boolean) => void;
  setLayout: (layout: 'stacked' | 'grid') => void;
  setWidgetOrder: (order: string[]) => void;
  setAnalyticsOption: <K extends keyof AnalyticsConfig>(key: K, value: AnalyticsConfig[K]) => void;
  setBadgesOption: <K extends keyof BadgesConfig>(key: K, value: BadgesConfig[K]) => void;
  setSocialsOption: <K extends keyof SocialsConfig>(key: K, value: SocialsConfig[K]) => void;
  updateSocialProfile: (platform: string, updates: Partial<SocialProfile>) => void;
  setSocialProfiles: (profiles: SocialProfile[]) => void;
  addManualSkill: (skill: ManualSkill) => void;
  updateManualSkill: (name: string, updates: Partial<ManualSkill>) => void;
  removeManualSkill: (skillName: string) => void;
  toggleLanguageVisibility: (lang: string) => void;
  toggleSkillVisibility: (skill: string) => void;
  setAutoLanguages: (langs: { name: string, color: string, percentage: number }[]) => void;
  setManualSkills: (skills: ManualSkill[]) => void;
  setAllSkillsOrder: (order: string[]) => void;
  copyAnalyticsThemeToBadges: () => void;
  setActiveWidgetTab: (tab: string) => void;
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set) => ({
      username: '',
      showStats: true,
      showStreak: true,
      showTrophies: true,
      showTopRepos: false,
      showLanguages: true,
      showBadges: true,
      showSocials: true,
      activeWidgetTab: 'stats',

      analyticsConfig: {
        languageLimit: 5,
        includeContributions: true,
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
        skillIconTheme: 'dark',
        skillIconsPerRow: 10,
        artisticIconSize: 24,
        shadowDepth: 5,
        showGlow: true,
        customBgColor: '000000',
        customIconColor: '79ff97',
      },

      socialsConfig: {
        blockRadius: 20,
        elementRadius: 10,
        showGlow: true,
        layout: 'bento',
        cardStyle: 'glass',
        useAvatar: true,
        showBlurBackground: true,
        shadowDepth: 5,
        syncAvatarColor: true,
      },
      socialProfiles: [
        { platform: 'career', username: 'Available for Hire', isVisible: true, style: 'badge', customColor: '10b981' },
        { platform: 'gmail', username: 'your.email@gmail.com', isVisible: false, style: 'badge', customColor: 'ea4335' }
      ],
      manualSkills: [],
      hiddenLanguages: [],
      hiddenSkills: [],
      autoLanguages: [],
      allSkillsOrder: [],
      widgetOrder: ['stats', 'streak', 'trophies', 'languages', 'badges', 'socials'],

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
      setSocialsOption: (key, value) => 
        set((state) => ({
          socialsConfig: { ...state.socialsConfig, [key]: value }
        })),
      updateSocialProfile: (platform, updates) =>
        set((state) => ({
          socialProfiles: state.socialProfiles.map(p => p.platform === platform ? { ...p, ...updates } : p)
        })),
      setSocialProfiles: (socialProfiles) => set({ socialProfiles }),

      addManualSkill: (skill) => set((state) => ({
        manualSkills: state.manualSkills.some(s => s.name === skill.name) ? state.manualSkills : [...state.manualSkills, skill]
      })),
      updateManualSkill: (name, updates) => set((state) => ({
        manualSkills: state.manualSkills.map(s => s.name === name ? { ...s, ...updates } : s)
      })),
      removeManualSkill: (skillName) => set((state) => ({
        manualSkills: state.manualSkills.filter(s => s.name !== skillName)
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
      setManualSkills: (manualSkills) => set({ manualSkills }),
      setAllSkillsOrder: (allSkillsOrder) => set({ allSkillsOrder }),
      copyAnalyticsThemeToBadges: () => set((state) => ({
        badgesConfig: {
          ...state.badgesConfig,
          customBgColor: state.customBgColor,
          customIconColor: state.customIconColor,
        }
      })),
      setActiveWidgetTab: (activeWidgetTab) => set({ activeWidgetTab }),
    }),
    {
      name: 'github-customizer-storage',
    }
  )
);
