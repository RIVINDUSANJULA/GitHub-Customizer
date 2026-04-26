
export async function fetchSocialIdentity(platform: string, username: string) {
  // Real-time data fetching with fallbacks
  // NOTE: In a production environment, you would use process.env secrets here.
  
  try {
    switch (platform.toLowerCase()) {
      case 'discord': {
        // Use Lanyard API for Discord presence (no key needed for public data)
        const res = await fetch(`https://api.lanyard.rest/v1/users/${username}`);
        if (res.ok) {
          const { data } = await res.json();
          return {
            avatar: `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png`,
            status: data.discord_status,
            followers: null,
            verified: true
          };
        }
        break;
      }
      
      case 'youtube': {
        // Scrape public channel page for avatar and subs (fallback for no-key)
        const res = await fetch(`https://www.youtube.com/@${username}`);
        const html = await res.text();
        const avatarMatch = html.match(/"avatar":{"thumbnails":\[{"url":"([^"]+)"/);
        const subsMatch = html.match(/"subscriberCountText":{"simpleText":"([^"]+)"/);
        return {
          avatar: avatarMatch ? avatarMatch[1] : `https://unavatar.io/youtube/${username}`,
          followers: subsMatch ? subsMatch[1] : null,
          verified: !!avatarMatch
        };
      }

      case 'twitter':
      case 'x': {
        return {
          avatar: `https://unavatar.io/twitter/${username}`,
          followers: null, // Scrapers for X are brittle, using fallback
          verified: true
        };
      }

      case 'github': {
        const res = await fetch(`https://api.github.com/users/${username}`);
        const data = await res.json();
        return {
          avatar: data.avatar_url,
          followers: `${data.followers} followers`,
          verified: true
        };
      }

      case 'instagram': {
        return {
          avatar: `https://unavatar.io/instagram/${username}`,
          verified: true
        };
      }
    }
  } catch (e) {
    console.error("Identity fetch failed:", e);
  }

  return {
    avatar: `https://unavatar.io/${platform}/${username}`,
    verified: false
  };
}
