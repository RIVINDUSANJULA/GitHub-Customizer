/**
 * GitInfo Narrative Engine v4.0 (Zero-Hallucination Architect)
 * Generates elite GitHub biographies with strict architectural constraints and high-signal data mapping.
 */

interface BioOptions {
  username: string;
  title: string;
  skills: string[];
  socials: string[];
  vibe: 'professional' | 'creative' | 'minimalist' | 'technical' | 'elite';
  format: 'paragraph' | 'bullets' | 'mixed';
  length: 'short' | 'medium' | 'long';
  notes?: string;
  repoStack?: string[];
}

export function generateBio(options: BioOptions): string {
  const { username, title, skills, vibe, notes, repoStack } = options;
  
  const name = username || "Developer";
  const role = title || "Systems Architect";
  const rawSkills = skills.length > 0 ? skills : ["Next.js", "React 19", "Tailwind v4", "TypeScript", "Zustand v5"];
  const stack = (repoStack && repoStack.length > 0) ? repoStack : rawSkills;

  // British English Standard
  const BE = {
    optimised: "optimised",
    visualising: "visualising",
    architecting: "Architecting",
    synthesising: "Synthesising",
    abstracting: "Abstracting",
    deploying: "Deploying",
    modelling: "modelling",
    analysing: "analysing"
  };

  const context = {
    gitinfo: "**GitInfo** — a zero-config identity suite engineered to bypass GitHub caching via server-side proxy architecture.",
    education: "**IIT Sri Lanka / University of Westminster** — BEng (Hons) Software Engineering (Current).",
    career: "Specialising in Enterprise Architecture and **Cybersecurity (SOC Analyst)** path."
  };

  // 💼 [PROFESSIONAL MODE]
  // Focus: Career growth and institutional credibility.
  if (vibe === 'professional') {
    const sections = [
      `# Professional Summary`,
      `As a **${role}**, I focus on engineering high-performance digital ecosystems through ${BE.optimised} system design. My methodology prioritises scalability, architectural integrity, and the implementation of industry-standard patterns.`,
      `## Education & Certifications`,
      `* ${context.education}`,
      `* Focus: Enterprise Architecture & Information Security`,
      `## Technical Leadership`,
      `* **Project Lead:** ${context.gitinfo}`,
      `* **Research:** ${BE.synthesising} modern web mechanics with secure infrastructure.`
    ];
    return sections.join('\n\n');
  }

  // 🎨 [CREATIVE MODE]
  // Focus: Visual identity and UI/UX philosophy.
  if (vibe === 'creative') {
    const sections = [
      `# ✨ Designing Through the Glass Prism`,
      `I operate at the intersection of aesthetic brilliance and technical precision. As a **${role}**, I am **${BE.visualising}** environments where code is not just logic, but an art form.`,
      `## The Aesthetic Engine`,
      `* **Glassmorphism:** Depth, transparency, and blurred boundaries.`,
      `* **Neon Accents:** Defining clarity within high-contrast digital spaces.`,
      `* **Identity:** Architecting **GitInfo** as a living, breathing developer narrative.`,
      `## Vision`,
      `Code is the medium; performance is the masterpiece.`
    ];
    return sections.join('\n\n');
  }

  // ☁️ [MINIMALIST MODE]
  // Focus: Maximum signal, zero noise. (Strict 4-line limit)
  if (vibe === 'minimalist') {
    return [
      `# ${name.toUpperCase()}`,
      `**${role}** | ${context.education}`,
      `Architecting **GitInfo** • ${BE.abstracting} complexity • ${BE.optimised} output.`,
      `${stack.slice(0, 6).join(' • ')}`
    ].join('\n');
  }

  // ⚙️ [TECHNICAL MODE]
  // Focus: Architecture, Logic, and Performance.
  if (vibe === 'technical') {
    const sections = [
      `### // STACK_TRACE`,
      `\`\`\`text\n${stack.join(" | ")}\n\`\`\``,
      `### // LOG_DUMP`,
      `* **Subsystem:** \`GitInfo v1.0\``,
      `* **Architecture:** Server-side proxying for deterministic identity rendering.`,
      `* **Optimisation:** Addressing GitHub's caching bottleneck through ${BE.optimised} API gateways.`,
      `### // CURRENT_THREAD`,
      `* **Education:** ${context.education}`,
      `* **Vector:** ${context.career}`,
      `* **Status:** \`Active Process\``
    ];
    return sections.join('\n\n');
  }

  // 👑 [ELITE MODE]
  // Focus: The "Industry Leader" blend.
  const elite = {
    root: `## // IDENTITY_ROOT\n${BE.architecting} high-availability digital ecosystems as a **${role}**. Engineered for the 2026 technical landscape.`,
    logic: `## // CORE_LOGIC\n${BE.abstracting} complex requirements into scalable architectures. I am ${BE.analysing} the next generation of web mechanics, ensuring every deployment is ${BE.optimised} for peak performance and glassmorphic elegance.`,
    stack: `## // STACK_TRACE\n\`\`\`text\n${stack.join(" | ")}\n\`\`\``,
    process: `## // ACTIVE_PROCESS\nCurrently iterating on **GitInfo** — ${context.gitinfo}`,
    future: `## // FUTURE_STATE\nAdvancing academic research at **IIT Sri Lanka / University of Westminster**. Navigating towards a future in **SOC Analyst** operations.`,
    status: `Status: Currently iterating on GitInfo v1.0`
  };

  let bio = `${elite.root}\n\n${elite.logic}\n\n${elite.stack}\n\n${elite.process}\n\n${elite.future}\n\n---\n${elite.status}`;
  
  if (notes) {
    bio += `\n\n## // SUPPLEMENTARY_CONTEXT\n${notes}`;
  }
  
  return bio;
}
