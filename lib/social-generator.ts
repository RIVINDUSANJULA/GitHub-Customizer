import * as si from 'simple-icons';

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

function getSimpleIcon(name: string) {
  const mapping: Record<string, string> = {
    'twitter': 'x',
    'career': 'briefcase'
  };
  
  const searchName = mapping[name.toLowerCase()] || name.toLowerCase();
  
  const slug = searchName
    .replace(/\+/g, 'plus')
    .replace(/\./g, 'dot')
    .replace(/[^a-z0-9]/g, '');
  
  const iconKey = 'si' + slug.charAt(0).toUpperCase() + slug.slice(1);
  if ((si as any)[iconKey]) return (si as any)[iconKey];

  for (const icon of Object.values(si)) {
    if ((icon as any).title?.toLowerCase() === searchName) return icon;
    if ((icon as any).slug === slug) return icon;
  }
  return null;
}

export function generateSocialSVG(options: SocialCardOptions) {
  const { platform, username, data, style, blockRadius, elementRadius, showGlow, themeColor } = options;
  
  const brandIcon = getSimpleIcon(platform);
  const brandColor = themeColor || (brandIcon ? brandIcon.hex : '4f46e5');
  
  const width = style === 'activity' ? 400 : 220;
  const height = style === 'badge' ? 60 : 130;
  
  const glowFilter = showGlow ? `
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  ` : '';

  const iconPath = brandIcon ? brandIcon.path : "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z";
  
  let content = "";

  if (platform === 'career') {
    const isAvailable = username.toLowerCase().includes('available') || username.toLowerCase().includes('open');
    const dotColor = isAvailable ? '10b981' : 'ef4444';
    
    content = `
      <rect width="${width}" height="${height}" rx="${blockRadius}" fill="#${brandColor}" fill-opacity="0.1" stroke="#${brandColor}" stroke-opacity="0.3"/>
      <g transform="translate(20, ${height/2 - 10}) scale(0.8)">
        <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" fill="#${brandColor}"/>
      </g>
      <circle cx="${width - 25}" cy="${height/2}" r="5" fill="#${dotColor}">
        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="50" y="${height/2 + 6}" fill="white" font-family="Arial" font-size="16" font-weight="900" style="text-shadow: 0 2px 4px rgba(0,0,0,0.3)">${username}</text>
    `;
  } else if (style === 'badge') {
    content = `
      <rect width="${width}" height="${height}" rx="${blockRadius}" fill="#${brandColor}" fill-opacity="0.1" stroke="#${brandColor}" stroke-opacity="0.3"/>
      <g transform="translate(15, ${height/2 - 12}) scale(1)">
        <g transform="scale(${24/24})" fill="#${brandColor}">
          <path d="${iconPath}"/>
        </g>
      </g>
      <text x="50" y="${height/2 + 6}" fill="white" font-family="Arial" font-size="14" font-weight="900" style="text-shadow: 0 2px 4px rgba(0,0,0,0.3)">${username || 'Enter Handle'}</text>
      <text x="${width - 15}" y="${height/2 + 5}" fill="#${brandColor}" font-family="Arial" font-size="9" font-weight="black" text-anchor="end" opacity="0.6" style="text-transform:uppercase; letter-spacing: 1px">${platform}</text>
    `;
  } else {
    // Large Card / Activity
    content = `
      <rect width="${width}" height="${height}" rx="${blockRadius}" fill="#${brandColor}" fill-opacity="0.05" stroke="#${brandColor}" stroke-opacity="0.3"/>
      <g transform="translate(20, 25) scale(1.2)">
        <g fill="#${brandColor}">
          <path d="${iconPath}"/>
        </g>
      </g>
      <text x="${width - 20}" y="40" fill="#${brandColor}" font-family="Arial" font-size="12" font-weight="black" text-anchor="end" style="text-transform:uppercase; letter-spacing: 2px">${platform}</text>
      <text x="20" y="80" fill="white" font-family="Arial" font-size="24" font-weight="900" style="text-shadow: 0 4px 8px rgba(0,0,0,0.5)">${username || 'Username'}</text>
      <text x="20" y="105" fill="white" fill-opacity="0.6" font-family="Arial" font-size="12" font-weight="bold">${data.subscribers || data.status || "LIVE DATA FEED"}</text>
      
      <rect x="0" y="${height-4}" width="${width}" height="4" fill="#${brandColor}" fill-opacity="0.3" rx="2"/>
    `;
  }

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${glowFilter}
        <style>
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        </style>
      </defs>
      <g ${showGlow ? 'filter="url(#glow)"' : ''}>
        ${content}
      </g>
    </svg>
  `.trim();
}
