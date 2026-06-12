# PDF Editor Upgrade Roadmap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the PDF toolbox toward an Edge-like PDF reader editor while keeping full original-content editing out of the first implementation wave.

**Architecture:** Add a reader/editor layer around the existing PDF toolbox. PDF.js remains responsible for rendering and text extraction; a new annotation overlay stores user edits in structured client state; pdf-lib writes the chosen annotations into a downloaded PDF copy.

**Tech Stack:** Next.js, React, TypeScript, PDF.js, pdf-lib, Vitest, browser Canvas, optional AI Gateway capability for translation in a later task.

---

## File Structure

Planned implementation files for future coding tasks:

- `apps/web/src/modules/tools/pdf-toolbox/components/PdfReaderEditor.tsx`：reader/editor shell, zoom, page navigation, toolbar wiring.
- `apps/web/src/modules/tools/pdf-toolbox/components/PdfAnnotationLayer.tsx`：per-page overlay for text boxes, signatures, cover areas, highlights and ink strokes.
- `apps/web/src/modules/tools/pdf-toolbox/components/PdfEditorToolbar.tsx`：tool selection, color, size and save actions.
- `apps/web/src/modules/tools/pdf-toolbox/lib/pdf-annotations.ts`：annotation types, coordinate conversion and flattening helpers.
- `apps/web/src/modules/tools/pdf-toolbox/lib/pdf-search.ts`：PDF.js text extraction, search indexing and page hit mapping.
- `apps/web/src/modules/tools/pdf-toolbox/lib/pdf-export-images.ts`：PDF page to PNG/JPEG export helpers.
- `apps/web/src/modules/tools/pdf-toolbox/__tests__/pdf-annotations.test.ts`：coordinate and flattening tests.
- `apps/web/src/modules/tools/pdf-toolbox/__tests__/pdf-search.test.ts`：search indexing tests.

Documentation files already created by T144:

- `docs/modules/pdf-toolbox/PDF_EDITOR_UPGRADE_ROADMAP.md`
- `docs/tasks/items/T144-pdf-editor-upgrade-roadmap.md`
- `docs/tasks/claims/T144-lee.md`

## Task 1: Reader Editor Shell

**Files:**

- Create: `apps/web/src/modules/tools/pdf-toolbox/components/PdfReaderEditor.tsx`
- Modify: `apps/web/src/modules/tools/pdf-toolbox/components/PdfToolbox.tsx`
- Test manually: `/tools/pdf-toolbox`

- [ ] Step 1: Add a reader/editor mode switch beside the existing page-grid workflow.
- [ ] Step 2: Render the current PDF pages in a continuous reader viewport.
- [ ] Step 3: Add zoom in, zoom out, fit width and page jump controls.
- [ ] Step 4: Verify desktop and mobile layouts do not overflow.
- [ ] Step 5: Keep the existing page-level tools available as the default mode until the editor mode is stable.

Acceptance:

- Users can switch between current page processing mode and reader editor mode.
- Existing upload, split, merge and download behavior still works.
- Reader mode displays at least one normal multi-page PDF.

## Task 2: Annotation Data Model

**Files:**

- Create: `apps/web/src/modules/tools/pdf-toolbox/lib/pdf-annotations.ts`
- Create: `apps/web/src/modules/tools/pdf-toolbox/__tests__/pdf-annotations.test.ts`
- Modify: `apps/web/src/modules/tools/pdf-toolbox/types.ts`

- [ ] Step 1: Define annotation types for `text`, `signature`, `cover`, `highlight` and `ink`.
- [ ] Step 2: Store every annotation with page index, normalized coordinates, size, color and creation time.
- [ ] Step 3: Add coordinate conversion helpers from viewport pixels to PDF normalized coordinates.
- [ ] Step 4: Add tests for scale changes and page resize conversion.
- [ ] Step 5: Run `npm run test -w apps/web -- pdf-annotations`.

Acceptance:

- Annotation coordinates remain stable when zoom changes.
- The model can represent all first-wave free tools without special cases.

## Task 3: Text Box, Signature and Cover Area Tools

**Files:**

- Create: `apps/web/src/modules/tools/pdf-toolbox/components/PdfAnnotationLayer.tsx`
- Create: `apps/web/src/modules/tools/pdf-toolbox/components/PdfEditorToolbar.tsx`
- Modify: `apps/web/src/modules/tools/pdf-toolbox/components/PdfReaderEditor.tsx`

- [ ] Step 1: Add a toolbar with text, signature and cover tools.
- [ ] Step 2: Let users place a text box on the active page.
- [ ] Step 3: Let users drag and resize text boxes.
- [ ] Step 4: Let users upload a signature image and place it on a chosen page.
- [ ] Step 5: Let users drag and resize a cover rectangle, with white as the default color.
- [ ] Step 6: Add delete controls for selected annotations.
- [ ] Step 7: Verify touch interaction on mobile viewport.

Acceptance:

- Users can add and adjust text, signature and cover annotations.
- Annotation state survives zoom changes and page scrolling within the current session.

## Task 4: Flatten Annotations Into PDF

**Files:**

- Modify: `apps/web/src/modules/tools/pdf-toolbox/lib/pdf-annotations.ts`
- Modify: `apps/web/src/modules/tools/pdf-toolbox/components/PdfReaderEditor.tsx`
- Test: `apps/web/src/modules/tools/pdf-toolbox/__tests__/pdf-annotations.test.ts`

- [ ] Step 1: Add flattening helpers that draw text boxes, images and rectangles into copied PDF pages with `pdf-lib`.
- [ ] Step 2: Add tests that save a PDF with each supported annotation type and reload it successfully.
- [ ] Step 3: Add a `下载标注版 PDF` action.
- [ ] Step 4: Verify the output opens in Edge, macOS Preview and browser PDF viewer.

Acceptance:

- Downloaded PDF visibly contains the added annotations.
- Existing original PDF bytes are not modified in place.
- UI copy says the file is saved as a new PDF copy.

## Task 5: Highlight and Ink Tools

**Files:**

- Modify: `apps/web/src/modules/tools/pdf-toolbox/components/PdfAnnotationLayer.tsx`
- Modify: `apps/web/src/modules/tools/pdf-toolbox/components/PdfEditorToolbar.tsx`
- Modify: `apps/web/src/modules/tools/pdf-toolbox/lib/pdf-annotations.ts`

- [ ] Step 1: Add highlight annotation placement for selected text or dragged rectangles.
- [ ] Step 2: Add ink stroke capture using pointer events.
- [ ] Step 3: Add stroke color and width controls.
- [ ] Step 4: Flatten highlights and ink strokes into the exported PDF.
- [ ] Step 5: Verify pointer, mouse and touch behavior.

Acceptance:

- Users can highlight visible text areas.
- Users can draw freehand strokes and export them.

## Task 6: Text Search and Selection Copy

**Files:**

- Create: `apps/web/src/modules/tools/pdf-toolbox/lib/pdf-search.ts`
- Create: `apps/web/src/modules/tools/pdf-toolbox/__tests__/pdf-search.test.ts`
- Modify: `apps/web/src/modules/tools/pdf-toolbox/components/PdfReaderEditor.tsx`

- [ ] Step 1: Build a search index from PDF.js text content.
- [ ] Step 2: Add search input with page hit count.
- [ ] Step 3: Jump to the next and previous hit.
- [ ] Step 4: Highlight the active search hit in the reader overlay.
- [ ] Step 5: Add selected text copy support where browser selection is available.
- [ ] Step 6: Run `npm run test -w apps/web -- pdf-search`.

Acceptance:

- Ordinary text PDFs can be searched.
- Scanned PDFs show a clear OCR-needed message.

## Task 7: Translation Side Panel

**Files:**

- Modify: `docs/tasks/CHANGE_INTAKE.md`
- Create a later implementation task before coding AI translation.
- Future code scope: `apps/web/src/modules/tools/pdf-toolbox/**`, `apps/web/src/lib/ai/**`, `apps/web/src/app/api/ai/**`

- [ ] Step 1: Create a separate task for PDF translation capability.
- [ ] Step 2: Define AI Gateway capabilities `pdf.translate.selection` and `pdf.translate.page`.
- [ ] Step 3: Add front-end model availability checks before showing translation actions.
- [ ] Step 4: Add rate limit, point cost and error handling in the AI Gateway task.
- [ ] Step 5: Hide translation actions until the Gateway capability is available.

Acceptance:

- Translation is not implemented as a hidden direct API call.
- Model cost and availability are controlled by AI Gateway.

## Task 8: PDF To Image and Basic Compression

**Files:**

- Create: `apps/web/src/modules/tools/pdf-toolbox/lib/pdf-export-images.ts`
- Modify: `apps/web/src/modules/tools/pdf-toolbox/components/PdfActionPanel.tsx`
- Modify: `apps/web/src/modules/tools/pdf-toolbox/components/PdfToolbox.tsx`
- Test: `apps/web/src/modules/tools/pdf-toolbox/__tests__/pdf-actions.test.ts`

- [ ] Step 1: Add PDF page to PNG/JPEG export helper using PDF.js rendering.
- [ ] Step 2: Let users export selected pages as images.
- [ ] Step 3: Add basic compression that reports original and output size.
- [ ] Step 4: Explain that browser compression is best effort and large files may need server-side processing later.
- [ ] Step 5: Run `npm run test -w apps/web -- pdf`.

Acceptance:

- Users can export selected PDF pages as images.
- Compression result shows size before and after.

## Task 9: Commercial SDK Evaluation

**Files:**

- Create: `docs/modules/pdf-toolbox/PDF_ORIGINAL_EDITING_SDK_EVALUATION.md`

- [ ] Step 1: Compare Apryse, Nutrient, Adobe/Acrobat-related options and at least one fallback candidate.
- [ ] Step 2: Score each option for original text editing, image replacement, Chinese font support, browser support, licensing and integration risk.
- [ ] Step 3: Recommend whether to build, buy or postpone original-content editing.
- [ ] Step 4: Keep the decision separate from the free Edge-like editor implementation.

Acceptance:

- The team has a clear decision path before promising original PDF content editing.

## Verification

For documentation-only planning tasks:

- Run `npm run docs:sync`.
- Run placeholder scan on the changed planning files.
- Run `git diff --check`.

For future implementation tasks:

- Run `npm run test -w apps/web -- pdf`.
- Run `npm run lint -w apps/web`.
- Run `npm run typecheck -w apps/web`.
- Run `npm run build -w apps/web`.
- Check `/tools/pdf-toolbox` on desktop and mobile.
