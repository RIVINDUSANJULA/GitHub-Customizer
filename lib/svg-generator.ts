export interface SvgOptions {
  theme?: string;
  bg_color?: string;
  title_color?: string;
  text_color?: string;
  icon_color?: string;
  border_color?: string;
  hide_border?: boolean;
  limit?: number;
  layout?: 'compact' | 'pie' | 'list';
}

const THEMES: Record<string, any> = {
  default: { bg: "ffffff", title: "2f81f7", text: "212121", border: "e4e2e2" },
  dark: { bg: "0d1117", title: "58a6ff", text: "c9d1d9", border: "30363d" },
  radical: { bg: "141321", title: "fe428e", text: "a9fef7", border: "1a1a1a" },
  tokyonight: { bg: "1a1b26", title: "70a5fd", text: "38bdae", border: "1a1b26" },
  gruvbox: { bg: "282828", title: "fabd2f", text: "8ec07c", border: "282828" },
  synthwave: { bg: "2b213a", title: "e24896", text: "ff8070", border: "2b213a" },
  dracula: { bg: "282a36", title: "ff79c6", text: "f8f8f2", border: "44475a" },
};

export function generateLanguageSvg(languages: any[], options: SvgOptions) {
  const theme = THEMES[options.theme || 'default'] || THEMES.default;
  const bg = options.bg_color || theme.bg;
  const titleColor = options.title_color || theme.title;
  const textColor = options.text_color || theme.text;
  const borderColor = options.border_color || theme.border;
  const limit = options.limit || 5;
  const layout = options.layout || 'compact';

  const data = languages.slice(0, limit);
  const width = 450;
  const height = layout === 'compact' ? 120 : layout === 'pie' ? 250 : 200;

  let content = "";

  if (layout === 'compact') {
    content = generateCompactLayout(data, titleColor, textColor);
  } else if (layout === 'pie') {
    content = generatePieLayout(data, titleColor, textColor);
  } else {
    content = generateListLayout(data, titleColor, textColor);
  }

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${titleColor}; }
        .lang-name { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${textColor}; }
        .percentage { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${textColor}; opacity: 0.8; }
      </style>
      <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="8" fill="#${bg}" stroke="#${borderColor}" stroke-opacity="${options.hide_border ? 0 : 1}"/>
      <text x="25" y="35" class="header">Most Used Languages</text>
      ${content}
    </svg>
  `;
}

function generateCompactLayout(data: any[], titleColor: string, textColor: string) {
  let x = 25;
  const barWidth = 400;
  const barHeight = 10;
  const barY = 55;

  let barSegments = "";
  let legend = "";
  let currentX = x;

  data.forEach((lang, i) => {
    const segmentWidth = (lang.percentage / 100) * barWidth;
    barSegments += `<rect x="${currentX}" y="${barY}" width="${segmentWidth}" height="${barHeight}" fill="${lang.color}" ${i === 0 ? 'rx="5"' : ''} ${i === data.length - 1 ? 'rx="5"' : ''}/>`;

    // Legend
    const lx = 25 + (i % 3) * 130;
    const ly = 85 + Math.floor(i / 3) * 20;
    legend += `
      <circle cx="${lx}" cy="${ly - 4}" r="4" fill="${lang.color}"/>
      <text x="${lx + 12}" y="${ly}" class="lang-name">${lang.name}</text>
      <text x="${lx + 85}" y="${ly}" class="percentage">${lang.percentage.toFixed(1)}%</text>
    `;

    currentX += segmentWidth;
  });

  return barSegments + legend;
}

function generateListLayout(data: any[], titleColor: string, textColor: string) {
  let list = "";
  data.forEach((lang, i) => {
    const y = 65 + i * 25;
    const barMaxWidth = 250;
    const barWidth = (lang.percentage / 100) * barMaxWidth;
    list += `
      <text x="25" y="${y}" class="lang-name">${lang.name}</text>
      <rect x="120" y="${y - 10}" width="${barMaxWidth}" height="8" rx="4" fill="#eeeeee" fill-opacity="0.2"/>
      <rect x="120" y="${y - 10}" width="${barWidth}" height="8" rx="4" fill="${lang.color}"/>
      <text x="380" y="${y}" class="percentage">${lang.percentage.toFixed(1)}%</text>
    `;
  });
  return list;
}

function generatePieLayout(data: any[], titleColor: string, textColor: string) {
  // Simple representation as list for now since SVG pie charts are complex to generate purely by string without math libs
  // But let's at least make it look different
  return generateListLayout(data, titleColor, textColor);
}
