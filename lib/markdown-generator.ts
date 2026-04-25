import { BuilderState } from '@/store/useBuilderStore';

export interface MarkdownResult {
  header: string;
  customLanguages: string;
  widgets: string;
  footer: string;
  full: string;
}

function getSlug(name: string) {
  return name
    .toLowerCase()
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
  
  // Dynamic Widget Generation based on order
  widgetOrder.forEach((id) => {
    if (id === 'languages' && showLanguages) {
      const advancedParams = `&blockRadius=${analyticsConfig.blockRadius}&elementRadius=${analyticsConfig.elementRadius}&showGlow=${analyticsConfig.showGlow}&animationSpeed=${analyticsConfig.animationSpeed}&donutHoleSize=${analyticsConfig.donutHoleSize}&startAngle=${analyticsConfig.startAngle}&barHeight=${analyticsConfig.barHeight}&lineThickness=${analyticsConfig.lineThickness}&cardsPerRow=${analyticsConfig.cardsPerRow}&shadowDepth=${analyticsConfig.shadowDepth}&bgType=${analyticsConfig.bgType}&bgColor2=${analyticsConfig.bgColor2}&pieShowHoverLabels=${analyticsConfig.pieShowHoverLabels}&pieLabelPosition=${analyticsConfig.pieLabelPosition}&pieHideLegend=${analyticsConfig.pieHideLegend}`;
      widgets += `<div align="center">\n  <img src="${baseUrl}/api/github-languages?username=${username}&include_contribs=${analyticsConfig.includeContributions}&limit=${analyticsConfig.languageLimit}&layout=${analyticsConfig.layout}${themeParams}${advancedParams}" alt="Detailed Language Analytics" />\n</div>\n\n`;
    }

    if (id === 'badges' && showBadges) {
      widgets += `<div align="center">\n`;
      const allSkills = [
        ...state.autoLanguages.filter(l => !hiddenLanguages.includes(l.name)).map(l => l.name),
        ...manualSkills.filter(s => !hiddenSkills.includes(s))
      ];

      allSkills.forEach(skill => {
        if (badgesConfig.badgeStyle === 'shields') {
          const slug = getSlug(skill);
          // Shields.io URL: https://img.shields.io/badge/[Label]-[HexColor]?style=for-the-badge&logo=[LogoName]&logoColor=white
          // We use %23 for # in the color
          const color = badgesConfig.useOfficialColors ? '20232a' : customIconColor; // Default to dark for shields if not official
          const logoColor = badgesConfig.useOfficialColors ? 'white' : customTextColor;
          widgets += `  <img src="https://img.shields.io/badge/${encodeURIComponent(skill)}-%23${color}.svg?style=for-the-badge&logo=${slug}&logoColor=${logoColor}" alt="${skill}" loading="lazy" />\n`;
        } else {
          const color = badgesConfig.badgeColorMode === 'brand' ? '' : `&color=${customIconColor}`;
          widgets += `  <img src="${baseUrl}/api/badge?name=${encodeURIComponent(skill)}${color}&size=${badgesConfig.badgeSize}&radius=${badgesConfig.elementRadius}&useOfficialColor=${badgesConfig.useOfficialColors}&showGlow=${analyticsConfig.showGlow}" alt="${skill}" loading="lazy" />\n`;
        }
      });
      widgets += `</div>\n\n`;
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
  });

  const footer = `\n<!-- Generated by GitCustomize (github-customizer.vercel.app) -->\n`;

  return {
    header,
    customLanguages: '', // Merged into widgets for order
    widgets,
    footer,
    full: `${header}${widgets}${footer}`
  };
}
