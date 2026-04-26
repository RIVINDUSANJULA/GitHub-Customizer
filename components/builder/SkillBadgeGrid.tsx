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
    'objective-c': 'objectivec',
    'jupyter notebook': 'jupyter',
    'shell': 'bash',
    'powershell': 'powershell',
    'nodejs': 'node-dot-js',
    'node.js': 'node-dot-js',
    'express': 'express',
    'tailwindcss': 'tailwind-css',
    'scikit-learn': 'scikitlearn',
    'react': 'react',
    'typescript': 'typescript',
    'javascript': 'javascript',
    'python': 'python',
    'java': 'java',
    'ruby': 'ruby',
    'php': 'php',
    'go': 'go',
    'rust': 'rust',
    'swift': 'swift',
    'kotlin': 'kotlin',
    'dart': 'dart',
    'flutter': 'flutter',
    'docker': 'docker',
    'kubernetes': 'kubernetes',
    'git': 'git',
    'aws': 'amazonaws',
    'azure': 'microsoftazure',
    'firebase': 'firebase',
    'heroku': 'heroku',
    'vercel': 'vercel',
    'netlify': 'netlify',
    'mysql': 'mysql',
    'sqlite': 'sqlite',
    'redis': 'redis',
    'graphql': 'graphql',
    'nginx': 'nginx',
    'apache': 'apache',
    'linux': 'linux',
    'macos': 'macos',
    'windows': 'windows',
    'unity': 'unity',
    'unreal engine': 'unrealengine',
    'arduino': 'arduino',
    'raspberry pi': 'raspberrypi',
  };

  const lower = name.toLowerCase().trim();
  if (mapping[lower]) return mapping[lower];

  return lower
    .replace(/\s+/g, '')
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
    analyticsConfig,
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
    customIconColor,
    showIcons
  } = badgesConfig;

  const safeAutoLangs = Array.isArray(autoLanguages) ? autoLanguages : [];
  const safeAutoSkills = Array.isArray(autoSkills) ? autoSkills : [];
  const safeManualSkills = Array.isArray(manualSkills) ? manualSkills : [];
  const safeAllSkillsOrder = Array.isArray(allSkillsOrder) ? allSkillsOrder : [];

  const visibleAutoLangs = safeAutoLangs.filter(l => !hiddenLanguages.includes(l.name));
  const visibleAutoSkills = safeAutoSkills.filter(s => !hiddenSkills.includes(s.name));
  const visibleManualSkills = safeManualSkills.filter(s => !hiddenSkills.includes(s.name));

  const allVisibleSkillsRaw = [
    ...visibleAutoLangs.map(l => ({ 
      name: l.name, 
      type: 'auto' as const, 
      iconUrl: `https://cdn.simpleicons.org/${getSlug(l.name)}/white`, 
      color: l.color?.replace('#', '') 
    })),
    ...visibleAutoSkills.map(s => ({ 
      name: s.name, 
      type: 'auto' as const, 
      iconUrl: `https://cdn.simpleicons.org/${getSlug(s.name)}/white`, 
      color: undefined 
    })),
    ...visibleManualSkills.map(s => ({ 
      name: s.name, 
      type: 'manual' as const, 
      iconUrl: s.iconUrl, 
      color: s.color 
    }))
  ];

  // De-duplicate by name (case-insensitive)
  const uniqueSkillsMap = new Map();
  allVisibleSkillsRaw.forEach(skill => {
    const key = skill.name.toLowerCase();
    const existing = uniqueSkillsMap.get(key);
    // Priority: Manual > Auto-Language (w/ Color) > Auto-Skill (Topic)
    if (!existing || skill.type === 'manual' || (skill.type === 'auto' && skill.color && !existing.color)) {
      uniqueSkillsMap.set(key, skill);
    }
  });

  const allVisibleSkills = Array.from(uniqueSkillsMap.values());

  // Apply unified order
  const sortedSkills = [...allVisibleSkills].sort((a, b) => {
    const idxA = safeAllSkillsOrder.indexOf(a.name);
    const idxB = safeAllSkillsOrder.indexOf(b.name);
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
            const logoParam = showIcons ? `&logo=${getSlug(skill.name)}&logoColor=${logoColor}` : "";
            imgSrc = `https://img.shields.io/badge/${encodeURIComponent(skill.name)}-%23${shieldsColor}.svg?style=for-the-badge${logoParam}`;
          } else if (badgeStyle === 'artistic' || badgeStyle === 'premium') {
            const bgColor = skill.color ? skill.color : (useOfficialColors ? '' : customBgColor);
            const textColor = useOfficialColors ? 'ffffff' : customIconColor;
            const iconParam = (showIcons && skill.iconUrl) ? `&iconUrl=${encodeURIComponent(skill.iconUrl)}` : "";
            const useOfficialParam = useOfficialColors ? 'true' : 'false';
            
            imgSrc = `${baseUrl}/api/badge?name=${encodeURIComponent(skill.name)}&color=${bgColor}&textColor=${textColor}&size=${badgeSize}&radius=${elementRadius}&useOfficialColor=${useOfficialParam}&showGlow=${showGlow}&artisticIconSize=${artisticIconSize}&showIcon=${showIcons}${iconParam}`;
          }

          if (badgeStyle === 'shields' || badgeStyle === 'premium' || (badgeStyle === 'artistic' && typeof window === 'undefined')) {
            // For SVG export/Shields, use the image directly
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
          }

          return (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group"
            >
              <div 
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300",
                  badgeSize === 'sm' ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-xs",
                  showIcons ? "pl-1.5" : "px-3"
                )}
                style={{
                  backgroundColor: useOfficialColors && skill.color ? `#${skill.color}15` : `${customBgColor}15`,
                  borderColor: useOfficialColors && skill.color ? `#${skill.color}30` : `${customBgColor}30`,
                  color: useOfficialColors && skill.color ? `#${skill.color}` : customIconColor,
                  borderRadius: `${elementRadius}px`,
                }}
              >
                {showIcons && (
                  <img 
                    src={skill.iconUrl} 
                    alt="" 
                    className={cn(
                      "opacity-80 group-hover:opacity-100 transition-opacity",
                      badgeSize === 'sm' ? "w-3 h-3" : "w-4 h-4"
                    )}
                  />
                )}
                <span className="font-bold tracking-tight">{skill.name}</span>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
