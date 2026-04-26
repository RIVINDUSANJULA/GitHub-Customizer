import { NextRequest, NextResponse } from "next/server";
import { generateSocialSVG } from "@/lib/social-generator";
import { fetchSocialIdentity } from "@/lib/identity-fetcher";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  
  const platform = searchParams.get("platform") || "github";
  const username = searchParams.get("username") || "User";
  const style = (searchParams.get("style") || "badge") as any;
  const blockRadius = parseInt(searchParams.get("blockRadius") || "20");
  const elementRadius = parseInt(searchParams.get("elementRadius") || "10");
  const showGlow = searchParams.get("showGlow") === "true";
  const themeColor = searchParams.get("color") || undefined;
  const useAvatar = searchParams.get("useAvatar") === "true";
  const syncAvatarColor = searchParams.get("syncAvatarColor") === "true";
  const customAvatarUrl = searchParams.get("customAvatarUrl");

  // Fetch real-time identity data
  const identity = await fetchSocialIdentity(platform, username);
  
  const data = {
    followers: identity.followers || searchParams.get("subs") || null,
    status: identity.status || searchParams.get("status") || "Active",
    avatarUrl: customAvatarUrl || (useAvatar ? identity.avatar : null),
    verified: identity.verified,
    isDefault: customAvatarUrl ? false : identity.isDefault
  };

  const svg = generateSocialSVG({
    platform,
    username,
    data,
    style,
    blockRadius,
    elementRadius,
    showGlow,
    themeColor,
    syncAvatarColor
  });

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, s-maxage=3600",
    },
  });
}
