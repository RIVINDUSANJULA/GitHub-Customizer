import { cn } from "./utils";

export interface SocialCardOptions {
  platform: string;
  username: string;
  data: any;
  style: 'badge' | 'counter' | 'activity';
  blockRadius: number;
  elementRadius: number;
  showGlow: boolean;
  themeColor?: string;
}

export function generateSocialSVG(options: SocialCardOptions) {
  const { platform, username, data, style, blockRadius, elementRadius, showGlow, themeColor } = options;
  
  const width = style === 'activity' ? 400 : 200;
  const height = style === 'badge' ? 50 : 120;
  
  const color = themeColor || (platform === 'youtube' ? 'ff0000' : platform === 'discord' ? '5865f2' : '4f46e5');

  const glowFilter = showGlow ? `
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  ` : '';

  let content = "";

  if (platform === 'career') {
    const isAvailable = username.toLowerCase().includes('available') || username.toLowerCase().includes('open');
    const dotColor = isAvailable ? '10b981' : 'ef4444';
    
    content = `
      <rect width="${width}" height="${height}" rx="${blockRadius}" fill="#${color}" fill-opacity="0.1" stroke="#${color}" stroke-opacity="0.2"/>
      <circle cx="20" cy="${height/2}" r="5" fill="#${dotColor}">
        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="35" y="${height/2 + 5}" fill="white" font-family="Arial" font-size="14" font-weight="bold">${username}</text>
    `;
  } else if (style === 'badge') {
    content = `
      <rect width="${width}" height="${height}" rx="${blockRadius}" fill="#${color}" fill-opacity="0.1" stroke="#${color}" stroke-opacity="0.2"/>
      <text x="15" y="${height/2 + 5}" fill="white" font-family="Arial" font-size="14" font-weight="bold">${platform.toUpperCase()}: ${username}</text>
    `;
  } else {
    // Large Card / Activity
    content = `
      <rect width="${width}" height="${height}" rx="${blockRadius}" fill="#${color}" fill-opacity="0.05" stroke="#${color}" stroke-opacity="0.2"/>
      <text x="20" y="35" fill="#${color}" font-family="Arial" font-size="12" font-weight="black" style="text-transform:uppercase; letter-spacing: 1px">${platform}</text>
      <text x="20" y="60" fill="white" font-family="Arial" font-size="18" font-weight="bold">${username}</text>
      <text x="20" y="85" fill="white" fill-opacity="0.6" font-family="Arial" font-size="12">${data.subscribers || data.status || "Live Connection"}</text>
    `;
  }

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>${glowFilter}</defs>
      <g ${showGlow ? 'filter="url(#glow)"' : ''}>
        ${content}
      </g>
    </svg>
  `.trim();
}
