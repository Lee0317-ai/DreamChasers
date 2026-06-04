# TimePick Tag API Cutover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move TimePick tag read and tag management flows from Supabase to DreamChasers resources API.

**Architecture:** Keep tags as an array field on resources. Fetch all current-user resources through `fetchTimePickResourceView`, derive tag statistics in the TimePick API client, and update resource tags with `updateTimePickResource`.

**Tech Stack:** Vite React, TypeScript, existing DreamChasers TimePick API client, existing TimePick components.

---

### Task 1: Document And Claim T124

**Files:**
- Modify: `docs/tasks/CHANGE_INTAKE.md`
- Modify: `docs/tasks/NEXT_ID.md`
- Create: `docs/tasks/items/T124-timepick-tag-api-cutover.md`
- Create: `docs/tasks/claims/T124-lee.md`
- Create: `docs/superpowers/plans/2026-06-04-timepick-tag-api-cutover.md`

- [x] **Step 1: Register IDEA-20260604-08**

Record scope, non-goals, affected files, validation commands, and assign T124.

- [x] **Step 2: Create item and claim shards**

Set T124 status to `进行中`, owner `Lee`, allowed files, forbidden files, and validation commands.

- [x] **Step 3: Advance NEXT_ID**

Change `docs/tasks/NEXT_ID.md` from `124` to `125`.

### Task 2: Red Checks

**Files:**
- Read: `/Users/lee/Desktop/Lee/TimePick/src/components/TagCloud.tsx`
- Read: `/Users/lee/Desktop/Lee/TimePick/src/components/TagTree.tsx`
- Read: `/Users/lee/Desktop/Lee/TimePick/src/components/TagManageDialog.tsx`

- [ ] **Step 1: Run static red check**

Run:

```bash
node -e "const fs=require('fs'); for (const f of ['src/components/TagCloud.tsx','src/components/TagTree.tsx','src/components/TagManageDialog.tsx']) { const s=fs.readFileSync('/Users/lee/Desktop/Lee/TimePick/'+f,'utf8'); if (/integrations\/supabase|supabase\.|\.from\('resources'\)|\.rpc\('(delete_tag|rename_tag)'\)/.test(s)) process.exit(1); }"
```

Expected: exit 1 before implementation, because the three components still use Supabase.

### Task 3: API Client Helpers

**Files:**
- Modify: `/Users/lee/Desktop/Lee/TimePick/src/lib/timepick-api.ts`

- [ ] **Step 1: Extend resource payload patch**

Add `tags` to `TimePickResourcePayloadPatch`.

- [ ] **Step 2: Preserve tag overrides in payload builder**

Change the payload builder to use `patch.tags ?? resource.tags ?? null`.

- [ ] **Step 3: Add tag statistics helper**

Add `getTimePickTagStats(resources: Resource[])` that counts non-empty tags and sorts by count descending, then locale name ascending.

### Task 4: Tag Read Components

**Files:**
- Modify: `/Users/lee/Desktop/Lee/TimePick/src/components/TagCloud.tsx`
- Modify: `/Users/lee/Desktop/Lee/TimePick/src/components/TagTree.tsx`

- [ ] **Step 1: Replace Supabase imports**

Remove Supabase imports and import `fetchTimePickResourceView` plus `getTimePickTagStats`.

- [ ] **Step 2: Fetch resources from DreamChasers**

Use `fetchTimePickResourceView({ displayMode: "resource-only", selectedType: "all" })` in each loader.

- [ ] **Step 3: Keep existing UI behavior**

Keep loading state, empty state, tag selection, grouping, and tracking behavior unchanged.

### Task 5: Tag Management Dialog

**Files:**
- Modify: `/Users/lee/Desktop/Lee/TimePick/src/components/TagManageDialog.tsx`

- [ ] **Step 1: Replace Supabase imports**

Remove Supabase and `useAuth` imports. Import `Resource`, `fetchTimePickResourceView`, `getTimePickTagStats`, `buildTimePickResourcePayload`, and `updateTimePickResource`.

- [ ] **Step 2: Store loaded resources**

Keep `resources` state so delete, rename, and add operations update the same current-user resource set returned by DreamChasers API.

- [ ] **Step 3: Delete tag by resource updates**

For resources containing the tag, call `updateTimePickResource(resource.id, buildTimePickResourcePayload(resource, { tags: filteredTags }))`.

- [ ] **Step 4: Rename tag by resource updates**

For resources containing the old tag, replace it with the trimmed new tag, de-duplicate tags, and call `updateTimePickResource`.

- [ ] **Step 5: Add tag to first resource**

Match existing behavior: if at least one resource exists, add the new tag to the first resource; if no resources exist, show `请先创建一个资源后再添加标签`.

### Task 6: Verification And Docs

**Files:**
- Modify: `docs/tasks/items/T124-timepick-tag-api-cutover.md`
- Modify: `docs/tasks/claims/T124-lee.md`
- Modify: `docs/progress/2026-06-04-lee.md`
- Create: `docs/completion/2026-06-04-task-T124-timepick-tag-api-cutover.md`

- [ ] **Step 1: Run static green check**

Run the same static command from Task 2. Expected: exit 0.

- [ ] **Step 2: Run targeted ESLint**

Run:

```bash
npx eslint src/lib/dreamchasers-auth.ts src/lib/timepick-api.ts src/components/TagCloud.tsx src/components/TagTree.tsx src/components/TagManageDialog.tsx
```

Expected: exit 0.

- [ ] **Step 3: Run TimePick build**

Run:

```bash
npm run build
```

Expected: exit 0. Existing Vite chunk-size warnings are acceptable.

- [ ] **Step 4: Browser verification**

Use Kimi WebBridge against `http://localhost:8080`; create a temporary resource with tag `t124-old`, open tag management, add `t124-new`, rename `t124-old` to `t124-renamed`, delete `t124-renamed`, then delete the temporary resource. Confirm DreamChasers `PATCH /api/timepick/resources/:id` returns 200 for tag writes.

- [ ] **Step 5: Sync docs and check diffs**

Run:

```bash
npm run docs:sync
git diff --check
```

Also run `git diff --check` in `/Users/lee/Desktop/Lee/TimePick`.
