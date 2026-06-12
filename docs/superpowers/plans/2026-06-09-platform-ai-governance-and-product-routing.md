# Platform AI Governance And Product Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the next platform slice after T146-T148 by hardening AI governance first, then routing PDF toolbox and AI photo editor integrations through the same platform rules.

**Architecture:** This plan treats account AI pages as the control and observation surface, while AI Gateway remains the execution and enforcement layer. The first implementation wave upgrades the account AI page, adds provider readiness and environment governance, standardizes runtime errors and request log semantics, and only then connects the next station product capability.

**Tech Stack:** Next.js App Router, TypeScript, Prisma/PostgreSQL, Auth.js session helpers, existing account wallet and ledger services, existing AI Gateway runtime, Vitest, browser verification.

---

## 1. Scope

This plan implements the platform-governance-first route defined by T149.

In scope:

- Upgrade `/account/ai/credits` into a first-phase AI governance surface.
- Add provider readiness and environment-based runtime state.
- Standardize AI Gateway runtime error codes and request log semantics.
- Define and implement the first station-product AI integration after governance hardening.
- Keep TimePick as a validated peer product, not the next priority lane.

Out of scope:

- Persisting user provider keys.
- Automatic multi-provider routing.
- Full operations console, alerting system, or job queue.
- Payment, subscription, KMS, Key Vault, or workflow orchestration.
- A full AI photo editor provider rollout in this same execution slice.

## 2. Planned Files

Create:

- `apps/web/src/lib/ai/provider-readiness.ts`
  Central provider readiness evaluator based on runtime env requirements.

- `apps/web/src/lib/ai/error-display.ts`
  Shared translation of gateway error codes into readable UI labels and descriptions.

- `apps/web/src/lib/ai/__tests__/provider-readiness.test.ts`
  Verifies readiness states and missing-env classification.

- `apps/web/src/lib/ai/__tests__/error-display.test.ts`
  Verifies human-readable mapping for standard gateway error codes.

- `docs/completion/2026-06-09-task-149-platform-ai-governance-and-product-routing-plan.md`
  Completion note for the planning task once accepted.

Modify:

- `apps/web/src/app/account/ai/credits/page.tsx`
  Add runtime status panel, request status filtering, and readable failure reasons.

- `apps/web/src/lib/account/account-data.ts`
  Expand account dashboard payload for AI governance display.

- `apps/web/src/lib/ai/account-ai-overview.ts`
  Add runtime summaries and any presentation helpers required by the account page.

- `apps/web/src/lib/ai/model-catalog.ts`
  Keep catalog metadata aligned with provider readiness and governance display.

- `apps/web/src/lib/ai/ai-gateway.ts`
  Normalize error semantics and runtime readiness checks.

- `apps/web/src/lib/timepick/**`
  Only if needed to align existing TimePick routes with standardized gateway error semantics.

- `docs/tasks/**`, `docs/progress/**`, `docs/completion/**`
  Task tracking for T150-T154 as each execution slice lands.

## 3. Task Decomposition

### Task 1: Account AI Governance Surface

**Files:**

- Modify: `apps/web/src/app/account/ai/credits/page.tsx`
- Modify: `apps/web/src/lib/account/account-data.ts`
- Modify: `apps/web/src/lib/ai/account-ai-overview.ts`
- Test: `apps/web/src/lib/ai/__tests__/account-ai-overview.test.ts`

- [ ] **Step 1: Write the failing test for runtime summaries**

Add cases that assert the account AI overview can summarize active capabilities, request counts, and provider runtime states for mixed ready and misconfigured providers.

- [ ] **Step 2: Run the targeted test**

Run: `npm run test -w apps/web -- account-ai-overview`
Expected: FAIL because provider runtime summary fields are not implemented yet.

- [ ] **Step 3: Implement runtime summary helpers**

Add helpers in `apps/web/src/lib/ai/account-ai-overview.ts` so the account page can render capability cards, provider statuses, and request count summaries without duplicating logic in the page component.

- [ ] **Step 4: Expand account dashboard payload**

Update `apps/web/src/lib/account/account-data.ts` to expose the AI request data needed by the page, including `errorCode`, `credentialSource`, and the minimal fields necessary for request filtering and readable failure states.

- [ ] **Step 5: Upgrade the account AI page**

Modify `apps/web/src/app/account/ai/credits/page.tsx` to add:

```text
Capability catalog
Runtime status
Recent requests with All / Succeeded / Failed filter
Readable failure reason labels
Recent ledger
```

The page remains an observation and explanation surface, not an editable operations console.

- [ ] **Step 6: Re-run the targeted test**

Run: `npm run test -w apps/web -- account-ai-overview`
Expected: PASS

- [ ] **Step 7: Run page-level verification**

Run:

```bash
npm run typecheck -w apps/web
npm run build -w apps/web
```

Expected: both pass.

### Task 2: Provider Readiness And Environment Governance

**Files:**

- Create: `apps/web/src/lib/ai/provider-readiness.ts`
- Create: `apps/web/src/lib/ai/__tests__/provider-readiness.test.ts`
- Modify: `apps/web/src/lib/ai/model-catalog.ts`
- Modify: `apps/web/src/lib/ai/account-ai-overview.ts`

- [ ] **Step 1: Write the failing readiness test**

Create tests that cover:

- `mock` => `dry_run_only`
- missing OpenAI-compatible env => `misconfigured`
- explicitly disabled provider => `disabled`
- configured provider => `enabled`

- [ ] **Step 2: Run the readiness test**

Run: `npm run test -w apps/web -- provider-readiness`
Expected: FAIL because the readiness evaluator does not exist yet.

- [ ] **Step 3: Implement provider readiness**

Create `apps/web/src/lib/ai/provider-readiness.ts` with a small evaluator that reads runtime env and returns:

```ts
type ProviderRuntimeStatus = "enabled" | "misconfigured" | "disabled" | "dry_run_only";
```

Include human-readable reason strings for missing configuration where needed.

- [ ] **Step 4: Thread readiness into catalog-facing summaries**

Update account overview helpers so the account AI page can show each provider's status, dry-run mode, and readiness reason.

- [ ] **Step 5: Re-run the readiness test**

Run: `npm run test -w apps/web -- provider-readiness`
Expected: PASS

- [ ] **Step 6: Run integration safety checks**

Run:

```bash
npm run test -w apps/web -- account-ai-overview model-catalog ai-gateway
npm run typecheck -w apps/web
```

Expected: PASS

### Task 3: Standard Error Codes And Request Log Semantics

**Files:**

- Create: `apps/web/src/lib/ai/error-display.ts`
- Create: `apps/web/src/lib/ai/__tests__/error-display.test.ts`
- Modify: `apps/web/src/lib/ai/ai-gateway.ts`
- Modify: `apps/web/src/app/account/ai/credits/page.tsx`
- Modify: `apps/web/src/lib/timepick/**` as needed for consistent translation only

- [ ] **Step 1: Write the failing error-display test**

Add cases for:

- `unauthorized`
- `insufficient_credits`
- `provider_unavailable`
- `provider_misconfigured`
- `model_not_allowed`
- `capability_not_supported`
- `execution_failed`

- [ ] **Step 2: Run the test**

Run: `npm run test -w apps/web -- error-display`
Expected: FAIL because the display mapper does not exist yet.

- [ ] **Step 3: Implement readable error translation**

Create `apps/web/src/lib/ai/error-display.ts` with a stable mapping from gateway error code to UI label and explanation text.

- [ ] **Step 4: Harden gateway semantics**

Update `apps/web/src/lib/ai/ai-gateway.ts` so readiness and provider failures consistently surface one of the standardized error codes instead of ad hoc runtime errors.

- [ ] **Step 5: Render readable failure reasons**

Update the account AI page to display translated failure labels in the recent request section, using `errorCode` rather than raw internal strings.

- [ ] **Step 6: Re-run the targeted tests**

Run:

```bash
npm run test -w apps/web -- error-display ai-gateway mock-provider timepick-fortune-chat timepick-recognition
```

Expected: PASS

- [ ] **Step 7: Run build verification**

Run:

```bash
npm run typecheck -w apps/web
npm run build -w apps/web
```

Expected: PASS

### Task 4: PDF Toolbox First AI Capability

**Files:**

- Modify: `apps/web/src/app/tools/pdf-toolbox/**`
- Modify: `apps/web/src/modules/tools/pdf-toolbox/**`
- Modify: `apps/web/src/lib/ai/**`
- Modify: `docs/modules/pdf-toolbox/**`
- Test: `apps/web` pdf and ai tests

- [ ] **Step 1: Confirm the first capability choice**

Use the T144 roadmap and T149 governance rules to freeze one first capability before writing code. Recommended order:

```text
PDF summary
or
page-level translation
```

Avoid OCR-heavy or full-editor features in the first slice.

- [ ] **Step 2: Write the failing product test**

Add one focused test that proves the selected PDF capability:

- resolves through the model catalog,
- routes through AI Gateway,
- charges platform credits,
- records an auditable request log.

- [ ] **Step 3: Run the failing test**

Run the targeted pdf and ai test command.
Expected: FAIL because the PDF capability is not yet wired.

- [ ] **Step 4: Implement the minimal route and UI wiring**

Keep the first integration intentionally narrow: one user-triggered action, one gateway call, one result panel, one request log trail.

- [ ] **Step 5: Re-run the tests**

Run:

```bash
npm run test -w apps/web -- pdf ai-gateway
npm run typecheck -w apps/web
npm run build -w apps/web
```

Expected: PASS

- [ ] **Step 6: Run browser verification**

Verify the selected PDF action in desktop and mobile layouts, and confirm the request appears in the account AI governance surface.

### Task 5: AI Photo Editor Integration Planning

**Files:**

- Modify: `docs/modules/photo-editor/**`
- Modify: `docs/tasks/**`
- Modify: `docs/progress/**`
- Modify: `docs/completion/**`

- [ ] **Step 1: Write the planning task record**

Create the planning task notes for T154, anchored to the T149 governance rules.

- [ ] **Step 2: Define capability split**

Document which photo-editor actions can start as:

- mock or dry-run,
- platform pool only,
- blocked until a real image provider exists.

- [ ] **Step 3: Define provider constraints**

Record which features require:

- image edit
- image generation
- image understanding

and which of them need asynchronous workflow or heavy result handling.

- [ ] **Step 4: Save the planning artifacts**

Update the relevant module docs and task records so the photo-editor line is ready for a later implementation task without creating a second, tool-specific model stack.

## 4. Verification Matrix

After Task 1:

```bash
npm run test -w apps/web -- account-ai-overview
npm run typecheck -w apps/web
npm run build -w apps/web
```

After Task 2:

```bash
npm run test -w apps/web -- provider-readiness account-ai-overview model-catalog ai-gateway
npm run typecheck -w apps/web
```

After Task 3:

```bash
npm run test -w apps/web -- error-display ai-gateway mock-provider timepick-fortune-chat timepick-recognition
npm run typecheck -w apps/web
npm run build -w apps/web
```

After Task 4:

```bash
npm run test -w apps/web -- pdf ai-gateway
npm run typecheck -w apps/web
npm run build -w apps/web
npm run docs:sync
git diff --check
```

After Task 5:

```bash
npm run docs:sync
git diff --check
```

## 5. Self-Review

Spec coverage:

- Account AI governance surface: covered by Task 1.
- Provider readiness and env governance: covered by Task 2.
- Standardized errors and log semantics: covered by Task 3.
- PDF toolbox first station-product integration: covered by Task 4.
- AI photo editor next-step planning: covered by Task 5.

Placeholder scan:

- No `TBD`, `TODO`, or deferred placeholder phrases remain in the planned tasks.

Type consistency:

- Runtime provider states consistently use `enabled`, `misconfigured`, `disabled`, and `dry_run_only`.
- Error codes consistently use the T149-approved gateway set.
