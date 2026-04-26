"use client";

import { useBuilderStore } from "@/store/useBuilderStore";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AboutMePreview() {
  const { aboutMe, aboutMeConfig, showAboutMe } = useBuilderStore();

  if (!showAboutMe || !aboutMe) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative group"
    >
      {/* Neon Glow Background */}
      {aboutMeConfig.showGlow && (
        <div className="absolute -inset-4 bg-rose-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
      )}

      <div
        style={{ borderRadius: `${aboutMeConfig.blockRadius}px` }}
        className={cn(
          "relative overflow-hidden border p-8 transition-all duration-500",
          "bg-white/80 dark:bg-zinc-950/40 backdrop-blur-xl",
          "border-slate-200 dark:border-white/10 hover:border-rose-500/50 shadow-xl"
        )}
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-rose-500/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-rose-500" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">About Me</h3>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-strong:text-rose-500 prose-ul:list-disc prose-li:marker:text-rose-500">
          <ReactMarkdown>{aboutMe}</ReactMarkdown>
        </div>

        {/* Decorative Neon Accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-[60px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-500/5 blur-[40px] pointer-events-none" />
      </div>
    </motion.div>
  );
}
