"use client";

import { useBuilderStore, StatTheme } from "@/store/useBuilderStore";
import { User, Palette, Settings, Layout, Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

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

        {/* Widgets Section */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-50/50 dark:bg-zinc-900/20">
          <button onClick={() => toggleSection('widgets')} className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900/50 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors">
            <div className="flex items-center gap-3">
              <Layout className="w-5 h-5 text-emerald-500" />
              <span className="font-semibold text-slate-900 dark:text-white">Widgets</span>
            </div>
            <ChevronDown className={cn("w-5 h-5 text-slate-500 transition-transform", openSection === 'widgets' && "rotate-180")} />
          </button>
          
          {openSection === 'widgets' && (
            <div className="p-4 border-t border-slate-200 dark:border-white/10 space-y-3">
              {[
                { id: 'showStats', label: 'Overall Stats' },
                { id: 'showLanguages', label: 'Top Languages' },
                { id: 'showStreak', label: 'GitHub Streak' },
                { id: 'showTrophies', label: 'Trophies' },
                { id: 'showTopRepos', label: 'Pinned Repos (Example)' },
              ].map((widget) => (
                <label key={widget.id} className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{widget.label}</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={store[widget.id as keyof typeof store] as boolean}
                      onChange={() => store.toggleModule(widget.id as any)}
                    />
                    <div className={cn("w-10 h-6 rounded-full transition-colors", store[widget.id as keyof typeof store] ? "bg-indigo-500" : "bg-slate-300 dark:bg-zinc-700")}></div>
                    <div className={cn("absolute top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm", store[widget.id as keyof typeof store] ? "translate-x-5" : "translate-x-1")}></div>
                  </div>
                </label>
              ))}

              <div className="pt-4 mt-2 border-t border-slate-200 dark:border-white/10">
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Layout Pattern</label>
                 <div className="flex gap-2">
                   <button onClick={() => store.setLayout('grid')} className={cn("flex-1 py-2 text-sm font-medium rounded-lg transition-colors border", store.layout === 'grid' ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30" : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10")}>Grid / Inline</button>
                   <button onClick={() => store.setLayout('stacked')} className={cn("flex-1 py-2 text-sm font-medium rounded-lg transition-colors border", store.layout === 'stacked' ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30" : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10")}>Stacked</button>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Language Stats Section */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-50/50 dark:bg-zinc-900/20">
          <button onClick={() => toggleSection('languages')} className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900/50 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors">
            <div className="flex items-center gap-3">
              <Code2 className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-slate-900 dark:text-white">Language Analytics</span>
            </div>
            <ChevronDown className={cn("w-5 h-5 text-slate-500 transition-transform", openSection === 'languages' && "rotate-180")} />
          </button>
          
          {openSection === 'languages' && (
            <div className="p-4 border-t border-slate-200 dark:border-white/10 space-y-4">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-slate-700 dark:text-slate-300">Show Advanced Analytics</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={store.showCustomLanguages}
                    onChange={() => store.toggleModule('showCustomLanguages' as any)}
                  />
                  <div className={cn("w-10 h-6 rounded-full transition-colors", store.showCustomLanguages ? "bg-indigo-500" : "bg-slate-300 dark:bg-zinc-700")}></div>
                  <div className={cn("absolute top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm", store.showCustomLanguages ? "translate-x-5" : "translate-x-1")}></div>
                </div>
              </label>

              {store.showCustomLanguages && (
                <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-white/10">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm text-slate-700 dark:text-slate-300">Include Contributions</span>
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
                      {(['compact', 'list', 'pie'] as const).map((style) => (
                        <button
                          key={style}
                          onClick={() => store.setLanguageOption('languageLayout', style)}
                          className={cn(
                            "py-2 text-xs font-medium rounded-lg border transition-all capitalize",
                            store.languageLayout === style 
                              ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30" 
                              : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10"
                          )}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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
