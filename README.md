<div align="center">

# 🪞 Identity Suite

**The ultimate, zero-config architect for interactive developer portfolios.**<br>
[Not Live Yet](#)

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg?style=flat-square)](https://www.gnu.org/licenses/agpl-3.0)
[![Next.js 16](https://img.shields.io/badge/Next.js_16-black?style=flat-square&logo=next.js)]()
[![React 19](https://img.shields.io/badge/React_19-087ea4?style=flat-square&logo=react)]()
[![Tailwind v4](https://img.shields.io/badge/Tailwind_v4-38bdf8?style=flat-square&logo=tailwind-css)]()
[![Zero Config](https://img.shields.io/badge/Setup-Zero_Config-brightgreen?style=flat-square)]()

<br />

<!--<img src="https://via.placeholder.com/1000x500/0a0a0a/00ffcc?text=Drop+a+Video/GIF+of+the+Glassmorphic+Builder+Here" alt="Identity Suite Interface" width="100%" style="border-radius: 16px; box-shadow: 0 0 30px rgba(0, 255, 204, 0.15);" /> 

<br />
<br />
-->

**Identity Suite** transforms static, boring Markdown files into interactive, high-end web components. Explore a drag-and-drop builder that generates real-time, glassmorphic developer profiles. Bypassing GitHub's strict image caching, this tool ensures your online presence is always live, uniquely styled, and context-aware.

</div>

---

## ✨ Core Architecture

We engineered this suite to bridge the gap between static Markdown and living web applications, all without requiring a single API key from the user.

<table width="100%">
  <tr>
    <td width="50%" valign="top">
      <h3>🪞 Elite Glassmorphism</h3>
      <p>A fully customizable UI engine supporting deep background blurs, independent element radiuses, and synchronized neon-glow borders. Adapts instantly to your personal brand colors.</p>
    </td>
    <td width="50%" valign="top">
      <h3>🧠 Deterministic Narrative Engine</h3>
      <p>Zero LLM APIs required. Our internal algorithmic engine parses your GitHub Repo Stack and rough notes to instantly generate a senior-level, professionally formatted biography locally.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🧩 Fluid Layout Manager</h3>
      <p>A robust drag-and-drop system powered by Zustand. Move your tech stack, bio, and socials around; the output Markdown re-generates instantly to match your exact visual hierarchy.</p>
    </td>
    <td width="50%" valign="top">
      <h3>🔗 Server-Side Identity Proxy</h3>
      <p>Bypasses GitHub's aggressive Camo proxy caching. It fetches and displays real-time social media avatars and connection statistics seamlessly in the background.</p>
    </td>
  </tr>
</table>

---

## 🛠️ Under The Hood

Standard GitHub READMEs cache images for weeks and rely on static text. Identity Suite uses custom Next.js Edge routes and advanced SVG styling to force real-time, dynamic updates.

| Feature / Input | Engineering Mechanic | Visual Result |
| :--- | :--- | :--- |
| **Social Handle** | API proxy + Cache bust hash (`?v=timestamp`) | Live avatar appears instantly, bypassing Camo cache. |
| **Profile Image** | Extracting image data to an SVG `<filter>` | Generates a perfectly synced "Aesthetic Blur" background. |
| **Career Status** | Inline SVG CSS `@keyframes` | A smooth, pulsing neon dot indicating live availability. |
| **Platform Default** | Scraper string detection | "Hijacks" ugly gray silhouettes and injects an Elite 3D User Icon. |

---

## ⚙️ The Tech Stack

Built on the absolute bleeding edge of the modern web ecosystem.

* **Framework:** Next.js 16 (App Router, Turbopack)
* **UI Library:** React 19
* **Styling:** Tailwind CSS v4 + `next-themes`
* **State Management:** Zustand v5
* **Motion & Animation:** Framer Motion v12
* **Narrative Synthesis:** Internal Deterministic Template Engine (Zero-API)
* **Markdown Compilation:** `react-markdown`

---

## 🚀 Quick Start (Zero-Config)

Because Identity Suite uses internal proxying and an algorithmic narrative engine, there are **zero external API keys or environment variables required** to run the core application. It works beautifully right out of the box.

```bash
# 1. Clone the repository
git clone [https://github.com/yourusername/identity-suite.git](https://github.com/yourusername/identity-suite.git)
cd identity-suite

# 2. Install bleeding-edge dependencies
npm install

# 3. Spin up the visual builder
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to launch the suite and start architecting your profile.

---

## 🤝 Contributing

Contributions are what make the open-source community an amazing place to learn, inspire, and create. Whether you're fixing a bug, adding a new social proxy, or improving the glassmorphic rendering, your help is **greatly appreciated**.

Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to submit pull requests and adhere to our architectural standards. 

*Note: By contributing, you explicitly agree that your code will be licensed under the AGPL-3.0.*

---

## ⚖️ License

This project is licensed under the **GNU Affero General Public License v3.0**. 

You are entirely free to fork, modify, and contribute to this repository. However, if you host a modified version of this application as a public-facing web service, you are legally obligated to open-source your modifications under the exact same AGPL-3.0 license. See the [LICENSE](LICENSE) file for complete details.

<br />

<div align="center">
  <b>Designed & Engineered by M. M. Rivindu Sanjula</b><br>
</div>