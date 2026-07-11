# 胡了卜 Cocos v1 M0 Production Baseline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立一条可测试、可重复、可追踪的 Cocos Creator 3.8.8 非 debug `web-mobile` production build 链路，并把 Web demo 明确冻结为 legacy reference。

**Architecture:** 用版本化 JSON 描述发布契约；纯 Node CJS 库负责产物、Creator 结果、manifest 和 HTTP smoke；薄 CLI 只负责参数、调用 Creator 和编排。M0 不修改 Cocos `assets/**`、玩法规则或 Web 主组件，避免覆盖 T239/T240 的未提交改动。

**Tech Stack:** Node.js 22 built-ins、Vitest 4、Cocos Creator 3.8.8 CLI、npm workspaces。

## Global Constraints

- Cocos Creator 版本固定为 `3.8.8`，平台固定为 `web-mobile`，`debug` 固定为 `false`。
- Cocos 是唯一正式运行时；Web demo 只作为 legacy reference，M0 不删除现有试玩文件，也不继续扩展其玩法。
- production build 只有同时满足 Finished 日志、完整产物和 HTTP smoke 才成功。
- 原始 Creator 退出码 `36` 只在 `allowedNonZeroExitCodes` 白名单、Finished 日志和零产物错误同时成立时归一化；其他非零退出码必须失败。
- 默认输出到 Cocos 工程已忽略的 `build/production/web-mobile`，不覆盖现有 `build/web-mobile`。
- 所有新增/修改文本文件使用 UTF-8 无 BOM。
- 不修改 `GameSceneController.ts`、Cocos Binder、runtime、config、scene、resources、settings、Web `HulebuGamePage` 或账号/数据库代码。

---

### Task 1: Release Contract, Artifact Validation And Creator Decision

**Files:**
- Create: `apps/game/mahjong-roguelike/release/hulebu-v1.release.json`
- Create: `packages/shared/src/hulebu-cocos-release.test.ts`
- Create: `apps/game/mahjong-roguelike/scripts/hulebu-cocos-release.cjs`

**Interfaces:**
- Consumes: Node built-ins and the future `hulebu-cocos-release.cjs` exports.
- Produces: `HulebuReleaseConfig` JSON contract plus `HulebuReleaseError`, `loadReleaseConfig`, `validateReleaseConfig`, `validateBuildArtifacts`, and `evaluateCreatorBuild`.

- [ ] **Step 1: Add the versioned release contract**

```json
{
  "schemaVersion": 1,
  "gameId": "hulebu",
  "displayName": "胡了卜",
  "creatorVersion": "3.8.8",
  "platform": "web-mobile",
  "debug": false,
  "outputName": "web-mobile",
  "contentVersion": "0.1.0-m0",
  "saveSchemaVersion": 1,
  "finishedMarker": "build Task (web-mobile) Finished",
  "allowedNonZeroExitCodes": [36],
  "requiredFiles": [
    "index.html",
    "index.js",
    "application.js",
    "style.css",
    "src/settings.json",
    "src/import-map.json",
    "assets/main/config.json",
    "assets/resources/config.json"
  ],
  "requiredJsonFiles": [
    "src/settings.json",
    "src/import-map.json",
    "assets/main/config.json",
    "assets/resources/config.json"
  ],
  "smokePaths": [
    "/",
    "/src/settings.json",
    "/src/import-map.json",
    "/assets/main/config.json",
    "/assets/resources/config.json"
  ]
}
```

- [ ] **Step 2: Write failing tests for config, artifacts and Creator exit handling**

Create a Vitest file that imports the future CJS library with `createRequire(import.meta.url)`. Use `mkdtempSync()` and a `createValidBuild()` helper that writes `GameCanvas` and `System.import` into `index.html`, valid JSON into all required JSON files, and non-empty data into other required files.

The tests must assert these exact behaviors:

```ts
expect(loadReleaseConfig(realConfigPath)).toMatchObject({
  creatorVersion: "3.8.8",
  debug: false,
  platform: "web-mobile",
  outputName: "web-mobile",
  allowedNonZeroExitCodes: [36],
});

expect(validateBuildArtifacts(validBuildRoot, config)).toEqual({ ok: true, errors: [] });
expect(validateBuildArtifacts(missingIndexRoot, config).errors).toContain(
  "missing required file: index.html",
);
expect(validateBuildArtifacts(invalidJsonRoot, config).errors).toContain(
  "invalid JSON: src/settings.json",
);

expect(evaluateCreatorBuild({
  exitCode: 36,
  logText: config.finishedMarker,
  artifactErrors: [],
  config,
})).toEqual({ accepted: true, normalized: true, originalExitCode: 36 });

expect(() => evaluateCreatorBuild({
  exitCode: 36,
  logText: "build started",
  artifactErrors: [],
  config,
})).toThrow("Creator build log is missing the finished marker");

expect(() => evaluateCreatorBuild({
  exitCode: 36,
  logText: config.finishedMarker,
  artifactErrors: ["missing required file: index.html"],
  config,
})).toThrow("Creator build artifacts are invalid");

expect(() => evaluateCreatorBuild({
  exitCode: 9,
  logText: config.finishedMarker,
  artifactErrors: [],
  config,
})).toThrow("Creator exited with unsupported code 9");
```

- [ ] **Step 3: Run the tests and verify RED**

Run:

```bash
npm run test -w packages/shared -- hulebu-cocos-release
```

Expected: FAIL because `apps/game/mahjong-roguelike/scripts/hulebu-cocos-release.cjs` does not exist.

- [ ] **Step 4: Implement config validation**

The module must export this error and these functions:

```js
class HulebuReleaseError extends Error {
  constructor(message) {
    super(message);
    this.name = "HulebuReleaseError";
  }
}

function loadReleaseConfig(configPath) {
  let config;
  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (error) {
    throw new HulebuReleaseError(`Unable to read release config: ${error.message}`);
  }
  validateReleaseConfig(config);
  return config;
}

function validateReleaseConfig(config) {
  if (config?.schemaVersion !== 1) throw new HulebuReleaseError("release schemaVersion must be 1");
  if (config.creatorVersion !== "3.8.8") throw new HulebuReleaseError("creatorVersion must be 3.8.8");
  if (config.platform !== "web-mobile") throw new HulebuReleaseError("platform must be web-mobile");
  if (config.debug !== false) throw new HulebuReleaseError("debug must be false");
  if (config.outputName !== "web-mobile") throw new HulebuReleaseError("outputName must be web-mobile");
  for (const key of ["requiredFiles", "requiredJsonFiles", "smokePaths", "allowedNonZeroExitCodes"]) {
    if (!Array.isArray(config[key]) || config[key].length === 0) {
      throw new HulebuReleaseError(`${key} must be a non-empty array`);
    }
  }
  if (typeof config.finishedMarker !== "string" || !config.finishedMarker) {
    throw new HulebuReleaseError("finishedMarker must be a non-empty string");
  }
}
```

- [ ] **Step 5: Implement artifact validation and exit normalization**

```js
function validateBuildArtifacts(buildRoot, config) {
  const errors = [];
  for (const relativePath of config.requiredFiles) {
    const filePath = path.join(buildRoot, relativePath);
    if (!fs.existsSync(filePath)) {
      errors.push(`missing required file: ${relativePath}`);
      continue;
    }
    if (fs.statSync(filePath).size === 0) errors.push(`empty required file: ${relativePath}`);
  }
  for (const relativePath of config.requiredJsonFiles) {
    const filePath = path.join(buildRoot, relativePath);
    if (!fs.existsSync(filePath)) continue;
    try {
      JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch {
      errors.push(`invalid JSON: ${relativePath}`);
    }
  }
  const indexPath = path.join(buildRoot, "index.html");
  if (fs.existsSync(indexPath)) {
    const indexHtml = fs.readFileSync(indexPath, "utf8");
    if (!indexHtml.includes('id="GameCanvas"')) errors.push("index.html missing GameCanvas");
    if (!indexHtml.includes("System.import")) errors.push("index.html missing System.import bootstrap");
  }
  return { ok: errors.length === 0, errors };
}

function evaluateCreatorBuild({ exitCode, logText, artifactErrors, config }) {
  if (artifactErrors.length > 0) {
    throw new HulebuReleaseError(`Creator build artifacts are invalid: ${artifactErrors.join("; ")}`);
  }
  if (!logText.includes(config.finishedMarker)) {
    throw new HulebuReleaseError("Creator build log is missing the finished marker");
  }
  if (exitCode === 0) return { accepted: true, normalized: false, originalExitCode: 0 };
  if (config.allowedNonZeroExitCodes.includes(exitCode)) {
    return { accepted: true, normalized: true, originalExitCode: exitCode };
  }
  throw new HulebuReleaseError(`Creator exited with unsupported code ${exitCode}`);
}
```

- [ ] **Step 6: Export the public surface**

```js
module.exports = {
  HulebuReleaseError,
  evaluateCreatorBuild,
  loadReleaseConfig,
  validateBuildArtifacts,
  validateReleaseConfig,
};
```

- [ ] **Step 7: Run the scoped test and verify GREEN**

Run:

```bash
npm run test -w packages/shared -- hulebu-cocos-release
```

Expected: artifact/config/Creator decision tests PASS; HTTP smoke and manifest tests are not added yet.

- [ ] **Step 8: Commit the green release contract**

```bash
git add apps/game/mahjong-roguelike/release/hulebu-v1.release.json apps/game/mahjong-roguelike/scripts/hulebu-cocos-release.cjs packages/shared/src/hulebu-cocos-release.test.ts
git commit -m "feat(hulebu): validate Cocos production artifacts"
```

---

### Task 2: Manifest And HTTP Smoke

**Files:**
- Modify: `apps/game/mahjong-roguelike/scripts/hulebu-cocos-release.cjs`
- Modify: `packages/shared/src/hulebu-cocos-release.test.ts`

**Interfaces:**
- Consumes: a validated build directory.
- Produces: `collectBuildStats`, `writeBuildManifest`, `resolveRequestPath`, `startStaticServer`, and `smokeBuild`.

- [ ] **Step 1: Add failing manifest tests**

```ts
const manifest = writeBuildManifest(validBuildRoot, {
  buildId: "abc1234-20260711T010203Z",
  commit: "abc1234",
  config,
  creatorDecision: { accepted: true, normalized: true, originalExitCode: 36 },
  createdAt: "2026-07-11T01:02:03.000Z",
  smokeResults: config.smokePaths.map((pathname) => ({ pathname, status: 200 })),
});

expect(JSON.parse(readFileSync(manifest.path, "utf8"))).toMatchObject({
  schemaVersion: 1,
  gameId: "hulebu",
  creatorVersion: "3.8.8",
  creatorExitCode: 36,
  creatorExitNormalized: true,
  contentVersion: "0.1.0-m0",
  saveSchemaVersion: 1,
  commit: "abc1234",
});
expect(manifest.data.fileCount).toBeGreaterThan(0);
expect(manifest.data.totalBytes).toBeGreaterThan(0);
```

- [ ] **Step 2: Add failing path-safety and HTTP smoke tests**

```ts
expect(() => resolveRequestPath(validBuildRoot, "/%2e%2e/package.json")).toThrow(
  "request path escapes the build root",
);

const smokeResults = await smokeBuild(validBuildRoot, config.smokePaths);
expect(smokeResults).toEqual(
  config.smokePaths.map((pathname) => expect.objectContaining({ pathname, status: 200 })),
);
```

- [ ] **Step 3: Run the tests and verify RED**

Run the scoped test. Expected: FAIL because the five functions are not exported.

- [ ] **Step 4: Implement stats and atomic manifest writing**

Walk files recursively, excluding `hulebu-build.json`, sum `fileCount` and `totalBytes`, then write `hulebu-build.json.tmp` and rename it atomically to `hulebu-build.json`.

The persisted object must be:

```js
const data = {
  schemaVersion: 1,
  buildId,
  gameId: config.gameId,
  displayName: config.displayName,
  creatorVersion: config.creatorVersion,
  platform: config.platform,
  debug: config.debug,
  contentVersion: config.contentVersion,
  saveSchemaVersion: config.saveSchemaVersion,
  commit,
  createdAt,
  creatorExitCode: creatorDecision.originalExitCode,
  creatorExitNormalized: creatorDecision.normalized,
  smokeResults,
  ...collectBuildStats(buildRoot),
};
```

- [ ] **Step 5: Implement a traversal-safe ephemeral HTTP server**

`resolveRequestPath()` must decode the URL, map `/` to `index.html`, resolve inside `buildRoot`, and reject any resolved path outside `${buildRoot}${path.sep}`. `startStaticServer()` binds only `127.0.0.1` on port `0`, returns `{ origin, close }`, serves HTML/JS/CSS/JSON/WASM/BIN/PNG content types, returns 403 for unsafe paths and 404 for missing files.

`smokeBuild()` must always close the server in `finally`, fetch each configured path, require HTTP 200 and non-empty bodies, parse `.json` responses, and return `{ pathname, status, bytes }[]`.

- [ ] **Step 6: Run tests and verify GREEN**

Run:

```bash
npm run test -w packages/shared -- hulebu-cocos-release
```

Expected: all release tests PASS.

- [ ] **Step 7: Commit**

```bash
git add apps/game/mahjong-roguelike/scripts/hulebu-cocos-release.cjs packages/shared/src/hulebu-cocos-release.test.ts
git commit -m "feat(hulebu): add build manifest and HTTP smoke"
```

---

### Task 3: Production Build CLI

**Files:**
- Create: `apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs`
- Modify: `package.json`
- Modify: `packages/shared/src/hulebu-cocos-release.test.ts`

**Interfaces:**
- Consumes: all release-library exports from Tasks 1–2 and the Creator executable.
- Produces: `npm run game:hulebu:build` and `npm run game:hulebu:verify-build`.

- [ ] **Step 1: Add failing CLI contract tests**

Read `package.json` and CLI source. Assert:

```ts
expect(rootPackage.scripts).toMatchObject({
  "game:hulebu:build": "node apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs",
  "game:hulebu:verify-build": "node apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs --verify-only",
});
expect(cliSource).toContain("COCOS_CREATOR_BIN");
expect(cliSource).toContain("build/production");
expect(cliSource).toContain("debug=false");
expect(cliSource).toContain("evaluateCreatorBuild");
expect(cliSource).toContain("smokeBuild");
expect(cliSource).toContain("writeBuildManifest");
```

- [ ] **Step 2: Run tests and verify RED**

Expected: FAIL because the CLI and package scripts do not exist.

- [ ] **Step 3: Implement exact CLI behavior**

The CLI must:

1. Resolve the project at `../cocos/hulebu-cocos-3.8.8` and config at `../release/hulebu-v1.release.json`.
2. Default Creator binary to `/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator`, overridable by `COCOS_CREATOR_BIN` or `--creator`.
3. Default output root to `<project>/build/production`, overridable by `--output-root`; the build root is `<outputRoot>/web-mobile`.
4. Support `--verify-only` without invoking Creator.
5. In build mode remove only `<outputRoot>/web-mobile`, never the whole Cocos `build/` directory.
6. Invoke Creator with:

```js
[
  "--project",
  projectRoot,
  "--build",
  `platform=${config.platform};debug=false;buildPath=${outputRoot};outputName=${config.outputName}`,
]
```

7. Save combined stdout/stderr as `<outputRoot>/hulebu-cocos-build.log`.
8. Validate artifacts before evaluating the Creator exit result.
9. Run HTTP smoke before writing the final manifest.
10. Use `git rev-parse --short=12 HEAD` for `commit`, a UTC timestamp for `createdAt`, and `${commit}-${timestampWithoutPunctuation}` for `buildId`.
11. Print one JSON summary and return 0 only after every gate succeeds; errors print one concise line and set `process.exitCode = 1`.

- [ ] **Step 4: Add package scripts**

```json
"game:hulebu:build": "node apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs",
"game:hulebu:verify-build": "node apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs --verify-only"
```

- [ ] **Step 5: Run tests and verify GREEN**

Run the release tests, then run:

```bash
npm run game:hulebu:verify-build -- --output-root apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/build
```

Expected: the existing `build/web-mobile` passes artifact and HTTP checks and emits a manifest. Remove that generated manifest after this compatibility check so M0 does not alter the older build folder.

- [ ] **Step 6: Commit**

```bash
git add package.json apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs packages/shared/src/hulebu-cocos-release.test.ts
git commit -m "feat(hulebu): add production build command"
```

---

### Task 4: Formal Runtime And Legacy Documentation

**Files:**
- Modify: `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/README.md`
- Create: `apps/game/mahjong-roguelike/prototypes/config-playable/LEGACY.md`
- Create: `apps/web/public/games/hulebu-demo/LEGACY.md`
- Modify: `packages/shared/src/hulebu-cocos-release.test.ts`

**Interfaces:**
- Consumes: commands from Task 3.
- Produces: durable source-of-truth and freeze rules visible to maintainers and tests.

- [ ] **Step 1: Add failing documentation contract tests**

```ts
expect(cocosReadme).toContain("唯一正式运行时");
expect(cocosReadme).toContain("npm run game:hulebu:build");
expect(cocosReadme).toContain("build/production/web-mobile/hulebu-build.json");
expect(cocosReadme).not.toContain("工程壳");
expect(prototypeLegacy).toContain("Legacy Reference");
expect(webDemoLegacy).toContain("Legacy Reference");
expect(prototypeLegacy).toContain("不得继续扩展玩法");
expect(webDemoLegacy).toContain("不得继续扩展玩法");
```

- [ ] **Step 2: Run tests and verify RED**

Expected: FAIL because README is stale and legacy markers are absent.

- [ ] **Step 3: Rewrite the Cocos README as an operator guide**

Keep the Dashboard/editor path, but state Cocos is the unique formal runtime. Document build/verify commands, output/log/manifest paths, exit 36 safeguards, Creator version, generated folders, and the prohibition against editing `build/**` by hand.

- [ ] **Step 4: Add both legacy markers**

Each marker must say:

- Title contains `Legacy Reference`.
- This directory is read-only behavioral/visual reference.
- It is not the production runtime and must not be linked from the formal release.
- It must not receive new gameplay, balance, mode, save or UI features.
- Any behavior retained for v1 must be specified and implemented in Cocos under a numbered task.

- [ ] **Step 5: Run release and existing Cocos tests**

```bash
npm run test -w packages/shared -- hulebu-cocos-release mahjong-cocos-project
```

Expected: both files PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/README.md apps/game/mahjong-roguelike/prototypes/config-playable/LEGACY.md apps/web/public/games/hulebu-demo/LEGACY.md packages/shared/src/hulebu-cocos-release.test.ts
git commit -m "docs(hulebu): freeze legacy runtimes"
```

---

### Task 5: Real Production Build And Task Closure

**Files:**
- Modify: `docs/tasks/items/T242-hulebu-cocos-v1-m0-production-baseline.md`
- Modify: `docs/tasks/claims/T242-lee.md`
- Create: `docs/progress/2026-07-11-lee.md`
- Create: `docs/completion/2026-07-11-task-242-hulebu-cocos-v1-m0-production-baseline.md`
- Regenerate: `docs/tasks/TASK_BOARD.md`, `docs/tasks/CLAIMS.md`, `docs/status/CURRENT_STATUS.md`, `docs/progress/2026-07-11.md`

**Interfaces:**
- Consumes: completed production pipeline.
- Produces: verified M0 build evidence and the handoff to M1.

- [ ] **Step 1: Run focused automated verification**

```bash
npm run test -w packages/shared -- hulebu-cocos-release mahjong-cocos-project
npx tsc --noEmit -p apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json
```

Expected: all focused tests and Cocos TypeScript pass.

- [ ] **Step 2: Run the real production build**

```bash
npm run game:hulebu:build
```

Expected: command returns 0, build exists at `apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/build/production/web-mobile`, HTTP smoke paths all return 200, and `hulebu-build.json` records the original Creator exit code.

- [ ] **Step 3: Inspect manifest and size**

```bash
node -e "const m=require('./apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/build/production/web-mobile/hulebu-build.json'); console.log(m)"
du -sh apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/build/production/web-mobile
```

Record `creatorExitCode`, `creatorExitNormalized`, `fileCount`, `totalBytes`, and directory size in the completion record. M0 records the current 131 MB class baseline; size reduction belongs to the later performance milestone.

- [ ] **Step 4: Update task and progress documents**

Mark T242 and its claim `已完成`. The completion record must list files, behavior, exact commands, pass/fail results, build manifest values, branch divergence, and M1 as the next step.

- [ ] **Step 5: Sync and verify docs**

```bash
npm run docs:sync
git diff --check
```

- [ ] **Step 6: Final scoped commit**

Stage only T242 files. Do not stage unrelated dirty files or pre-existing user changes.

```bash
git commit -m "feat(hulebu): establish Cocos production baseline"
```

## Plan Self-Review

- Spec coverage: M0 build wrapper, exit 36 safety, artifact validation, HTTP smoke, version manifest, Web demo freeze and documentation are each assigned to a task.
- Scope: App/Run state machines, chapter content, UI/audio and Web host switching are intentionally deferred to separate M1–M5 plans.
- Type/interface consistency: every CLI dependency is exported by `hulebu-cocos-release.cjs`; `creatorDecision` uses one shape in tests, manifest and CLI.
- Safety: the only removed directory is `build/production/web-mobile`; current `build/web-mobile` and all source assets remain untouched.
