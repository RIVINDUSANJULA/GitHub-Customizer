"use client";

import { useBuilderStore } from "@/store/useBuilderStore";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

export default function AboutMePreview() {
  const store = useBuilderStore();
  const { aboutMe, aboutMeConfig, showAboutMe, theme, customIconColor } = store;
  const isGenerating = aboutMeConfig.isGenerating;

  if (!showAboutMe) return null;

  const glowColor = theme === 'custom' ? `#${customIconColor}` : '#f43f5e'; // Default rose-500
  
  const content = isGenerating 
    ? "Synthesizing your professional narrative... generating technical insights and career milestones based on your technical stack and manual notes."
    : (aboutMe || "### Your Professional Story Starts Here\nUse the **AI Generator** or switch to **Manual Mode** in the sidebar to write your bio. It will appear here with beautiful glassmorphism and neon accents!");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative group w-full"
    >
      <div
        className={cn(
          "relative overflow-hidden transition-all duration-700 shadow-2xl",
          "bg-black/40 dark:bg-black/40 bg-white/5 backdrop-blur-xl",
          !aboutMe && !isGenerating && "border-dashed opacity-60"
        )}
        style={{ 
          borderRadius: `${aboutMeConfig.blockRadius}px`,
          border: `1px solid ${glowColor}30`,
          boxShadow: aboutMeConfig.showGlow ? `0 0 50px -12px ${glowColor}20` : undefined
        }}
      >
        {/* Shimmer Overlay for Loading State */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
            >
              <div 
                className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${glowColor}05, ${glowColor}20, ${glowColor}05, transparent)`,
                }}
              />
              <style jsx global>{`
                @keyframes shimmer {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(100%); }
                }
              `}</style>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Professional Header Label */}
        <div className="absolute top-4 left-6 z-10 flex items-center gap-3">
          <div 
            className="w-1.5 h-1.5 rounded-full" 
            style={{ 
              backgroundColor: glowColor,
              boxShadow: `0 0 8px ${glowColor}`
            }} 
          />
          <span className="text-[9px] font-mono font-bold tracking-[0.3em] uppercase text-white/50">
            // BIOGRAPHY
          </span>
        </div>

        {/* Content Area */}
        <div className="p-8 pt-14 relative z-10">
          <div className={cn(
            "prose prose-sm dark:prose-invert max-w-none transition-all duration-1000",
            isGenerating ? "opacity-20 blur-[3px]" : "opacity-100 blur-0",
            "prose-p:leading-[1.6] prose-p:text-slate-300/90 prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight",
            "prose-strong:text-white prose-strong:font-black",
            "prose-ul:list-none prose-ul:pl-0",
            "prose-li:relative prose-li:pl-6 prose-li:before:content-[''] prose-li:before:absolute prose-li:before:left-0 prose-li:before:top-[0.6em] prose-li:before:w-2 prose-li:before:h-[1px] prose-li:before:opacity-30"
          )}
          style={{ 
            // Dynamic theme accents for markdown
            "--tw-prose-bullets": glowColor,
            "--tw-prose-counters": glowColor,
            "--tw-prose-links": glowColor,
            "--tw-prose-bold": "white",
          } as any}>
            <ReactMarkdown key={aboutMe || 'loading'}>
              {content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Minimal Decorative Gradients */}
        <div 
          className="absolute -top-24 -right-24 w-64 h-64 blur-[100px] pointer-events-none opacity-[0.08]"
          style={{ backgroundColor: glowColor }}
        />
        <div 
          className="absolute -bottom-24 -left-24 w-64 h-64 blur-[100px] pointer-events-none opacity-[0.05]"
          style={{ backgroundColor: glowColor }}
        />
      </div>
    </motion.div>
  );
}
