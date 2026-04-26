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
            const query = new URLSearchParams({
              platform: profile.platform,
              username: profile.username || 'username',
              style: profile.style || 'badge',
              blockRadius: (socialsConfig.blockRadius ?? 20).toString(),
              elementRadius: (socialsConfig.elementRadius ?? 10).toString(),
              showGlow: (socialsConfig.showGlow ?? true).toString(),
              useAvatar: (socialsConfig.useAvatar ?? true).toString(),
              color: profile.customColor || ''
            });

            const imgSrc = `${baseUrl}/api/social-card?${query.toString()}`;

            const getProfileUrl = (platform: string, username: string) => {
              const mapping: Record<string, string> = {
                youtube: `https://youtube.com/@${username}`,
                twitter: `https://x.com/${username}`,
                linkedin: `https://linkedin.com/in/${username}`,
                discord: `https://discord.com/users/${username}`,
                instagram: `https://instagram.com/${username}`,
                github: `https://github.com/${username}`,
                tiktok: `https://tiktok.com/@${username}`,
                gmail: `mailto:${username}`,
              };
              return mapping[platform] || '#';
            };

            const profileUrl = getProfileUrl(profile.platform, profile.username);

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
                  socialsConfig.layout === 'bento' && (profile.style === 'activity' || profile.platform === 'career' || profile.style === 'identity') ? "md:col-span-2" : "",
                  socialsConfig.layout === 'header' ? "w-full" : ""
                )}
              >
                <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                  <div className="absolute inset-0 bg-rose-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                  <img 
                    src={imgSrc} 
                    alt={profile.platform} 
                    className={cn(
                      "relative z-10 drop-shadow-2xl transition-all duration-500 group-hover:scale-[1.03] group-hover:-translate-y-1",
                      socialsConfig.layout === 'header' ? "w-full" : "w-full h-auto"
                    )}
                  />
                  
                  {/* Status Indicator for Bento/Large cards */}
                  {(profile.style === 'activity' || profile.platform === 'career' || profile.style === 'identity') && (
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
