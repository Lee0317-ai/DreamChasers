# Sitewide Naturecore UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the selected Hybrid Portal Naturecore style across DreamChasers while keeping tool workflows usable.

**Architecture:** Reuse the existing React component structure and make the visual system mostly CSS-driven. The homepage gets a stronger immersive portal treatment, while channel, auth, and account pages share dark glass components and restrained motion.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS in `apps/web/src/app/globals.css`, existing Vitest/Next build pipeline.

---

### Task 1: Homepage Immersive Portal

**Files:**
- Modify: `apps/web/src/components/HomeExperience.tsx`
- Modify: `apps/web/src/app/globals.css`

- [ ] Replace the left/right split homepage with a single `portal-home` scene containing account links, a central title, portal ring, and two entry cards.
- [ ] Add CSS for the homepage background using gradients, tree silhouettes, a moon/portal ring, and card hover effects.
- [ ] Keep `/tools` and `/games` links obvious on desktop and mobile.

### Task 2: Shared Navigation And Channel Pages

**Files:**
- Modify: `apps/web/src/components/AppHeader.tsx`
- Modify: `apps/web/src/components/ChannelPage.tsx`
- Modify: `apps/web/src/components/PortalCard.tsx`
- Modify: `apps/web/src/components/PortalModal.tsx`
- Modify: `apps/web/src/app/globals.css`

- [ ] Keep existing navigation links and route behavior.
- [ ] Restyle the top nav as a dark glass bar with gold/cyan active states.
- [ ] Restyle `/tools` and `/games` channel pages as dark console pages with light background texture, search, filters, glass cards, and modal styling.
- [ ] Add local card pointer coordinates only if needed; otherwise use CSS hover effects.

### Task 3: Authentication Page Skin

**Files:**
- Modify: `apps/web/src/app/globals.css`
- Inspect only if needed: `apps/web/src/app/login/page.tsx`, `apps/web/src/app/register/page.tsx`, `apps/web/src/app/forgot-password/page.tsx`, `apps/web/src/app/reset-password/page.tsx`

- [ ] Reuse existing auth markup.
- [ ] Restyle `.account-auth-page` and `.account-auth-panel` to match the Naturecore glass system.
- [ ] Preserve form labels, validation, links, and button behavior.

### Task 4: Tool/Game Outer Compatibility

**Files:**
- Modify if necessary: `apps/web/src/modules/tools/pdf-toolbox/components/PdfToolbox.tsx`
- Modify if necessary: `apps/web/src/modules/games/hulebu/HulebuGamePage.module.css`
- Modify: `apps/web/src/app/globals.css`

- [ ] Avoid rewriting PDF and game business components.
- [ ] Ensure the shared dark page background does not break PDF toolbox readability.
- [ ] Leave AI photo editor and Hulebu fullscreen pages alone where their app shell is intentionally hidden.

### Task 5: Verification And Docs

**Files:**
- Modify: `docs/tasks/items/T158-sitewide-naturecore-ui-planning.md`
- Modify: `docs/tasks/claims/T158-lee.md`
- Modify: `docs/progress/2026-06-12-lee.md`
- Create: `docs/completion/2026-06-12-task-158-sitewide-naturecore-ui.md`

- [ ] Run targeted tests: `npm run test -w apps/web -- account-ai-overview model-catalog ai-gateway account-ai-config pdf hulebu`.
- [ ] Run `npm run typecheck -w apps/web`.
- [ ] Run `npm run build -w apps/web`.
- [ ] Check `/`, `/tools`, `/games`, `/login`, and `/account/ai/credits` in the in-app browser on desktop and mobile.
- [ ] Run `npm run docs:sync`.
- [ ] Run full `git diff --check` and a T158-scoped diff check if generated Prisma files still block the full check.

## Self-Review

- Spec coverage: Covers homepage background, channel pages, auth pages, account continuity, and tool-workspace restraint.
- Placeholder scan: No placeholder implementation tasks remain; docs task will fill verification after execution.
- Type consistency: No new TypeScript interfaces are required; existing component props remain unchanged.
