"use client";

import { useBuilderStore } from "@/store/useBuilderStore";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

export default function AboutMePreview() {
  const store = useBuilderStore();
  const { aboutMe, aboutMeConfig, showAboutMe, theme, customIconColor } = store;
  const isGenerating = aboutMeConfig.isGenerating;
  const [glitch, setGlitch] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D TILT LOGIC
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!aboutMeConfig.useHoverTilt || isGenerating) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    if (aboutMeConfig.preset !== 'none') {
      setGlitch(true);
      const timer = setTimeout(() => setGlitch(false), 400);
      return () => clearTimeout(timer);
    }
  }, [aboutMeConfig.preset]);

  if (!showAboutMe) return null;

  // PRESET ENGINE (Visual-only overrides)
  const p = aboutMeConfig.preset;
  const isMatrix = p === 'matrix';
  const isFrost = p === 'frost';
  const isEmber = p === 'ember';
  
  const glowColor = isMatrix ? '#00FF41' : (isFrost ? '#ffffff' : (isEmber ? '#f43f5e' : (theme === 'custom' ? `#${customIconColor}` : '#f43f5e')));
  const fontClass = isMatrix ? "font-mono" : (isFrost ? "font-serif" : "font-sans");

  const content = isGenerating 
    ? "Synthesizing your professional narrative... generating technical insights and career milestones based on your technical stack and manual notes."
    : (aboutMe || "### Your Professional Story Starts Here\nUse the **AI Generator** or switch to **Manual Mode** in the sidebar to write your bio. It will appear here with beautiful glassmorphism and neon accents!");

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        perspective: "1000px",
        '--bio-glow': glowColor,
        '--bio-blur': `${aboutMeConfig.glassBlur}px`,
        '--bio-border-op': aboutMeConfig.borderOpacity,
        '--bio-glass-op': aboutMeConfig.glassOpacity,
        '--bio-spread': `${aboutMeConfig.glowSpread}px`,
        '--bio-stroke': `${aboutMeConfig.strokeWeight}px`,
        '--bio-lh': aboutMeConfig.lineHeight,
        '--bio-ls': `${aboutMeConfig.letterSpacing}px`,
      } as any}
      className="relative group w-full"
    >
      <motion.div
        style={{ rotateX: aboutMeConfig.useHoverTilt ? rotateX : 0, rotateY: aboutMeConfig.useHoverTilt ? rotateY : 0 }}
        className={cn(
          "relative overflow-hidden transition-all duration-700 shadow-2xl",
          fontClass,
          isEmber && "animate-pulse-glow",
          glitch && "animate-glitch",
          "bg-black/[var(--bio-glass-op)] backdrop-blur-[var(--bio-blur)]",
          !aboutMe && !isGenerating && "border-dashed opacity-60"
        )}
        style={{ 
          borderRadius: `${aboutMeConfig.blockRadius}px`,
          border: `${aboutMeConfig.borderStyle} var(--bio-stroke) var(--bio-glow)`,
          borderColor: `rgba(${parseInt(glowColor.slice(1,3), 16)}, ${parseInt(glowColor.slice(3,5), 16)}, ${parseInt(glowColor.slice(5,7), 16)}, var(--bio-border-op))`,
          boxShadow: aboutMeConfig.showGlow ? `0 0 var(--bio-spread) -12px var(--bio-glow)` : undefined
        }}
      >
        {/* Surface Texture: Noise */}
        {(aboutMeConfig.showNoise || isFrost) && (
          <div className="absolute inset-0 pointer-events-none opacity-[0.08] z-10" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
          />
        )}

        {/* Surface Texture: Dot Matrix */}
        {(aboutMeConfig.showGrid) && (
          <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-10"
               style={{ backgroundImage: `radial-gradient(var(--bio-glow) 1px, transparent 0)`, backgroundSize: '16px 16px' }}
          />
        )}

        {/* Matrix Scanline Effect */}
        {isMatrix && (
          <div className="absolute inset-0 pointer-events-none z-30 opacity-[0.03] animate-scanline bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0)_0px,rgba(0,0,0,0)_1px,#00FF41_2px,rgba(0,0,0,0)_3px)] bg-[length:100%_4px]" />
        )}

        {/* Flowing Shimmer Overlay */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
            >
              <div 
                className="absolute inset-0 animate-flow-shimmer"
                style={{
                  background: `linear-gradient(45deg, transparent 25%, ${glowColor}20 50%, transparent 75%)`,
                  backgroundSize: '200% 200%'
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header HUD Capsule */}
        <div className="absolute top-0 left-0 z-40">
           <div 
            className="px-3 py-1 rounded-br-lg flex items-center gap-2 border-r border-b"
            style={{ 
              backgroundColor: `${glowColor}15`, 
              borderColor: `${glowColor}30`,
            }}
           >
             <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: glowColor, boxShadow: `0 0 8px ${glowColor}` }} />
             <span className={cn(
               "text-[8px] font-mono font-black tracking-[0.2em] uppercase",
               isMatrix ? "text-[#00FF41]" : "text-white"
             )}>
               {headerLabel}
             </span>
           </div>
        </div>

        {/* Content Area */}
        <div className={cn(
          "p-8 pt-12 relative z-20",
          aboutMeConfig.alignment === 'center' ? "text-center" : (aboutMeConfig.alignment === 'justify' ? "text-justify" : "text-left")
        )}>
          <div className={cn(
            "prose prose-sm dark:prose-invert max-w-none transition-all duration-1000",
            isGenerating ? "opacity-20 blur-[4px]" : "opacity-100 blur-0",
            isMatrix ? "prose-p:text-[#00FF41]/90 prose-headings:text-[#00FF41]" : (isFrost ? "prose-p:text-white/80 prose-headings:text-white" : "prose-p:text-slate-300/90 prose-headings:text-white"),
            "prose-headings:font-black prose-headings:tracking-tighter",
            "prose-strong:font-black prose-strong:text-white",
            "prose-ul:list-none prose-ul:pl-0",
            "prose-li:relative prose-li:pl-6 prose-li:before:content-[''] prose-li:before:absolute prose-li:before:left-0 prose-li:before:top-[0.6em] prose-li:before:w-2 prose-li:before:h-[1px] prose-li:before:opacity-30"
          )}
          style={{ 
            lineHeight: 'var(--bio-lh)',
            letterSpacing: 'var(--bio-ls)',
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
        {!isMatrix && (
          <>
            <div 
              className="absolute -top-24 -right-24 w-64 h-64 blur-[100px] pointer-events-none opacity-[0.08]"
              style={{ backgroundColor: glowColor }}
            />
            <div 
              className="absolute -bottom-24 -left-24 w-64 h-64 blur-[100px] pointer-events-none opacity-[0.05]"
              style={{ backgroundColor: glowColor }}
            />
          </>
        )}

        <style jsx global>{`
          @keyframes flow-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          @keyframes scanline {
            0% { transform: translateY(0); }
            100% { transform: translateY(100%); }
          }
          @keyframes glitch {
            0% { transform: translate(0); }
            10% { transform: translate(-2px, 1px); }
            20% { transform: translate(2px, -1px); }
            30% { transform: translate(-1px, 2px); }
            100% { transform: translate(0); }
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 40px -15px var(--bio-glow); border-opacity: 0.2; }
            50% { box-shadow: 0 0 60px -10px var(--bio-glow); border-opacity: 0.5; }
          }
          .animate-glitch { animation: glitch 0.4s ease-in-out; }
          .animate-scanline { animation: scanline 12s linear infinite; }
          .animate-flow-shimmer { animation: flow-shimmer 4s linear infinite; }
          .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        `}</style>
      </motion.div>
    </motion.div>
  );
}
