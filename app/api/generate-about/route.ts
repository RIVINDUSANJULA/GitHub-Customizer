import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: NextRequest) {
  try {
    const { username, title, skills, socials, vibe, format, length, notes, repoUrl } = await req.json();

    let githubContext = "";
    if (repoUrl && repoUrl.includes("github.com")) {
      try {
        const parts = repoUrl.replace("https://github.com/", "").split("/");
        const owner = parts[0];
        const repo = parts[1];

        if (owner && repo) {
          // Fetch Languages
          const langRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`);
          if (langRes.ok) {
            const langs = await langRes.json();
            githubContext += `\nRepository Technical Stack: ${Object.keys(langs).join(", ")}`;
          }

          // Fetch README for context
          const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
            headers: { 'Accept': 'application/vnd.github.v3.raw' }
          });
          if (readmeRes.ok) {
            const readme = await readmeRes.text();
            githubContext += `\nRepository README Insight: ${readme.substring(0, 1500)}`;
          }
        }
      } catch (err) {
        console.error("GitHub context fetch failed:", err);
      }
    }

    const systemPrompt = `
      You are an expert GitHub Profile Architect. Your goal is to write a high-quality "About Me" section for a developer's GitHub README.
      
      USER DATA:
      - Name: ${username}
      - Role: ${title}
      - Core Skills: ${skills.join(", ")}
      - Socials: ${socials.join(", ")}
      - Manual Notes from User: ${notes || "None provided"}
      ${githubContext}
      
      CONSTRAINTS:
      - Vibe: ${vibe}
      - Format: ${format}
      - Length: ${length}
      - Use GitHub Flavored Markdown (bolding, lists, emojis).
      - Do NOT use clichés like "passionate self-starter", "highly motivated", or "team player".
      - Ensure it sounds human, professional, and impressive.
      - Focus on technical stack and real-world impact.
      - Do NOT include placeholders like [Your Name]. Use the provided data.
    `;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ content: text });
  } catch (error: any) {
    console.error("AI Generation failed:", error);
    return NextResponse.json({ error: "Failed to generate bio" }, { status: 500 });
  }
}
