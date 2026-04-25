"use client";

import { useBuilderStore } from "@/store/useBuilderStore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

function getSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/\+/g, 'plus')
    .replace(/\./g, 'dot')
    .replace(/[^a-z0-9]/g, '');
}

export function SkillBadgeGrid() {
  const store = useBuilderStore();
  const { 
    manualSkills, 
    autoLanguages, 
    hiddenLanguages, 
    hiddenSkills, 
    badgesConfig,
    analyticsConfig,
    customIconColor,
    customTextColor
  } = store;

  const { badgeColorMode, badgeSize, elementRadius, useOfficialColors, badgeStyle } = badgesConfig;
  const { showGlow } = analyticsConfig;

  const visibleAutoLangs = autoLanguages.filter(l => !hiddenLanguages.includes(l.name));
  const visibleManualSkills = manualSkills.filter(s => !hiddenSkills.includes(s));

  // Combine them
  const allVisibleSkills = [
    ...visibleAutoLangs.map(l => ({ name: l.name, type: 'auto' as const })),
    ...visibleManualSkills.map(s => ({ name: s, type: 'manual' as const }))
  ];

  if (allVisibleSkills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-xl text-slate-400">
        <p className="text-sm italic">No visible skills or languages. Add some or check visibility.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <AnimatePresence mode="popLayout">
        {allVisibleSkills.map((skill) => {
          const color = customIconColor;
          const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
          
          const imgSrc = badgeStyle === 'shields' 
            ? `https://img.shields.io/badge/${encodeURIComponent(skill.name)}-%23${useOfficialColors ? '20232a' : customIconColor}.svg?style=for-the-badge&logo=${getSlug(skill.name)}&logoColor=${useOfficialColors ? 'white' : customTextColor}`
            : `${baseUrl}/api/badge?name=${encodeURIComponent(skill.name)}&color=${color}&size=${badgeSize}&radius=${elementRadius}&useOfficialColor=${useOfficialColors}&showGlow=${showGlow}`;

          return (
            <motion.div
              key={skill.name}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <img 
                src={imgSrc} 
                alt={skill.name}
                loading="lazy"
                className={cn(
                  "shadow-sm hover:shadow-md transition-shadow duration-200 cursor-default",
                  badgeStyle === 'shields' ? "h-7" : (badgeSize === 'sm' ? "h-[26px]" : "h-[32px]")
                )}
                style={{ borderRadius: badgeStyle === 'shields' ? '0px' : `${elementRadius}px` }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
