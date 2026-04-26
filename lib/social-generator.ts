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
  
  const avatarUrl = options.data.avatarUrl || `https://unavatar.io/${platform}/${username}`;
  const useAvatar = !!options.data.avatarUrl;

  const glowFilter = showGlow ? `
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  ` : '';

  const blurFilter = `
    <filter id="bgBlur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.3 0" />
    </filter>
  `;

  const iconPath = brandIcon ? brandIcon.path : "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z";
  
  let content = "";

  if (platform === 'career') {
    const isAvailable = username.toLowerCase().includes('available') || username.toLowerCase().includes('open');
    const dotColor = isAvailable ? '10b981' : 'f59e0b';
    
    content = `
      <rect width="${width}" height="${height}" rx="${blockRadius}" fill="#${brandColor}" fill-opacity="0.1" stroke="#${brandColor}" stroke-opacity="0.3"/>
      <g transform="translate(20, ${height/2 - 10}) scale(0.8)">
        <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" fill="#${brandColor}"/>
      </g>
      
      <!-- Pulse Animation Dot -->
      <g transform="translate(${width - 25}, ${height/2})">
        <circle r="8" fill="#${dotColor}" fill-opacity="0.3" class="pulse-ring" />
        <circle r="4" fill="#${dotColor}" />
      </g>
      
      <text x="50" y="${height/2 + 6}" fill="white" font-family="Arial" font-size="14" font-weight="900">${username}</text>
    `;
  } else if (style === 'badge') {
    content = `
      <rect width="${width}" height="${height}" rx="${blockRadius}" fill="#${brandColor}" fill-opacity="0.1" stroke="#${brandColor}" stroke-opacity="0.3"/>
      
      ${useAvatar ? `
        <clipPath id="avatarClip">
          <rect x="10" y="10" width="40" height="40" rx="${elementRadius}" />
        </clipPath>
        <image x="10" y="10" width="40" height="40" href="${avatarUrl}" clip-path="url(#avatarClip)" />
      ` : `
        <g transform="translate(15, ${height/2 - 12}) scale(1)" fill="#${brandColor}">
          <path d="${iconPath}"/>
        </g>
      `}
      
      <text x="${useAvatar ? 60 : 50}" y="${height/2 + 6}" fill="white" font-family="Arial" font-size="14" font-weight="900">${username}</text>
      <text x="${width - 15}" y="${height/2 + 5}" fill="#${brandColor}" font-family="Arial" font-size="9" font-weight="black" text-anchor="end" opacity="0.6">${platform.toUpperCase()}</text>
    `;
  } else {
    // Identity Style / Large Card
    content = `
      <mask id="cardMask">
        <rect width="${width}" height="${height}" rx="${blockRadius}" fill="white" />
      </mask>
      
      <g mask="url(#cardMask)">
        <!-- Blur Background -->
        <image href="${avatarUrl}" width="${width * 1.5}" height="${height * 1.5}" x="${-width * 0.25}" y="${-height * 0.25}" filter="url(#bgBlur)" />
        
        <rect width="${width}" height="${height}" fill="#${brandColor}" fill-opacity="0.1" stroke="#${brandColor}" stroke-opacity="0.3"/>
        
        <!-- Profile Section -->
        <g transform="translate(20, 25)">
          <clipPath id="avatarCircle">
            <rect width="48" height="48" rx="${elementRadius}" />
          </clipPath>
          <image width="48" height="48" href="${avatarUrl}" clip-path="url(#avatarCircle)" />
          <rect width="48" height="48" rx="${elementRadius}" fill="none" stroke="#${brandColor}" stroke-width="2" />
        </g>
        
        <text x="80" y="45" fill="white" font-family="Arial" font-size="18" font-weight="900">${username}</text>
        <text x="80" y="62" fill="#${brandColor}" font-family="Arial" font-size="10" font-weight="black" style="text-transform:uppercase">${platform}</text>
        
        <text x="20" y="105" fill="white" fill-opacity="0.7" font-family="Arial" font-size="12" font-weight="bold">${data.followers || data.status || "Identity Suite Active"}</text>
        
        ${data.verified ? `
          <g transform="translate(${width - 40}, 20) scale(0.6)">
            <path d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" fill="#${brandColor}" />
          </g>
        ` : ''}
      </g>
    `;
  }

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${glowFilter}
        ${blurFilter}
        <style>
          .pulse-ring {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.1; transform: scale(1.5); }
          }
          text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
        </style>
      </defs>
      <g ${showGlow ? 'filter="url(#glow)"' : ''}>
        ${content}
      </g>
    </svg>
  `.trim();
}
