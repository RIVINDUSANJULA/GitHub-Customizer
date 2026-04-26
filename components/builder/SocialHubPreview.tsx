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
    "w-full gap-4",
    socialsConfig.layout === 'bento' ? "grid grid-cols-1 md:grid-cols-3" : 
    socialsConfig.layout === 'inline' ? "flex flex-wrap justify-center" : 
    "flex flex-col items-center"
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 mb-2">
         <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
         <span className="text-[10px] font-black uppercase text-rose-500 tracking-[0.2em]">Live Connectivity Hub</span>
      </div>
      
      <div className={containerClasses}>
        <AnimatePresence mode="popLayout">
          {visibleProfiles.map((profile) => {
            const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
            const query = new URLSearchParams({
              platform: profile.platform,
              username: profile.username,
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  "relative group",
                  socialsConfig.layout === 'bento' && profile.style === 'activity' ? "md:col-span-2" : ""
                )}
              >
                <img 
                  src={imgSrc} 
                  alt={profile.platform} 
                  className="w-full h-auto drop-shadow-lg transition-transform group-hover:scale-[1.02] duration-300"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
