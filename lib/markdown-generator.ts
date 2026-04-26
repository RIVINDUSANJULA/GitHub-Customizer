import { BuilderState } from '@/store/useBuilderStore';

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

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://github-customizer.vercel.app';

  const header = `<h1 align="center">Hi there, I'm ${username} 👋</h1>\n\n`;

  let widgets = '';
  
  widgetOrder.forEach((id) => {
    if (id === 'languages' && showLanguages) {
      const advancedParams = `&blockRadius=${analyticsConfig.blockRadius}&elementRadius=${analyticsConfig.elementRadius}&showGlow=${analyticsConfig.showGlow}&animationSpeed=${analyticsConfig.animationSpeed}&donutHoleSize=${analyticsConfig.donutHoleSize}&startAngle=${analyticsConfig.startAngle}&barHeight=${analyticsConfig.barHeight}&lineThickness=${analyticsConfig.lineThickness}&cardsPerRow=${analyticsConfig.cardsPerRow}&shadowDepth=${analyticsConfig.shadowDepth}&bgType=${analyticsConfig.bgType}&bgColor2=${analyticsConfig.bgColor2}&pieShowHoverLabels=${analyticsConfig.pieShowHoverLabels}&pieLabelPosition=${analyticsConfig.pieLabelPosition}&pieHideLegend=${analyticsConfig.pieHideLegend}`;
      widgets += `<div align="center">\n  <img src="${baseUrl}/api/github-languages?username=${username}&include_contribs=${analyticsConfig.includeContributions}&limit=${analyticsConfig.languageLimit}&layout=${analyticsConfig.layout}${themeParams}${advancedParams}" alt="Detailed Language Analytics" />\n</div>\n\n`;
    }

    if (id === 'badges' && showBadges) {
      const allSkills = [
        ...state.autoLanguages.filter(l => !hiddenLanguages.includes(l.name)).map(l => ({ name: l.name, iconUrl: undefined })),
        ...manualSkills.filter(s => !hiddenSkills.includes(s.name))
      ];

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
      widgets += `<div align="center">\n`;
      state.socialProfiles.filter(p => p.isVisible).forEach((profile) => {
        const query = new URLSearchParams({
          platform: profile.platform,
          username: profile.username,
          style: profile.style || 'badge',
          blockRadius: state.socialsConfig.blockRadius.toString(),
          elementRadius: state.socialsConfig.elementRadius.toString(),
          showGlow: state.socialsConfig.showGlow.toString(),
          color: profile.customColor || ''
        });
        widgets += `  <img src="${baseUrl}/api/social-card?${query.toString()}" alt="${profile.platform}" />\n`;
      });
      widgets += `</div>\n\n`;
    }
  });

  const footer = `\n<!-- Generated by GitCustomize (github-customizer.vercel.app) -->\n`;

  return {
    header,
    customLanguages: '', 
    widgets,
    footer,
    full: `${header}${widgets}${footer}`
  };
}
