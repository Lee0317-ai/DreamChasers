# Account Auth Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add password reset, password change, and resend verification email flows to the email-password account system.

**Architecture:** Keep auth behavior in `apps/web/src/lib/auth/**` with pure helpers for token, email, and password validation. Route files remain thin App Router pages that post to server actions. Reuse Auth.js `VerificationToken` for password reset tokens and the existing Nodemailer verification provider for email verification resend.

**Tech Stack:** Next.js App Router, React Server Components, Server Actions, Auth.js, Prisma, Vitest, Nodemailer, TypeScript.

---

## File Structure

- Create `apps/web/src/lib/auth/recovery.ts`: token identifiers, reset token hashing, reset input validation.
- Create `apps/web/src/lib/auth/__tests__/recovery.test.ts`: pure recovery helper tests.
- Modify `apps/web/src/lib/auth/email-login.ts`: add reset-password email builder and generic SMTP send helper.
- Modify `apps/web/src/lib/auth/__tests__/email-login.test.ts`: cover reset email copy.
- Modify `apps/web/src/lib/auth/actions.ts`: add request password reset, complete reset, change password, resend verification actions.
- Modify `apps/web/src/app/login/page.tsx`: add forgot-password link.
- Create `apps/web/src/app/forgot-password/page.tsx`: password reset request form.
- Create `apps/web/src/app/reset-password/page.tsx`: new password form.
- Modify `apps/web/src/app/login/check-email/page.tsx`: accept mode copy for verification or password reset.
- Modify `apps/web/src/app/login/error/page.tsx`: add new reason copy and resend verification form.
- Modify `apps/web/src/app/account/security/page.tsx`: add change password and resend verification forms.
- Modify `apps/web/src/app/globals.css`: only add missing compact form styles if current classes do not cover new forms.
- Update T138 docs and completion records.

## Tasks

### Task 1: Recovery Helpers

- [ ] Write failing tests for email normalization, password reset identifier, token hashing, expiry, and password input validation in `apps/web/src/lib/auth/__tests__/recovery.test.ts`.
- [ ] Run `npm run test -w apps/web -- recovery` and confirm it fails because `recovery.ts` does not exist.
- [ ] Implement `apps/web/src/lib/auth/recovery.ts` with `normalizeAuthEmail`, `buildPasswordResetIdentifier`, `createPasswordResetToken`, `hashPasswordResetToken`, and `validatePasswordPair`.
- [ ] Run `npm run test -w apps/web -- recovery` and confirm it passes.

### Task 2: Email Copy

- [ ] Add failing test in `apps/web/src/lib/auth/__tests__/email-login.test.ts` for `buildPasswordResetEmail`.
- [ ] Run `npm run test -w apps/web -- email-login` and confirm it fails.
- [ ] Add `buildPasswordResetEmail` and a shared `sendAuthEmail` helper to `apps/web/src/lib/auth/email-login.ts`.
- [ ] Run `npm run test -w apps/web -- email-login` and confirm it passes.

### Task 3: Server Actions

- [ ] Add focused tests where pure validation allows it; do not mock Auth.js internals unnecessarily.
- [ ] Implement `requestPasswordReset`, `completePasswordReset`, `changeCurrentPassword`, and `resendVerificationEmail` in `apps/web/src/lib/auth/actions.ts`.
- [ ] Use `VerificationToken` for password reset by storing the hashed token with `identifier = "password-reset:<email>"`.
- [ ] Keep forgot-password responses non-enumerating: missing users still redirect to `/login/check-email?mode=password-reset`.
- [ ] Run `npm run test -w apps/web -- auth`.

### Task 4: Pages

- [ ] Add `/forgot-password` and `/reset-password` pages with existing account auth panel styling.
- [ ] Add forgot-password link on `/login`.
- [ ] Extend `/login/check-email` copy by `mode=password-reset`.
- [ ] Extend `/login/error` copy and add resend verification form for `email-not-verified`.
- [ ] Add change password and conditional resend verification forms on `/account/security`.

### Task 5: Verification And Docs

- [ ] Run `npm run test -w apps/web -- auth account`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run lint`.
- [ ] Run `set -a; source /Users/lee/Desktop/Lee/DreamChasers/.env; set +a; npm run build`.
- [ ] Check `/forgot-password`, `/reset-password`, `/login/error`, `/account/security` in browser.
- [ ] Update T138 progress/completion docs.
- [ ] Run `npm run docs:sync`.
- [ ] Run `git diff --check`.
