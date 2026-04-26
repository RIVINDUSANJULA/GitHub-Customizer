import { NextRequest, NextResponse } from "next/server";
import { generateSocialSVG } from "@/lib/social-generator";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  
  const platform = searchParams.get("platform") || "github";
  const username = searchParams.get("username") || "User";
  const style = (searchParams.get("style") || "badge") as any;
  const blockRadius = parseInt(searchParams.get("blockRadius") || "20");
  const elementRadius = parseInt(searchParams.get("elementRadius") || "10");
  const showGlow = searchParams.get("showGlow") === "true";
  const themeColor = searchParams.get("color") || undefined;

  // In a real app, we would fetch live data here
  // For the preview, we can mock some data or pass it via query
  const data = {
    subscribers: searchParams.get("subs") || "Live Data",
    status: searchParams.get("status") || "Active",
  };

  const svg = generateSocialSVG({
    platform,
    username,
    data,
    style,
    blockRadius,
    elementRadius,
    showGlow,
    themeColor
  });

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, s-maxage=3600",
    },
  });
}
