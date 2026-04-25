export interface SvgOptions {
  theme?: string;
  bg_color?: string;
  title_color?: string;
  text_color?: string;
  icon_color?: string;
  border_color?: string;
  hide_border?: boolean;
  limit?: number;
  layout?: 'compact' | 'pie' | 'list' | 'modern-bar' | 'soft-cards' | 'minimalist-line';
  borderRadius?: number;
  showGlow?: boolean;
  animationSpeed?: number;
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
  if (!languages || languages.length === 0) {
    return generateEmptyStateSvg(options);
  }

  const theme = THEMES[options.theme || 'default'] || THEMES.default;
  const bg = options.bg_color || theme.bg;
  const titleColor = options.title_color || theme.title;
  const textColor = options.text_color || theme.text;
  const borderColor = options.border_color || theme.border;
  const limit = options.limit || 5;
  const layout = options.layout || 'compact';
  const radius = options.borderRadius ?? 8;
  const speed = options.animationSpeed || 1;

  const data = languages.slice(0, limit);
  const width = 450;
  
  let height = 120;
  if (layout === 'compact') {
    height = 90 + Math.ceil(data.length / 3) * 25;
  } else if (layout === 'list') {
    height = 80 + data.length * 35;
  } else if (layout === 'pie') {
    height = 300;
  } else if (layout === 'modern-bar') {
    height = 100 + data.length * 40;
  } else if (layout === 'soft-cards') {
    height = 80 + Math.ceil(data.length / 2) * 60;
  } else if (layout === 'minimalist-line') {
    height = 70;
  }

  let content = "";
  if (layout === 'compact') content = generateCompactLayout(data, radius, speed);
  else if (layout === 'pie') content = generatePieLayout(data, radius, speed);
  else if (layout === 'list') content = generateListLayout(data, radius, speed);
  else if (layout === 'modern-bar') content = generateModernBarLayout(data, radius, speed);
  else if (layout === 'soft-cards') content = generateSoftCardsLayout(data, radius, speed, bg);
  else if (layout === 'minimalist-line') content = generateMinimalistLineLayout(data, speed);

  const glowFilter = options.showGlow ? `
    <defs>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>` : "";

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${titleColor}; }
        .lang-name { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${textColor}; }
        .percentage { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${textColor}; opacity: 0.7; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes growPie { from { stroke-dashoffset: 440; } to { stroke-dashoffset: 0; } }
        .animate { animation: fadeIn ${0.5 / speed}s ease forwards; }
        .bar-animate { transform-origin: left; animation: scaleIn ${0.8 / speed}s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      </style>
      ${glowFilter}
      <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="${radius}" fill="#${bg}" stroke="#${borderColor}" stroke-opacity="${options.hide_border ? 0 : 1}"/>
      ${layout !== 'minimalist-line' ? `<text x="25" y="35" class="header animate">Most Used Languages</text>` : ""}
      ${content}
    </svg>
  `;
}

function generateCompactLayout(data: any[], radius: number, speed: number) {
  const barWidth = 400;
  const barHeight = 12;
  const barY = 55;
  let currentX = 25;
  let barSegments = "";
  let legend = "";

  data.forEach((lang, i) => {
    const segmentWidth = (lang.percentage / 100) * barWidth;
    barSegments += `<rect x="${currentX}" y="${barY}" width="${segmentWidth}" height="${barHeight}" fill="${lang.color}" 
      ${i === 0 ? `rx="${radius/2}"` : ""} ${i === data.length - 1 ? `rx="${radius/2}"` : ""} class="bar-animate" style="animation-delay: ${i * 0.1 / speed}s"/>`;

    const lx = 25 + (i % 3) * 135;
    const ly = 100 + Math.floor(i / 3) * 25;
    legend += `
      <g class="animate" style="animation-delay: ${0.5 + i * 0.1 / speed}s">
        <circle cx="${lx}" cy="${ly - 4}" r="5" fill="${lang.color}" filter="url(#glow)"/>
        <text x="${lx + 15}" y="${ly}" class="lang-name">${lang.name} <tspan class="percentage">${lang.percentage.toFixed(1)}%</tspan></text>
      </g>`;
    currentX += segmentWidth;
  });
  return barSegments + legend;
}

function generateListLayout(data: any[], radius: number, speed: number) {
  let list = "";
  data.forEach((lang, i) => {
    const y = 75 + i * 35;
    const barMaxWidth = 230;
    const barWidth = (lang.percentage / 100) * barMaxWidth;
    list += `
      <g class="animate" style="animation-delay: ${i * 0.1 / speed}s">
        <text x="25" y="${y}" class="lang-name">${lang.name}</text>
        <rect x="135" y="${y - 12}" width="${barMaxWidth}" height="12" rx="${radius/2}" fill="#888" fill-opacity="0.1"/>
        <rect x="135" y="${y - 12}" width="${barWidth}" height="12" rx="${radius/2}" fill="${lang.color}" filter="url(#glow)" class="bar-animate"/>
        <text x="385" y="${y}" class="percentage">${lang.percentage.toFixed(1)}%</text>
      </g>`;
  });
  return list;
}

function generatePieLayout(data: any[], radius: number, speed: number) {
  const centerX = 130;
  const centerY = 175;
  const r = 75;
  const strokeWidth = 30;
  const circumference = 2 * Math.PI * r;
  let currentOffset = 0;
  let chart = "";
  let legend = "";

  data.forEach((lang, i) => {
    const sliceLength = (lang.percentage / 100) * circumference;
    const rotation = (currentOffset / circumference) * 360 - 90;
    chart += `<circle cx="${centerX}" cy="${centerY}" r="${r}" fill="transparent" stroke="${lang.color}" stroke-width="${strokeWidth}" 
      stroke-dasharray="${sliceLength} ${circumference}" transform="rotate(${rotation} ${centerX} ${centerY})" filter="url(#glow)" 
      style="animation: growPie ${1 / speed}s ease forwards; animation-delay: ${i * 0.1 / speed}s" stroke-dashoffset="${sliceLength}"/>`;

    const ly = 90 + i * 35;
    legend += `
      <g class="animate" style="animation-delay: ${0.5 + i * 0.1 / speed}s">
        <circle cx="280" cy="${ly - 4}" r="6" fill="${lang.color}"/>
        <text x="300" y="${ly}" class="lang-name">${lang.name} <tspan class="percentage">${lang.percentage.toFixed(1)}%</tspan></text>
      </g>`;
    currentOffset += sliceLength;
  });
  return chart + legend;
}

function generateModernBarLayout(data: any[], radius: number, speed: number) {
  let list = "";
  data.forEach((lang, i) => {
    const y = 80 + i * 40;
    const barMaxWidth = 400;
    const barWidth = (lang.percentage / 100) * barMaxWidth;
    list += `
      <g class="animate" style="animation-delay: ${i * 0.1 / speed}s">
        <text x="25" y="${y - 15}" class="lang-name">${lang.name} <tspan class="percentage">${lang.percentage.toFixed(1)}%</tspan></text>
        <rect x="25" y="${y - 8}" width="${barMaxWidth}" height="18" rx="${radius}" fill="#888" fill-opacity="0.1"/>
        <linearGradient id="grad${i}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${lang.color};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${lang.color};stop-opacity:1" />
        </linearGradient>
        <rect x="25" y="${y - 8}" width="${barWidth}" height="18" rx="${radius}" fill="url(#grad${i})" filter="url(#glow)" class="bar-animate"/>
      </g>`;
  });
  return list;
}

function generateSoftCardsLayout(data: any[], radius: number, speed: number, bg: string) {
  let cards = "";
  data.forEach((lang, i) => {
    const x = 25 + (i % 2) * 210;
    const y = 65 + Math.floor(i / 2) * 60;
    cards += `
      <g class="animate" style="animation-delay: ${i * 0.1 / speed}s">
        <rect x="${x}" y="${y}" width="190" height="45" rx="${radius}" fill="#888" fill-opacity="0.05" stroke="#888" stroke-opacity="0.1"/>
        <circle cx="${x + 20}" cy="${y + 22}" r="6" fill="${lang.color}" filter="url(#glow)"/>
        <text x="${x + 35}" y="${y + 27}" class="lang-name">${lang.name}</text>
        <text x="${x + 150}" y="${y + 27}" class="percentage">${lang.percentage.toFixed(0)}%</text>
        <rect x="${x}" y="${y + 40}" width="${(lang.percentage / 100) * 190}" height="5" rx="2" fill="${lang.color}" fill-opacity="0.3"/>
      </g>`;
  });
  return cards;
}

function generateMinimalistLineLayout(data: any[], speed: number) {
  const barWidth = 400;
  const barHeight = 6;
  const barY = 35;
  let currentX = 25;
  let barSegments = "";

  data.forEach((lang, i) => {
    const segmentWidth = (lang.percentage / 100) * barWidth;
    barSegments += `<rect x="${currentX}" y="${barY}" width="${segmentWidth}" height="${barHeight}" fill="${lang.color}" class="bar-animate" style="animation-delay: ${i * 0.1 / speed}s"/>`;
    currentX += segmentWidth;
  });
  return barSegments;
}

function generateEmptyStateSvg(options: SvgOptions) {
  const theme = THEMES[options.theme || 'default'] || THEMES.default;
  const bg = options.bg_color || theme.bg;
  const radius = options.borderRadius ?? 8;
  return `
    <svg width="450" height="150" viewBox="0 0 450 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="450" height="150" rx="${radius}" fill="#${bg}" />
      <text x="50%" y="50%" text-anchor="middle" font-family="Segoe UI" font-size="16" fill="#888">No language data found yet. Start coding!</text>
    </svg>`;
}
