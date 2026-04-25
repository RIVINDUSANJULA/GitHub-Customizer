"use client";

import { useBuilderStore, StatTheme } from "@/store/useBuilderStore";
import { User, Palette, Settings, Layout, Check, ChevronDown, Code2, BarChart3, Tags, Zap, Trophy, PieChart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
  const [openSection, setOpenSection] = useState<string>("profile");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? "" : section);
  };

  return (
    <div className="w-full h-full bg-white dark:bg-zinc-950/50 backdrop-blur-xl border-r border-slate-200 dark:border-white/10 flex flex-col overflow-y-auto custom-scrollbar">
      <div className="p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Configuration</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Customize your GitHub profile README.</p>
      </div>

      <div className="flex-1 px-4 space-y-4 pb-12">
        {/* Profile Section */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-50/50 dark:bg-zinc-900/20">
          <button onClick={() => toggleSection('profile')} className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900/50 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-indigo-500" />
              <span className="font-semibold text-slate-900 dark:text-white">Profile</span>
            </div>
            <ChevronDown className={cn("w-5 h-5 text-slate-500 transition-transform", openSection === 'profile' && "rotate-180")} />
          </button>

          {openSection === 'profile' && (
            <div className="p-4 border-t border-slate-200 dark:border-white/10">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">GitHub Username</label>
              <input
                type="text"
                placeholder="e.g. torvalds"
                value={store.username}
                onChange={(e) => store.setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-zinc-950 border border-slate-300 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          )}
        </div>

        {/* Unified Widgets Section */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-50/50 dark:bg-zinc-900/20">
          <button onClick={() => toggleSection('widgets')} className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900/50 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors">
            <div className="flex items-center gap-3">
              <Layout className="w-5 h-5 text-emerald-500" />
              <span className="font-semibold text-slate-900 dark:text-white">Widgets</span>
            </div>
            <ChevronDown className={cn("w-5 h-5 text-slate-500 transition-transform", openSection === 'widgets' && "rotate-180")} />
          </button>

          {openSection === 'widgets' && (
            <div className="p-4 border-t border-slate-200 dark:border-white/10 space-y-6">
              {/* Visibility Checklist */}
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-3">Include in README</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'showStats', label: 'Stats' },
                    { id: 'showStreak', label: 'Streak' },
                    { id: 'showTrophies', label: 'Trophies' },
                    { id: 'showCustomLanguages', label: 'Adv. Analytics' },
                  ].map((widget) => (
                    <label key={widget.id} className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-950/50 cursor-pointer hover:border-indigo-500/50 transition-all group">
                      <input
                        type="checkbox"
                        checked={store[widget.id as keyof typeof store] as boolean}
                        onChange={() => store.toggleModule(widget.id as any)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{widget.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Customization Tab Selector */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-3">Customize Widget</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                    { id: 'badges', label: 'Badges', icon: Tags },
                    { id: 'stats', label: 'Stats', icon: PieChart },
                    { id: 'streak', label: 'Streak', icon: Zap },
                    { id: 'trophies', label: 'Trophies', icon: Trophy },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        store.setActiveWidgetTab(tab.id as any);
                        if (tab.id === 'analytics') store.setLanguageDisplayType('analytics');
                        if (tab.id === 'badges') store.setLanguageDisplayType('badges');
                      }}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                        store.activeWidgetTab === tab.id
                          ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30 shadow-sm"
                          : "bg-white dark:bg-zinc-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-zinc-800"
                      )}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Customization Panel */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                {store.activeWidgetTab === 'analytics' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase">Analytics Settings</span>
                    </div>
                    <label className="flex items-center justify-between cursor-pointer group">
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-700 dark:text-slate-300">Include Contributions</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Public repositories only for privacy</span>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={store.includeContributions}
                          onChange={() => store.setLanguageOption('includeContributions', !store.includeContributions)}
                        />
                        <div className={cn("w-10 h-6 rounded-full transition-colors", store.includeContributions ? "bg-indigo-500" : "bg-slate-300 dark:bg-zinc-700")}></div>
                        <div className={cn("absolute top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm", store.includeContributions ? "translate-x-5" : "translate-x-1")}></div>
                      </div>
                    </label>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Display Limit: {store.languageLimit}</label>
                      <input
                        type="range"
                        min="3"
                        max="12"
                        step="1"
                        value={store.languageLimit}
                        onChange={(e) => store.setLanguageOption('languageLimit', parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Visual Style</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['compact', 'list', 'pie', 'modern-bar', 'soft-cards', 'minimalist-line'] as const).map((style) => (
                          <button
                            key={style}
                            onClick={() => store.setLanguageOption('languageLayout', style)}
                            className={cn(
                              "py-2 text-[10px] font-bold rounded-lg border transition-all uppercase tracking-wider",
                              store.languageLayout === style
                                ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30 shadow-sm"
                                : "bg-white dark:bg-zinc-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300"
                            )}
                          >
                            {style.replace('-', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 space-y-4 border-t border-slate-200 dark:border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase">Advanced Styling</span>
                      </div>
                      
                      <div className="space-y-4 overflow-hidden">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={store.languageLayout}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="space-y-4"
                          >
                            {/* Common Settings: Glow & Speed */}
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Neon Glow Effect</label>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer" 
                                  checked={store.showGlow}
                                  onChange={(e) => store.setLanguageOption('showGlow', e.target.checked)}
                                />
                                <div className="w-9 h-5 bg-slate-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                              </label>
                            </div>

                            {/* Radius Settings */}
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Outer Block Radius: {store.blockRadius}px</label>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="40"
                                  step="2"
                                  value={store.blockRadius}
                                  onChange={(e) => store.setLanguageOption('blockRadius', parseInt(e.target.value))}
                                  className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Internal Element Radius: {store.elementRadius}px</label>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="20"
                                  step="1"
                                  value={store.elementRadius}
                                  onChange={(e) => store.setLanguageOption('elementRadius', parseInt(e.target.value))}
                                  className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                              </div>
                            </div>

                            {/* Conditional: Pie Settings */}
                            {store.languageLayout === 'pie' && (
                              <div className="space-y-4">
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Donut Hole Size: {store.donutHoleSize}%</label>
                                  </div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="80"
                                    step="5"
                                    value={store.donutHoleSize}
                                    onChange={(e) => store.setLanguageOption('donutHoleSize', parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                  />
                                </div>
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Start Angle: {store.startAngle}°</label>
                                  </div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="360"
                                    step="15"
                                    value={store.startAngle}
                                    onChange={(e) => store.setLanguageOption('startAngle', parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Conditional: Bar Height */}
                            {(store.languageLayout === 'modern-bar' || store.languageLayout === 'compact') && (
                              <div>
                                <div className="flex justify-between mb-1">
                                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Bar Height: {store.barHeight}px</label>
                                </div>
                                <input
                                  type="range"
                                  min="8"
                                  max="30"
                                  step="2"
                                  value={store.barHeight}
                                  onChange={(e) => store.setLanguageOption('barHeight', parseInt(e.target.value))}
                                  className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                              </div>
                            )}

                            {/* Conditional: Cards per Row & Shadow */}
                            {store.languageLayout === 'soft-cards' && (
                              <div className="space-y-4">
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Cards per Row: {store.cardsPerRow}</label>
                                  </div>
                                  <input
                                    type="range"
                                    min="1"
                                    max="4"
                                    step="1"
                                    value={store.cardsPerRow}
                                    onChange={(e) => store.setLanguageOption('cardsPerRow', parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                  />
                                </div>
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Shadow Depth: {store.shadowDepth}px</label>
                                  </div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    step="1"
                                    value={store.shadowDepth}
                                    onChange={(e) => store.setLanguageOption('shadowDepth', parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Background Type & Gradient */}
                            <div className="pt-2 border-t border-slate-200 dark:border-white/5 space-y-3">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Background Type</label>
                                <div className="flex p-0.5 bg-slate-100 dark:bg-zinc-800 rounded-md">
                                  {(['solid', 'gradient'] as const).map((type) => (
                                    <button
                                      key={type}
                                      onClick={() => store.setLanguageOption('bgType', type)}
                                      className={cn(
                                        "px-2 py-1 text-[9px] font-bold rounded transition-all uppercase",
                                        store.bgType === type 
                                          ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                          : "text-slate-500"
                                      )}
                                    >
                                      {type}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              
                              {store.bgType === 'gradient' && (
                                <div className="flex items-center gap-2">
                                  <div className="flex-1">
                                    <label className="text-[10px] text-slate-400 block mb-1">Start Color</label>
                                    <input 
                                      type="color" 
                                      value={`#${store.customBgColor}`}
                                      onChange={(e) => store.setCustomColor('customBgColor', e.target.value.replace('#', ''))}
                                      className="w-full h-6 rounded cursor-pointer border-none bg-transparent"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <label className="text-[10px] text-slate-400 block mb-1">End Color</label>
                                    <input 
                                      type="color" 
                                      value={`#${store.bgColor2}`}
                                      onChange={(e) => store.setLanguageOption('bgColor2', e.target.value.replace('#', ''))}
                                      className="w-full h-6 rounded cursor-pointer border-none bg-transparent"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            <div>
                              <div className="flex justify-between mb-1">
                                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Animation Speed: {store.animationSpeed}x</label>
                              </div>
                              <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={store.animationSpeed}
                                onChange={(e) => store.setLanguageOption('animationSpeed', parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                              />
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                )}

                {store.activeWidgetTab === 'badges' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase">Badge Grid Settings</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Add Manual Skill</label>
                      <input
                        type="text"
                        placeholder="React, Figma, Docker..."
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-950 border border-slate-300 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = e.currentTarget.value.trim();
                            if (val) {
                              store.addManualSkill(val);
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Color Mode</span>
                        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-zinc-900 rounded-lg">
                          <button onClick={() => store.setBadgeColorMode('brand')} className={cn("flex-1 py-1 text-[10px] font-bold rounded-md transition-all", store.badgeColorMode === 'brand' ? "bg-white dark:bg-zinc-800 shadow-sm" : "text-slate-500")}>BRAND</button>
                          <button onClick={() => store.setBadgeColorMode('custom')} className={cn("flex-1 py-1 text-[10px] font-bold rounded-md transition-all", store.badgeColorMode === 'custom' ? "bg-white dark:bg-zinc-800 shadow-sm" : "text-slate-500")}>CUSTOM</button>
                        </div>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Badge Size</span>
                        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-zinc-900 rounded-lg">
                          <button onClick={() => store.setBadgeSize('sm')} className={cn("flex-1 py-1 text-[10px] font-bold rounded-md transition-all", store.badgeSize === 'sm' ? "bg-white dark:bg-zinc-800 shadow-sm" : "text-slate-500")}>SM</button>
                          <button onClick={() => store.setBadgeSize('md')} className={cn("flex-1 py-1 text-[10px] font-bold rounded-md transition-all", store.badgeSize === 'md' ? "bg-white dark:bg-zinc-800 shadow-sm" : "text-slate-500")}>MD</button>
                        </div>
                      </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto pr-2 space-y-2 custom-scrollbar border border-slate-200 dark:border-white/10 rounded-lg p-3 bg-white/50 dark:bg-zinc-950/50">
                      {store.autoLanguages.length > 0 && (
                        <div className="pb-2 mb-2 border-b border-slate-200 dark:border-white/10">
                          <span className="block text-[10px] uppercase font-bold text-slate-400 mb-2">GitHub Detected</span>
                          {store.autoLanguages.map(lang => (
                            <label key={lang.name} className="flex items-center gap-2 cursor-pointer group py-1">
                              <input
                                type="checkbox"
                                checked={!store.hiddenLanguages.includes(lang.name)}
                                onChange={() => store.toggleLanguageVisibility(lang.name)}
                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white flex items-center justify-between flex-1">
                                {lang.name}
                                <span className="text-[10px] opacity-50">{lang.percentage.toFixed(1)}%</span>
                              </span>
                            </label>
                          ))}
                        </div>
                      )}

                      <span className="block text-[10px] uppercase font-bold text-slate-400 mb-2">Manual Skills</span>
                      {store.manualSkills.length > 0 ? (
                        store.manualSkills.map(skill => (
                          <label key={skill} className="flex items-center gap-2 cursor-pointer group py-1">
                            <input
                              type="checkbox"
                              checked={!store.hiddenSkills.includes(skill)}
                              onChange={() => store.toggleSkillVisibility(skill)}
                              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">{skill}</span>
                          </label>
                        ))
                      ) : (
                        <p className="text-[10px] text-slate-400 italic">No manual skills added yet.</p>
                      )}
                    </div>
                  </div>
                )}

                {(store.activeWidgetTab === 'stats' || store.activeWidgetTab === 'streak' || store.activeWidgetTab === 'trophies') && (
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-xl bg-slate-50/50 dark:bg-zinc-950/20">
                    <Settings className="w-8 h-8 text-slate-300 dark:text-zinc-700 mb-3" />
                    <p className="text-xs text-slate-500 dark:text-slate-400">Settings for <span className="font-bold text-indigo-500 capitalize">{store.activeWidgetTab}</span> will be available soon.</p>
                  </div>
                )}
              </div>

              {/* Layout Pattern (Moved here as it relates to widgets) */}
              <div className="pt-4 mt-2 border-t border-slate-200 dark:border-white/10">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Overall Layout Pattern</label>
                <div className="flex gap-2">
                  <button onClick={() => store.setLayout('grid')} className={cn("flex-1 py-2 text-sm font-medium rounded-lg transition-colors border", store.layout === 'grid' ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30" : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10")}>Grid / Inline</button>
                  <button onClick={() => store.setLayout('stacked')} className={cn("flex-1 py-2 text-sm font-medium rounded-lg transition-colors border", store.layout === 'stacked' ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30" : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10")}>Stacked</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Appearance Section */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-50/50 dark:bg-zinc-900/20">
          <button onClick={() => toggleSection('appearance')} className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900/50 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-rose-500" />
              <span className="font-semibold text-slate-900 dark:text-white">Appearance</span>
            </div>
            <ChevronDown className={cn("w-5 h-5 text-slate-500 transition-transform", openSection === 'appearance' && "rotate-180")} />
          </button>

          {openSection === 'appearance' && (
            <div className="p-4 border-t border-slate-200 dark:border-white/10 space-y-4">

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Theme Presets</label>
                <div className="grid grid-cols-2 gap-2">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => store.setTheme(theme.id)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all border",
                        store.theme === theme.id
                          ? "bg-indigo-50 dark:bg-indigo-500/20 border-indigo-200 dark:border-indigo-500/50 text-indigo-700 dark:text-indigo-300 font-medium"
                          : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20"
                      )}
                    >
                      {theme.name}
                      {store.theme === theme.id && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {store.theme === 'custom' && (
                <div className="space-y-3 p-3 bg-white dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-white/10">
                  {[
                    { id: 'customBgColor', label: 'Background Color' },
                    { id: 'customTextColor', label: 'Text/Title Color' },
                    { id: 'customIconColor', label: 'Icon Color' },
                    { id: 'customBorderColor', label: 'Border Color' },
                  ].map((colorSetting) => (
                    <div key={colorSetting.id} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{colorSetting.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">#</span>
                        <input
                          type="text"
                          maxLength={6}
                          className="w-16 px-2 py-1 text-sm bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded uppercase"
                          value={store[colorSetting.id as keyof typeof store] as string}
                          onChange={(e) => store.setCustomColor(colorSetting.id as any, e.target.value)}
                        />
                        <input
                          type="color"
                          className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
                          value={`#${store[colorSetting.id as keyof typeof store]}`}
                          onChange={(e) => store.setCustomColor(colorSetting.id as any, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <label className="flex items-center justify-between cursor-pointer group pt-2 border-t border-slate-200 dark:border-white/10">
                <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Hide Widget Borders</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={store.hideBorder}
                    onChange={(e) => store.setHideBorder(e.target.checked)}
                  />
                  <div className={cn("w-10 h-6 rounded-full transition-colors", store.hideBorder ? "bg-indigo-500" : "bg-slate-300 dark:bg-zinc-700")}></div>
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
