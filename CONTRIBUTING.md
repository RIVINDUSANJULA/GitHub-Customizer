# Contributing to the Next-Gen GitHub Profile & GitInfo

First off, thank you for considering contributing to this project! It's people like you that make the open-source community such an amazing place to learn, inspire, and create. 

This document provides guidelines and workflows for contributing to the repository. Please read it carefully to ensure a smooth collaboration.

---

## ⚖️ Important Legal Notice (AGPL-3.0)

This project is strictly licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. 

**By submitting a Pull Request, you explicitly agree that:**
1. All of your contributions will be licensed under the AGPL-3.0.
2. You have the right to submit the code you are contributing.
3. You understand that if anyone (including you) hosts a modified version of this application as a public web service, the modified source code must be made public under the AGPL-3.0.

---

## 🚀 How Can I Contribute?

### 1. Reporting Bugs
If you find a bug, please open an issue in the repository. Include as much detail as possible:
* **Description:** A clear and concise description of what the bug is.
* **Steps to Reproduce:** How can we trigger this bug?
* **Expected Behavior:** What did you expect to happen?
* **Environment:** Your OS, Browser, and Node.js version.
* **Screenshots:** Visual proof of UI/UX breaks (especially related to the Glassmorphism engine).

### 2. Suggesting Enhancements
We are always looking to expand the **GitInfo**. If you have an idea for a new widget, a better layout engine mechanism, or a new social media proxy integration, please open an "Enhancement" issue to discuss it before you start coding.

### 3. Submitting Pull Requests
To contribute code, follow this standard GitHub workflow:

1. **Fork the Repository** to your own GitHub account.
2. **Clone the Project** to your local machine.
   ```bash
   git clone [https://github.com/RIVINDUSANJULA/GitInfo.git]
   cd GitInfo
   ```
3. **Create a Branch** for your feature or bug fix. Use a descriptive name:
   ```bash
   git checkout -b feature/amazing-new-widget
   # or
   git checkout -b fix/proxy-timeout-bug
   ```
4. **Make your changes.** Ensure your code follows the project's style guide (see below).
5. **Commit your changes** using clear, descriptive commit messages.
   ```bash
   git commit -m "feat: added new glassmorphic badge component"
   ```
6. **Push to your branch:**
   ```bash
   git push origin feature/amazing-new-widget
   ```
7. **Open a Pull Request (PR)** against the `main` branch of the original repository. Provide a detailed description of what you changed and why.

---

## 🛠️ Local Development Setup

To run the Next.js environment locally:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file for any required backend secrets (e.g., Narrative Engine keys).
3. Start the dev server:
   ```bash
   npm run dev
   ```

---

## 🎨 Architecture & Style Guidelines

To maintain the high-end "SaaS" feel of this project, please adhere to the following technical and design principles:

* **UI/UX Aesthetics:** All new visual components must respect the core **Glassmorphism** theme. Utilize `backdrop-filter`, proper opacity layering, and the global Neon Glow configuration. Avoid flat, solid colors unless used as strict fallbacks.
* **State Management:** We use **Zustand** for global state and the drag-and-drop Layout Engine. Do not introduce Redux or Context API for core layout states to prevent performance bottlenecks.
* **Server-Side Proxying:** If you are adding a new data fetcher (e.g., a new social media scraper), it **must** be routed through the Next.js `/api` endpoints to bypass GitHub's Camo caching. Do not make direct client-side fetches to external platforms if they are prone to CORS errors.
* **Performance:** Ensure heavy SVG animations (like the Pulse dots) utilize internal CSS `@keyframes` rather than JavaScript-based animation libraries whenever possible to keep the markdown output lightweight.