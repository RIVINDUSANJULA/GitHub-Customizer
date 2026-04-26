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

  // CHROMATIC ENGINE
  const config = aboutMeConfig;
  const p = config.preset;
  const isMatrix = p === 'matrix';
  const isFrost = p === 'frost';
  const isEmber = p === 'ember';
  
  // Base Colors
  const accent = `#${config.accentColor}`;
  const accent2 = config.useBorderGradient ? `#${config.borderGradientColor2}` : accent;
  const headerCol = `#${config.headerTextColor}`;
  const tint = `#${config.glassTint}`;

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
        '--bio-accent': accent,
        '--bio-accent-2': accent2,
        '--bio-header': headerCol,
        '--bio-tint': tint,
        '--bio-blur': `${config.glassBlur}px`,
        '--bio-border-op': config.borderOpacity,
        '--bio-glass-op': config.glassOpacity,
        '--bio-glow-op': config.glowOpacity,
        '--bio-spread': `${config.glowSpread}px`,
        '--bio-stroke': `${config.strokeWeight}px`,
        '--bio-glow': accent,
        '--bio-lh': config.lineHeight,
        '--bio-ls': `${config.letterSpacing}px`,
      } as any}
      className="relative group w-full"
    >
      <motion.div
        style={{ rotateX: config.useHoverTilt ? rotateX : 0, rotateY: config.useHoverTilt ? rotateY : 0 }}
        className={cn(
          "relative overflow-hidden transition-all duration-700 shadow-2xl",
          fontClass,
          isEmber && "animate-pulse-glow",
          glitch && "animate-glitch",
          config.luminanceBoost && "brightness-125 contrast-110",
          "backdrop-blur-[var(--bio-blur)]",
          !aboutMe && !isGenerating && "border-dashed opacity-60"
        )}
        style={{ 
          borderRadius: `${config.blockRadius}px`,
          backgroundColor: `${tint}${Math.round(config.glassOpacity * 255).toString(16).padStart(2, '0')}`,
          border: `${config.borderStyle} var(--bio-stroke) transparent`,
          backgroundImage: `linear-gradient(black, black), linear-gradient(to right, var(--bio-accent), var(--bio-accent-2))`,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          boxShadow: config.showGlow ? `0 0 var(--bio-spread) -10px var(--bio-accent)` : undefined
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
                  background: `linear-gradient(45deg, transparent 25%, var(--bio-accent)20 50%, transparent 75%)`,
                  backgroundSize: '200% 200%'
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header HUD Capsule */}
        <div className="absolute top-0 left-0 z-40">
           <div 
            className="px-3 py-1 rounded-br-xl flex items-center gap-2 border-r border-b"
            style={{ 
              backgroundColor: `var(--bio-accent)25`, 
              borderColor: `var(--bio-accent)40`,
              backdropFilter: 'blur(8px)'
            }}
           >
             <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--bio-accent)', boxShadow: `0 0 8px var(--bio-accent)` }} />
             <span className={cn(
               "text-[8px] font-mono font-black tracking-[0.2em] uppercase",
               "text-[var(--bio-header)]"
             )}>
               {config.headerLabel}
             </span>
           </div>
        </div>

        {/* Content Area */}
        <div className={cn(
          "p-8 pt-16 relative z-20",
          config.alignment === 'center' ? "text-center" : (config.alignment === 'justify' ? "text-justify" : "text-left")
        )}>
          {/* Unified Greeting Section */}
          <div className="mb-8 space-y-2">
             <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "text-4xl md:text-5xl font-black tracking-tighter leading-none",
                isMatrix ? "text-[var(--bio-accent)] font-mono uppercase" : "text-white"
              )}
             >
                {isMatrix ? `> HI_THERE, I'M ${store.username}` : `Hi there, I'm ${store.username} 👋`}
             </motion.h1>
             <div 
              className={cn(
                "h-1 rounded-full",
                config.alignment === 'center' ? "mx-auto w-24" : "w-12"
              )}
              style={{ backgroundColor: 'var(--bio-accent)', opacity: config.glowOpacity }}
             />
          </div>

          <div className={cn(
            "prose prose-sm dark:prose-invert max-w-none transition-all duration-1000",
            isGenerating ? "opacity-20 blur-[4px]" : "opacity-100 blur-0",
            isMatrix ? "prose-p:text-[var(--bio-accent)]/90 prose-headings:text-[var(--bio-accent)]" : (isFrost ? "prose-p:text-white/80 prose-headings:text-white" : "prose-p:text-slate-300/90 prose-headings:text-white"),
            "prose-headings:font-black prose-headings:tracking-tighter",
            "prose-strong:font-black prose-strong:text-white",
            "prose-ul:list-none prose-ul:pl-0",
            "prose-li:relative prose-li:pl-6 prose-li:before:content-[''] prose-li:before:absolute prose-li:before:left-0 prose-li:before:top-[0.6em] prose-li:before:w-2 prose-li:before:h-[1px] prose-li:before:opacity-30"
          )}
          style={{ 
            lineHeight: 'var(--bio-lh)',
            letterSpacing: 'var(--bio-ls)',
            "--tw-prose-bullets": 'var(--bio-accent)',
            "--tw-prose-counters": 'var(--bio-accent)',
            "--tw-prose-links": 'var(--bio-accent)',
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
              style={{ backgroundColor: 'var(--bio-accent)' }}
            />
            <div 
              className="absolute -bottom-24 -left-24 w-64 h-64 blur-[100px] pointer-events-none opacity-[0.05]"
              style={{ backgroundColor: 'var(--bio-accent)' }}
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
