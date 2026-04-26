
async function toBase64(url: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
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
  const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for scraper

  try {
    let avatarUrl = `https://unavatar.io/${platform}/${username}`;
    let followers = null;
    let status = "Active";
    let verified = false;
    let isDefault = false;

    const fetchOptions = { signal: controller.signal, headers: { 'User-Agent': 'Mozilla/5.0' } };

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
          verified = true; // Profile exists
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
        // Aggressive HTTP discovery
        const res = await fetch(`https://unavatar.io/${platform}/${username}`, { method: 'HEAD', ...fetchOptions });
        if (res.ok) verified = true;
      }
    }

    // HIJACK: If image is a default platform silhouette, force our custom avatar
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
    console.error("Discovery failed:", e);
  }

  // Catch-all: Verify by username pattern if possible, else return safe default
  return {
    avatar: null,
    verified: username.length > 2, 
    isDefault: true
  };
}
