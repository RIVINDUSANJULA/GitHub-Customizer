
async function toBase64(url: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s timeout

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const contentType = res.headers.get('content-type') || 'image/png';
    return `data:${contentType};base64,${base64}`;
  } catch (e) {
    clearTimeout(timeoutId);
    return null;
  }
}

// Detect if an avatar is a platform-default placeholder
function isDefaultAvatar(url: string, platform: string): boolean {
  if (!url) return true;
  const lower = url.toLowerCase();
  
  const placeholders = [
    'default_profile', 
    'default-avatar', 
    'avatar-placeholder',
    'identicons',
    'googleusercontent.com/a/default',
    'abs.twimg.com/sticky/default_profile_images',
    'discord.com/assets/embed/avatars',
    'static-cdn.jtvnw.net/user-default-pictures',
    'ui-avatars.com/api',
    'gravatar.com/avatar/0000'
  ];
  
  return placeholders.some(p => lower.includes(p));
}

export async function fetchSocialIdentity(platform: string, username: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s total timeout

  try {
    let avatarUrl = `https://unavatar.io/${platform}/${username}`;
    let followers = null;
    let status = "Active";
    let verified = false;
    let isDefault = false;

    const fetchOptions = { 
      signal: controller.signal, 
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 3600 } // Cache for 1 hour
    };

    switch (platform.toLowerCase()) {
      case 'discord': {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${username}`, fetchOptions);
        if (res.ok) {
          const { data } = await res.json();
          avatarUrl = `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png`;
          status = data.discord_status;
          verified = true;
          isDefault = !data.discord_user.avatar;
        }
        break;
      }
      
      case 'youtube': {
        const res = await fetch(`https://www.youtube.com/@${username}`, fetchOptions);
        if (res.ok) {
          verified = true;
          const html = await res.text();
          const avatarMatch = html.match(/"avatar":{"thumbnails":\[{"url":"([^"]+)"/);
          const subsMatch = html.match(/"subscriberCountText":{"simpleText":"([^"]+)"/);
          if (avatarMatch) {
            avatarUrl = avatarMatch[1].replace(/=s[0-9]+.*$/, '=s96-c-k-c0x00ffffff-no-rj');
          }
          followers = subsMatch ? subsMatch[1] : null;
        }
        break;
      }

      case 'github': {
        const res = await fetch(`https://api.github.com/users/${username}`, fetchOptions);
        if (res.ok) {
          const data = await res.json();
          avatarUrl = data.avatar_url;
          followers = `${data.followers} followers`;
          verified = true;
        }
        break;
      }

      default: {
        // Quick discovery check
        try {
          const res = await fetch(`https://unavatar.io/${platform}/${username}`, { method: 'HEAD', ...fetchOptions });
          if (res.ok) verified = true;
        } catch (e) {
          // Ignore fetch errors for discovery
        }
      }
    }

    if (isDefaultAvatar(avatarUrl, platform)) {
      isDefault = true;
    }

    const base64Avatar = isDefault ? null : await toBase64(avatarUrl);
    clearTimeout(timeoutId);

    return {
      avatar: base64Avatar,
      followers,
      status,
      verified: verified || !!base64Avatar,
      isDefault
    };
  } catch (e) {
    clearTimeout(timeoutId);
    // Log only non-abort errors
    if (e instanceof Error && e.name !== 'AbortError') {
      console.error("Discovery error:", e.message);
    }
  }

  return {
    avatar: null,
    verified: username.length > 2, 
    isDefault: true
  };
}
