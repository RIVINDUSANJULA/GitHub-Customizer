import { NextRequest, NextResponse } from "next/server";
import { fetchUserLanguages, aggregateLanguages } from "@/lib/github-api";
import { generateLanguageSvg, generateErrorSvg, SvgOptions } from "@/lib/svg-generator";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const username = searchParams.get("username");

  // Default headers for SVG and Caching
  const headers = {
    "Content-Type": "image/svg+xml",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
  };

  if (!username) {
    return new NextResponse(generateErrorSvg("Username is required"), { status: 200, headers });
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
    blockRadius: searchParams.get("blockRadius") ? parseInt(searchParams.get("blockRadius")!) : undefined,
    elementRadius: searchParams.get("elementRadius") ? parseInt(searchParams.get("elementRadius")!) : undefined,
    showGlow: searchParams.get("showGlow") === "true",
    animationSpeed: searchParams.get("animationSpeed") ? parseFloat(searchParams.get("animationSpeed")!) : undefined,
    donutHoleSize: searchParams.get("donutHoleSize") ? parseInt(searchParams.get("donutHoleSize")!) : undefined,
    startAngle: searchParams.get("startAngle") ? parseInt(searchParams.get("startAngle")!) : undefined,
    barHeight: searchParams.get("barHeight") ? parseInt(searchParams.get("barHeight")!) : undefined,
    cardsPerRow: searchParams.get("cardsPerRow") ? parseInt(searchParams.get("cardsPerRow")!) : undefined,
    shadowDepth: searchParams.get("shadowDepth") ? parseInt(searchParams.get("shadowDepth")!) : undefined,
    bg_type: (searchParams.get("bgType") as any) || 'solid',
    bg_color_2: searchParams.get("bgColor2") || undefined,
  };

  try {
    const userData = await fetchUserLanguages(username, includeContribs);
    const aggregated = aggregateLanguages(userData);
    const svg = generateLanguageSvg(aggregated, options);

    return new NextResponse(svg, { headers });
  } catch (error: any) {
    console.error("API Route Error:", error);
    const errorMsg = error.message || "Failed to fetch data";
    return new NextResponse(generateErrorSvg(errorMsg, theme), { status: 200, headers });
  }
}
