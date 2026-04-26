"use client";

import { useBuilderStore } from "@/store/useBuilderStore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { normalizePlatform, getProfileUrl } from "@/lib/social-utils";
import { useState, useEffect } from "react";

export function SocialHubPreview() {
  const store = useBuilderStore();
  const { socialProfiles, socialsConfig, showSocials } = store;
  
  // Track handles to detect changes for loading resets
  const [loadingHandles, setLoadingHandles] = useState<Record<string, boolean>>({});

  if (!showSocials || socialProfiles.length === 0) return null;

  const visibleProfiles = socialProfiles.filter(p => p.isVisible);

  const containerClasses = cn(
    "w-full gap-6",
    socialsConfig.layout === 'bento' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : 
    socialsConfig.layout === 'header' ? "flex flex-col gap-2" :
    socialsConfig.layout === 'inline' ? "flex flex-wrap justify-center items-center" : 
    "flex flex-col items-center"
  );

  return (
    <div className="w-full space-y-6 py-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse"></div>
           <span className="text-[10px] font-black uppercase text-rose-500 tracking-[0.3em]">{socialsConfig.layout === 'header' ? 'Identity Strip' : 'Connectivity Matrix'}</span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-rose-500/20 to-transparent ml-4"></div>
      </div>
      
      <div className={containerClasses}>
        <AnimatePresence mode="popLayout">
          {visibleProfiles.map((profile) => {
            const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
            const platform = normalizePlatform(profile.platform);
            
            // UNIQUE KEY: Force clean re-render if content changes
            const uniqueKey = `${platform}-${profile.username}-${profile.style}-${socialsConfig.layout}`;
            
            const avatarUrl = profile.avatarMode === 'custom' && profile.customAvatarUrl
              ? `${baseUrl}/api/proxy-image?url=${encodeURIComponent(profile.customAvatarUrl)}`
              : null;

            const query = new URLSearchParams({
              platform,
              username: profile.username || 'username',
              style: profile.style || 'badge',
              blockRadius: (socialsConfig.blockRadius ?? 20).toString(),
              elementRadius: (socialsConfig.elementRadius ?? 10).toString(),
              showGlow: (socialsConfig.showGlow ?? true).toString(),
              useAvatar: (socialsConfig.useAvatar ?? true).toString(),
              syncAvatarColor: (socialsConfig.syncAvatarColor ?? true).toString(),
              color: profile.customColor || '',
              v: Date.now().toString() // Local cache bust
            });

            if (avatarUrl) query.set('customAvatarUrl', avatarUrl);

            const imgSrc = `${baseUrl}/api/social-card?${query.toString()}`;
            const profileUrl = getProfileUrl(platform, profile.username);

            return (
              <motion.div
                key={uniqueKey}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={cn(
                  "relative group cursor-pointer",
                  socialsConfig.layout === 'bento' && (profile.style === 'activity' || platform === 'career' || profile.style === 'identity') ? "md:col-span-2" : "",
                  socialsConfig.layout === 'header' ? "w-full" : ""
                )}
              >
                <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                  <div className="absolute inset-0 bg-rose-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                  
                  {/* Image Container with Reset State */}
                  <div className="relative z-10 overflow-hidden rounded-xl">
                    <img 
                      src={imgSrc} 
                      alt={platform} 
                      className={cn(
                        "relative z-10 drop-shadow-2xl transition-all duration-500 group-hover:scale-[1.03] group-hover:-translate-y-1",
                        socialsConfig.layout === 'header' ? "w-full" : "w-full h-auto"
                      )}
                    />
                  </div>
                  
                  {/* Status Indicator for Bento/Large cards */}
                  {(profile.style === 'activity' || platform === 'career' || profile.style === 'identity') && (
                    <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-2 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[8px] font-black text-white uppercase tracking-tighter">Live</span>
                    </div>
                  )}
                </a>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
