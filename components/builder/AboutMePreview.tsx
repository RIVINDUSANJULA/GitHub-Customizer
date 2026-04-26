"use client";

import { useBuilderStore } from "@/store/useBuilderStore";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Sparkles, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AboutMePreview() {
  const store = useBuilderStore();
  const { aboutMe, aboutMeConfig, showAboutMe, theme, customIconColor } = store;
  const isGenerating = aboutMeConfig.isGenerating;

  if (!showAboutMe || (!aboutMe && !isGenerating)) return null;

  const glowColor = theme === 'custom' ? `#${customIconColor}` : '#f43f5e'; // Default rose-500

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative group w-full"
    >
      {/* Neon Glow Background */}
      {aboutMeConfig.showGlow && (
        <div 
          className="absolute -inset-4 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" 
          style={{ backgroundColor: `${glowColor}20` }}
        />
      )}

      <div
        style={{ 
          borderRadius: `${aboutMeConfig.blockRadius}px`,
          borderColor: aboutMeConfig.showGlow ? `${glowColor}30` : undefined
        }}
        className={cn(
          "relative overflow-hidden border p-8 transition-all duration-500",
          "bg-white/80 dark:bg-zinc-950/40 backdrop-blur-xl",
          "border-slate-200 dark:border-white/10 hover:border-rose-500/50 shadow-xl"
        )}
      >
        {/* Shimmer Overlay for Loading State */}
        {isGenerating && (
          <div className="absolute inset-0 z-10 overflow-hidden">
            <div 
              className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
              style={{
                background: `linear-gradient(90deg, transparent, ${glowColor}10, ${glowColor}20, ${glowColor}10, transparent)`,
              }}
            />
            <style jsx global>{`
              @keyframes shimmer {
                100% { transform: translateX(100%); }
              }
            `}</style>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-500/10 rounded-lg">
              {isGenerating ? (
                <Sparkles className="w-5 h-5 text-rose-500 animate-spin" />
              ) : (
                <Bot className="w-5 h-5 text-rose-500" />
              )}
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
              {isGenerating ? 'Synthesizing Bio...' : 'About Me'}
            </h3>
          </div>
          {isGenerating && (
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase text-rose-500 tracking-widest">AI Thinking</span>
            </div>
          )}
        </div>

        <div className={cn(
          "prose prose-sm dark:prose-invert max-w-none transition-all duration-700",
          isGenerating ? "opacity-30 blur-[2px]" : "opacity-100 blur-0",
          "prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-strong:text-rose-500 prose-ul:list-disc prose-li:marker:text-rose-500"
        )}>
          <ReactMarkdown>
            {isGenerating ? "Synthesizing your professional narrative... generating technical insights and career milestones based on your technical stack and manual notes." : aboutMe}
          </ReactMarkdown>
        </div>

        {/* Decorative Neon Accents */}
        <div 
          className="absolute top-0 right-0 w-32 h-32 blur-[60px] pointer-events-none opacity-20"
          style={{ backgroundColor: `${glowColor}40` }}
        />
        <div 
          className="absolute bottom-0 left-0 w-24 h-24 blur-[40px] pointer-events-none opacity-10"
          style={{ backgroundColor: `${glowColor}30` }}
        />
      </div>
    </motion.div>
  );
}
