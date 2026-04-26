import { NextRequest, NextResponse } from "next/server";

// Caching layer: 1 hour in-memory
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 3600 * 1000; 

async function fetchWithCache(key: string, fetcher: () => Promise<any>) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  const data = await fetcher();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { platform: string } }
) {
  const { platform } = params;
  const { searchParams } = req.nextUrl;
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    let data: any = {};

    if (platform === 'discord') {
      // Use Lanyard API for Discord
      data = await fetchWithCache(`discord-${username}`, async () => {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${username}`);
        const json = await res.json();
        if (!json.success) return { status: 'offline' };
        
        const d = json.data;
        return {
          status: d.discord_status,
          activities: d.activities?.map((a: any) => ({
            name: a.name,
            state: a.state,
            details: a.details,
            type: a.type
          })) || []
        };
      });
    } else if (platform === 'youtube') {
      // Mocking YouTube for now (assuming API key in .env)
      // In production, this would use the YouTube Data API v3
      data = await fetchWithCache(`youtube-${username}`, async () => {
        return {
          subscribers: "12.4K",
          latestVideo: "Building a Next.js Masterpiece",
          thumbnail: "" 
        };
      });
    } else if (platform === 'career') {
      // Career status doesn't need external fetching
      data = { status: username };
    } else {
      // Fallback for static badges
      data = { handle: username };
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching ${platform} data:`, error);
    return NextResponse.json({ error: "Failed to fetch social data" }, { status: 500 });
  }
}
