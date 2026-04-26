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
  const { platform, username, data, style, blockRadius, elementRadius, showGlow, themeColor, syncAvatarColor } = options;
  
  // Create a unique ID suffix to prevent collisions in browsers
  const uid = Math.random().toString(36).substring(2, 8);
  
  const brandIcon = getSimpleIcon(platform);
  const brandColor = themeColor || (brandIcon ? brandIcon.hex : '4f46e5');
  
  const width = style === 'activity' ? 400 : 220;
  const height = style === 'badge' ? 60 : 130;
  
  // FALLBACK HIERARCHY LOGIC
  const isDefault = data.isDefault || !data.avatarUrl;
  const avatarUrl = data.avatarUrl;
  
  const neonColor = brandColor;
  const avatarThemeColor = syncAvatarColor ? neonColor : brandColor;

  const glowFilter = showGlow ? `
    <filter id="glow_${uid}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  ` : '';

  const blurFilter = `
    <filter id="bgBlur_${uid}" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.3 0" />
    </filter>
  `;

  const iconPath = brandIcon ? brandIcon.path : "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z";
  
  const renderAvatar = (x: number, y: number, size: number, clipId: string) => {
    if (!isDefault && avatarUrl) {
      return `<image x="${x}" y="${y}" width="${size}" height="${size}" href="${avatarUrl}" clip-path="url(#${clipId})" />`;
    }
    
    // ELITE DEFAULT USER ICON (Futuristic 3D Silhouette)
    const initial = (username[0] || '?').toUpperCase();
    return `
      <g clip-path="url(#${clipId})" transform="translate(${x}, ${y})">
        <rect width="${size}" height="${size}" fill="#${avatarThemeColor}" fill-opacity="0.1" />
        
        <!-- Animated Scanline -->
        <rect width="${size}" height="2" fill="#${avatarThemeColor}" fill-opacity="0.3" class="scanline">
          <animateTransform attributeName="transform" type="translate" from="0 0" to="0 ${size}" dur="3s" repeatCount="indefinite" />
        </rect>

        <circle cx="${size/2}" cy="${size/2}" r="${size/2.5}" fill="#${avatarThemeColor}" fill-opacity="0.15" class="pulse-ring" />
        
        <!-- 3D Silhouette Path -->
        <g transform="translate(${size/4}, ${size/4}) scale(${size/100})">
           <path d="M50 20 C65 20 75 35 75 50 C75 65 65 80 50 80 C35 80 25 65 25 50 C25 35 35 20 50 20 M10 120 C10 100 30 85 50 85 C70 85 90 100 90 120 L90 140 L10 140 Z" 
                 fill="#${avatarThemeColor}" fill-opacity="0.6" stroke="#${avatarThemeColor}" stroke-width="2" />
        </g>

        <text x="${size/2}" y="${size/2 + (size/15)}" fill="white" font-family="Arial" font-size="${size/4}" font-weight="900" text-anchor="middle" dominant-baseline="middle" opacity="0.3">${initial}</text>
      </g>
    `;
  };

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
      
      <clipPath id="avatarClip_${uid}">
        <rect x="10" y="10" width="40" height="40" rx="${elementRadius}" />
      </clipPath>
      ${renderAvatar(10, 10, 40, `avatarClip_${uid}`)}
      
      <text x="60" y="${height/2 + 6}" fill="white" font-family="Arial" font-size="14" font-weight="900">${username}</text>
      <text x="${width - 15}" y="${height/2 + 5}" fill="#${brandColor}" font-family="Arial" font-size="9" font-weight="black" text-anchor="end" opacity="0.6">${platform.toUpperCase()}</text>
    `;
  } else {
    // Identity Style / Large Card
    content = `
      <mask id="cardMask_${uid}">
        <rect width="${width}" height="${height}" rx="${blockRadius}" fill="white" />
      </mask>
      
      <g mask="url(#cardMask_${uid})">
        <!-- Blur Background (Still using stylized colors if default) -->
        ${isDefault ? `
          <rect width="${width}" height="${height}" fill="#${avatarThemeColor}" fill-opacity="0.05" filter="url(#bgBlur_${uid})" />
        ` : `
          <image href="${avatarUrl}" width="${width * 1.5}" height="${height * 1.5}" x="${-width * 0.25}" y="${-height * 0.25}" filter="url(#bgBlur_${uid})" />
        `}
        
        <rect width="${width}" height="${height}" fill="#${brandColor}" fill-opacity="0.1" stroke="#${brandColor}" stroke-opacity="0.3"/>
        
        <!-- Profile Section -->
        <g transform="translate(20, 25)">
          <clipPath id="avatarCircle_${uid}">
            <rect width="48" height="48" rx="${elementRadius}" />
          </clipPath>
          ${renderAvatar(0, 0, 48, `avatarCircle_${uid}`)}
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
            transform-origin: center;
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.1; transform: scale(1.5); }
          }
          text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
        </style>
      </defs>
      <g ${showGlow ? `filter="url(#glow_${uid})"` : ''}>
        ${content}
      </g>
    </svg>
  `.trim();
}
