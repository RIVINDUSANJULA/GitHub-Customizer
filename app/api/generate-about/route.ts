import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: NextRequest) {
  try {
    const { username, title, skills, socials, vibe, format, length } = await req.json();

    const systemPrompt = `
      You are an expert GitHub Profile Architect. Your goal is to write a high-quality "About Me" section for a developer's GitHub README.
      
      USER DATA:
      - Name: ${username}
      - Role: ${title}
      - Skills: ${skills.join(", ")}
      - Socials: ${socials.join(", ")}
      
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
