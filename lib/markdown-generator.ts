import { BuilderState } from '@/store/useBuilderStore';
import { normalizePlatform, getProfileUrl } from './social-utils';

export interface MarkdownResult {
  header: string;
  customLanguages: string;
  widgets: string;
  footer: string;
  full: string;
}

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
  };

  const lower = name.toLowerCase();
  if (mapping[lower]) return mapping[lower];

  return lower
    .replace(/\+/g, 'plus')
    .replace(/\./g, 'dot')
    .replace(/[^a-z0-9]/g, '');
}

export function generateMarkdown(state: BuilderState): MarkdownResult {
  const empty = { header: '', customLanguages: '', widgets: '', footer: '', full: '' };
  if (!state.username) {
    return { ...empty, full: '<!-- Please enter your GitHub username to generate the README -->' };
  }

  const {
    username,
    showStats,
    showStreak,
    showTrophies,
    showTopRepos,
    showLanguages,
    showBadges,
    analyticsConfig,
    badgesConfig,
    manualSkills,
    hiddenLanguages,
    hiddenSkills,
    theme,
    customBgColor,
    customTextColor,
    customIconColor,
    customBorderColor,
    hideBorder,
    layout,
    widgetOrder,
  } = state;

  let themeParams = `&theme=${theme}`;
  if (theme === 'custom') {
    themeParams = `&bg_color=${customBgColor}&title_color=${customTextColor}&text_color=${customTextColor}&icon_color=${customIconColor}&border_color=${customBorderColor}`;
  }
  if (hideBorder) {
    themeParams += '&hide_border=true';
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://gitinfo.vercel.app';


  let widgets = '';
  
  widgetOrder.forEach((id) => {
    if (id === 'languages' && showLanguages) {
      const advancedParams = `&blockRadius=${analyticsConfig.blockRadius}&elementRadius=${analyticsConfig.elementRadius}&showGlow=${analyticsConfig.showGlow}&animationSpeed=${analyticsConfig.animationSpeed}&donutHoleSize=${analyticsConfig.donutHoleSize}&startAngle=${analyticsConfig.startAngle}&barHeight=${analyticsConfig.barHeight}&lineThickness=${analyticsConfig.lineThickness}&cardsPerRow=${analyticsConfig.cardsPerRow}&shadowDepth=${analyticsConfig.shadowDepth}&bgType=${analyticsConfig.bgType}&bgColor2=${analyticsConfig.bgColor2}&pieShowHoverLabels=${analyticsConfig.pieShowHoverLabels}&pieLabelPosition=${analyticsConfig.pieLabelPosition}&pieHideLegend=${analyticsConfig.pieHideLegend}`;
      widgets += `<div align="center">\n  <img src="${baseUrl}/api/github-languages?username=${username}&include_contribs=${analyticsConfig.includeContributions}&limit=${analyticsConfig.languageLimit}&layout=${analyticsConfig.layout}${themeParams}${advancedParams}" alt="Detailed Language Analytics" />\n</div>\n\n`;
    }

    if (id === 'badges' && showBadges) {
      const skillMap = new Map<string, any>();
      
      const autoLangs = Array.isArray(state.autoLanguages) ? state.autoLanguages : [];
      const autoSks = Array.isArray(state.autoSkills) ? state.autoSkills : [];
      const manualSks = Array.isArray(manualSkills) ? manualSkills : [];

      // 1. Auto Languages
      autoLangs.filter(l => !hiddenLanguages.includes(l.name)).forEach(l => {
        skillMap.set(l.name.toLowerCase(), { name: l.name, iconUrl: undefined, color: undefined });
      });

      // 2. Auto Skills (Topics)
      autoSks.filter(s => !hiddenSkills.includes(s.name)).forEach(s => {
        if (!skillMap.has(s.name.toLowerCase())) {
          skillMap.set(s.name.toLowerCase(), { name: s.name, iconUrl: undefined, color: undefined });
        }
      });

      // 3. Manual Skills
      manualSks.filter(s => !hiddenSkills.includes(s.name)).forEach(s => {
        skillMap.set(s.name.toLowerCase(), { name: s.name, iconUrl: s.iconUrl, color: s.color });
      });

      const allSkills = Array.from(skillMap.values());

      if (allSkills.length > 0) {
        widgets += `<div align="center">\n`;
        if (badgesConfig.badgeStyle === 'skillicons') {
          const slugs = allSkills.map(s => getSlug(s.name)).join(',');
          widgets += `  <img src="https://skillicons.dev/icons?i=${slugs}&theme=${badgesConfig.skillIconTheme}&perline=${badgesConfig.skillIconsPerRow}" alt="My Skills" />\n`;
        } else {
          allSkills.forEach(skill => {
            if (badgesConfig.badgeStyle === 'shields') {
              const slug = getSlug(skill.name);
              const logoColor = badgesConfig.useOfficialColors ? 'white' : badgesConfig.customIconColor;
              const shieldsColor = skill.color ? skill.color : (badgesConfig.useOfficialColors ? '20232a' : badgesConfig.customBgColor);
              widgets += `  <img src="https://img.shields.io/badge/${encodeURIComponent(skill.name)}-%23${shieldsColor}.svg?style=for-the-badge&logo=${slug}&logoColor=${logoColor}" alt="${skill.name}" loading="lazy" />\n`;
            } else {
              const artisticParams = skill.iconUrl ? `&iconUrl=${encodeURIComponent(skill.iconUrl)}&iconSize=${badgesConfig.artisticIconSize}` : "";
              const bgColor = skill.color ? skill.color : (badgesConfig.useOfficialColors ? '' : badgesConfig.customBgColor);
              const textColor = badgesConfig.useOfficialColors ? 'ffffff' : badgesConfig.customIconColor;
              const useOfficialParam = badgesConfig.useOfficialColors && !skill.color;
              widgets += `  <img src="${baseUrl}/api/badge?name=${encodeURIComponent(skill.name)}&color=${bgColor}&textColor=${textColor}&size=${badgesConfig.badgeSize}&radius=${badgesConfig.elementRadius}&useOfficialColor=${useOfficialParam}&showGlow=${badgesConfig.showGlow}${artisticParams}" alt="${skill.name}" loading="lazy" />\n`;
            }
          });
        }
        widgets += `</div>\n\n`;
      }
    }
    if (id === 'aboutme' && state.showAboutMe && state.aboutMe) {
      const { preset, headerLabel, alignment, accentColor, headerTextColor, useBorderGradient, borderGradientColor2 } = state.aboutMeConfig;
      const greeting = `Hi there, I'm ${state.username} 👋`;
      const alignPrefix = alignment === 'center' ? '<div align="center">\n\n' : '';
      const alignSuffix = alignment === 'center' ? '\n\n</div>' : '';
      const accent = `#${accentColor}`;
      const headerCol = `#${headerTextColor}`;

      if (preset === 'matrix') {
        widgets += `\`\`\`text\n[${headerLabel}]\n\n${greeting.toUpperCase()}\n${'='.repeat(greeting.length)}\n\n${state.aboutMe}\n\`\`\`\n\n`;
      } else if (useBorderGradient) {
        // High-end SVG export for gradients
        const gradientId = `grad_${state.username}`;
        widgets += `${alignPrefix}<svg width="100%" height="auto" viewBox="0 0 800 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${accent}" />
      <stop offset="100%" stop-color="#${borderGradientColor2}" />
    </linearGradient>
  </defs>
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color: white; font-family: sans-serif; padding: 20px; border: 2px solid url(#${gradientId}); border-radius: 20px; background: rgba(0,0,0,0.8);">
      <h1 style="color: ${accent}; margin: 0;">${greeting}</h1>
      <h3 style="color: ${headerCol}; opacity: 0.6; margin: 10px 0;">${headerLabel}</h3>
      <p style="color: #ccc; line-height: 1.6;">${state.aboutMe.replace(/\n/g, '<br/>')}</p>
    </div>
  </foreignObject>
</svg>${alignSuffix}\n\n`;
      } else {
        widgets += `${alignPrefix}# <span style="color: ${accent}">${greeting}</span>\n### <span style="color: ${headerCol}">${headerLabel}</span>\n${state.aboutMe}${alignSuffix}\n\n`;
      }
    }

    if (id === 'stats' && showStats) {
      widgets += `<div align="center">\n  <img src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true${themeParams}" alt="${username}'s GitHub Stats" />\n</div>\n\n`;
    }

    if (id === 'streak' && showStreak) {
      widgets += `<div align="center">\n  <img src="https://github-readme-streak-stats.herokuapp.com/?user=${username}${themeParams.replace('bg_color', 'background').replace('title_color', 'stroke').replace('text_color', 'currStreakNum').replace('icon_color', 'fire')}" alt="${username}'s GitHub Streak" />\n</div>\n\n`;
    }

    if (id === 'trophies' && showTrophies) {
      widgets += `<div align="center">\n  <img src="https://github-profile-trophy.vercel.app/?username=${username}&theme=${theme === 'custom' ? 'flat' : theme}&no-frame=false&no-bg=true&margin-w=15" alt="trophies" />\n</div>\n\n`;
    }

    if (id === 'socials' && state.showSocials && state.socialProfiles.length > 0) {
      const visibleProfiles = state.socialProfiles.filter(p => p.isVisible);
        visibleProfiles.forEach((profile) => {
          const platform = normalizePlatform(profile.platform);
          const username = profile.username || 'username';
          
          // AGGRESSIVE CACHE BUSTING: Hash the handle + style + timestamp
          const cacheKey = Buffer.from(`${platform}-${username}-${profile.style || 'badge'}-${Date.now()}`).toString('base64').substring(0, 12);
          
          const avatarUrl = profile.avatarMode === 'custom' && profile.customAvatarUrl
            ? `${baseUrl}/api/proxy-image?url=${encodeURIComponent(profile.customAvatarUrl)}`
            : null;

          const query = new URLSearchParams({
            username,
            style: profile.style || 'badge',
            blockRadius: state.socialsConfig.blockRadius.toString(),
            elementRadius: state.socialsConfig.elementRadius.toString(),
            showGlow: state.socialsConfig.showGlow.toString(),
            useAvatar: state.socialsConfig.useAvatar ? 'true' : 'false',
            syncAvatarColor: state.socialsConfig.syncAvatarColor ? 'true' : 'false',
            v: cacheKey, // Content-based versioning
            t: Date.now().toString()
          });
          
          if (avatarUrl) query.set('customAvatarUrl', avatarUrl);
          if (profile.customColor) query.set('color', profile.customColor);
          
          const imageUrl = `${baseUrl}/api/social-card?platform=${platform}&${query.toString()}`;
          const profileUrl = getProfileUrl(platform, username);
          
          widgets += `  <a href="${profileUrl}"><img src="${imageUrl}" alt="${platform}" /></a>\n`;
        });
        widgets += `</p>\n\n`;
    }
  });

  const footer = `\n<!-- Generated by GitInfo (gitinfo.vercel.app) -->\n`;

  return {
    header: '',
    customLanguages: '', 
    widgets,
    footer,
    full: `${widgets}${footer}`
  };
}
