export interface SvgOptions {
  theme?: string;
  bg_color?: string;
  bg_color_2?: string;
  bg_type?: 'solid' | 'gradient';
  title_color?: string;
  text_color?: string;
  icon_color?: string;
  border_color?: string;
  hide_border?: boolean;
  limit?: number;
  layout?: 'compact' | 'pie' | 'list' | 'modern-bar' | 'soft-cards' | 'minimalist-line';
  blockRadius?: number;
  elementRadius?: number;
  showGlow?: boolean;
  animationSpeed?: number;
  donutHoleSize?: number;
  startAngle?: number;
  barHeight?: number;
  lineThickness?: number;
  cardsPerRow?: number;
  shadowDepth?: number;
  pieShowHoverLabels?: boolean;
  pieLabelPosition?: 'inside' | 'floating';
  pieHideLegend?: boolean;
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
    return createEmptyStateSvg(options);
  }

  const theme = THEMES[options.theme || 'default'] || THEMES.default;
  const bg = options.bg_color || theme.bg;
  const bg2 = options.bg_color_2 || bg;
  const titleColor = options.title_color || theme.title;
  const textColor = options.text_color || theme.text;
  const borderColor = options.border_color || theme.border;
  const limit = options.limit || 5;
  const layout = options.layout || 'compact';
  const blockRadius = options.blockRadius ?? 20;
  const elementRadius = options.elementRadius ?? 10;
  const speed = options.animationSpeed || 1;

  const data = languages.slice(0, limit);
  const width = 450;
  
  let height = 250;
  if (layout === 'list') height = 85 + data.length * 35;
  else if (layout === 'pie') {
    height = options.pieHideLegend 
      ? 300 
      : Math.max(300, 110 + data.length * 35);
  }
  else if (layout === 'modern-bar') height = 95 + data.length * 40;
  else if (layout === 'soft-cards') height = 75 + Math.ceil(data.length / (options.cardsPerRow || 2)) * 65;
  else if (layout === 'compact') height = 120 + Math.ceil(data.length / 3) * 25;
  else if (layout === 'minimalist-line') height = 70;

  const hoverStyle = options.pieShowHoverLabels ? `
    .segment-group { cursor: pointer; }
    .segment-group .segment { transition: all 0.3s ease; }
    .segment-group:hover .segment { opacity: 1; transform: scale(1.03); transform-origin: center; filter: brightness(1.2) ${options.showGlow ? 'drop-shadow(0 0 8px currentColor)' : ''}; }
    .hover-label { opacity: 0; visibility: hidden; transition: opacity 0.3s ease; pointer-events: none; }
    .segment-group:hover .hover-label { opacity: 1; visibility: visible; }
    ${options.pieLabelPosition === 'inside' ? `
      .default-hole-text { transition: opacity 0.3s ease; pointer-events: none; }
      .segment-group:hover ~ .default-hole-text { opacity: 0; }
    ` : ''}
  ` : '';

  let content = "";
  if (layout === 'compact') content = generateCompactLayout(data, elementRadius, speed, options);
  else if (layout === 'pie') content = generatePieLayout(data, elementRadius, speed, options);
  else if (layout === 'list') content = generateListLayout(data, elementRadius, speed, options);
  else if (layout === 'modern-bar') content = generateModernBarLayout(data, elementRadius, speed, options);
  else if (layout === 'soft-cards') content = generateSoftCardsLayout(data, elementRadius, speed, options);
  else if (layout === 'minimalist-line') content = generateMinimalistLineLayout(data, speed, elementRadius, options);

  const glowFilter = options.showGlow ? `
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>` : "";

  const shadowFilter = options.layout === 'soft-cards' ? `
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="${options.shadowDepth || 5}" stdDeviation="3" flood-opacity="0.2"/>
      </filter>` : "";

  const bgFill = options.bg_type === 'gradient' 
    ? `url(#bgGradient)` 
    : `#${bg}`;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${glowFilter}
        ${shadowFilter}
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#${bg}" />
          <stop offset="100%" stop-color="#${bg2}" />
        </linearGradient>
      </defs>
      <style>
        .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${titleColor}; }
        .lang-name { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${textColor}; }
        .percentage { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: #${textColor}; opacity: 0.7; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes growPie { from { stroke-dashoffset: var(--dash-offset); } to { stroke-dashoffset: 0; } }
        .animate { animation: fadeIn ${0.5 / speed}s ease forwards; }
        .bar-animate { transform-origin: left; animation: scaleIn ${0.8 / speed}s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        ${hoverStyle}
      </style>
      <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="${blockRadius}" fill="${bgFill}" stroke="#${borderColor}" stroke-opacity="${options.hide_border ? 0 : 1}"/>
      ${layout !== 'minimalist-line' ? `<text x="25" y="35" class="header animate">Most Used Languages</text>` : ""}
      ${content}
    </svg>
  `;
}

function generateCompactLayout(data: any[], radius: number, speed: number, options: SvgOptions) {
  const barWidth = 400;
  const barHeight = options.barHeight || 18;
  const barY = 55;
  const gap = radius > 0 ? 2 : 0;
  const totalGaps = (data.length - 1) * gap;
  const availableWidth = barWidth - totalGaps;
  
  let currentX = 25;
  let barSegments = "";
  let legend = "";

  data.forEach((lang, i) => {
    const segmentWidth = (lang.percentage / 100) * availableWidth;
    const safeId = lang.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    barSegments += `<rect id="bar-${safeId}" x="${currentX}" y="${barY}" width="${segmentWidth}" height="${barHeight}" fill="${lang.color}" 
      rx="${radius}" ${glow} class="bar-animate" style="animation-delay: ${i * 0.1 / speed}s"/>`;

    const lx = 25 + (i % 3) * 135;
    const ly = barY + barHeight + 35 + Math.floor(i / 3) * 25;
    legend += `
      <g class="animate" id="legend-${safeId}" style="animation-delay: ${0.5 + i * 0.1 / speed}s">
        <circle cx="${lx}" cy="${ly - 4}" r="5" fill="${lang.color}" ${glow}/>
        <text x="${lx + 15}" y="${ly}" class="lang-name">${lang.name} <tspan class="percentage">${lang.percentage.toFixed(1)}%</tspan></text>
      </g>`;
    currentX += segmentWidth + gap;
  });
  return barSegments + legend;
}

function generateListLayout(data: any[], radius: number, speed: number, options: SvgOptions) {
  let list = "";
  data.forEach((lang, i) => {
    const y = 75 + i * 35;
    const barMaxWidth = 230;
    const barWidth = (lang.percentage / 100) * barMaxWidth;
    const glow = options.showGlow ? 'filter="url(#glow)"' : '';
    const safeId = lang.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    list += `
      <g class="animate" id="lang-${safeId}" style="animation-delay: ${i * 0.1 / speed}s">
        <text x="25" y="${y}" class="lang-name">${lang.name}</text>
        <rect x="135" y="${y - 12}" width="${barMaxWidth}" height="12" rx="${radius}" fill="#888" fill-opacity="0.1"/>
        <rect x="135" y="${y - 12}" width="${barWidth}" height="12" rx="${radius}" fill="${lang.color}" ${glow} class="bar-animate"/>
        <text x="385" y="${y}" class="percentage">${lang.percentage.toFixed(1)}%</text>
      </g>`;
  });
  return list;
}

function generatePieLayout(data: any[], radius: number, speed: number, options: SvgOptions) {
  const hideLegend = options.pieHideLegend;
  const centerX = hideLegend ? 225 : 130;
  const centerY = 175;
  const holeSize = (options.donutHoleSize ?? 60) / 100;
  const r = 75;
  const strokeWidth = Math.max(1, r * (1 - holeSize) * 2);
  const actualRadius = Math.max(0.5, r - strokeWidth / 2);
  const circumference = 2 * Math.PI * actualRadius;
  const startAngle = options.startAngle || 0;
  
  let currentOffset = 0;
  let chart = "";
  let legend = "";

  data.forEach((lang, i) => {
    const sliceLength = (lang.percentage / 100) * circumference;
    const rotation = (currentOffset / circumference) * 360 - 90 + startAngle;
    const glowAttr = options.showGlow ? 'filter="url(#glow)"' : '';
    const safeId = lang.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    // Label positioning
    let lx = centerX;
    let ly = centerY;
    let anchor = "middle";

    if (options.pieLabelPosition === 'floating') {
      const midAngle = (rotation + (sliceLength / circumference) * 180) * (Math.PI / 180);
      const labelRadius = actualRadius + strokeWidth / 2 + 20;
      lx = centerX + Math.cos(midAngle) * labelRadius;
      ly = centerY + Math.sin(midAngle) * labelRadius;
      anchor = lx > centerX ? "start" : "end";
    }

    chart += `
      <g class="segment-group" id="lang-${safeId}" color="${lang.color}">
        <circle class="segment" cx="${centerX}" cy="${centerY}" r="${actualRadius}" fill="transparent" stroke="${lang.color}" 
          stroke-width="${strokeWidth}" stroke-dasharray="${sliceLength} ${circumference}" 
          transform="rotate(${rotation} ${centerX} ${centerY})" ${glowAttr} 
          stroke-linecap="${radius > 0 ? 'round' : 'butt'}"
          style="--dash-offset: ${sliceLength}; animation: growPie ${1 / speed}s ease forwards; animation-delay: ${i * 0.1 / speed}s" stroke-dashoffset="${sliceLength}"/>
        
        ${options.pieShowHoverLabels ? `
          <g class="hover-label">
            <text x="${lx}" y="${ly - 5}" fill="${lang.color}" text-anchor="${anchor}" font-weight="700" font-size="14">${lang.name}</text>
            <text x="${lx}" y="${ly + 12}" fill="${lang.color}" text-anchor="${anchor}" font-size="11" opacity="0.8">${lang.percentage.toFixed(1)}%</text>
          </g>
        ` : ""}
      </g>`;

    if (!hideLegend) {
      const legendY = 90 + i * 35;
      legend += `
        <g class="animate" id="legend-${safeId}" style="animation-delay: ${0.5 + i * 0.1 / speed}s">
          <circle cx="280" cy="${legendY - 4}" r="6" fill="${lang.color}" ${glowAttr}/>
          <text x="300" y="${legendY}" class="lang-name">${lang.name} <tspan class="percentage">${lang.percentage.toFixed(1)}%</tspan></text>
        </g>`;
    }
    currentOffset += sliceLength;
  });

  const defaultHole = options.pieShowHoverLabels && options.pieLabelPosition === 'inside' ? `
    <g class="default-hole-text" pointer-events="none">
      <text x="${centerX}" y="${centerY - 5}" fill="#888" text-anchor="middle" font-weight="600" font-size="10" opacity="0.5">TOP</text>
      <text x="${centerX}" y="${centerY + 10}" fill="#888" text-anchor="middle" font-weight="700" font-size="12" opacity="0.8">LANGS</text>
    </g>
  ` : "";

  return chart + defaultHole + legend;
}

function generateModernBarLayout(data: any[], radius: number, speed: number, options: SvgOptions) {
  let list = "";
  const barHeight = options.barHeight || 18;
  data.forEach((lang, i) => {
    const y = 85 + i * 40;
    const barMaxWidth = 400;
    const barWidth = (lang.percentage / 100) * barMaxWidth;
    const glowAttr = options.showGlow ? 'filter="url(#glow)"' : '';
    const safeId = lang.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    list += `
      <g class="animate" id="lang-${safeId}" style="animation-delay: ${i * 0.1 / speed}s">
        <text x="25" y="${y - 15}" class="lang-name">${lang.name} <tspan class="percentage">${lang.percentage.toFixed(1)}%</tspan></text>
        <rect x="25" y="${y - (barHeight/2)}" width="${barMaxWidth}" height="${barHeight}" rx="${radius}" fill="#888" fill-opacity="0.1"/>
        <linearGradient id="grad${i}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${lang.color};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${lang.color};stop-opacity:1" />
        </linearGradient>
        <rect x="25" y="${y - (barHeight/2)}" width="${barWidth}" height="${barHeight}" rx="${radius}" fill="url(#grad${i})" ${glowAttr} class="bar-animate"/>
      </g>`;
  });
  return list;
}

function generateSoftCardsLayout(data: any[], radius: number, speed: number, options: SvgOptions) {
  let cards = "";
  const perRow = options.cardsPerRow || 2;
  const cardWidth = (400 - (perRow - 1) * 10) / perRow;
  const shadowAttr = options.shadowDepth && options.shadowDepth > 0 ? 'filter="url(#shadow)"' : '';
  
  data.forEach((lang, i) => {
    const x = 25 + (i % perRow) * (cardWidth + 10);
    const y = 65 + Math.floor(i / perRow) * 65;
    const glowAttr = options.showGlow ? 'filter="url(#glow)"' : '';
    const safeId = lang.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    cards += `
      <g class="animate" id="lang-${safeId}" style="animation-delay: ${i * 0.1 / speed}s" ${shadowAttr}>
        <rect x="${x}" y="${y}" width="${cardWidth}" height="55" rx="${radius}" fill="#ffffff" fill-opacity="0.05" stroke="#ffffff" stroke-opacity="0.1"/>
        <circle cx="${x + 20}" cy="${y + 22}" r="6" fill="${lang.color}" ${glowAttr}/>
        <text x="${x + 35}" y="${y + 27}" class="lang-name" font-size="12">${lang.name}</text>
        <text x="${x + cardWidth - 35}" y="${y + 27}" class="percentage" font-size="10">${lang.percentage.toFixed(0)}%</text>
        <rect x="${x + 10}" y="${y + 42}" width="${cardWidth - 20}" height="4" rx="2" fill="#888" fill-opacity="0.1"/>
        <rect x="${x + 10}" y="${y + 42}" width="${(lang.percentage / 100) * (cardWidth - 20)}" height="4" rx="2" fill="${lang.color}" ${glowAttr}/>
      </g>`;
  });
  return cards;
}

function generateMinimalistLineLayout(data: any[], speed: number, radius: number, options: SvgOptions) {
  const barWidth = 400;
  const barHeight = options.lineThickness || 6;
  const barY = 35;
  const gap = radius > 0 ? 2 : 0;
  const totalGaps = (data.length - 1) * gap;
  const availableWidth = barWidth - totalGaps;
  const glowAttr = options.showGlow ? 'filter="url(#glow)"' : '';
  
  let currentX = 25;
  let barSegments = "";

  data.forEach((lang, i) => {
    const segmentWidth = (lang.percentage / 100) * availableWidth;
    barSegments += `<rect x="${currentX}" y="${barY}" width="${segmentWidth}" height="${barHeight}" fill="${lang.color}" rx="${radius}" ${glowAttr} class="bar-animate" style="animation-delay: ${i * 0.1 / speed}s"/>`;
    currentX += segmentWidth + gap;
  });
  return barSegments;
}

function createEmptyStateSvg(options: SvgOptions) {
  const theme = THEMES[options.theme || 'default'] || THEMES.default;
  const bg = options.bg_color || theme.bg;
  const radius = options.blockRadius ?? 20;
  return `
    <svg width="450" height="150" viewBox="0 0 450 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="450" height="150" rx="${radius}" fill="#${bg}" />
      <text x="50%" y="50%" text-anchor="middle" font-family="Segoe UI" font-size="16" fill="#888">No language data found yet. Start coding!</text>
    </svg>`;
}

export function generateErrorSvg(message: string, themeId: string = 'default') {
  const theme = THEMES[themeId] || THEMES.default;
  return `
    <svg width="450" height="120" viewBox="0 0 450 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="450" height="120" rx="20" fill="#${theme.bg}" stroke="#ff4d4d" stroke-width="2"/>
      <text x="50%" y="45%" text-anchor="middle" font-family="Segoe UI" font-weight="bold" font-size="18" fill="#ff4d4d">Error Fetching Data</text>
      <text x="50%" y="70%" text-anchor="middle" font-family="Segoe UI" font-size="14" fill="#${theme.text}" opacity="0.8">${message}</text>
    </svg>`;
}

export function generateLoadingSvg(themeId: string = 'default') {
  const theme = THEMES[themeId] || THEMES.default;
  return `
    <svg width="450" height="120" viewBox="0 0 450 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="450" height="120" rx="20" fill="#${theme.bg}" />
      <circle cx="225" cy="60" r="15" stroke="#${theme.title}" stroke-width="3" stroke-dasharray="70 30">
        <animateTransform attributeName="transform" type="rotate" from="0 225 60" to="360 225 60" dur="1s" repeatCount="indefinite" />
      </circle>
      <text x="225" y="95%" text-anchor="middle" font-family="Segoe UI" font-size="12" fill="#${theme.text}" opacity="0.5">Profile Data Loading...</text>
    </svg>`;
}
