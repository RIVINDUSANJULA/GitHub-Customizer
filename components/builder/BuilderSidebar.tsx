"use client";

import { useBuilderStore, StatTheme, ManualSkill, SocialProfile } from "@/store/useBuilderStore";
import { 
  User, 
  Palette, 
  Settings, 
  Layout, 
  Check, 
  ChevronDown, 
  Code2, 
  BarChart3, 
  Tags, 
  Zap, 
  Trophy, 
  PieChart, 
  GripVertical, 
  Eye, 
  EyeOff, 
  Boxes, 
  Layers, 
  Sparkles, 
  Shield, 
  Diamond, 
  Brush, 
  Search, 
  Trash2, 
  Copy, 
  Share2, 
  Video, 
  Disc, 
  Camera, 
  MessageSquare, 
  Plus, 
  ExternalLink,
  RefreshCw,
  Image as ImageIcon
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, Reorder, LayoutGroup } from "framer-motion";
import { fetchSocialIdentity } from "@/lib/identity-fetcher";
import { normalizePlatform, getProfileUrl } from "@/lib/social-utils";

const THEMES: { id: StatTheme; name: string }[] = [
  { id: "default", name: "Default" },
  { id: "dark", name: "Dark" },
  { id: "radical", name: "Radical" },
  { id: "tokyonight", name: "Tokyo Night" },
  { id: "gruvbox", name: "Gruvbox" },
  { id: "synthwave", name: "Synthwave" },
  { id: "dracula", name: "Dracula" },
  { id: "custom", name: "Custom Colors" },
];

export function BuilderSidebar() {
  const store = useBuilderStore();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ profile: true });
  const [skillInput, setSkillInput] = useState("");
  const [socialSearch, setSocialSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://github-customizer.vercel.app';
    const platform = normalizePlatform(id.split('-')[1]);
    const username = text || 'your-handle';
    
    // CONTENT-BASED CACHE BUSTING
    const cacheKey = Buffer.from(`${platform}-${username}-${Date.now()}`).toString('base64').substring(0, 8);

    const query = new URLSearchParams({
      platform,
      username,
      style: store.socialProfiles.find(p => p.platform === platform)?.style || store.socialsConfig.cardStyle || 'badge',
      blockRadius: (store.socialsConfig.blockRadius ?? 20).toString(),
      elementRadius: (store.socialsConfig.elementRadius ?? 10).toString(),
      showGlow: (store.socialsConfig.showGlow ?? true).toString(),
      useAvatar: (store.socialsConfig.useAvatar ?? true).toString(),
      v: cacheKey
    });
    
    const profile = store.socialProfiles.find(p => p.platform === platform);
    if (profile?.customColor) query.set('color', profile.customColor);

    const imageUrl = `${baseUrl}/api/social-card?${query.toString()}`;
    const profileUrl = getProfileUrl(platform, username);
    const markdown = `[![${platform}](${imageUrl})](${profileUrl})`;
    
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(markdown);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = markdown;
      document.body.appendChild(textArea);
      textArea.select();
      try { document.execCommand('copy'); } catch (err) { console.error(err); }
      document.body.removeChild(textArea);
    }

    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  // Ensure socials is in the widget order and config is up to date
  useEffect(() => {
    if (!store.widgetOrder.includes('socials')) {
      store.setWidgetOrder([...store.widgetOrder, 'socials']);
    }
    
    // Repair socialsConfig if missing new fields
    if (store.socialsConfig.useAvatar === undefined) {
      store.setSocialsOption('useAvatar', true);
    }
    if (store.socialsConfig.showBlurBackground === undefined) {
      store.setSocialsOption('showBlurBackground', true);
    }
    if (!store.socialsConfig.layout) {
      store.setSocialsOption('layout', 'bento');
    }
    if (!store.socialsConfig.cardStyle) {
      store.setSocialsOption('cardStyle', 'glass');
    }
  }, [store.widgetOrder, store.setWidgetOrder, store.socialsConfig]);

  // Auto-verification logic
  useEffect(() => {
    const verifyProfiles = async () => {
      for (const profile of store.socialProfiles) {
        if (profile.username && profile.username.length > 3 && profile.isVerified === undefined) {
          const identity = await fetchSocialIdentity(profile.platform, profile.username);
          if (identity.verified) {
            store.updateSocialProfile(profile.platform, { 
              isVerified: true,
              isDefault: identity.isDefault 
            });
          }
        }
      }
    };
    const timer = setTimeout(verifyProfiles, 2000);
    return () => clearTimeout(timer);
  }, [store.socialProfiles]);

  const PLATFORMS = [
    { id: 'youtube', name: 'YouTube', color: 'FF0000', icon: 'youtube' },
    { id: 'twitter', name: 'X / Twitter', color: '000000', icon: 'twitter' },
    { id: 'linkedin', name: 'LinkedIn', color: '0A66C2', icon: 'linkedin' },
    { id: 'discord', name: 'Discord', color: '5865F2', icon: 'discord' },
    { id: 'instagram', name: 'Instagram', color: 'E4405F', icon: 'instagram' },
    { id: 'github', name: 'GitHub', color: '181717', icon: 'github' },
    { id: 'tiktok', name: 'TikTok', color: '000000', icon: 'tiktok' },
    { id: 'gmail', name: 'Gmail', color: 'EA4335', icon: 'gmail' },
    { id: 'career', name: 'Career / Hire', color: '10B981', icon: 'briefcase' },
  ];

  const getPlatformIcon = (platformId: string) => {
    switch (platformId) {
      case 'tiktok': return "https://cdn.simpleicons.org/tiktok/white";
      case 'gmail': return "https://cdn.simpleicons.org/gmail/EA4335";
      case 'career': return "https://cdn.jsdelivr.net/npm/lucide-static@0.321.0/icons/briefcase.svg";
    }
    const p = PLATFORMS.find(pl => pl.id === platformId);
    return `https://api.iconify.design/simple-icons:${p?.icon || platformId}.svg?color=%23${p?.color || 'ffffff'}`;
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const isSectionOpen = (section: string) => !!openSections[section];

  const mapToArtisticIcon = (name: string) => {
    const mapping: Record<string, string> = {
      'nodejs': 'nodejs-icon',
      'react': 'react',
      'typescript': 'typescript-icon',
      'javascript': 'javascript',
      'python': 'python',
      'tailwind': 'tailwindcss-icon',
      'next.js': 'nextjs-icon',
      'mongodb': 'mongodb-icon',
      'docker': 'docker-icon',
      'git': 'git-icon',
      'github': 'github-icon',
      'vscode': 'visual-studio-code',
      'figma': 'figma',
      'firebase': 'firebase',
      'mysql': 'mysql-icon',
      'postgres': 'postgresql',
      'redis': 'redis',
      'graphql': 'graphql',
      'rust': 'rust',
      'go': 'go',
      'swift': 'swift',
      'kotlin': 'kotlin-icon',
      'flutter': 'flutter',
      'aws': 'aws',
      'azure': 'azure-icon',
      'gcp': 'google-cloud-icon',
      'linux': 'linux-tux',
      'nginx': 'nginx',
      'html': 'html-5',
      'css': 'css-3',
      'sass': 'sass',
      'npm': 'npm-icon',
    };

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const iconName = mapping[slug] || slug;
    return `https://api.iconify.design/logos:${iconName}.svg`;
  };

  const handleAddSkill = () => {
    const val = skillInput.trim();
    if (val) {
      store.addManualSkill({ 
        name: val,
        iconUrl: mapToArtisticIcon(val)
      });
      setSkillInput("");
    }
  };

  const combinedSkills = useMemo(() => {
    const autoLangs = Array.isArray(store.autoLanguages) 
      ? store.autoLanguages.map(l => ({ 
          name: l.name, 
          isAuto: true, 
          iconUrl: mapToArtisticIcon(l.name) 
        })) 
      : [];
    const autoSkills = Array.isArray(store.autoSkills)
      ? store.autoSkills.map(s => ({
          name: s.name,
          isAuto: true,
          iconUrl: mapToArtisticIcon(s.name)
        }))
      : [];
    const manual = store.manualSkills.map(s => ({ name: s.name, isAuto: false, iconUrl: s.iconUrl }));
    const allRaw = [...autoLangs, ...autoSkills, ...manual];
    
    // Unique-ify by name (Manual takes precedence)
    const uniqueMap = new Map();
    allRaw.forEach(item => {
      const existing = uniqueMap.get(item.name);
      if (!existing || (!item.isAuto && existing.isAuto)) {
        uniqueMap.set(item.name, item);
      }
    });
    
    const all = Array.from(uniqueMap.values());

    return all.sort((a, b) => {
      const idxA = store.allSkillsOrder.indexOf(a.name);
      const idxB = store.allSkillsOrder.indexOf(b.name);
      if (idxA === -1 && idxB === -1) return 0;
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });
  }, [store.autoLanguages, store.autoSkills, store.manualSkills, store.allSkillsOrder]);

  return (
    <div className="w-full h-full bg-white dark:bg-zinc-950/50 backdrop-blur-xl border-r border-slate-200 dark:border-white/10 flex flex-col overflow-y-auto custom-scrollbar">
      <div className="p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          GitCustomize
        </h2>
      </div>

      <div className="flex-1 px-4 space-y-4 pb-12">
              {/* Profile Section */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-50/50 dark:bg-zinc-900/20">
                <button onClick={() => toggleSection('profile')} className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900/50 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-indigo-500" />
                    <span className="font-semibold text-slate-900 dark:text-white">Profile</span>
                  </div>
                  <ChevronDown className={cn("w-5 h-5 text-slate-500 transition-transform", isSectionOpen('profile') && "rotate-180")} />
                </button>

                {isSectionOpen('profile') && (
                  <div className="p-4 border-t border-slate-200 dark:border-white/10">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">GitHub Username</label>
                    <input
                      type="text"
                      placeholder="e.g. torvalds"
                      value={store.username || ""}
                      onChange={(e) => store.setUsername(e.target.value)}
                      className="w-full px-4 py-2 bg-white dark:bg-zinc-950 border border-slate-300 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                    />
                  </div>
                )}
              </div>

              {/* 📊 Analytics Settings Section */}
              <div className={cn("rounded-2xl border overflow-hidden transition-all", store.showLanguages ? "border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/20 dark:bg-indigo-500/5" : "border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-zinc-900/20")}>
                <button onClick={() => toggleSection('analytics')} className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900/50 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors">
                  <div className="flex items-center gap-3">
                    <BarChart3 className={cn("w-5 h-5", store.showLanguages ? "text-indigo-500" : "text-slate-400")} />
                    <span className="font-semibold text-slate-900 dark:text-white">Analytics Settings</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={store.showLanguages} 
                      onChange={() => store.toggleModule('showLanguages')}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <ChevronDown className={cn("w-5 h-5 text-slate-500 transition-transform", isSectionOpen('analytics') && "rotate-180")} />
                  </div>
                </button>

                <AnimatePresence>
                  {isSectionOpen('analytics') && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-slate-200 dark:border-white/10">
                      <div className="p-4 space-y-6 bg-white dark:bg-zinc-950/20">
                        <div className="space-y-4">
                          <label className="flex items-center justify-between cursor-pointer group">
                            <div className="flex flex-col">
                              <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Include Contributions</span>
                              <span className="text-[10px] text-slate-400 mt-0.5 tracking-tight">Public repositories only for privacy</span>
                            </div>
                            <div className="relative">
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={store.analyticsConfig.includeContributions}
                                onChange={() => store.setAnalyticsOption('includeContributions', !store.analyticsConfig.includeContributions)}
                              />
                              <div className={cn("w-10 h-6 rounded-full transition-colors", store.analyticsConfig.includeContributions ? "bg-indigo-500" : "bg-slate-300 dark:bg-zinc-700")}></div>
                              <div className={cn("absolute top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm", store.analyticsConfig.includeContributions ? "translate-x-5" : "translate-x-1")}></div>
                            </div>
                          </label>

                          <div>
                            <div className="flex justify-between mb-1.5">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Display Limit: {store.analyticsConfig.languageLimit}</label>
                            </div>
                            <input
                              type="range"
                              min="3"
                              max="15"
                              step="1"
                              value={store.analyticsConfig.languageLimit || 5}
                              onChange={(e) => store.setAnalyticsOption('languageLimit', parseInt(e.target.value))}
                              className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Visual Style</label>
                            <div className="grid grid-cols-2 gap-2">
                              {(['compact', 'list', 'pie', 'modern-bar', 'soft-cards', 'minimalist-line'] as const).map((style) => (
                                <button
                                  key={style}
                                  onClick={() => store.setAnalyticsOption('layout', style)}
                                  className={cn(
                                    "py-2.5 text-[10px] font-black rounded-xl border transition-all uppercase tracking-tighter flex items-center justify-center gap-2",
                                    store.analyticsConfig.layout === style
                                      ? "bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20"
                                      : "bg-white dark:bg-zinc-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-indigo-300"
                                  )}
                                >
                                  {style.replace('-', ' ')}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Advanced Styling (Context-Aware) */}
                          <div className="pt-4 space-y-4 border-t border-slate-200 dark:border-white/10">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Advanced Configuration</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Block Radius: {store.analyticsConfig.blockRadius}px</label>
                                <input
                                  type="range"
                                  min="0"
                                  max="40"
                                  step="2"
                                  value={store.analyticsConfig.blockRadius || 0}
                                  onChange={(e) => store.setAnalyticsOption('blockRadius', parseInt(e.target.value))}
                                  className="w-full h-1 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Element Radius: {store.analyticsConfig.elementRadius}px</label>
                                <input
                                  type="range"
                                  min="0"
                                  max="20"
                                  step="1"
                                  value={store.analyticsConfig.elementRadius || 0}
                                  onChange={(e) => store.setAnalyticsOption('elementRadius', parseInt(e.target.value))}
                                  className="w-full h-1 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                              </div>
                            </div>

                            <div className="space-y-4 pt-2">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Glow Intensity: {store.analyticsConfig.glowIntensity}</label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={store.analyticsConfig.glowIntensity || 0.5}
                                    onInput={(e) => {
                                       const val = parseFloat(e.currentTarget.value);
                                       document.documentElement.style.setProperty('--glow-intensity', val.toString());
                                    }}
                                    onChange={(e) => store.setAnalyticsOption('glowIntensity', parseFloat(e.target.value))}
                                    className="w-full h-1 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Blur Strength: {store.analyticsConfig.blurStrength}px</label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="60"
                                    step="2"
                                    value={store.analyticsConfig.blurStrength || 20}
                                    onInput={(e) => {
                                       const val = e.currentTarget.value;
                                       document.documentElement.style.setProperty('--blur-amount', `${val}px`);
                                    }}
                                    onChange={(e) => store.setAnalyticsOption('blurStrength', parseInt(e.target.value))}
                                    className="w-full h-1 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                  />
                                </div>
                              </div>
                              {store.analyticsConfig.layout === 'pie' && (
                                <div className="p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-white/5 space-y-4">
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Donut Hole: {store.analyticsConfig.donutHoleSize}%</label>
                                    <input
                                      type="range"
                                      min="0"
                                      max="85"
                                      step="5"
                                      value={store.analyticsConfig.donutHoleSize || 60}
                                      onChange={(e) => store.setAnalyticsOption('donutHoleSize', parseInt(e.target.value))}
                                      className="w-full h-1 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Hover Precision Mapping</label>
                                    <div className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", store.analyticsConfig.pieShowHoverLabels ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-500/10 text-slate-500")}>
                                      {store.analyticsConfig.pieShowHoverLabels ? 'Active' : 'Disabled'}
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Hide Side Legend</label>
                                    <input 
                                      type="checkbox" 
                                      checked={store.analyticsConfig.pieHideLegend}
                                      onChange={(e) => store.setAnalyticsOption('pieHideLegend', e.target.checked)}
                                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                  </div>
                                </div>
                              )}

                              {store.analyticsConfig.layout === 'modern-bar' && (
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase">Bar Height: {store.analyticsConfig.barHeight}px</label>
                                  <input
                                    type="range"
                                    min="8"
                                    max="32"
                                    step="2"
                                    value={store.analyticsConfig.barHeight || 18}
                                    onChange={(e) => store.setAnalyticsOption('barHeight', parseInt(e.target.value))}
                                    className="w-full h-1 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                  />
                                </div>
                              )}

                              <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Neon Glow Engine</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={store.analyticsConfig.showGlow}
                                    onChange={(e) => store.setAnalyticsOption('showGlow', e.target.checked)}
                                  />
                                  <div className="w-9 h-5 bg-slate-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                                </label>
                              </div>

                              <div className="pt-2">
                                <button
                                  onClick={() => store.setRefreshTrigger(store.refreshTrigger + 1)}
                                  className="w-full py-3 bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
                                >
                                  <RefreshCw className={cn("w-3 h-3", store.isSyncing && "animate-spin")} />
                                  {store.isSyncing ? "Syncing GraphQL..." : "Real-time Sync"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 🏷️ Skill Badges Section */}
              <div className={cn("rounded-2xl border overflow-hidden transition-all", store.showBadges ? "border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-500/5" : "border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-zinc-900/20")}>
                <button onClick={() => toggleSection('badges')} className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900/50 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors">
                  <div className="flex items-center gap-3">
                    <Tags className={cn("w-5 h-5", store.showBadges ? "text-emerald-500" : "text-slate-400")} />
                    <span className="font-semibold text-slate-900 dark:text-white">Skill Badges</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={store.showBadges} 
                      onChange={() => store.toggleModule('showBadges')}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <ChevronDown className={cn("w-5 h-5 text-slate-500 transition-transform", isSectionOpen('badges') && "rotate-180")} />
                  </div>
                </button>

                <AnimatePresence>
                  {isSectionOpen('badges') && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-slate-200 dark:border-white/10">
                      <LayoutGroup>
                        <div className="p-4 space-y-6 bg-white dark:bg-zinc-950/20">
                          <div className="space-y-2.5">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Badge Aesthetic Engine</label>
                            <div className="flex p-1 bg-slate-100 dark:bg-zinc-900 rounded-xl gap-1">
                              {[
                                { id: 'shields', label: 'Classic', icon: Shield },
                                { id: 'skillicons', label: 'Dynamic', icon: Sparkles },
                                { id: 'artistic', label: 'Artistic', icon: Brush },
                              ].map((provider) => (
                                <button
                                  key={provider.id}
                                  onClick={() => store.setBadgesOption('badgeStyle', provider.id as any)}
                                  className={cn(
                                    "flex-1 flex flex-col items-center justify-center gap-1 py-2 text-[7px] font-black rounded-lg transition-all uppercase tracking-tighter border",
                                    store.badgesConfig.badgeStyle === provider.id
                                      ? "bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shadow-sm"
                                      : "text-slate-500 border-transparent hover:text-slate-700 dark:hover:text-slate-300"
                                  )}
                                >
                                  <provider.icon className="w-3.5 h-3.5" />
                                  {provider.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <motion.div layout className="space-y-4">
                            {/* Context-Aware Settings */}
                            {(store.badgesConfig.badgeStyle === 'artistic' || store.badgesConfig.badgeStyle === 'premium') && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Block Radius: {store.badgesConfig.blockRadius || 0}px</label>
                                    <input
                                      type="range"
                                      min="0"
                                      max="40"
                                      step="2"
                                      value={store.badgesConfig.blockRadius || 0}
                                      onChange={(e) => store.setBadgesOption('blockRadius', parseInt(e.target.value))}
                                      className="w-full h-1 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Badge Roundness: {store.badgesConfig.elementRadius || 0}px</label>
                                    <input
                                      type="range"
                                      min="0"
                                      max="20"
                                      step="1"
                                      value={store.badgesConfig.elementRadius || 0}
                                      onChange={(e) => store.setBadgesOption('elementRadius', parseInt(e.target.value))}
                                      className="w-full h-1 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                   <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase text-emerald-500">Uniform Icon Scale: {store.badgesConfig.artisticIconSize}px</label>
                                    <input
                                      type="range"
                                      min="12"
                                      max="48"
                                      step="2"
                                      value={store.badgesConfig.artisticIconSize || 24}
                                      onChange={(e) => store.setBadgesOption('artisticIconSize', parseInt(e.target.value))}
                                      className="w-full h-1 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-4">
                                      <label className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Neon Glow</span>
                                        <div className="relative pt-1">
                                          <input 
                                            type="checkbox" 
                                            className="sr-only" 
                                            checked={store.badgesConfig.showGlow || false} 
                                            onChange={(e) => store.setBadgesOption('showGlow', e.target.checked)} 
                                          />
                                          <div className={cn("w-10 h-6 rounded-full transition-colors", store.badgesConfig.showGlow ? "bg-emerald-500" : "bg-slate-300 dark:bg-zinc-700")}></div>
                                          <div className={cn("absolute top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm", store.badgesConfig.showGlow ? "translate-x-5" : "translate-x-1")}></div>
                                        </div>
                                      </label>
                                      <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Shadow Depth: {store.badgesConfig.shadowDepth || 0}px</label>
                                        <input
                                          type="range"
                                          min="0"
                                          max="10"
                                          step="1"
                                          value={store.badgesConfig.shadowDepth || 0}
                                          onChange={(e) => store.setBadgesOption('shadowDepth', parseInt(e.target.value))}
                                          className="w-full h-1 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                        />
                                      </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}

                            {store.badgesConfig.badgeStyle === 'shields' && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                 <div className="grid grid-cols-2 gap-2">
                                   <div className="space-y-2">
                                     <span className="block text-[10px] uppercase font-black text-slate-400">Visual Scale</span>
                                     <div className="flex gap-1 p-1 bg-slate-100 dark:bg-zinc-900 rounded-xl">
                                       {(['sm', 'md'] as const).map((size) => (
                                         <button
                                           key={size}
                                           onClick={() => store.setBadgesOption('badgeSize', size)}
                                           className={cn(
                                             "flex-1 py-1.5 text-[9px] font-black rounded-md transition-all uppercase",
                                             store.badgesConfig.badgeSize === size
                                               ? "bg-white dark:bg-zinc-800 shadow-sm text-emerald-500"
                                               : "text-slate-500"
                                           )}
                                         >
                                           {size}
                                         </button>
                                       ))}
                                     </div>
                                   </div>
                                 </div>
                              </motion.div>
                            )}

                            {store.badgesConfig.badgeStyle === 'skillicons' && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-2">
                                    <span className="block text-[10px] uppercase font-black text-slate-400">Dynamic Theme</span>
                                    <div className="flex gap-1 p-1 bg-slate-100 dark:bg-zinc-900 rounded-xl">
                                      {(['dark', 'light'] as const).map((t) => (
                                        <button
                                          key={t}
                                          onClick={() => store.setBadgesOption('skillIconTheme', t)}
                                          className={cn(
                                            "flex-1 py-1.5 text-[9px] font-black rounded-md transition-all uppercase",
                                            store.badgesConfig.skillIconTheme === t
                                              ? "bg-white dark:bg-zinc-800 shadow-sm text-amber-500"
                                              : "text-slate-500"
                                          )}
                                        >
                                          {t}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Icons Per Line: {store.badgesConfig.skillIconsPerRow || 10}</label>
                                    <input
                                      type="range"
                                      min="1"
                                      max="20"
                                      step="1"
                                      value={store.badgesConfig.skillIconsPerRow || 10}
                                      onChange={(e) => store.setBadgesOption('skillIconsPerRow', parseInt(e.target.value))}
                                      className="w-full h-1 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            )}

                            {/* Unified Library Manager */}
                            <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-4">
                              <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Master Skill Library</span>
                                   <div className="flex items-center gap-4">
                                      <button 
                                        onClick={() => store.copyAnalyticsThemeToBadges()}
                                        className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-zinc-800 text-[9px] font-black text-slate-500 rounded-lg hover:bg-indigo-500 hover:text-white transition-all border border-slate-200 dark:border-white/5 uppercase tracking-tighter"
                                        title="Sync color with Analytics"
                                      >
                                        <Copy className="w-3 h-3" />
                                        Copy Palette
                                      </button>
                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Official Colors</span>
                                        <div className="relative">
                                          <input type="checkbox" className="sr-only" checked={store.badgesConfig.useOfficialColors} onChange={(e) => store.setBadgesOption('useOfficialColors', e.target.checked)} />
                                          <div className={cn("w-7 h-4 rounded-full transition-colors", store.badgesConfig.useOfficialColors ? "bg-emerald-500" : "bg-slate-300 dark:bg-zinc-700")}></div>
                                          <div className={cn("absolute top-0.5 bg-white w-3 h-3 rounded-full transition-transform shadow-sm", store.badgesConfig.useOfficialColors ? "translate-x-3.5" : "translate-x-0.5")}></div>
                                        </div>
                                      </label>
                                   </div>
                                </div>

                                <AnimatePresence>
                                  {!store.badgesConfig.useOfficialColors && (
                                    <motion.div 
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-zinc-900/50 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden"
                                    >
                                      <div className="space-y-2">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Global Theme color</label>
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="color"
                                            value={`#${store.badgesConfig.customBgColor}`}
                                            onChange={(e) => store.setBadgesOption('customBgColor', e.target.value.replace('#', ''))}
                                            className="w-8 h-8 p-0 border-0 rounded-lg cursor-pointer bg-transparent"
                                          />
                                          <span className="text-[10px] font-mono text-slate-500 uppercase">#{store.badgesConfig.customBgColor}</span>
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Label/Icon color</label>
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="color"
                                            value={`#${store.badgesConfig.customIconColor}`}
                                            onChange={(e) => store.setBadgesOption('customIconColor', e.target.value.replace('#', ''))}
                                            className="w-8 h-8 p-0 border-0 rounded-lg cursor-pointer bg-transparent"
                                          />
                                          <span className="text-[10px] font-mono text-slate-500 uppercase">#{store.badgesConfig.customIconColor}</span>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              <div>
                                <div className="relative">
                                  <input
                                    type="text"
                                    placeholder="Add Skill (React, Node...)"
                                    value={skillInput || ""}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition-all"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleAddSkill();
                                    }}
                                  />
                                  <button 
                                    onClick={handleAddSkill}
                                    className="absolute right-2 top-1.5 p-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Unified Draggable Skill Library */}
                              <div className="max-h-80 overflow-y-auto pr-2 space-y-3 custom-scrollbar border border-slate-200 dark:border-white/10 rounded-xl p-3 bg-white/50 dark:bg-zinc-950/30 shadow-inner">
                                <div className="space-y-3">
                                  <span className="block text-[10px] uppercase font-black text-slate-400 tracking-tighter">Unified Skill Library (Drag to Reorder)</span>
                                  {combinedSkills.length > 0 ? (
                                    <Reorder.Group axis="y" values={combinedSkills} onReorder={(newOrder) => store.setAllSkillsOrder(newOrder.map(s => s.name))} className="grid gap-2">
                                      {combinedSkills.map(skill => (
                                        <Reorder.Item 
                                          key={skill.name} 
                                          value={skill}
                                          className={cn(
                                            "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl p-2 flex flex-col gap-2 group shadow-sm hover:border-emerald-500/30 transition-all cursor-grab active:cursor-grabbing",
                                            skill.isAuto && "border-l-4 border-l-indigo-500"
                                          )}
                                        >
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                              <GripVertical className="w-3.5 h-3.5 text-slate-300 dark:text-zinc-700" />
                                              <div className="w-6 h-6 rounded bg-slate-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                                                {skill.iconUrl ? (
                                                  <img src={skill.iconUrl} alt="" className="w-4 h-4 object-contain" />
                                                ) : (
                                                  <Code2 className="w-3 h-3 text-slate-400" />
                                                )}
                                              </div>
                                              <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{skill.name}</span>
                                                {skill.isAuto && <span className="text-[8px] text-indigo-500 font-bold uppercase tracking-widest">GitHub Auto</span>}
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                              {!skill.isAuto && (
                                                <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 rounded-lg p-0.5 border border-slate-200 dark:border-white/5">
                                                  <input 
                                                    type="color" 
                                                    value={store.manualSkills.find(s => s.name === skill.name)?.color ? `#${store.manualSkills.find(s => s.name === skill.name)?.color}` : `#${store.badgesConfig.customBgColor}`}
                                                    onChange={(e) => store.updateManualSkill(skill.name, { color: e.target.value.replace('#', '') })}
                                                    className="w-4 h-4 p-0 border-0 rounded cursor-pointer bg-transparent"
                                                    title="Individual Skill Override"
                                                  />
                                                </div>
                                              )}
                                              {skill.isAuto ? (
                                                <button 
                                                  onClick={() => store.toggleLanguageVisibility(skill.name)}
                                                  className={cn(
                                                    "p-1.5 rounded-lg transition-all",
                                                    !store.hiddenLanguages.includes(skill.name) 
                                                      ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                                                      : "bg-slate-500/10 text-slate-500 hover:bg-slate-500 hover:text-white"
                                                  )}
                                                >
                                                  {!store.hiddenLanguages.includes(skill.name) ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                </button>
                                              ) : (
                                                <button onClick={() => store.removeManualSkill(skill.name)} className="p-1.5 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all">
                                                  <Trash2 className="w-3 h-3" />
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                          {!skill.isAuto && skill.iconUrl && (
                                            <div className="flex items-center gap-2 px-1 pl-7">
                                               <div className="flex-1 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                  <div className="h-full bg-emerald-500 w-full"></div>
                                               </div>
                                               <span className="text-[8px] font-bold text-emerald-500 uppercase">Artistic Mapped</span>
                                            </div>
                                          )}
                                        </Reorder.Item>
                                      ))}
                                    </Reorder.Group>
                                  ) : (
                                    <p className="text-[10px] text-slate-400 italic text-center py-4">Your library is empty. Enter a username or add skills manually.</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </LayoutGroup>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 🔗 Social Connectivity Section */}
              <div className={cn("rounded-2xl border overflow-hidden transition-all", store.showSocials ? "border-rose-200 dark:border-rose-500/30 bg-rose-50/20 dark:bg-rose-500/5" : "border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-zinc-900/20")}>
                <button onClick={() => toggleSection('socials')} className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900/50 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors">
                  <div className="flex items-center gap-3">
                    <Share2 className={cn("w-5 h-5", store.showSocials ? "text-rose-500" : "text-slate-400")} />
                    <span className="font-semibold text-slate-900 dark:text-white">Social Connectivity</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={store.showSocials} 
                      onChange={() => store.toggleModule('showSocials')}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                    />
                    <ChevronDown className={cn("w-5 h-5 text-slate-500 transition-transform", isSectionOpen('socials') && "rotate-180")} />
                  </div>
                </button>

                <AnimatePresence>
                  {isSectionOpen('socials') && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-slate-200 dark:border-white/10">
                      <div className="p-4 space-y-6 bg-white dark:bg-zinc-950/20">
                        {/* Quick-Add Bar */}
                        <div className="space-y-3">
                          <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest px-1">Quick-Add Platforms</span>
                          <div className="flex flex-wrap gap-2 p-3 bg-slate-100 dark:bg-zinc-900/50 rounded-2xl border border-slate-200 dark:border-white/5">
                            {PLATFORMS.map((p) => {
                              const isActive = store.socialProfiles.some(profile => profile.platform === p.id);
                              return (
                                <button
                                  key={p.id}
                                  onClick={() => {
                                    if (!isActive) {
                                      store.setSocialProfiles([...store.socialProfiles, { platform: p.id as any, username: "", isVisible: true, style: 'badge' }]);
                                    }
                                    setOpenSections(prev => ({ ...prev, [`social-${p.id}`]: true }));
                                  }}
                                  className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all border relative group",
                                    isActive 
                                      ? "bg-rose-500 border-rose-500 shadow-lg shadow-rose-500/20" 
                                      : "bg-white dark:bg-zinc-800 border-slate-200 dark:border-white/10 hover:border-rose-500/50"
                                  )}
                                  title={`Add ${p.name}`}
                                >
                                  <img 
                                    src={getPlatformIcon(p.id)} 
                                    alt={p.name} 
                                    className={cn("w-5 h-5 object-contain", isActive && "brightness-0 invert")} 
                                  />
                                  {isActive && (
                                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center border border-rose-500">
                                      <Check className="w-2.5 h-2.5 text-rose-500" />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Active Socials List */}
                        <div className="space-y-2">
                          {store.socialProfiles.map((profile) => {
                            const isOpen = isSectionOpen(`social-${profile.platform}`);
                            
                            return (
                              <div key={profile.platform} className={cn(
                                "bg-white dark:bg-zinc-900 border transition-all rounded-2xl overflow-hidden",
                                isOpen ? "border-rose-500/50 shadow-lg ring-1 ring-rose-500/10" : "border-slate-200 dark:border-white/10 hover:border-rose-500/30"
                              )}>
                                 <div 
                                   onClick={() => toggleSection(`social-${profile.platform}`)}
                                   className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors"
                                 >
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-white/5">
                                          <img src={getPlatformIcon(profile.platform)} alt="" className="w-4 h-4 object-contain" />
                                       </div>
                                       <div className="flex flex-col">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">{profile.platform}</span>
                                            {profile.isVerified && (
                                              <div className="flex items-center gap-0.5 px-1 bg-emerald-500/10 text-emerald-500 rounded text-[8px] font-bold uppercase tracking-tighter">
                                                <Check className="w-2 h-2" />
                                                Verified
                                              </div>
                                            )}
                                          </div>
                                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            {profile.username || <span className="text-slate-400 italic">Enter handle...</span>}
                                          </span>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <button 
                                          onClick={(e) => handleCopy(e, profile.username, `copy-${profile.platform}`)}
                                          className="p-1.5 hover:bg-indigo-500/10 text-slate-300 hover:text-indigo-500 rounded-lg transition-all relative"
                                        >
                                          {copiedId === `copy-${profile.platform}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                          <AnimatePresence>
                                            {copiedId === `copy-${profile.platform}` && (
                                              <motion.div 
                                                initial={{ opacity: 0, y: 10 }} 
                                                animate={{ opacity: 1, y: 0 }} 
                                                exit={{ opacity: 0 }}
                                                className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 text-white text-[8px] font-black uppercase rounded shadow-xl whitespace-nowrap z-50"
                                              >
                                                Copied!
                                              </motion.div>
                                            )}
                                          </AnimatePresence>
                                        </button>
                                       <button 
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           store.setSocialProfiles(store.socialProfiles.filter(p => p.platform !== profile.platform));
                                         }}
                                         className="p-1.5 hover:bg-rose-500/10 text-slate-300 hover:text-rose-500 rounded-lg transition-all"
                                       >
                                         <Trash2 className="w-3.5 h-3.5" />
                                       </button>
                                       <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isOpen && "rotate-180")} />
                                    </div>
                                 </div>

                                 <AnimatePresence>
                                   {isOpen && (
                                     <motion.div 
                                       initial={{ height: 0 }} 
                                       animate={{ height: 'auto' }} 
                                       exit={{ height: 0 }} 
                                       className="overflow-hidden border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-zinc-950/20"
                                     >
                                       <div className="p-4 space-y-4">
                                         <div className="space-y-1.5">
                                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Username / Handle</label>
                                           <input 
                                             type="text" 
                                             placeholder={`@username for ${profile.platform}`}
                                             value={profile.username}
                                             autoFocus
                                             onChange={(e) => store.updateSocialProfile(profile.platform, { username: e.target.value })}
                                             className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
                                           />
                                         </div>

                                         <div className="flex items-center justify-between">
                                           <div className="flex items-center gap-2">
                                             <span className="text-[10px] font-medium text-slate-400 uppercase">Profile Active</span>
                                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                           </div>
                                           <button 
                                             onClick={() => store.updateSocialProfile(profile.platform, { isVisible: !profile.isVisible })}
                                             className={cn("p-1.5 rounded-lg transition-all", profile.isVisible ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white" : "bg-slate-500/10 text-slate-500")}
                                           >
                                             {profile.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                           </button>
                                         </div>

                                         {/* Identity Import Controls */}
                                         <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5">
                                           <div className="flex items-center justify-between">
                                             <div className="flex flex-col">
                                               <span className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-300">Identity Source</span>
                                               <span className="text-[8px] text-slate-400 uppercase">Auto vs Manual</span>
                                             </div>
                                             <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg">
                                               <button 
                                                 onClick={() => store.updateSocialProfile(profile.platform, { avatarMode: 'auto' })}
                                                 className={cn(
                                                   "px-2 py-1 text-[8px] font-black uppercase rounded-md transition-all",
                                                   (profile.avatarMode || 'auto') === 'auto' ? "bg-white dark:bg-zinc-700 text-rose-500 shadow-sm" : "text-slate-400"
                                                 )}
                                               >
                                                 Auto
                                               </button>
                                               <button 
                                                 onClick={() => store.updateSocialProfile(profile.platform, { avatarMode: 'custom' })}
                                                 className={cn(
                                                   "px-2 py-1 text-[8px] font-black uppercase rounded-md transition-all",
                                                   profile.avatarMode === 'custom' ? "bg-white dark:bg-zinc-700 text-rose-500 shadow-sm" : "text-slate-400"
                                                 )}
                                               >
                                                 Custom
                                               </button>
                                             </div>
                                           </div>

                                           {profile.avatarMode === 'custom' && (
                                             <div className="space-y-1">
                                               <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">Custom Image URL</span>
                                               <div className="relative group">
                                                 <input 
                                                   type="text" 
                                                   value={profile.customAvatarUrl || ''} 
                                                   onChange={(e) => store.updateSocialProfile(profile.platform, { customAvatarUrl: e.target.value })}
                                                   placeholder="https://..."
                                                   className="w-full h-8 pl-8 pr-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-lg text-xs focus:ring-1 focus:ring-rose-500/50 outline-none transition-all"
                                                 />
                                                 <ImageIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                                               </div>
                                               <p className="text-[7px] text-slate-400 uppercase leading-tight italic">
                                                 Proxied via our engine to bypass GitHub Camo & CORS.
                                               </p>
                                             </div>
                                           )}
                                         </div>
                                       </div>
                                     </motion.div>
                                   )}
                                 </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>

                        {/* Global Social Styling Accordion */}
                        <div className="pt-2">
                          <button 
                            onClick={() => toggleSection('social-global')}
                            className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-900/50 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-white/5 transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <Brush className="w-4 h-4 text-rose-500" />
                              <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Aesthetic Settings</span>
                            </div>
                            <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform group-hover:text-rose-500", isSectionOpen('social-global') && "rotate-180")} />
                          </button>

                          <AnimatePresence>
                            {isSectionOpen('social-global') && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="p-4 space-y-6 pt-6 bg-white dark:bg-zinc-950/20 rounded-b-2xl border-x border-b border-slate-100 dark:border-white/5">
                                  <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Layout Architecture</label>
                                    <div className="flex p-1 bg-slate-100 dark:bg-zinc-900 rounded-xl gap-1">
                                      {[{ id: 'list', label: 'List', icon: Layout }, { id: 'bento', label: 'Bento', icon: Boxes }, { id: 'inline', label: 'Inline', icon: Layers }, { id: 'header', label: 'Suite Header', icon: Sparkles }].map((layout) => (
                                        <button key={layout.id} onClick={() => store.setSocialsOption('layout', layout.id as any)} className={cn("flex-1 flex flex-col items-center justify-center gap-1 py-2 text-[9px] font-black rounded-lg transition-all uppercase tracking-tighter border", store.socialsConfig.layout === layout.id ? "bg-white dark:bg-zinc-800 text-rose-600 shadow-sm border-rose-500/20" : "text-slate-500 border-transparent hover:text-slate-700")}>
                                          <layout.icon className="w-3.5 h-3.5" />
                                          {layout.label}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Card Aesthetic</label>
                                    <div className="flex p-1 bg-slate-100 dark:bg-zinc-900 rounded-xl gap-1">
                                      {[{ id: 'badge', label: 'Badge' }, { id: 'counter', label: 'Counter' }, { id: 'activity', label: 'Activity' }, { id: 'identity', label: 'Identity' }].map((s) => (
                                        <button key={s.id} onClick={() => store.setSocialProfiles(store.socialProfiles.map(p => ({ ...p, style: s.id as any })))} className={cn("flex-1 py-2 text-[9px] font-black rounded-lg transition-all uppercase tracking-tighter border", store.socialProfiles[0]?.style === s.id ? "bg-white dark:bg-zinc-800 text-rose-600 shadow-sm border-rose-500/20" : "text-slate-500 border-transparent hover:text-slate-700")}>
                                          {s.label}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                      <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Block Radius: {store.socialsConfig.blockRadius}px</label>
                                        <input type="range" min="0" max="40" step="2" value={store.socialsConfig.blockRadius || 20} onChange={(e) => store.setSocialsOption('blockRadius', parseInt(e.target.value))} className="w-full h-1 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500" />
                                      </div>
                                      <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Element Radius: {store.socialsConfig.elementRadius}px</label>
                                        <input type="range" min="0" max="20" step="1" value={store.socialsConfig.elementRadius || 10} onChange={(e) => store.setSocialsOption('elementRadius', parseInt(e.target.value))} className="w-full h-1 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500" />
                                      </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-white/5 pt-6">
                                    <label className="flex items-center justify-between cursor-pointer group">
                                      <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tighter">Use Profile Avatars</span>
                                        <span className="text-[8px] text-slate-400 uppercase">Fetch real images</span>
                                      </div>
                                      <div className="relative">
                                        <input type="checkbox" className="sr-only peer" checked={store.socialsConfig.useAvatar ?? true} onChange={(e) => store.setSocialsOption('useAvatar', e.target.checked)} />
                                        <div className="w-8 h-4 bg-slate-200 dark:bg-zinc-800 rounded-full peer peer-checked:bg-rose-500 transition-colors"></div>
                                        <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full peer-checked:translate-x-4 transition-transform"></div>
                                      </div>
                                    </label>
                                    
                                    <label className="flex items-center justify-between cursor-pointer group">
                                      <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tighter">Blur Background</span>
                                        <span className="text-[8px] text-slate-400 uppercase">Glassmorphism glow</span>
                                      </div>
                                      <div className="relative">
                                        <input type="checkbox" className="sr-only peer" checked={store.socialsConfig.showBlurBackground ?? true} onChange={(e) => store.setSocialsOption('showBlurBackground', e.target.checked)} />
                                        <div className="w-8 h-4 bg-slate-200 dark:bg-zinc-800 rounded-full peer peer-checked:bg-rose-500 transition-colors"></div>
                                        <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full peer-checked:translate-x-4 transition-transform"></div>
                                      </div>
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer group">
                                      <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tighter">Sync Avatar with Theme</span>
                                        <span className="text-[8px] text-slate-400 uppercase">Match fallback colors</span>
                                      </div>
                                      <div className="relative">
                                        <input type="checkbox" className="sr-only peer" checked={store.socialsConfig.syncAvatarColor ?? true} onChange={(e) => store.setSocialsOption('syncAvatarColor', e.target.checked)} />
                                        <div className="w-8 h-4 bg-slate-200 dark:bg-zinc-800 rounded-full peer peer-checked:bg-rose-500 transition-colors"></div>
                                        <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full peer-checked:translate-x-4 transition-transform"></div>
                                      </div>
                                    </label>
                                  </div>

                                  <div className="flex items-center justify-between pt-2">
                                      <div className="flex items-col gap-2">
                                        <div className="flex flex-col">
                                          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tighter">Neon Engagement Glow</span>
                                          <span className="text-[8px] text-slate-400 uppercase">Dynamic pulse effects</span>
                                        </div>
                                      </div>
                                      <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={store.socialsConfig.showGlow} onChange={(e) => store.setSocialsOption('showGlow', e.target.checked)} />
                                        <div className="w-9 h-5 bg-slate-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
                                      </label>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-50/50 dark:bg-zinc-900/20">
                <button onClick={() => toggleSection('layout')} className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900/50 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors">
                  <div className="flex items-center gap-3">
                    <Layers className="w-5 h-5 text-amber-500" />
                    <span className="font-semibold text-slate-900 dark:text-white">Layout Engine</span>
                  </div>
                  <ChevronDown className={cn("w-5 h-5 text-slate-500 transition-transform", isSectionOpen('layout') && "rotate-180")} />
                </button>

                {isSectionOpen('layout') && (
                  <div className="p-4 border-t border-slate-200 dark:border-white/10 space-y-6">
                    {/* Overall Pattern */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Master Pattern</label>
                      <div className="flex gap-2">
                        <button onClick={() => store.setLayout('grid')} className={cn("flex-1 py-2.5 text-xs font-black rounded-xl border transition-all uppercase tracking-tighter", store.layout === 'grid' ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20" : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-amber-300")}>Grid / Inline</button>
                        <button onClick={() => store.setLayout('stacked')} className={cn("flex-1 py-2.5 text-xs font-black rounded-xl border transition-all uppercase tracking-tighter", store.layout === 'stacked' ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20" : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-amber-300")}>Stacked</button>
                      </div>
                    </div>

                    {/* Drag & Drop Reorder */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Component Sequence</span>
                      <Reorder.Group axis="y" values={store.widgetOrder} onReorder={store.setWidgetOrder} className="space-y-2">
                        {store.widgetOrder.map((id) => {
                          const isVisible = id === 'languages' ? store.showLanguages : 
                                          id === 'badges' ? store.showBadges :
                                          id === 'stats' ? store.showStats :
                                          id === 'streak' ? store.showStreak :
                                          id === 'trophies' ? store.showTrophies :
                                          id === 'socials' ? store.showSocials : true;
                          
                          const label = id === 'languages' ? 'Language Analytics' :
                                       id === 'badges' ? 'Skill Badges' :
                                       id === 'stats' ? 'GitHub Stats' :
                                       id === 'streak' ? 'Streak Stats' :
                                       id === 'trophies' ? 'GitHub Trophies' :
                                       id === 'socials' ? 'Social Connectivity' : id;

                          return (
                            <Reorder.Item
                              key={id}
                              value={id}
                              className={cn(
                                "group flex items-center justify-between p-3 rounded-xl border bg-white dark:bg-zinc-900 transition-all",
                                "border-slate-200 dark:border-white/5 hover:border-amber-300 dark:hover:border-amber-500/50 shadow-sm",
                                !isVisible && "opacity-50 grayscale-[0.5]"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <GripVertical className="w-4 h-4 text-slate-300 dark:text-zinc-700 cursor-grab active:cursor-grabbing" />
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{label}</span>
                              </div>
                              <button
                                onClick={() => {
                                  if (id === 'languages') store.toggleModule('showLanguages');
                                  else if (id === 'badges') store.toggleModule('showBadges');
                                  else if (id === 'stats') store.toggleModule('showStats');
                                  else if (id === 'streak') store.toggleModule('showStreak');
                                  else if (id === 'trophies') store.toggleModule('showTrophies');
                                  else if (id === 'socials') store.toggleModule('showSocials');
                                }}
                              >
                                {isVisible ? <Eye className="w-4 h-4 text-indigo-500" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                              </button>
                            </Reorder.Item>
                          );
                        })}
                      </Reorder.Group>
                    </div>
                  </div>
                )}
              </div>

              {/* 🎨 Appearance Section */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-50/50 dark:bg-zinc-900/20">
                <button onClick={() => toggleSection('appearance')} className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900/50 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors">
                  <div className="flex items-center gap-3">
                    <Palette className="w-5 h-5 text-rose-500" />
                    <span className="font-semibold text-slate-900 dark:text-white">Global Appearance</span>
                  </div>
                  <ChevronDown className={cn("w-5 h-5 text-slate-500 transition-transform", isSectionOpen('appearance') && "rotate-180")} />
                </button>

                {isSectionOpen('appearance') && (
                  <div className="p-4 border-t border-slate-200 dark:border-white/10 space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Theme Ecosystem</label>
                      <div className="grid grid-cols-2 gap-2">
                        {THEMES.map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => store.setTheme(theme.id)}
                            className={cn(
                              "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all border font-bold uppercase tracking-tighter",
                              store.theme === theme.id
                                ? "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20"
                                : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-rose-300"
                            )}
                          >
                            {theme.name}
                            {store.theme === theme.id && <Check className="w-3 h-3" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {store.theme === 'custom' && (
                      <div className="space-y-3 p-4 bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-white/10 shadow-inner">
                        {[
                          { id: 'customBgColor', label: 'Canvas Color' },
                          { id: 'customTextColor', label: 'Ink Color' },
                          { id: 'customIconColor', label: 'Accent Color' },
                          { id: 'customBorderColor', label: 'Edge Color' },
                        ].map((colorSetting) => (
                          <div key={colorSetting.id} className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{colorSetting.label}</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                className="w-8 h-8 p-0 border-0 rounded-lg cursor-pointer bg-transparent"
                                value={`#${store[colorSetting.id as keyof typeof store] || "000000"}`}
                                onChange={(e) => store.setCustomColor(colorSetting.id as any, e.target.value)}
                              />
                              <input
                                type="text"
                                maxLength={6}
                                className="w-14 px-1.5 py-1 text-[10px] font-mono bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded uppercase text-center"
                                value={(store[colorSetting.id as keyof typeof store] as string) || ""}
                                onChange={(e) => store.setCustomColor(colorSetting.id as any, e.target.value)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <label className="flex items-center justify-between cursor-pointer group pt-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Clean Frame Mode</span>
                        <span className="text-[10px] text-slate-400">Hide all widget borders</span>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={store.hideBorder}
                          onChange={(e) => store.setHideBorder(e.target.checked)}
                        />
                        <div className={cn("w-10 h-6 rounded-full transition-colors", store.hideBorder ? "bg-rose-500" : "bg-slate-300 dark:bg-zinc-700")}></div>
                        <div className={cn("absolute top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm", store.hideBorder ? "translate-x-5" : "translate-x-1")}></div>
                      </div>
                    </label>
                  </div>
                )}
              </div>
    </div>
  </div>
  );
}
