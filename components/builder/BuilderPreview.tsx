"use client";

import { useBuilderStore } from "@/store/useBuilderStore";
import { generateMarkdown } from "@/lib/markdown-generator";
import { Copy, Download, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { SkillBadgeGrid } from "./SkillBadgeGrid";
import { SocialHubPreview } from "./SocialHubPreview";

export function BuilderPreview() {
  const store = useBuilderStore();
  const markdownResult = generateMarkdown(store);
  const { header, widgets, full } = markdownResult;
  
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  useEffect(() => {
    if (!store.username) return;

    const fetchData = async (force = false) => {
      try {
        const res = await fetch(`/api/github-user-data?username=${store.username}&include_contribs=${store.analyticsConfig.includeContributions}${force ? '&forceRefresh=true' : ''}`);
        if (res.ok) {
          const data = await res.json();
          const languages = Array.isArray(data.languages) ? data.languages : [];
          const skills = Array.isArray(data.skills) ? data.skills : [];
          
          store.setAutoLanguages(languages);
          store.setAutoSkills(skills);
          
          // RECONCILE ORDER
          const rawAutoNames = [...languages.map((l: any) => l.name), ...skills.map((s: any) => s.name)];
          const autoNames = Array.from(new Set(rawAutoNames));
          
          const manualNames = store.manualSkills.map(s => s.name);
          const currentOrder = store.allSkillsOrder;
          
          const uniqueAllDetected = Array.from(new Set([...autoNames, ...manualNames]));
          const newSkills = uniqueAllDetected.filter(name => !currentOrder.includes(name));
          if (newSkills.length > 0) {
            store.setAllSkillsOrder([...currentOrder, ...newSkills]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch auto languages:", err);
      }
    };

    const timer = setTimeout(() => fetchData(store.refreshTrigger > 0), 1000);
    return () => clearTimeout(timer);
  }, [store.username, store.analyticsConfig.includeContributions, store.refreshTrigger]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([full], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-zinc-950/50">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 backdrop-blur-md">
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-zinc-950 rounded-lg">
          <button
            onClick={() => setActiveTab('preview')}
            className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all", activeTab === 'preview' ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white")}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all", activeTab === 'code' ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white")}
          >
            Code
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={downloadMarkdown}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto custom-scrollbar p-6 md:p-10">
        <div className="max-w-4xl mx-auto w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden min-h-[500px]">
          {activeTab === 'preview' ? (
            <div className="p-8 prose dark:prose-invert max-w-none">
              {store.username ? (
                  <div className="flex flex-col gap-8">
                    <motion.div layout dangerouslySetInnerHTML={{ __html: header.replace(/\n/g, '<br/>') }} />
                    
                    <div className="flex flex-col gap-8">
                      <AnimatePresence mode="popLayout">
                        {store.widgetOrder.map((id) => {
                          const isVisible = id === 'languages' ? store.showLanguages : 
                                           id === 'badges' ? store.showBadges :
                                           id === 'stats' ? store.showStats :
                                           id === 'streak' ? store.showStreak :
                                           id === 'trophies' ? store.showTrophies :
                                           id === 'socials' ? store.showSocials : false;

                          if (!isVisible) return null;

                          const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
                          let themeParams = `&theme=${store.theme}`;
                          if (store.theme === 'custom') {
                            themeParams = `&bg_color=${store.customBgColor}&title_color=${store.customTextColor}&text_color=${store.customTextColor}&icon_color=${store.customIconColor}&border_color=${store.customBorderColor}`;
                          }
                          if (store.hideBorder) themeParams += '&hide_border=true';

                          return (
                            <motion.div
                              key={id}
                              layout
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ type: "spring", stiffness: 400, damping: 30 }}
                              className="w-full flex justify-center"
                            >
                              {id === 'languages' && (
                                <div className="flex justify-center w-full">
                                  <object 
                                    type="image/svg+xml"
                                    data={`${baseUrl}/api/github-languages?username=${store.username}&include_contribs=${store.analyticsConfig.includeContributions}&limit=${store.analyticsConfig.languageLimit}&layout=${store.analyticsConfig.layout}${themeParams}&blockRadius=${store.analyticsConfig.blockRadius}&elementRadius=${store.analyticsConfig.elementRadius}&showGlow=${store.analyticsConfig.showGlow}&animationSpeed=${store.analyticsConfig.animationSpeed}&donutHoleSize=${store.analyticsConfig.donutHoleSize}&startAngle=${store.analyticsConfig.startAngle}&barHeight=${store.analyticsConfig.barHeight}&lineThickness=${store.analyticsConfig.lineThickness}&cardsPerRow=${store.analyticsConfig.cardsPerRow}&shadowDepth=${store.analyticsConfig.shadowDepth}&bgType=${store.analyticsConfig.bgType}&bgColor2=${store.analyticsConfig.bgColor2}&pieShowHoverLabels=${store.analyticsConfig.pieShowHoverLabels}&pieLabelPosition=${store.analyticsConfig.pieLabelPosition}&pieHideLegend=${store.analyticsConfig.pieHideLegend}`}
                                    className="max-w-full pointer-events-auto"
                                    style={{ height: 'auto' }}
                                  >
                                    Languages
                                  </object>
                                </div>
                              )}
                              {id === 'badges' && <SkillBadgeGrid />}
                              {id === 'socials' && <SocialHubPreview />}
                              {id === 'stats' && (
                                <div dangerouslySetInnerHTML={{ __html: `<img src="https://github-readme-stats.vercel.app/api?username=${store.username}&show_icons=true${themeParams}" alt="Stats" />` }} />
                              )}
                              {id === 'streak' && (
                                <div dangerouslySetInnerHTML={{ __html: `<img src="https://github-readme-streak-stats.herokuapp.com/?user=${store.username}${themeParams.replace('bg_color', 'background').replace('title_color', 'stroke').replace('text_color', 'currStreakNum').replace('icon_color', 'fire')}" alt="Streak" />` }} />
                              )}
                              {id === 'trophies' && (
                                <div dangerouslySetInnerHTML={{ __html: `<img src="https://github-profile-trophy.vercel.app/?username=${store.username}&theme=${store.theme === 'custom' ? 'flat' : store.theme}&no-frame=false&no-bg=true&margin-w=15" alt="Trophies" />` }} />
                              )}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500">
                  <p>Enter your GitHub username to see the preview.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-0 h-full">
              <pre className="p-6 text-sm text-slate-800 dark:text-slate-300 overflow-x-auto font-mono whitespace-pre-wrap">
                {full}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
