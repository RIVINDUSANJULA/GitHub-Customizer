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
  glowIntensity: number;
  blurStrength: number;
}

export interface BadgesConfig {
  showIcons: boolean;
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
  title: string;
  showStats: boolean;
  showStreak: boolean;
  showTrophies: boolean;
  showTopRepos: boolean;
  showLanguages: boolean;
  showBadges: boolean;
  showSocials: boolean;
  showAboutMe: boolean;
  
  aboutMe: string;
  aboutMeConfig: {
    content: string;
    notes: string;
    repoUrl: string;
    mode: 'manual' | 'ai';
    isGenerating: boolean;
    vibe: 'professional' | 'creative' | 'minimalist' | 'technical' | 'elite';
    format: 'paragraph' | 'bullets' | 'mixed';
    length: 'short' | 'medium' | 'long';
    showGlow: boolean;
    blockRadius: number;
    borderOpacity: number;
    borderStyle: 'solid' | 'dashed' | 'double';
    strokeWeight: number;
    accentColor: string;
    headerTextColor: string;
    glassTint: string;
    glowOpacity: number;
    luminanceBoost: boolean;
    useBorderGradient: boolean;
    borderGradientColor2: string;
    glassBlur: number;
    glassOpacity: number;
    showNoise: boolean;
    showGrid: boolean;
    headerLabel: string;
    glowSpread: number;
    lineHeight: number;
    letterSpacing: number;
    alignment: 'left' | 'center' | 'justify';
    useHoverTilt: boolean;
    preset: 'none' | 'matrix' | 'frost' | 'ember' | 'plasma' | 'toxic' | 'magma' | 'stealth';
  };

  analyticsConfig: AnalyticsConfig;
  badgesConfig: BadgesConfig;

  isSyncing: boolean;
  setIsSyncing: (val: boolean) => void;
  refreshTrigger: number;
  triggerRefresh: () => void;

  manualSkills: ManualSkill[];
  hiddenLanguages: string[];
  hiddenSkills: string[];
  autoLanguages: { name: string, color: string, percentage: number }[];
  autoSkills: { name: string, count: number }[];
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
  setAutoSkills: (skills: { name: string, count: number }[]) => void;
  setManualSkills: (skills: ManualSkill[]) => void;
  setAllSkillsOrder: (order: string[]) => void;
  copyAnalyticsThemeToBadges: () => void;
  setActiveWidgetTab: (tab: string) => void;
  setAboutMeOption: (key: keyof BuilderState['aboutMeConfig'], value: any) => void;
  applyAboutMePreset: (preset: 'none' | 'matrix' | 'frost' | 'ember' | 'plasma' | 'toxic' | 'magma' | 'stealth') => void;
  updateAboutMe: (content: string) => void;
  setTitle: (title: string) => void;
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set) => ({
      username: '',
      title: '',
      showStats: true,
      showStreak: true,
      showTrophies: true,
      showTopRepos: false,
      showLanguages: true,
      showBadges: true,
      showSocials: true,
      showAboutMe: true,
      activeWidgetTab: 'stats',

      aboutMe: '',
      aboutMeConfig: {
        content: "Hi there! I'm a developer building cool things on GitHub.",
        notes: "",
        repoUrl: "",
        mode: 'ai',
        isGenerating: false,
        vibe: 'professional',
        format: 'mixed',
        length: 'medium',
        showGlow: true,
        blockRadius: 20,
        borderOpacity: 0.3,
        borderStyle: 'solid',
        strokeWeight: 1,
        accentColor: 'f43f5e',
        headerTextColor: 'ffffff',
        glassTint: '000000',
        glowOpacity: 0.5,
        luminanceBoost: false,
        useBorderGradient: false,
        borderGradientColor2: 'f43f5e',
        glassBlur: 12,
        glassOpacity: 0.4,
        showNoise: false,
        showGrid: false,
        headerLabel: '// BIOGRAPHY',
        glowSpread: 40,
        lineHeight: 1.6,
        letterSpacing: 0,
        alignment: 'left',
        useHoverTilt: true,
        preset: 'none',
      },

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
        glowIntensity: 0.5,
        blurStrength: 20,
      },

      badgesConfig: {
        showIcons: true,
        blockRadius: 12,
        elementRadius: 8,
        badgeSize: 'md',
        badgeColorMode: 'brand',
        useOfficialColors: true,
        badgeStyle: 'artistic',
        skillIconTheme: 'dark',
        skillIconsPerRow: 10,
        artisticIconSize: 20,
        shadowDepth: 5,
        showGlow: true,
        customBgColor: "1e293b",
        customIconColor: "ffffff",
      },

      isSyncing: false,
      setIsSyncing: (val) => set({ isSyncing: val }),
      refreshTrigger: 0,
      triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),

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
      autoSkills: [],
      allSkillsOrder: [],
      widgetOrder: ['aboutme', 'stats', 'streak', 'trophies', 'languages', 'badges', 'socials'],

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
      setAboutMeOption: (key, value) =>
        set((state) => ({
          aboutMeConfig: { ...state.aboutMeConfig, [key]: value }
        })),
      applyAboutMePreset: (preset) =>
        set((state) => {
          const config = { ...state.aboutMeConfig, preset };
          
          switch (preset) {
            case 'matrix':
              config.headerLabel = '[SECURE_ACCESS]';
              config.showGlow = true;
              config.glowSpread = 40;
              config.borderOpacity = 0.6;
              config.glassBlur = 12;
              config.glassOpacity = 0.4;
              config.borderStyle = 'solid';
              config.strokeWeight = 1;
              config.showNoise = false;
              config.showGrid = false;
              config.lineHeight = 1.6;
              config.letterSpacing = 2;
              config.alignment = 'left';
              break;
            case 'frost':
              config.headerLabel = '// IDENTITY';
              config.showGlow = true;
              config.glowSpread = 60;
              config.borderOpacity = 0.2;
              config.glassBlur = 40;
              config.glassOpacity = 0.05;
              config.borderStyle = 'solid';
              config.strokeWeight = 0.5;
              config.showNoise = true;
              config.showGrid = false;
              config.lineHeight = 1.8;
              config.letterSpacing = 0;
              config.alignment = 'center';
              break;
            case 'ember':
              config.headerLabel = '> SYSTEM_LOG';
              config.showGlow = true;
              config.glowSpread = 50;
              config.borderOpacity = 0.8;
              config.glassBlur = 10;
              config.glassOpacity = 0.6;
              config.borderStyle = 'double';
              config.strokeWeight = 2;
              config.showNoise = false;
              config.showGrid = true;
              config.lineHeight = 1.6;
              config.letterSpacing = 0.5;
              config.alignment = 'left';
              break;
            case 'plasma':
              config.accentColor = '22d3ee';
              config.borderGradientColor2 = 'c084fc';
              config.useBorderGradient = true;
              config.glowSpread = 50;
              config.glowOpacity = 0.6;
              break;
            case 'toxic':
              config.accentColor = 'a3e635';
              config.headerTextColor = 'a3e635';
              config.glassTint = '052e16';
              config.glowSpread = 60;
              config.luminanceBoost = true;
              break;
            case 'magma':
              config.accentColor = 'f97316';
              config.borderGradientColor2 = '7f1d1d';
              config.useBorderGradient = true;
              config.glassTint = '450a0a';
              config.glowSpread = 40;
              break;
            case 'stealth':
              config.accentColor = 'ffffff';
              config.borderOpacity = 0.1;
              config.glassTint = '000000';
              config.glassOpacity = 0.8;
              config.glowSpread = 0;
              config.headerTextColor = '525252';
              break;
          }
          
          return { aboutMeConfig: config };
        }),
      updateAboutMe: (content) => set({ aboutMe: content }),
      updateSocialProfile: (platform, updates) =>
        set((state) => ({
          socialProfiles: state.socialProfiles.map(p => p.platform === platform ? { ...p, ...updates } : p)
        })),
      setSocialProfiles: (socialProfiles) => set({ socialProfiles }),

      addManualSkill: (skill) => set((state) => ({
        manualSkills: state.manualSkills.some(s => s.name === skill.name) ? state.manualSkills : [...state.manualSkills, skill],
        allSkillsOrder: state.allSkillsOrder.includes(skill.name) ? state.allSkillsOrder : [...state.allSkillsOrder, skill.name]
      })),
      updateManualSkill: (name, updates) => set((state) => ({
        manualSkills: state.manualSkills.map(s => s.name === name ? { ...s, ...updates } : s)
      })),
      removeManualSkill: (skillName) => set((state) => ({
        manualSkills: state.manualSkills.filter(s => s.name !== skillName),
        allSkillsOrder: state.allSkillsOrder.filter(name => name !== skillName)
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
      setAutoSkills: (autoSkills) => set({ autoSkills }),
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
      setTitle: (title) => set({ title }),
    }),
    {
      name: 'gitinfo-storage',
    }
  )
);
