import { NextRequest, NextResponse } from "next/server";
import { fetchUserLanguages, aggregateLanguages } from "@/lib/github-api";
import { generateLanguageSvg, SvgOptions } from "@/lib/svg-generator";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const username = searchParams.get("username");

  if (!username) {
    return new NextResponse("Username is required", { status: 400 });
  }

  const includeContribs = searchParams.get("include_contribs") === "true";
  const limit = parseInt(searchParams.get("limit") || "5");
  const layout = (searchParams.get("layout") as any) || 'compact';
  const theme = searchParams.get("theme") || "default";

  const options: SvgOptions = {
    theme,
    bg_color: searchParams.get("bg_color") || undefined,
    title_color: searchParams.get("title_color") || undefined,
    text_color: searchParams.get("text_color") || undefined,
    icon_color: searchParams.get("icon_color") || undefined,
    border_color: searchParams.get("border_color") || undefined,
    hide_border: searchParams.get("hide_border") === "true",
    limit,
    layout,
    borderRadius: searchParams.get("borderRadius") ? parseInt(searchParams.get("borderRadius")!) : undefined,
    showGlow: searchParams.get("showGlow") === "true",
    animationSpeed: searchParams.get("animationSpeed") ? parseFloat(searchParams.get("animationSpeed")!) : undefined,
  };

  try {
    const userData = await fetchUserLanguages(username, includeContribs);
    const aggregated = aggregateLanguages(userData);
    const svg = generateLanguageSvg(aggregated, options);

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return new NextResponse(`<svg width="400" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="100" fill="#f8d7da" rx="8"/>
      <text x="20" y="55" fill="#721c24" font-family="sans-serif">Error: ${error.message}</text>
    </svg>`, { 
      status: 200, // Return 200 so it still renders as an image
      headers: { "Content-Type": "image/svg+xml" } 
    });
  }
}
