import { NextRequest, NextResponse } from "next/server";
import { fetchUserLanguages, aggregateLanguages, aggregateSkills } from "@/lib/github-api";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const username = searchParams.get("username");

  if (!username) {
    return new NextResponse("Username is required", { status: 400 });
  }

  const includeContribs = searchParams.get("include_contribs") === "true";

  try {
    const userData = await fetchUserLanguages(username, includeContribs);
    const languages = aggregateLanguages(userData);
    const skills = aggregateSkills(userData);

    return NextResponse.json({ languages, skills });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return new NextResponse(error.message, { status: 500 });
  }
}
