"use client";

import { useBuilderStore } from "@/store/useBuilderStore";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LanguageData {
  name: string;
  percentage: number;
  color: string;
}

export function LanguageStats() {
  const store = useBuilderStore();
  const languages = Array.isArray(store.autoLanguages) ? store.autoLanguages : [];
  const layout = store.analyticsConfig.layout || 'modern-bar';
  
  // Determine loading/syncing state
  const isSyncing = store.username && languages.length === 0;

  if (isSyncing) {
    return <SkeletonShimmer layout={layout} />;
  }

  if (languages.length === 0) {
    return (
      <div className="w-full p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
          // NO_PUBLIC_DATA_FOUND
        </p>
        <p className="text-[8px] text-slate-600 mt-2">Enter a valid GitHub username to see stats</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden group">
      {/* Glow background */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[100px] rounded-full group-hover:bg-indigo-500/20 transition-colors" />
      
      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          // LANGUAGE_DISTRIBUTION
        </h3>
        <div className="flex gap-1 items-center bg-white/5 px-2 py-1 rounded-full border border-white/5">
          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[7px] font-mono text-emerald-500/80 uppercase">PRO_SYNC</span>
        </div>
      </div>

      <div className="relative z-10">
        {layout === 'compact' && <CompactList languages={languages} />}
        {layout === 'pie' && <PieChart languages={languages} />}
        {layout === 'modern-bar' && <ModernBars languages={languages} />}
        {layout === 'soft-cards' && <SoftCards languages={languages} />}
        {layout === 'minimalist-line' && <MinimalistLine languages={languages} />}
      </div>

      <div className="pt-4 border-t border-white/5 flex justify-between items-center relative z-10">
        <p className="text-[7px] font-mono text-slate-500 uppercase tracking-tight">
          GitInfo Aggregator v2.0
        </p>
        <p className="text-[7px] font-mono text-slate-500 uppercase tracking-tight">
          Real-time GraphQL Analysis
        </p>
      </div>
    </div>
  );
}

function SkeletonShimmer({ layout }: { layout: string }) {
  return (
    <div className="w-full p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-2 w-24 bg-white/10 rounded animate-pulse" />
          <div className="h-2 w-12 bg-white/10 rounded animate-pulse" />
        </div>

        {layout === 'pie' ? (
          <div className="flex items-center justify-center gap-8 py-4">
            <div className="w-40 h-40 rounded-full border-8 border-white/10 animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3].map(i => <div key={i} className="h-2 w-20 bg-white/10 rounded animate-pulse" />)}
            </div>
          </div>
        ) : layout === 'soft-cards' ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-white/10 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="space-y-2">
                <div className="h-2 w-32 bg-white/10 rounded animate-pulse" />
                <div className="h-2 w-full bg-white/10 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CompactList({ languages }: { languages: LanguageData[] }) {
  if (!Array.isArray(languages)) return null;
  return (
    <div className="space-y-3">
      {languages.map((lang, i) => (
        <motion.div 
          key={lang.name}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center justify-between group/item"
        >
          <div className="flex items-center gap-3">
             <div 
              className="w-1.5 h-1.5 rounded-full" 
              style={{ backgroundColor: lang.color, boxShadow: `0 0 10px ${lang.color}66` }}
            />
            <span className="text-[11px] font-bold text-slate-300 group-hover/item:text-white transition-colors">{lang.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500">{lang.percentage.toFixed(1)}%</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ModernBars({ languages }: { languages: LanguageData[] }) {
  const store = useBuilderStore();
  const barHeight = store.analyticsConfig.barHeight || 18;
  if (!Array.isArray(languages)) return null;
  return (
    <div className="space-y-5">
      {languages.map((lang, index) => (
        <motion.div 
          key={lang.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">{lang.name}</span>
            <span className="text-[10px] font-mono text-slate-400">{lang.percentage.toFixed(1)}%</span>
          </div>
          <div className="relative w-full bg-white/5 rounded-full overflow-hidden border border-white/5" style={{ height: `${barHeight}px` }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${lang.percentage}%` }}
              transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1], delay: index * 0.1 }}
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ 
                backgroundColor: lang.color,
                boxShadow: store.analyticsConfig.showGlow ? `0 0 20px ${lang.color}44` : undefined
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function PieChart({ languages }: { languages: LanguageData[] }) {
  const store = useBuilderStore();
  const donutHoleSize = store.analyticsConfig.donutHoleSize || 60;
  if (!Array.isArray(languages)) return null;
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <div className="flex items-center justify-center gap-8 py-4">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {languages.map((lang, i) => {
            const strokeDasharray = `${(lang.percentage * circumference) / 100} ${circumference}`;
            const strokeDashoffset = -currentOffset;
            currentOffset += (lang.percentage * circumference) / 100;

            return (
              <motion.circle
                key={lang.name}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={lang.color}
                strokeWidth="12"
                strokeDasharray={strokeDasharray}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1], delay: i * 0.1 }}
                style={{ filter: store.analyticsConfig.showGlow ? `drop-shadow(0 0 8px ${lang.color}44)` : undefined }}
                className="hover:stroke-[14px] transition-all duration-300 cursor-pointer"
              />
            );
          })}
          {/* Inner glass circle (Donut hole) */}
          <circle cx="50" cy="50" r={radius * (donutHoleSize / 100)} fill="rgba(255,255,255,0.03)" className="backdrop-blur-xl" />
        </svg>
      </div>
      {!store.analyticsConfig.pieHideLegend && (
        <div className="space-y-2">
          {languages.map((lang, i) => (
            <div key={lang.name} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{lang.name}</span>
              <span className="text-[9px] font-mono text-slate-600">{lang.percentage.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SoftCards({ languages }: { languages: LanguageData[] }) {
  if (!Array.isArray(languages)) return null;
  return (
    <div className="grid grid-cols-2 gap-3">
      {languages.map((lang, i) => (
        <motion.div
          key={lang.name}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col gap-2 hover:bg-white/10 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div className="w-4 h-4 rounded bg-white/5 flex items-center justify-center">
               <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: lang.color, boxShadow: `0 0 10px ${lang.color}` }} />
            </div>
            <span className="text-[9px] font-mono text-slate-500">{lang.percentage.toFixed(1)}%</span>
          </div>
          <span className="text-[10px] font-black uppercase text-slate-300 tracking-wider truncate">{lang.name}</span>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full transition-all duration-1000" style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function MinimalistLine({ languages }: { languages: LanguageData[] }) {
  if (!Array.isArray(languages)) return null;
  return (
    <div className="space-y-6 py-4">
      <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden flex border border-white/10 shadow-inner">
        {languages.map((lang, i) => (
          <motion.div
            key={lang.name}
            initial={{ flex: 0 }}
            animate={{ flex: lang.percentage }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="h-full relative group"
            style={{ backgroundColor: lang.color }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
            {/* Tooltip-like label on hover */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-[8px] font-mono text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
              {lang.name}: {lang.percentage.toFixed(1)}%
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
        {languages.map(lang => (
          <div key={lang.name} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: lang.color }} />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{lang.name}</span>
            <span className="text-[9px] font-mono text-slate-700">{lang.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
