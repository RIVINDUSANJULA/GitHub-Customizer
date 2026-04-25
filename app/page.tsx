"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code2, Sparkles, LayoutPanelLeft } from "lucide-react";

export default function Home() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (

    <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-slate-50 dark:from-indigo-900/20 dark:via-zinc-950 dark:to-zinc-950"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-overlay"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-overlay"></div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-8 border border-indigo-100 dark:border-indigo-800/50">
          <Sparkles className="w-4 h-4" />
          <span>The Ultimate Profile Builder</span>
        </motion.div>

        <motion.h1 variants={item} className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
          Stand Out on <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">GitHub</span>
        </motion.h1>

        <motion.p variants={item} className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
          Instantly generate a visually stunning, data-driven README for your GitHub profile. Customize stats, themes, and layouts in real-time.
        </motion.p>

        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/builder" className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl">
            Start Building
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white rounded-full font-semibold border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all">
            <Code2 className="w-4 h-4" />
            View on GitHub
          </Link>
        </motion.div>

        <motion.div variants={item} className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-left">
          {[
            { icon: LayoutPanelLeft, title: "Real-time Preview", desc: "See your README updates instantly as you tweak the settings." },
            { icon: Code2, title: "Clean Markdown", desc: "Generates pure, optimized markdown ready to copy and paste." },
            { icon: Sparkles, title: "Premium Themes", desc: "Choose from dozens of beautiful themes or create your own." }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-slate-100 dark:border-white/5 shadow-sm">
              <feature.icon className="w-8 h-8 text-indigo-500 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
