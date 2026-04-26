"use client";

import { useBuilderStore } from "@/store/useBuilderStore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function SocialHubPreview() {
  const store = useBuilderStore();
  const { socialProfiles, socialsConfig, showSocials } = store;

  if (!showSocials || socialProfiles.length === 0) return null;

  const visibleProfiles = socialProfiles.filter(p => p.isVisible);

  const containerClasses = cn(
    "w-full gap-6",
    socialsConfig.layout === 'bento' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : 
    socialsConfig.layout === 'inline' ? "flex flex-wrap justify-center items-center" : 
    "flex flex-col items-center"
  );

  return (
    <div className="w-full space-y-6 py-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse"></div>
           <span className="text-[10px] font-black uppercase text-rose-500 tracking-[0.3em]">Connectivity Matrix</span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-rose-500/20 to-transparent ml-4"></div>
      </div>
      
      <div className={containerClasses}>
        <AnimatePresence mode="popLayout">
          {visibleProfiles.map((profile) => {
            const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
            const query = new URLSearchParams({
              platform: profile.platform,
              username: profile.username || 'username',
              style: profile.style || 'badge',
              blockRadius: socialsConfig.blockRadius.toString(),
              elementRadius: socialsConfig.elementRadius.toString(),
              showGlow: socialsConfig.showGlow.toString(),
              color: profile.customColor || ''
            });

            const imgSrc = `${baseUrl}/api/social-card?${query.toString()}`;

            return (
              <motion.div
                key={profile.platform}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={cn(
                  "relative group cursor-pointer",
                  socialsConfig.layout === 'bento' && (profile.style === 'activity' || profile.platform === 'career') ? "md:col-span-2" : ""
                )}
              >
                <div className="absolute inset-0 bg-rose-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                <img 
                  src={imgSrc} 
                  alt={profile.platform} 
                  className="w-full h-auto relative z-10 drop-shadow-2xl transition-all duration-500 group-hover:scale-[1.03] group-hover:-translate-y-1"
                />
                
                {/* Status Indicator for Bento/Large cards */}
                {(profile.style === 'activity' || profile.platform === 'career') && (
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-2 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[8px] font-black text-white uppercase tracking-tighter">Live</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
