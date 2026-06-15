import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

// Small terracotta "harness knot" mark, matching the source course's accent.
const brandLogo =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23D95C41" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12.1" y1="11.9" x2="18.9" y2="8.2"/><line x1="12.1" y1="12.1" x2="20.3" y2="12.9"/><line x1="12.2" y1="12.4" x2="16.6" y2="19.1"/><line x1="11.8" y1="12.4" x2="7.3" y2="19.2"/><line x1="11.9" y1="12.1" x2="3.7" y2="13.3"/><line x1="11.8" y1="11.7" x2="7.8" y2="4.4"/></svg>';

const lectures = [
  { text: "01 · Why Capable Agents Still Fail", link: "/lectures/lecture-01" },
  { text: "02 · What a Harness Actually Is", link: "/lectures/lecture-02" },
  { text: "03 · Repository as System of Record", link: "/lectures/lecture-03" },
  { text: "04 · Why One Giant Instruction File Fails", link: "/lectures/lecture-04" },
  { text: "05 · Why Long-Running Tasks Lose Continuity", link: "/lectures/lecture-05" },
  { text: "06 · Why Initialization Needs Its Own Phase", link: "/lectures/lecture-06" },
  { text: "07 · Why Agents Overreach and Under-Finish", link: "/lectures/lecture-07" },
  { text: "08 · Why Feature Lists Are Harness Primitives", link: "/lectures/lecture-08" },
  { text: "09 · Why Agents Declare Victory Too Early", link: "/lectures/lecture-09" },
  { text: "10 · Why End-to-End Testing Changes Results", link: "/lectures/lecture-10" },
  { text: "11 · Why Observability Belongs Inside the Harness", link: "/lectures/lecture-11" },
  { text: "12 · Why Every Session Must Leave a Clean State", link: "/lectures/lecture-12" },
];

const projects = [
  { text: "Overview", link: "/projects/" },
  { text: "01 · Baseline vs Minimal Harness", link: "/projects/project-01" },
  { text: "02 · Agent-Readable Workspace", link: "/projects/project-02" },
  { text: "03 · Multi-Session Continuity", link: "/projects/project-03" },
  { text: "04 · Incremental Indexing", link: "/projects/project-04" },
  { text: "05 · Grounded QA & Verification", link: "/projects/project-05" },
  { text: "06 · Runtime Observability & Debugging", link: "/projects/project-06" },
];

const templates = [
  { text: "Overview", link: "/templates/" },
  { text: "AGENTS.md", link: "/templates/AGENTS" },
  { text: "CLAUDE.md", link: "/templates/CLAUDE" },
  { text: "claude-progress.md", link: "/templates/claude-progress" },
  { text: "session-handoff.md", link: "/templates/session-handoff" },
  { text: "clean-state-checklist.md", link: "/templates/clean-state-checklist" },
  { text: "evaluator-rubric.md", link: "/templates/evaluator-rubric" },
  { text: "quality-document.md", link: "/templates/quality-document" },
];

const sops = [
  { text: "Encode Knowledge Into the Repo", link: "/sops/encode-knowledge-into-repo" },
  { text: "Layered Domain Architecture", link: "/sops/layered-domain-architecture" },
  { text: "Observability Feedback Loop", link: "/sops/observability-feedback-loop" },
  { text: "Chrome DevTools Validation Loop", link: "/sops/chrome-devtools-validation-loop" },
];

const reference = [
  { text: "Method Map", link: "/reference/method-map" },
  { text: "Coding-Agent Startup Flow", link: "/reference/coding-agent-startup-flow" },
  { text: "Initializer-Agent Playbook", link: "/reference/initializer-agent-playbook" },
  { text: "Prompt Calibration", link: "/reference/prompt-calibration" },
];

export default withMermaid(
  defineConfig({
    title: "Harness Engineering",
    description:
      "Baha's personal harness-engineering knowledge base, adapted for Claude Code — lectures, projects, and copy-ready templates.",
    lang: "en-US",
    // Local dev/build serve from "/"; GitHub Pages sets DOCS_BASE=/harness-engineering/.
    base: process.env.DOCS_BASE || "/",
    cleanUrls: true,
    ignoreDeadLinks: false,
    head: [["link", { rel: "icon", href: brandLogo }]],
    themeConfig: {
      logo: brandLogo,
      nav: [
        { text: "Home", link: "/" },
        { text: "Lectures", link: "/lectures/lecture-01" },
        { text: "Projects", link: "/projects/" },
        {
          text: "Resources",
          items: [
            { text: "Templates", link: "/templates/" },
            { text: "SOPs", link: "/sops/encode-knowledge-into-repo" },
            { text: "Reference", link: "/reference/method-map" },
            { text: "Repo Template", link: "/repo-template/" },
          ],
        },
      ],
      sidebar: {
        "/lectures/": [{ text: "Lectures", items: lectures }],
        "/projects/": [{ text: "Projects", items: projects }],
        "/templates/": [{ text: "Templates", items: templates }],
        "/sops/": [{ text: "SOPs", items: sops }],
        "/reference/": [{ text: "Reference", items: reference }],
        "/repo-template/": [{ text: "Repo Template", items: [{ text: "Overview", link: "/repo-template/" }] }],
      },
      outline: { level: [2, 3], label: "On this page" },
      socialLinks: [
        { icon: "github", link: "https://github.com/walkinglabs/learn-harness-engineering" },
      ],
      footer: {
        message:
          'Adapted for Baha\'s Claude Code harness. Source: <a href="https://walkinglabs.github.io/learn-harness-engineering/">Learn Harness Engineering</a>.',
        copyright: "Personal study notes — not affiliated with the original authors.",
      },
      search: { provider: "local" },
    },
  })
);
