"use client";

import { useBuilderStore } from "@/store/useBuilderStore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

function getSlug(name: string) {
  const mapping: Record<string, string> = {
    'visual studio code': 'vscode',
    'mongodb': 'mongodb',
    'next.js': 'nextjs',
    'postgresql': 'postgres',
    'markdown': 'md',
    'html5': 'html',
    'css3': 'css',
    'google cloud': 'gcp',
    'c++': 'cpp',
    'c#': 'csharp',
  };

  const lower = name.toLowerCase();
  if (mapping[lower]) return mapping[lower];

  return lower
    .replace(/\+/g, 'plus')
    .replace(/\./g, 'dot')
    .replace(/[^a-z0-9]/g, '');
}

export function SkillBadgeGrid() {
  const store = useBuilderStore();
  const { 
    manualSkills, 
    autoLanguages, 
    autoSkills,
    hiddenLanguages, 
    hiddenSkills, 
    badgesConfig,
    allSkillsOrder
  } = store;

  const { 
    badgeSize, 
    elementRadius, 
    useOfficialColors, 
    badgeStyle, 
    skillIconTheme, 
    skillIconsPerRow, 
    artisticIconSize, 
    showGlow,
    customBgColor,
    customIconColor
  } = badgesConfig;

  const skillMap = new Map<string, any>();
  
  const autoLangs = Array.isArray(autoLanguages) ? autoLanguages : [];
  const autoSks = Array.isArray(autoSkills) ? autoSkills : [];
  const manualSks = Array.isArray(manualSkills) ? manualSkills : [];

  // Filter visibility
  const visibleAutoLangs = autoLangs.filter(l => !hiddenLanguages.includes(l.name));
  const visibleAutoSkills = autoSks.filter(s => !hiddenSkills.includes(s.name));
  const visibleManualSkills = manualSks.filter(s => !hiddenSkills.includes(s.name));

  // 1. Auto Languages
  visibleAutoLangs.forEach(l => {
    skillMap.set(l.name.toLowerCase(), { name: l.name, type: 'auto' as const, iconUrl: undefined, color: undefined });
  });

  // 2. Auto Skills (Topics)
  visibleAutoSkills.forEach(s => {
    if (!skillMap.has(s.name.toLowerCase())) {
      skillMap.set(s.name.toLowerCase(), { name: s.name, type: 'auto' as const, iconUrl: undefined, color: undefined });
    }
  });

  // 3. Manual Skills
  visibleManualSkills.forEach(s => {
    skillMap.set(s.name.toLowerCase(), { name: s.name, type: 'manual' as const, iconUrl: s.iconUrl, color: s.color });
  });

  const allVisibleSkills = Array.from(skillMap.values());

  // Apply unified order
  const sortedSkills = [...allVisibleSkills].sort((a, b) => {
    const idxA = allSkillsOrder.indexOf(a.name);
    const idxB = allSkillsOrder.indexOf(b.name);
    if (idxA === -1 && idxB === -1) return 0;
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  if (sortedSkills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-xl text-slate-400">
        <p className="text-sm italic">No visible skills or languages. Add some or check visibility.</p>
      </div>
    );
  }

  if (badgeStyle === 'skillicons') {
    const slugs = sortedSkills.map(s => getSlug(s.name)).join(',');
    const url = `https://skillicons.dev/icons?i=${slugs}&theme=${skillIconTheme}&perline=${skillIconsPerRow}`;
    
    return (
      <div className="flex justify-center w-full py-4">
        <motion.img 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={`skillicons-${url}`}
          src={url} 
          alt="Skill Icons" 
          className="max-w-full h-auto drop-shadow-xl"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <AnimatePresence mode="popLayout">
        {sortedSkills.map((skill) => {
          const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
          
          let imgSrc = "";
          if (badgeStyle === 'shields') {
            const logoColor = useOfficialColors ? 'white' : customIconColor;
            const shieldsColor = skill.color ? skill.color : (useOfficialColors ? '20232a' : customBgColor);
            imgSrc = `https://img.shields.io/badge/${encodeURIComponent(skill.name)}-%23${shieldsColor}.svg?style=for-the-badge&logo=${getSlug(skill.name)}&logoColor=${logoColor}`;
          } else if (badgeStyle === 'artistic' || badgeStyle === 'premium') {
            const artisticParams = skill.iconUrl ? `&iconUrl=${encodeURIComponent(skill.iconUrl)}&iconSize=${artisticIconSize}` : "";
            
            const bgColor = skill.color ? skill.color : (useOfficialColors ? '' : customBgColor);
            const textColor = useOfficialColors ? 'ffffff' : customIconColor;
            const useOfficialParam = useOfficialColors && !skill.color;
            
            imgSrc = `${baseUrl}/api/badge?name=${encodeURIComponent(skill.name)}&color=${bgColor}&textColor=${textColor}&size=${badgeSize}&radius=${elementRadius}&useOfficialColor=${useOfficialParam}&showGlow=${showGlow}${artisticParams}`;
          }

          return (
            <motion.div
              key={`${badgeStyle}-${skill.name}`}
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