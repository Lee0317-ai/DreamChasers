# AI Photo Editor AI Gateway Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate AI Photo Editor from tool-local image provider calls to the platform AI Gateway, starting with AI beauty and keeping later image workflows behind explicit readiness gates.

**Architecture:** Keep the existing browser-side editor unchanged for local tools, and move only AI execution to the shared AI Gateway. Reuse platform readiness, request logging, error semantics, and credits, while preserving the current photo-editor async UX of submit, poll, and replace-image.

**Tech Stack:** Next.js App Router, TypeScript, existing `apps/web/src/lib/ai/**` Gateway runtime, photo-editor routes/components under `apps/web/src/app/api/tools/photo/**` and `apps/web/src/components/tools/photo/**`

---

### Task 1: Align image capabilities with the platform Gateway

**Files:**
- Modify: `apps/web/src/lib/ai/**`
- Modify: `apps/web/src/lib/tools/photo/photo-editor-data.ts`
- Test: `apps/web/src/lib/ai/__tests__/**`

- [ ] **Step 1: Define the first supported image capability**

Document and implement a single first-class capability for the beauty flow, centered on `image_edit`.

- [ ] **Step 2: Add Gateway-side validation**

Ensure the Gateway can reject unsupported image models, disabled providers, and dry-run-only states before photo routes attempt execution.

- [ ] **Step 3: Verify tests**

Run: `npm run test -w apps/web -- ai-gateway model-catalog`
Expected: PASS

### Task 2: Move AI beauty onto Gateway execution

**Files:**
- Modify: `apps/web/src/app/api/tools/photo/beauty/route.ts`
- Modify: `apps/web/src/app/api/tools/photo/beauty/tasks/**`
- Modify: `apps/web/src/lib/tools/photo/ai-image-provider.ts`
- Modify: `apps/web/src/lib/tools/photo/beauty-task-store.ts`
- Test: `apps/web/src/**/__tests__/*photo*`

- [ ] **Step 1: Keep the existing HTTP contract stable**

Preserve `beautyType`, upload validation, task creation, polling, and result replacement so the frontend does not need a large UX rewrite.

- [ ] **Step 2: Replace tool-local provider execution**

Remove direct tool ownership of provider selection and call the platform Gateway instead.

- [ ] **Step 3: Verify photo and Gateway tests**

Run: `npm run test -w apps/web -- ai-gateway photo`
Expected: PASS

### Task 3: Add governance visibility for image tasks

**Files:**
- Modify: `apps/web/src/lib/ai/account-ai-overview.ts`
- Modify: `apps/web/src/app/account/ai/**`
- Test: `apps/web/src/lib/ai/__tests__/account-ai-overview.test.ts`

- [ ] **Step 1: Ensure image tasks show up in request history**

Expose photo-editor image tasks with readable capability, route, status, and failure reason text.

- [ ] **Step 2: Verify tests**

Run: `npm run test -w apps/web -- account-ai-overview ai-gateway`
Expected: PASS

### Task 4: Prepare the second image workflow without implementing it

**Files:**
- Modify: `docs/modules/photo-editor/**`
- Modify: `docs/tasks/**`
- Modify: `docs/completion/**`

- [ ] **Step 1: Freeze the next-slice order**

Keep the order as `smart erase -> background replace -> upscale`, and do not add them to the first migration task.

- [ ] **Step 2: Record async and asset constraints**

Document temporary asset lifetime, task duration expectations, and why these features remain blocked until the first Gateway image flow is stable.

### Verification Matrix

After Task 1:

```bash
npm run test -w apps/web -- ai-gateway model-catalog
npm run typecheck -w apps/web
```

After Task 2:

```bash
npm run test -w apps/web -- ai-gateway photo
npm run typecheck -w apps/web
npm run build -w apps/web
```

After Task 3:

```bash
npm run test -w apps/web -- account-ai-overview ai-gateway
npm run typecheck -w apps/web
```

After Task 4:

```bash
npm run docs:sync
git diff --check
```
