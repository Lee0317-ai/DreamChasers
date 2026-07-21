import {
  cpSync,
  existsSync,
  lstatSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmSync,
  statSync,
  symlinkSync,
  utimesSync,
  writeSync,
  writeFileSync,
} from "node:fs";
import { EventEmitter } from "node:events";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { request as httpRequest } from "node:http";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

type HulebuReleaseConfig = {
  schemaVersion: number;
  gameId: string;
  displayName: string;
  creatorVersion: string;
  creatorExecutableRealPath: string;
  creatorExecutableSha256: string;
  creatorBuildResourcesSha256: string;
  creatorBundleIdentifier: string;
  platform: string;
  debug: boolean;
  outputName: string;
  contentVersion: string;
  saveSchemaVersion: number;
  finishedMarker: string;
  allowedNonZeroExitCodes: number[];
  forbiddenBundleText: string[];
  requiredFiles: string[];
  requiredJsonFiles: string[];
  smokePaths: string[];
};

type CreatorBuildInput = {
  exitCode: number;
  logText: string;
  artifactErrors: string[];
  config: HulebuReleaseConfig;
};

type CreatorBuildDecision = {
  accepted: boolean;
  actualCreatorVersion: string;
  normalized: boolean;
  originalExitCode: number;
};

type CreatorExecutableEvidence = {
  creatorBundleIdentifier: string;
  creatorBundleVersion: string;
  creatorExecutableRealPath: string;
  creatorExecutableSha256: string;
  creatorBuildResourcesSha256: string;
  creatorExecutableIdentity?: {
    ctimeNs: string;
    dev: string;
    ino: string;
    mtimeNs: string;
    size: string;
  };
};

type SmokeResult = {
  pathname: string;
  status: number;
  bytes: number;
};

const require = createRequire(import.meta.url);
const mutableFs = require("node:fs") as {
  createReadStream: (
    ...args: unknown[]
  ) => ReturnType<typeof import("node:fs").createReadStream>;
  fstatSync: (
    ...args: unknown[]
  ) => ReturnType<typeof import("node:fs").fstatSync>;
  lstatSync: (
    ...args: unknown[]
  ) => ReturnType<typeof import("node:fs").lstatSync>;
  readFileSync: (...args: unknown[]) => unknown;
  renameSync: (...args: unknown[]) => unknown;
  rmSync: (...args: unknown[]) => unknown;
  statSync: (
    ...args: unknown[]
  ) => ReturnType<typeof import("node:fs").statSync>;
};
const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const realConfigPath = join(
  repositoryRoot,
  "apps/game/mahjong-roguelike/release/hulebu-v1.release.json",
);
const releaseLibraryPath = join(
  repositoryRoot,
  "apps/game/mahjong-roguelike/scripts/hulebu-cocos-release.cjs",
);
const buildCliPath = join(
  repositoryRoot,
  "apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs",
);
const rootPackagePath = join(repositoryRoot, "package.json");
const FULL_COMMIT_A = "a".repeat(40);
const FULL_COMMIT_B = "b".repeat(40);
const RELEASE_CONFIG_SHA256 = "c".repeat(64);
const SOURCE_TREE_SHA256 = "d".repeat(64);
const CREATOR_EXECUTABLE_EVIDENCE: CreatorExecutableEvidence = {
  creatorBundleIdentifier: "com.cocos.creator",
  creatorBundleVersion: "3.8.8",
  creatorExecutableRealPath:
    "/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator",
  creatorExecutableSha256:
    "3a8452496c03e85f2784e64679a1fd203701b0b245125efee02c7923f2bd3464",
  creatorBuildResourcesSha256:
    "4541ea999da1939e513e7115b6a1d19e7c3602f717fe08169ca655a6f2330ebe",
};
const {
  HulebuReleaseError,
  collectBuildStats,
  evaluateCreatorBuild,
  loadReleaseConfig,
  readBuildManifest,
  resolveRequestPath,
  smokeBuild,
  startStaticServer,
  validateBuildArtifacts,
  validateReleaseConfig,
  writeBuildManifest,
} = require(releaseLibraryPath) as {
  HulebuReleaseError: new (message: string) => Error;
  collectBuildStats: (buildRoot: string) => {
    fileCount: number;
    totalBytes: number;
  };
  evaluateCreatorBuild: (input: CreatorBuildInput) => {
    accepted: boolean;
    actualCreatorVersion: string;
    normalized: boolean;
    originalExitCode: number;
  };
  loadReleaseConfig: (configPath: string) => HulebuReleaseConfig;
  readBuildManifest: (
    buildRoot: string,
    expected: {
      commit: string;
      config: HulebuReleaseConfig;
      releaseConfigSha256: string;
      sourceInputs: readonly string[];
      sourceTreeSha256: string;
    },
  ) => Record<string, unknown>;
  resolveRequestPath: (buildRoot: string, rawPathname: string) => string;
  smokeBuild: (
    buildRoot: string,
    smokePaths: string[],
  ) => Promise<SmokeResult[]>;
  startStaticServer: (buildRoot: string) => Promise<{
    origin: string;
    close: () => Promise<void>;
  }>;
  validateBuildArtifacts: (
    buildRoot: string,
    config: HulebuReleaseConfig,
  ) => { ok: boolean; errors: string[] };
  validateReleaseConfig: (config: unknown) => void;
  writeBuildManifest: (
    buildRoot: string,
    input: {
      buildId: string;
      commit: string;
      config: HulebuReleaseConfig;
      creatorDecision: CreatorBuildDecision;
      creatorExecutableEvidence: CreatorExecutableEvidence;
      cocosTypecheckPassed: true;
      createdAt: string;
      releaseConfigSha256: string;
      sourceInputs: string[];
      sourceState: "clean";
      sourceTreeSha256: string;
      smokeResults: SmokeResult[];
    },
  ) => { path: string; data: Record<string, unknown> };
};

const temporaryRoots: string[] = [];

function createTemporaryRoot(label: string): string {
  const root = mkdtempSync(join(tmpdir(), `hulebu-cocos-${label}-`));
  temporaryRoots.push(root);
  return root;
}

function createTemporaryGitRepository(label: string): string {
  const root = createTemporaryRoot(label);
  execFileSync("git", ["init", "--quiet"], { cwd: root });
  execFileSync("git", ["config", "user.email", "hulebu-tests@example.invalid"], {
    cwd: root,
  });
  execFileSync("git", ["config", "user.name", "Hulebu Tests"], { cwd: root });
  mkdirSync(join(root, "formal"), { recursive: true });
  writeFileSync(join(root, "formal/a.txt"), "tracked-a\n", "utf8");
  writeFileSync(join(root, "formal/b.txt"), "tracked-b\n", "utf8");
  writeFileSync(join(root, "unrelated.txt"), "unrelated\n", "utf8");
  execFileSync("git", ["add", "formal/a.txt", "formal/b.txt", "unrelated.txt"], {
    cwd: root,
  });
  execFileSync("git", ["commit", "--quiet", "-m", "fixture"], { cwd: root });
  return root;
}

function createMockReleaseLifecycle(
  outputRoot: string,
  projectRoot: string,
  events?: string[],
) {
  const attemptRoot = join(outputRoot, ".hulebu-attempt-test");
  const attemptBuildRoot = join(attemptRoot, "web-mobile");
  const attemptLogPath = join(attemptRoot, "hulebu-cocos-build.log");
  return {
    attemptBuildRoot,
    attemptLogPath,
    createExactCommitProjectSnapshot: () => {
      events?.push("snapshot");
      return {
        checkoutRoot: join(projectRoot, "checkout"),
        projectRoot,
        release: () => events?.push("snapshot-release"),
      };
    },
    inspectCreatorExecutable: () => {
      events?.push("creator-inspect");
      return CREATOR_EXECUTABLE_EVIDENCE;
    },
    recoverPendingBuildPromotion: () => {
      events?.push("promotion-recover");
      return { cleanupWarnings: [], recovered: false };
    },
    reapOrphanBuildAttempts: () => {
      events?.push("attempt-reap");
      return { cleanupWarnings: [], reapedAttempts: [] };
    },
    captureSnapshotReleaseSourceState: () => {
      events?.push("snapshot-source-clean");
      return {
        commit: FULL_COMMIT_A,
        sourceInputs: ["formal"],
        sourceState: "clean" as const,
        sourceTreeSha256: SOURCE_TREE_SHA256,
      };
    },
    runCocosTypeCheck: () => {
      events?.push("typecheck");
      return { passed: true as const };
    },
    createBuildAttempt: () => {
      events?.push("attempt");
      mkdirSync(attemptRoot, { recursive: true });
      return {
        buildRoot: attemptBuildRoot,
        logPath: attemptLogPath,
        outputRoot: attemptRoot,
        markCreatorSpawning: () => undefined,
        recordCreatorPid: () => undefined,
        recordCreatorExited: () => undefined,
        cleanup: () => {
          events?.push("attempt-cleanup");
          rmSync(attemptRoot, { force: true, recursive: true });
        },
      };
    },
    beginBuildPromotion: () => {
      events?.push("promote");
      return {
        finalize: () => {
          events?.push("promote-finalize");
          return { cleanupWarnings: [] };
        },
        rollback: () => events?.push("promote-rollback"),
      };
    },
  };
}

function createValidBuild(config: HulebuReleaseConfig): string {
  const buildRoot = createTemporaryRoot("build");

  for (const relativePath of config.requiredFiles) {
    const filePath = join(buildRoot, relativePath);
    mkdirSync(dirname(filePath), { recursive: true });

    if (relativePath === "index.html") {
      writeFileSync(
        filePath,
        '<canvas id="GameCanvas"></canvas><script>System.import("./index.js")</script>',
        "utf8",
      );
    } else if (config.requiredJsonFiles.includes(relativePath)) {
      writeFileSync(filePath, JSON.stringify({ valid: true }), "utf8");
    } else {
      writeFileSync(filePath, `artifact:${relativePath}`, "utf8");
    }
  }

  return buildRoot;
}

function createSmokeEvidence(
  config: HulebuReleaseConfig,
  buildRoot: string,
): SmokeResult[] {
  return config.smokePaths.map((pathname) => {
    const relativePath = pathname === "/" ? "index.html" : pathname.slice(1);
    return {
      pathname,
      status: 200,
      bytes: statSync(join(buildRoot, relativePath)).size,
    };
  });
}

function tryCreateSymlink(
  targetPath: string,
  linkPath: string,
  type: "dir" | "file",
): boolean {
  try {
    symlinkSync(targetPath, linkPath, type);
    return true;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code && ["EACCES", "EPERM", "ENOSYS"].includes(code)) return false;
    throw error;
  }
}

function requestRaw(
  origin: string,
  rawPath: string,
  method = "GET",
): Promise<{
  status: number;
  body: Buffer;
  contentType: string | undefined;
  contentLength: string | undefined;
}> {
  const target = new URL(origin);

  return new Promise((resolveRequest, rejectRequest) => {
    const request = httpRequest(
      {
        hostname: target.hostname,
        port: target.port,
        path: rawPath,
        method,
      },
      (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk: Buffer) => chunks.push(chunk));
        response.on("end", () => {
          resolveRequest({
            status: response.statusCode ?? 0,
            body: Buffer.concat(chunks),
            contentType: response.headers["content-type"],
            contentLength: response.headers["content-length"],
          });
        });
      },
    );
    request.on("error", rejectRequest);
    request.end();
  });
}

type BuildCli = {
  DEFAULT_CREATOR_EXECUTABLE: string;
  RELEASE_SOURCE_INPUTS: readonly string[];
  assertReleaseInputsClean: (input: {
    commit?: string;
    git?: (...args: string[]) => string | Buffer;
    repositoryRoot: string;
    sourceInputs?: readonly string[];
  }) => {
    sourceInputs: string[];
    sourceState: "clean";
    sourceTreeSha256: string;
  };
  acquireOutputLock: (
    outputRoot: string,
    options?: {
      hostname?: string;
      now?: () => Date;
      pid?: number;
      probePid?: (pid: number) => "alive" | "dead" | "unknown";
      staleGraceMs?: number;
      tokenFactory?: () => string;
    },
  ) => { assertOwnership: () => void; release: () => void };
  buildCreatorArguments: (input: {
    config: HulebuReleaseConfig;
    outputRoot: string;
    projectRoot: string;
  }) => string[];
  createExactCommitProjectSnapshot: (input: {
    commit: string;
    projectRoot: string;
    repositoryRoot: string;
    temporaryRoot?: string;
  }) => {
    checkoutRoot: string;
    projectRoot: string;
    release: () => void;
  };
  inspectCreatorExecutable: (
    executablePath: string,
    config: HulebuReleaseConfig,
    options?: {
      readBundleMetadata?: (realPath: string) => {
        bundleIdentifier: string;
        version: string;
      };
      hashCreatorBuildResources?: (realPath: string) => string;
    },
  ) => {
    creatorBundleIdentifier: string;
    creatorBundleVersion: string;
    creatorExecutableRealPath: string;
    creatorExecutableSha256: string;
    creatorBuildResourcesSha256: string;
    creatorExecutableIdentity: {
      ctimeNs: string;
      dev: string;
      ino: string;
      mtimeNs: string;
      size: string;
    };
  };
  hashCreatorBuildResources: (executablePath: string) => string;
  reapOrphanBuildAttempts: (
    outputRoot: string,
    options?: {
      hostname?: string;
      now?: () => Date;
      probePid?: (pid: number) => "alive" | "dead" | "unknown";
      staleGraceMs?: number;
    },
  ) => { cleanupWarnings: string[]; reapedAttempts: string[] };
  createBuildAttempt: (input: {
    hostname?: string;
    now?: () => Date;
    outputName: string;
    outputRoot: string;
    pid?: number;
    tokenFactory?: () => string;
  }) => {
    buildRoot: string;
    logPath: string;
    outputRoot: string;
    markCreatorSpawning: () => void;
    recordCreatorPid: (pid: number) => void;
    recordCreatorExited: () => void;
    cleanup: () => void;
  };
  beginBuildPromotion: (input: {
    attemptBuildRoot: string;
    attemptLogPath: string;
    finalBuildRoot: string;
    finalLogPath: string;
    outputRoot: string;
    renameSync?: (oldPath: string, newPath: string) => void;
  }) => {
    finalize: () => { cleanupWarnings: string[] };
    rollback: () => void;
  };
  recoverPendingBuildPromotion: (outputRoot: string) => {
    action?: "completed" | "rolled-back";
    cleanupWarnings: string[];
    recovered: boolean;
  };
  main: (
    argv: string[],
    effects: Record<string, unknown>,
  ) => Promise<Record<string, unknown> | null>;
  parseArguments: (
    argv: string[],
    environment?: NodeJS.ProcessEnv,
  ) => {
    creatorExecutable: string;
    outputRoot?: string;
    verifyOnly: boolean;
  };
  resolveOutputPaths: (input: {
    config: HulebuReleaseConfig;
    cwd: string;
    outputRoot?: string;
    projectRoot: string;
  }) => { buildRoot: string; outputRoot: string };
  runCreatorProcess: (input: {
    creatorArguments: string[];
    creatorExecutable: string;
    environment: NodeJS.ProcessEnv;
    onExit?: () => void;
    onSpawn?: (pid: number) => void;
    outputRoot: string;
    projectRoot: string;
    spawn: (...args: unknown[]) => EventEmitter;
    terminationGraceMs?: number;
  }) => Promise<{
    logPath: string;
    logText: string;
    outcome:
      | { kind: "exit"; exitCode: number }
      | { kind: "signal"; signal: string }
      | { kind: "spawn-error"; error: Error };
  }>;
  runCocosTypeCheck: (input: {
    projectRoot: string;
    repositoryRoot: string;
  }) => { passed: true };
  runRelease: (
    argv: string[],
    effects?: Record<string, unknown>,
  ) => Promise<Record<string, unknown>>;
};

function loadBuildCli(): BuildCli {
  return require(buildCliPath) as BuildCli;
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { force: true, recursive: true });
  }
});

describe("Hulebu Cocos production release contract", () => {
  it("loads the pinned Cocos Creator release settings", () => {
    expect(loadReleaseConfig(realConfigPath)).toMatchObject({
      creatorVersion: "3.8.8",
      creatorExecutableRealPath:
        "/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator",
      creatorExecutableSha256:
        "3a8452496c03e85f2784e64679a1fd203701b0b245125efee02c7923f2bd3464",
      creatorBuildResourcesSha256: expect.stringMatching(/^[0-9a-f]{64}$/),
      creatorBundleIdentifier: "com.cocos.creator",
      debug: false,
      platform: "web-mobile",
      outputName: "web-mobile",
      allowedNonZeroExitCodes: [36],
      forbiddenBundleText: ["__HULEBU_DEBUG__"],
    });
  });

  it("accepts the checked-in release contract", () => {
    const config = loadReleaseConfig(realConfigPath);

    expect(() => validateReleaseConfig(config)).not.toThrow();
  });

  it("binds Creator execution to a real path, binary digest, and bundle metadata", () => {
    const cli = loadBuildCli();
    const executablePath = join(
      createTemporaryRoot("creator-provenance"),
      "CocosCreator",
    );
    const executableBytes = Buffer.from("fixture-cocos-creator", "utf8");
    writeFileSync(executablePath, executableBytes, { mode: 0o755 });
    const config = {
      ...loadReleaseConfig(realConfigPath),
      creatorExecutableRealPath: realpathSync(executablePath),
      creatorExecutableSha256: createHash("sha256")
        .update(executableBytes)
        .digest("hex"),
      creatorBuildResourcesSha256: "f".repeat(64),
    };

    expect(
      cli.inspectCreatorExecutable(executablePath, config, {
        readBundleMetadata: () => ({
          bundleIdentifier: "com.cocos.creator",
          version: "3.8.8",
        }),
        hashCreatorBuildResources: () => config.creatorBuildResourcesSha256,
      }),
    ).toMatchObject({
      creatorBundleIdentifier: "com.cocos.creator",
      creatorBundleVersion: "3.8.8",
      creatorExecutableRealPath: realpathSync(executablePath),
      creatorExecutableSha256: config.creatorExecutableSha256,
      creatorBuildResourcesSha256: config.creatorBuildResourcesSha256,
    });

    expect(() =>
      cli.inspectCreatorExecutable(
        executablePath,
        { ...config, creatorExecutableSha256: "0".repeat(64) },
        {
          readBundleMetadata: () => ({
            bundleIdentifier: "com.cocos.creator",
            version: "3.8.8",
          }),
          hashCreatorBuildResources: () => config.creatorBuildResourcesSha256,
        },
      ),
    ).toThrow("Creator executable SHA-256 does not match release config");
  });

  it("binds Creator provenance to the complete executed application bundle", () => {
    const cli = loadBuildCli();
    const bundleRoot = createTemporaryRoot("creator-build-resources");
    const executablePath = join(
      bundleRoot,
      "CocosCreator.app/Contents/MacOS/CocosCreator",
    );
    const appAsarPath = join(
      bundleRoot,
      "CocosCreator.app/Contents/Resources/app.asar",
    );
    const engineRoot = join(
      bundleRoot,
      "CocosCreator.app/Contents/Resources/resources/3d/engine",
    );
    const unpackedRoot = join(
      bundleRoot,
      "CocosCreator.app/Contents/Resources/app.asar.unpacked",
    );
    const frameworkPath = join(
      bundleRoot,
      "CocosCreator.app/Contents/Frameworks/Electron Framework.framework/Electron Framework",
    );
    mkdirSync(dirname(executablePath), { recursive: true });
    mkdirSync(join(engineRoot, "bin/.cache"), { recursive: true });
    mkdirSync(unpackedRoot, { recursive: true });
    mkdirSync(dirname(frameworkPath), { recursive: true });
    writeFileSync(executablePath, "launcher", { mode: 0o755 });
    writeFileSync(appAsarPath, "asar-a", "utf8");
    writeFileSync(join(engineRoot, "core.js"), "engine-a", "utf8");
    writeFileSync(join(unpackedRoot, "native.node"), "native-a", "utf8");
    writeFileSync(frameworkPath, "electron-a", "utf8");
    writeFileSync(join(engineRoot, "bin/.cache/generated.js"), "cache-a", "utf8");

    const initial = cli.hashCreatorBuildResources(executablePath);
    writeFileSync(join(engineRoot, "bin/.cache/generated.js"), "cache-b", "utf8");
    expect(cli.hashCreatorBuildResources(executablePath)).not.toBe(initial);
    writeFileSync(join(engineRoot, "bin/.cache/generated.js"), "cache-a", "utf8");

    writeFileSync(appAsarPath, "asar-b", "utf8");
    expect(cli.hashCreatorBuildResources(executablePath)).not.toBe(initial);
    writeFileSync(appAsarPath, "asar-a", "utf8");
    writeFileSync(join(engineRoot, "core.js"), "engine-b", "utf8");
    expect(cli.hashCreatorBuildResources(executablePath)).not.toBe(initial);
    writeFileSync(join(engineRoot, "core.js"), "engine-a", "utf8");
    writeFileSync(join(unpackedRoot, "native.node"), "native-b", "utf8");
    expect(cli.hashCreatorBuildResources(executablePath)).not.toBe(initial);
    writeFileSync(join(unpackedRoot, "native.node"), "native-a", "utf8");
    writeFileSync(frameworkPath, "electron-b", "utf8");
    expect(cli.hashCreatorBuildResources(executablePath)).not.toBe(initial);
  });

  it.each([
    ["schemaVersion", 3, "release schemaVersion must be 4"],
    ["gameId", "other", "gameId must be hulebu"],
    ["displayName", "", "displayName must be a non-empty string"],
    ["creatorVersion", "3.8.7", "creatorVersion must be 3.8.8"],
    [
      "creatorExecutableRealPath",
      "relative/creator",
      "creatorExecutableRealPath must be an absolute single-line path",
    ],
    [
      "creatorExecutableSha256",
      "invalid",
      "creatorExecutableSha256 must be a SHA-256 digest",
    ],
    [
      "creatorBuildResourcesSha256",
      "invalid",
      "creatorBuildResourcesSha256 must be a SHA-256 digest",
    ],
    [
      "creatorBundleIdentifier",
      "other.creator",
      "creatorBundleIdentifier must be com.cocos.creator",
    ],
    ["platform", "web-desktop", "platform must be web-mobile"],
    ["debug", true, "debug must be false"],
    ["outputName", "release", "outputName must be web-mobile"],
    ["contentVersion", "draft", "contentVersion must be a semantic version"],
    ["saveSchemaVersion", 0, "saveSchemaVersion must be a positive integer"],
    ["requiredFiles", [], "requiredFiles must be a non-empty array"],
    ["requiredJsonFiles", [], "requiredJsonFiles must be a non-empty array"],
    ["smokePaths", [], "smokePaths must be a non-empty array"],
    [
      "allowedNonZeroExitCodes",
      [],
      "allowedNonZeroExitCodes must be a non-empty array",
    ],
    ["finishedMarker", "", "finishedMarker must be a non-empty string"],
    [
      "forbiddenBundleText",
      [],
      "forbiddenBundleText must be a non-empty array",
    ],
  ])("rejects an invalid %s field", (key, value, message) => {
    const config = loadReleaseConfig(realConfigPath);

    expect(() => validateReleaseConfig({ ...config, [key]: value })).toThrow(
      message,
    );
  });

  it.each(
    (["requiredFiles", "requiredJsonFiles"] as const).flatMap((key) => [
      {
        key,
        label: "non-string",
        value: 42,
        message: "must be a non-empty string",
      },
      { key, label: "empty", value: "", message: "must be a non-empty string" },
      {
        key,
        label: "POSIX absolute",
        value: "/outside.json",
        message: "must be a portable relative path",
      },
      {
        key,
        label: "Windows absolute",
        value: "C:\\outside.json",
        message: "must be a portable relative path",
      },
      {
        key,
        label: "Windows drive-relative",
        value: "C:outside.json",
        message: "must be a portable relative path",
      },
      {
        key,
        label: "backslash-separated",
        value: "src\\settings.json",
        message: "must be a portable relative path",
      },
      {
        key,
        label: "current-directory segment",
        value: "src/./settings.json",
        message: "must not contain dot segments",
      },
      {
        key,
        label: "parent-directory segment",
        value: "src/../settings.json",
        message: "must not contain dot segments",
      },
      {
        key,
        label: "noncanonical separators",
        value: "src//settings.json",
        message: "must be normalized",
      },
    ]),
  )("rejects a $label entry in $key", ({ key, value, message }) => {
    const config = loadReleaseConfig(realConfigPath);
    const index = config[key].length;

    expect(() =>
      validateReleaseConfig({
        ...config,
        [key]: [...config[key], value],
      }),
    ).toThrow(`${key}[${index}] ${message}`);
  });

  it.each([
    { label: "non-string", value: 42, message: "must be a non-empty string" },
    { label: "empty", value: "", message: "must be a non-empty string" },
    {
      label: "path without a root slash",
      value: "src/settings.json",
      message: "must be an origin-relative HTTP path",
    },
    {
      label: "scheme URL",
      value: "https://example.com/settings.json",
      message: "must be an origin-relative HTTP path",
    },
    {
      label: "host-relative URL",
      value: "//example.com/settings.json",
      message: "must be an origin-relative HTTP path",
    },
    {
      label: "backslash",
      value: "/src\\settings.json",
      message: "must not contain backslashes",
    },
    {
      label: "query",
      value: "/src/settings.json?raw=1",
      message: "must not contain query or hash",
    },
    {
      label: "hash",
      value: "/src/settings.json#raw",
      message: "must not contain query or hash",
    },
    {
      label: "literal dot segment",
      value: "/src/./settings.json",
      message: "must not contain dot segments",
    },
    {
      label: "encoded dot segment",
      value: "/src/%2E%2e/settings.json",
      message: "must not contain dot segments",
    },
    {
      label: "multiply encoded dot segment",
      value: "/src/%25252E%25252e/settings.json",
      message: "must not contain dot segments",
    },
    {
      label: "encoded backslash",
      value: "/src/%5csettings.json",
      message: "must not contain backslashes",
    },
    {
      label: "encoded duplicate separator",
      value: "/src/%2f/settings.json",
      message: "must be normalized",
    },
    {
      label: "duplicate separator",
      value: "/src//settings.json",
      message: "must be normalized",
    },
  ])("rejects a $label smoke path", ({ value, message }) => {
    const config = loadReleaseConfig(realConfigPath);
    const index = config.smokePaths.length;

    expect(() =>
      validateReleaseConfig({
        ...config,
        smokePaths: [...config.smokePaths, value],
      }),
    ).toThrow(`smokePaths[${index}] ${message}`);
  });

  it("requires index.html in requiredFiles", () => {
    const config = loadReleaseConfig(realConfigPath);

    expect(() =>
      validateReleaseConfig({
        ...config,
        requiredFiles: config.requiredFiles.filter(
          (entry) => entry !== "index.html",
        ),
      }),
    ).toThrow("requiredFiles must include index.html");
  });

  it("requires every JSON artifact to also be a required file", () => {
    const config = loadReleaseConfig(realConfigPath);

    expect(() =>
      validateReleaseConfig({
        ...config,
        requiredFiles: config.requiredFiles.filter(
          (entry) => entry !== "src/settings.json",
        ),
      }),
    ).toThrow(
      "requiredJsonFiles entry must also be in requiredFiles: src/settings.json",
    );
  });

  it("validates every allowed Creator exit code", () => {
    const config = loadReleaseConfig(realConfigPath);

    expect(() =>
      validateReleaseConfig({
        ...config,
        allowedNonZeroExitCodes: [36, "36"],
      }),
    ).toThrow("allowedNonZeroExitCodes[1] must be a positive integer");
  });

  it("requires the production debug symbol to remain forbidden", () => {
    const config = loadReleaseConfig(realConfigPath);

    expect(() =>
      validateReleaseConfig({
        ...config,
        forbiddenBundleText: ["harmless"],
      }),
    ).toThrow("forbiddenBundleText must include __HULEBU_DEBUG__");
  });

  it("wraps unreadable config failures in the release error", () => {
    const invalidConfigPath = join(
      createTemporaryRoot("config"),
      "release.json",
    );
    writeFileSync(invalidConfigPath, "not-json", "utf8");

    expect(() => loadReleaseConfig(invalidConfigPath)).toThrow(
      HulebuReleaseError,
    );
    expect(() => loadReleaseConfig(invalidConfigPath)).toThrow(
      "Unable to read release config",
    );
  });
});

describe("Hulebu Cocos build artifact validation", () => {
  const config = loadReleaseConfig(realConfigPath);

  it("accepts a complete production build", () => {
    const validBuildRoot = createValidBuild(config);

    expect(validateBuildArtifacts(validBuildRoot, config)).toEqual({
      ok: true,
      errors: [],
    });
  });

  it("reports a missing required index", () => {
    const missingIndexRoot = createValidBuild(config);
    rmSync(join(missingIndexRoot, "index.html"));

    expect(validateBuildArtifacts(missingIndexRoot, config).errors).toContain(
      "missing required file: index.html",
    );
  });

  it("reports invalid required JSON", () => {
    const invalidJsonRoot = createValidBuild(config);
    writeFileSync(
      join(invalidJsonRoot, "src/settings.json"),
      "not-json",
      "utf8",
    );

    expect(validateBuildArtifacts(invalidJsonRoot, config).errors).toContain(
      "invalid JSON: src/settings.json",
    );
  });

  it("reports empty required files", () => {
    const emptyFileRoot = createValidBuild(config);
    writeFileSync(join(emptyFileRoot, "index.js"), "", "utf8");

    expect(validateBuildArtifacts(emptyFileRoot, config).errors).toContain(
      "empty required file: index.js",
    );
  });

  it("requires the Cocos canvas and SystemJS bootstrap", () => {
    const invalidIndexRoot = createValidBuild(config);
    writeFileSync(
      join(invalidIndexRoot, "index.html"),
      "<html></html>",
      "utf8",
    );

    expect(validateBuildArtifacts(invalidIndexRoot, config).errors).toEqual(
      expect.arrayContaining([
        "index.html missing GameCanvas",
        "index.html missing System.import bootstrap",
      ]),
    );
  });

  it("rejects a forbidden debug symbol in any production JavaScript bundle", () => {
    const invalidBuildRoot = createValidBuild(config);
    const nestedBundlePath = join(invalidBuildRoot, "assets/main/runtime.js");
    mkdirSync(dirname(nestedBundlePath), { recursive: true });
    writeFileSync(
      nestedBundlePath,
      "globalThis.__HULEBU_DEBUG__ = {};\n",
      "utf8",
    );

    expect(validateBuildArtifacts(invalidBuildRoot, config).errors).toContain(
      "forbidden production bundle text __HULEBU_DEBUG__ in assets/main/runtime.js",
    );
  });

  it.each(["index.html", "assets/main/runtime.mjs", "assets/main/runtime.cjs"])(
    "rejects a forbidden debug symbol in production artifact %s",
    (relativePath) => {
      const invalidBuildRoot = createValidBuild(config);
      const artifactPath = join(invalidBuildRoot, relativePath);
      mkdirSync(dirname(artifactPath), { recursive: true });
      const existing = existsSync(artifactPath)
        ? readFileSync(artifactPath, "utf8")
        : "";
      writeFileSync(
        artifactPath,
        `${existing}\nglobalThis.__HULEBU_DEBUG__ = {};\n`,
        "utf8",
      );

      expect(validateBuildArtifacts(invalidBuildRoot, config).errors).toContain(
        `forbidden production bundle text __HULEBU_DEBUG__ in ${relativePath}`,
      );
    },
  );

  it("rejects a directory used as a required artifact without throwing", () => {
    const directoryArtifactRoot = createValidBuild(config);
    const artifactPath = join(directoryArtifactRoot, "index.html");
    rmSync(artifactPath);
    mkdirSync(artifactPath);

    expect(() =>
      validateBuildArtifacts(directoryArtifactRoot, config),
    ).not.toThrow();
    expect(
      validateBuildArtifacts(directoryArtifactRoot, config).errors,
    ).toContain("required artifact is not a regular file: index.html");
  });

  it("rejects a direct artifact symlink when symlinks are supported", () => {
    const symlinkBuildRoot = createValidBuild(config);
    const externalRoot = createTemporaryRoot("direct-symlink-target");
    const targetPath = join(externalRoot, "index.js");
    const linkPath = join(symlinkBuildRoot, "index.js");
    writeFileSync(targetPath, "external artifact", "utf8");
    rmSync(linkPath);

    if (!tryCreateSymlink(targetPath, linkPath, "file")) return;

    expect(validateBuildArtifacts(symlinkBuildRoot, config).errors).toContain(
      "required file must not be a symlink: index.js",
    );
  });

  it("rejects an artifact escaping through a parent symlink when supported", () => {
    const symlinkBuildRoot = createValidBuild(config);
    const externalRoot = createTemporaryRoot("parent-symlink-target");
    writeFileSync(
      join(externalRoot, "config.json"),
      JSON.stringify({ valid: true }),
    );
    const parentLinkPath = join(symlinkBuildRoot, "assets/main");
    rmSync(parentLinkPath, { recursive: true });

    if (!tryCreateSymlink(externalRoot, parentLinkPath, "dir")) return;

    expect(validateBuildArtifacts(symlinkBuildRoot, config).errors).toContain(
      "required file escapes build root: assets/main/config.json",
    );
  });

  it("returns a structured error when artifact inspection fails", () => {
    const invalidHierarchyRoot = createValidBuild(config);
    const invalidHierarchyConfig = {
      ...config,
      requiredFiles: [...config.requiredFiles, "index.html/child.js"],
    };

    expect(() =>
      validateBuildArtifacts(invalidHierarchyRoot, invalidHierarchyConfig),
    ).not.toThrow();
    expect(
      validateBuildArtifacts(invalidHierarchyRoot, invalidHierarchyConfig)
        .errors,
    ).toContain("unable to inspect required file: index.html/child.js");
  });

  it("returns a structured error when a validated artifact read fails", () => {
    const readFailureRoot = createValidBuild(config);
    const failingPath = join(readFailureRoot, "src/settings.json");
    const originalReadFileSync = mutableFs.readFileSync;
    mutableFs.readFileSync = (...args: unknown[]) => {
      if (args[0] === failingPath) {
        throw Object.assign(new Error("simulated read failure"), {
          code: "EIO",
        });
      }
      return originalReadFileSync(...args);
    };

    try {
      expect(() =>
        validateBuildArtifacts(readFailureRoot, config),
      ).not.toThrow();
      expect(validateBuildArtifacts(readFailureRoot, config).errors).toContain(
        "unable to read required file: src/settings.json",
      );
    } finally {
      mutableFs.readFileSync = originalReadFileSync;
    }
  });
});

describe("Hulebu Cocos Creator build decision", () => {
  const config = loadReleaseConfig(realConfigPath);

  it("accepts a clean Creator exit without normalization", () => {
    expect(
      evaluateCreatorBuild({
        exitCode: 0,
        logText: `Build with Cocos Creator 3.8.8\n${config.finishedMarker}`,
        artifactErrors: [],
        config,
      }),
    ).toEqual({
      accepted: true,
      actualCreatorVersion: "3.8.8",
      normalized: false,
      originalExitCode: 0,
    });
  });

  it("normalizes Creator exit 36 when the build is otherwise valid", () => {
    expect(
      evaluateCreatorBuild({
        exitCode: 36,
        logText: `Build with Cocos Creator 3.8.8\n${config.finishedMarker}`,
        artifactErrors: [],
        config,
      }),
    ).toEqual({
      accepted: true,
      actualCreatorVersion: "3.8.8",
      normalized: true,
      originalExitCode: 36,
    });
  });

  it("rejects an allowed non-zero exit without the finished marker", () => {
    expect(() =>
      evaluateCreatorBuild({
        exitCode: 36,
        logText: "Build with Cocos Creator 3.8.8\nbuild started",
        artifactErrors: [],
        config,
      }),
    ).toThrow("Creator build log is missing the finished marker");
  });

  it.each([
    ["missing", "build started", "missing Creator version evidence"],
    [
      "mismatched",
      "Build with Cocos Creator 3.8.7",
      "Creator version 3.8.7 does not match 3.8.8",
    ],
    [
      "duplicated",
      "Build with Cocos Creator 3.8.8\nBuild with Cocos Creator 3.8.8",
      "Creator build log has duplicate version evidence",
    ],
  ])("rejects %s Creator version evidence", (_label, versionLog, message) => {
    expect(() =>
      evaluateCreatorBuild({
        exitCode: 0,
        logText: `${versionLog}\n${config.finishedMarker}`,
        artifactErrors: [],
        config,
      }),
    ).toThrow(message);
  });

  it("rejects invalid build artifacts", () => {
    expect(() =>
      evaluateCreatorBuild({
        exitCode: 36,
        logText: `Build with Cocos Creator 3.8.8\n${config.finishedMarker}`,
        artifactErrors: ["missing required file: index.html"],
        config,
      }),
    ).toThrow("Creator build artifacts are invalid");
  });

  it("rejects unsupported Creator exit codes", () => {
    expect(() =>
      evaluateCreatorBuild({
        exitCode: 9,
        logText: `Build with Cocos Creator 3.8.8\n${config.finishedMarker}`,
        artifactErrors: [],
        config,
      }),
    ).toThrow("Creator exited with unsupported code 9");
  });
});

describe("Hulebu Cocos build manifest", () => {
  const config = loadReleaseConfig(realConfigPath);

  it("counts regular files exactly while excluding only the final root manifest", () => {
    const buildRoot = createTemporaryRoot("stats");
    mkdirSync(join(buildRoot, "nested"));
    writeFileSync(join(buildRoot, "index.html"), "abc", "utf8");
    writeFileSync(join(buildRoot, "nested/data.json"), "世界", "utf8");
    writeFileSync(
      join(buildRoot, "nested/hulebu-build.json"),
      "nested",
      "utf8",
    );
    writeFileSync(join(buildRoot, "hulebu-build.json"), "old manifest", "utf8");
    writeFileSync(join(buildRoot, "hulebu-build.json.tmp"), "stale", "utf8");

    expect(collectBuildStats(buildRoot)).toEqual({
      fileCount: 4,
      totalBytes:
        Buffer.byteLength("abc") +
        Buffer.byteLength("世界") +
        Buffer.byteLength("nested") +
        Buffer.byteLength("stale"),
    });
  });

  it("wraps missing and non-directory build roots in the release error", () => {
    const root = createTemporaryRoot("invalid-stats");
    const filePath = join(root, "file.txt");
    writeFileSync(filePath, "file", "utf8");

    expect(() => collectBuildStats(join(root, "missing"))).toThrow(
      HulebuReleaseError,
    );
    expect(() => collectBuildStats(filePath)).toThrow(HulebuReleaseError);
  });

  it("rejects symlinks instead of following them when supported", () => {
    const buildRoot = createTemporaryRoot("stats-symlink");
    const externalRoot = createTemporaryRoot("stats-symlink-target");
    const targetPath = join(externalRoot, "outside.txt");
    writeFileSync(targetPath, "outside", "utf8");

    if (!tryCreateSymlink(targetPath, join(buildRoot, "linked.txt"), "file"))
      return;

    expect(() => collectBuildStats(buildRoot)).toThrow(HulebuReleaseError);
  });

  it("atomically writes the complete manifest with stable build statistics", () => {
    const validBuildRoot = createValidBuild(config);
    const expectedStats = collectBuildStats(validBuildRoot);
    const smokeResults = config.smokePaths.map((pathname) => ({
      pathname,
      status: 200,
      bytes: 42,
    }));
    const input = {
      buildId: `${FULL_COMMIT_A.slice(0, 12)}-20260711T010203Z`,
      commit: FULL_COMMIT_A,
      config,
      creatorDecision: {
        accepted: true,
        actualCreatorVersion: config.creatorVersion,
        normalized: true,
        originalExitCode: 36,
      },
      creatorExecutableEvidence: CREATOR_EXECUTABLE_EVIDENCE,
      cocosTypecheckPassed: true as const,
      createdAt: "2026-07-11T01:02:03.000Z",
      releaseConfigSha256: RELEASE_CONFIG_SHA256,
      sourceInputs: ["formal/a", "formal/b"],
      sourceState: "clean" as const,
      sourceTreeSha256: SOURCE_TREE_SHA256,
      smokeResults,
    };

    const manifest = writeBuildManifest(validBuildRoot, input);
    const expectedData = {
      schemaVersion: 6,
      buildId: input.buildId,
      gameId: config.gameId,
      displayName: config.displayName,
      creatorVersion: config.creatorVersion,
      ...CREATOR_EXECUTABLE_EVIDENCE,
      cocosTypecheckPassed: input.cocosTypecheckPassed,
      platform: config.platform,
      debug: config.debug,
      contentVersion: config.contentVersion,
      saveSchemaVersion: config.saveSchemaVersion,
      commit: input.commit,
      createdAt: input.createdAt,
      sourceInputs: input.sourceInputs,
      sourceState: input.sourceState,
      sourceTreeSha256: input.sourceTreeSha256,
      releaseConfigSha256: input.releaseConfigSha256,
      creatorExitCode: 36,
      creatorExitNormalized: true,
      smokeResults,
      artifactSha256: expect.stringMatching(/^[0-9a-f]{64}$/),
      ...expectedStats,
    };

    expect(manifest).toEqual({
      path: join(validBuildRoot, "hulebu-build.json"),
      data: expectedData,
    });
    expect(JSON.parse(readFileSync(manifest.path, "utf8"))).toEqual(
      expectedData,
    );
    expect(readFileSync(manifest.path, "utf8").endsWith("\n")).toBe(true);
    expect(existsSync(join(validBuildRoot, "hulebu-build.json.tmp"))).toBe(
      false,
    );

    const replacement = writeBuildManifest(validBuildRoot, {
      ...input,
      buildId: `${FULL_COMMIT_A.slice(0, 12)}-20260711T020304Z`,
      createdAt: "2026-07-11T02:03:04.000Z",
    });
    expect(replacement.data).toMatchObject({
      buildId: `${FULL_COMMIT_A.slice(0, 12)}-20260711T020304Z`,
      createdAt: "2026-07-11T02:03:04.000Z",
      ...expectedStats,
    });
  });

  it("reads only a clean manifest for the current commit and source inputs", () => {
    const validBuildRoot = createValidBuild(config);
    const sourceInputs = ["formal/a", "formal/b"];
    const manifest = writeBuildManifest(validBuildRoot, {
      buildId: `${FULL_COMMIT_A.slice(0, 12)}-20260711T010203Z`,
      commit: FULL_COMMIT_A,
      config,
      cocosTypecheckPassed: true,
      creatorDecision: {
        accepted: true,
        actualCreatorVersion: config.creatorVersion,
        normalized: false,
        originalExitCode: 0,
      },
      creatorExecutableEvidence: CREATOR_EXECUTABLE_EVIDENCE,
      createdAt: "2026-07-11T01:02:03.000Z",
      releaseConfigSha256: RELEASE_CONFIG_SHA256,
      sourceInputs,
      sourceState: "clean",
      sourceTreeSha256: SOURCE_TREE_SHA256,
      smokeResults: createSmokeEvidence(config, validBuildRoot),
    });

    expect(
      readBuildManifest(validBuildRoot, {
        commit: FULL_COMMIT_A,
        config,
        releaseConfigSha256: RELEASE_CONFIG_SHA256,
        sourceInputs,
        sourceTreeSha256: SOURCE_TREE_SHA256,
      }),
    ).toEqual(manifest.data);
    expect(() =>
      readBuildManifest(validBuildRoot, {
        commit: FULL_COMMIT_B,
        config,
        releaseConfigSha256: RELEASE_CONFIG_SHA256,
        sourceInputs,
        sourceTreeSha256: SOURCE_TREE_SHA256,
      }),
    ).toThrow("build manifest commit does not match current HEAD");

    writeFileSync(
      manifest.path,
      `${JSON.stringify({ ...manifest.data, sourceState: "dirty" })}\n`,
      "utf8",
    );
    expect(() =>
      readBuildManifest(validBuildRoot, {
        commit: FULL_COMMIT_A,
        config,
        releaseConfigSha256: RELEASE_CONFIG_SHA256,
        sourceInputs,
        sourceTreeSha256: SOURCE_TREE_SHA256,
      }),
    ).toThrow("build manifest sourceState must be clean");
  });

  it("detects same-size artifact tampering", () => {
    const validBuildRoot = createValidBuild(config);
    const sourceInputs = ["formal"];
    writeBuildManifest(validBuildRoot, {
      buildId: `${FULL_COMMIT_A.slice(0, 12)}-20260711T010203Z`,
      commit: FULL_COMMIT_A,
      config,
      cocosTypecheckPassed: true,
      creatorDecision: {
        accepted: true,
        actualCreatorVersion: config.creatorVersion,
        normalized: false,
        originalExitCode: 0,
      },
      creatorExecutableEvidence: CREATOR_EXECUTABLE_EVIDENCE,
      createdAt: "2026-07-11T01:02:03.000Z",
      releaseConfigSha256: RELEASE_CONFIG_SHA256,
      sourceInputs,
      sourceState: "clean",
      sourceTreeSha256: SOURCE_TREE_SHA256,
      smokeResults: createSmokeEvidence(config, validBuildRoot),
    });
    const indexJsPath = join(validBuildRoot, "index.js");
    const original = readFileSync(indexJsPath, "utf8");
    writeFileSync(
      indexJsPath,
      `${original.slice(0, -1)}${original.endsWith("x") ? "y" : "x"}`,
      "utf8",
    );
    expect(statSync(indexJsPath).size).toBe(Buffer.byteLength(original));

    expect(() =>
      readBuildManifest(validBuildRoot, {
        commit: FULL_COMMIT_A,
        config,
        releaseConfigSha256: RELEASE_CONFIG_SHA256,
        sourceInputs,
        sourceTreeSha256: SOURCE_TREE_SHA256,
      }),
    ).toThrow("build manifest artifactSha256 does not match output");
  });

  it("rejects a reserved temporary manifest added after signing", () => {
    const validBuildRoot = createValidBuild(config);
    const sourceInputs = ["formal"];
    writeBuildManifest(validBuildRoot, {
      buildId: `${FULL_COMMIT_A.slice(0, 12)}-20260711T010203Z`,
      commit: FULL_COMMIT_A,
      config,
      cocosTypecheckPassed: true,
      creatorDecision: {
        accepted: true,
        actualCreatorVersion: config.creatorVersion,
        normalized: false,
        originalExitCode: 0,
      },
      creatorExecutableEvidence: CREATOR_EXECUTABLE_EVIDENCE,
      createdAt: "2026-07-11T01:02:03.000Z",
      releaseConfigSha256: RELEASE_CONFIG_SHA256,
      sourceInputs,
      sourceState: "clean",
      sourceTreeSha256: SOURCE_TREE_SHA256,
      smokeResults: createSmokeEvidence(config, validBuildRoot),
    });
    writeFileSync(
      join(validBuildRoot, "hulebu-build.json.tmp"),
      '{"untrusted":true}\n',
      "utf8",
    );

    expect(() =>
      readBuildManifest(validBuildRoot, {
        commit: FULL_COMMIT_A,
        config,
        releaseConfigSha256: RELEASE_CONFIG_SHA256,
        sourceInputs,
        sourceTreeSha256: SOURCE_TREE_SHA256,
      }),
    ).toThrow("build output contains a reserved temporary manifest");
  });

  it.each([
    ["displayName", "伪造标题", "displayName does not match release config"],
    ["createdAt", "July 11, 2026 01:02:03 UTC", "createdAt is invalid"],
    [
      "buildId",
      `${FULL_COMMIT_A.slice(0, 12)}-forged`,
      "buildId does not match commit and timestamp",
    ],
  ])("rejects a tampered manifest %s", (key, value, message) => {
    const validBuildRoot = createValidBuild(config);
    const sourceInputs = ["formal"];
    const manifest = writeBuildManifest(validBuildRoot, {
      buildId: `${FULL_COMMIT_A.slice(0, 12)}-20260711T010203Z`,
      commit: FULL_COMMIT_A,
      config,
      cocosTypecheckPassed: true,
      creatorDecision: {
        accepted: true,
        actualCreatorVersion: config.creatorVersion,
        normalized: false,
        originalExitCode: 0,
      },
      creatorExecutableEvidence: CREATOR_EXECUTABLE_EVIDENCE,
      createdAt: "2026-07-11T01:02:03.000Z",
      releaseConfigSha256: RELEASE_CONFIG_SHA256,
      sourceInputs,
      sourceState: "clean",
      sourceTreeSha256: SOURCE_TREE_SHA256,
      smokeResults: createSmokeEvidence(config, validBuildRoot),
    });
    writeFileSync(
      manifest.path,
      `${JSON.stringify({ ...manifest.data, [key]: value })}\n`,
      "utf8",
    );

    expect(() =>
      readBuildManifest(validBuildRoot, {
        commit: FULL_COMMIT_A,
        config,
        releaseConfigSha256: RELEASE_CONFIG_SHA256,
        sourceInputs,
        sourceTreeSha256: SOURCE_TREE_SHA256,
      }),
    ).toThrow(`build manifest ${message}`);
  });

  it("rejects missing, malformed, or mismatched manifest source inputs", () => {
    const validBuildRoot = createValidBuild(config);
    const manifestPath = join(validBuildRoot, "hulebu-build.json");
    const expected = {
      commit: FULL_COMMIT_A,
      config,
      releaseConfigSha256: RELEASE_CONFIG_SHA256,
      sourceInputs: ["formal"],
      sourceTreeSha256: SOURCE_TREE_SHA256,
    };

    expect(() => readBuildManifest(validBuildRoot, expected)).toThrow(
      "missing build manifest",
    );
    writeFileSync(manifestPath, "not json\n", "utf8");
    expect(() => readBuildManifest(validBuildRoot, expected)).toThrow(
      "invalid build manifest JSON",
    );
    const validManifest = writeBuildManifest(validBuildRoot, {
      buildId: `${FULL_COMMIT_A.slice(0, 12)}-20260711T010203Z`,
      commit: FULL_COMMIT_A,
      config,
      cocosTypecheckPassed: true,
      creatorDecision: {
        accepted: true,
        actualCreatorVersion: config.creatorVersion,
        normalized: false,
        originalExitCode: 0,
      },
      creatorExecutableEvidence: CREATOR_EXECUTABLE_EVIDENCE,
      createdAt: "2026-07-11T01:02:03.000Z",
      releaseConfigSha256: RELEASE_CONFIG_SHA256,
      sourceInputs: expected.sourceInputs,
      sourceState: "clean",
      sourceTreeSha256: SOURCE_TREE_SHA256,
      smokeResults: createSmokeEvidence(config, validBuildRoot),
    });
    writeFileSync(
      manifestPath,
      `${JSON.stringify({ ...validManifest.data, sourceInputs: ["other"] })}\n`,
      "utf8",
    );
    expect(() => readBuildManifest(validBuildRoot, expected)).toThrow(
      "build manifest sourceInputs do not match release inputs",
    );
  });

  it("replaces a stale temporary symlink without altering its target", () => {
    const validBuildRoot = createValidBuild(config);
    const externalRoot = createTemporaryRoot("manifest-symlink-target");
    const externalPath = join(externalRoot, "outside.json");
    const temporaryPath = join(validBuildRoot, "hulebu-build.json.tmp");
    const externalContent = '{"outside":true}\n';
    writeFileSync(externalPath, externalContent, "utf8");

    if (!tryCreateSymlink(externalPath, temporaryPath, "file")) return;

    const manifest = writeBuildManifest(validBuildRoot, {
      buildId: `${FULL_COMMIT_A.slice(0, 12)}-20260711T010203Z`,
      commit: FULL_COMMIT_A,
      config,
      cocosTypecheckPassed: true,
      creatorDecision: {
        accepted: true,
        actualCreatorVersion: config.creatorVersion,
        normalized: false,
        originalExitCode: 0,
      },
      creatorExecutableEvidence: CREATOR_EXECUTABLE_EVIDENCE,
      createdAt: "2026-07-11T01:02:03.000Z",
      releaseConfigSha256: RELEASE_CONFIG_SHA256,
      sourceInputs: ["formal"],
      sourceState: "clean",
      sourceTreeSha256: SOURCE_TREE_SHA256,
      smokeResults: createSmokeEvidence(config, validBuildRoot),
    });

    expect(readFileSync(externalPath, "utf8")).toBe(externalContent);
    expect(lstatSync(manifest.path).isFile()).toBe(true);
    expect(lstatSync(manifest.path).isSymbolicLink()).toBe(false);
    expect(JSON.parse(readFileSync(manifest.path, "utf8"))).toMatchObject({
      buildId: `${FULL_COMMIT_A.slice(0, 12)}-20260711T010203Z`,
    });
  });

  it("reads the manifest through one no-follow descriptor", () => {
    const validBuildRoot = createValidBuild(config);
    const sourceInputs = ["formal"];
    const manifest = writeBuildManifest(validBuildRoot, {
      buildId: `${FULL_COMMIT_A.slice(0, 12)}-20260711T010203Z`,
      commit: FULL_COMMIT_A,
      config,
      cocosTypecheckPassed: true,
      creatorDecision: {
        accepted: true,
        actualCreatorVersion: config.creatorVersion,
        normalized: false,
        originalExitCode: 0,
      },
      creatorExecutableEvidence: CREATOR_EXECUTABLE_EVIDENCE,
      createdAt: "2026-07-11T01:02:03.000Z",
      releaseConfigSha256: RELEASE_CONFIG_SHA256,
      sourceInputs,
      sourceState: "clean",
      sourceTreeSha256: SOURCE_TREE_SHA256,
      smokeResults: createSmokeEvidence(config, validBuildRoot),
    });
    const externalRoot = createTemporaryRoot("manifest-read-race");
    const externalManifestPath = join(externalRoot, "outside.json");
    writeFileSync(
      externalManifestPath,
      readFileSync(manifest.path, "utf8"),
      "utf8",
    );
    const originalReadFileSync = mutableFs.readFileSync;
    let pathReadAttempted = false;
    mutableFs.readFileSync = (...args: unknown[]) => {
      if (args[0] === manifest.path) {
        pathReadAttempted = true;
        rmSync(manifest.path);
        symlinkSync(externalManifestPath, manifest.path, "file");
      }
      return originalReadFileSync(...args);
    };

    try {
      expect(
        readBuildManifest(validBuildRoot, {
          commit: FULL_COMMIT_A,
          config,
          releaseConfigSha256: RELEASE_CONFIG_SHA256,
          sourceInputs,
          sourceTreeSha256: SOURCE_TREE_SHA256,
        }),
      ).toMatchObject({ buildId: manifest.data.buildId });
      expect(pathReadAttempted).toBe(false);
      expect(lstatSync(manifest.path).isSymbolicLink()).toBe(false);
    } finally {
      mutableFs.readFileSync = originalReadFileSync;
    }
  });

  it("removes the temporary manifest when atomic replacement fails", () => {
    const validBuildRoot = createValidBuild(config);
    const originalRenameSync = mutableFs.renameSync;
    mutableFs.renameSync = () => {
      throw new Error("simulated rename failure");
    };

    try {
      expect(() =>
        writeBuildManifest(validBuildRoot, {
          buildId: `${FULL_COMMIT_A.slice(0, 12)}-20260711T010203Z`,
          commit: FULL_COMMIT_A,
          config,
          cocosTypecheckPassed: true,
          creatorDecision: {
            accepted: true,
            actualCreatorVersion: config.creatorVersion,
            normalized: false,
            originalExitCode: 0,
          },
          creatorExecutableEvidence: CREATOR_EXECUTABLE_EVIDENCE,
          createdAt: "2026-07-11T01:02:03.000Z",
          releaseConfigSha256: RELEASE_CONFIG_SHA256,
          sourceInputs: ["formal"],
          sourceState: "clean",
          sourceTreeSha256: SOURCE_TREE_SHA256,
          smokeResults: createSmokeEvidence(config, validBuildRoot),
        }),
      ).toThrow("simulated rename failure");
      expect(existsSync(join(validBuildRoot, "hulebu-build.json.tmp"))).toBe(
        false,
      );
    } finally {
      mutableFs.renameSync = originalRenameSync;
    }
  });
});

describe("Hulebu Cocos build HTTP server", () => {
  it("maps safe encoded paths and rejects unsafe request paths", () => {
    const buildRoot = createTemporaryRoot("resolve");

    expect(resolveRequestPath(buildRoot, "/")).toBe(
      join(buildRoot, "index.html"),
    );
    expect(resolveRequestPath(buildRoot, "/assets/My%20File.bin")).toBe(
      join(buildRoot, "assets/My File.bin"),
    );
    expect(() => resolveRequestPath(buildRoot, "/%2e%2e/package.json")).toThrow(
      "request path escapes the build root",
    );
    expect(() => resolveRequestPath(buildRoot, "/%2E%2E/package.json")).toThrow(
      "request path escapes the build root",
    );
    expect(() => resolveRequestPath(buildRoot, "/..%2fpackage.json")).toThrow(
      "request path escapes the build root",
    );
    expect(() => resolveRequestPath(buildRoot, "/..%5cpackage.json")).toThrow(
      HulebuReleaseError,
    );
    expect(() => resolveRequestPath(buildRoot, "/bad%escape")).toThrow(
      HulebuReleaseError,
    );
    expect(() => resolveRequestPath(buildRoot, "/bad%00path")).toThrow(
      HulebuReleaseError,
    );
    expect(() => resolveRequestPath(buildRoot, "//example.com/file")).toThrow(
      HulebuReleaseError,
    );
  });

  it("serves required content types from an ephemeral loopback origin", async () => {
    const buildRoot = createTemporaryRoot("mime");
    const fixtures = [
      ["index.html", "text/html; charset=utf-8"],
      ["bundle.js", "application/javascript; charset=utf-8"],
      ["style.css", "text/css; charset=utf-8"],
      ["config.json", "application/json; charset=utf-8"],
      ["module.wasm", "application/wasm"],
      ["data.bin", "application/octet-stream"],
      ["image.png", "image/png"],
      ["unknown.dat", "application/octet-stream"],
    ] as const;
    for (const [relativePath] of fixtures) {
      writeFileSync(
        join(buildRoot, relativePath),
        `content:${relativePath}`,
        "utf8",
      );
    }

    const server = await startStaticServer(buildRoot);
    try {
      expect(server.origin).toMatch(/^http:\/\/127\.0\.0\.1:\d+$/);
      expect(Number(new URL(server.origin).port)).toBeGreaterThan(0);

      for (const [relativePath, contentType] of fixtures) {
        const response = await requestRaw(server.origin, `/${relativePath}`);
        expect(response.status).toBe(200);
        expect(response.contentType).toBe(contentType);
        expect(response.contentLength).toBe(String(response.body.byteLength));
      }
    } finally {
      await server.close();
      await server.close();
    }
  });

  it("rejects raw encoded traversal before URL normalization", async () => {
    const buildRoot = createTemporaryRoot("raw-traversal");
    writeFileSync(join(buildRoot, "index.html"), "index", "utf8");
    const server = await startStaticServer(buildRoot);

    try {
      expect(
        (await requestRaw(server.origin, "/%2e%2e/package.json")).status,
      ).toBe(403);
      expect((await requestRaw(server.origin, "/bad%escape")).status).toBe(403);
      expect((await requestRaw(server.origin, "/missing.txt")).status).toBe(
        404,
      );
      expect((await requestRaw(server.origin, "/", "POST")).status).toBe(405);
    } finally {
      await server.close();
    }
  });

  it("does not serve directories or symlinks", async () => {
    const buildRoot = createTemporaryRoot("server-symlink");
    const externalRoot = createTemporaryRoot("server-symlink-target");
    mkdirSync(join(buildRoot, "directory"));
    writeFileSync(join(externalRoot, "outside.txt"), "outside", "utf8");
    const hasSymlink = tryCreateSymlink(
      join(externalRoot, "outside.txt"),
      join(buildRoot, "linked.txt"),
      "file",
    );
    const server = await startStaticServer(buildRoot);

    try {
      expect((await requestRaw(server.origin, "/directory")).status).toBe(404);
      if (hasSymlink) {
        expect((await requestRaw(server.origin, "/linked.txt")).status).toBe(
          404,
        );
      }
    } finally {
      await server.close();
    }
  });

  it("streams the opened file descriptor when the pathname is replaced", async () => {
    const buildRoot = createTemporaryRoot("server-descriptor-race");
    const externalRoot = createTemporaryRoot("server-descriptor-target");
    const filePath = join(buildRoot, "race.txt");
    const externalPath = join(externalRoot, "outside.txt");
    const probePath = join(buildRoot, "symlink-probe.txt");
    writeFileSync(filePath, "trusted-data", "utf8");
    writeFileSync(externalPath, "hostile-data", "utf8");
    const realFilePath = realpathSync(filePath);

    if (!tryCreateSymlink(externalPath, probePath, "file")) return;
    rmSync(probePath);

    const originalFstatSync = mutableFs.fstatSync;
    const originalStatSync = mutableFs.statSync;
    let swapped = false;
    const swapPath = () => {
      if (swapped) return;
      swapped = true;
      rmSync(filePath);
      symlinkSync(externalPath, filePath, "file");
    };
    mutableFs.fstatSync = (...args: unknown[]) => {
      const status = originalFstatSync(...args);
      swapPath();
      return status;
    };
    mutableFs.statSync = (...args: unknown[]) => {
      const status = originalStatSync(...args);
      if (args[0] === filePath || args[0] === realFilePath) swapPath();
      return status;
    };

    const server = await startStaticServer(buildRoot);
    try {
      const response = await requestRaw(server.origin, "/race.txt");
      expect(response.status).toBe(200);
      expect(response.body.toString("utf8")).toBe("trusted-data");
      expect(response.contentLength).toBe(String(response.body.byteLength));
    } finally {
      mutableFs.fstatSync = originalFstatSync;
      mutableFs.statSync = originalStatSync;
      await server.close();
    }
  });
});

describe("Hulebu Cocos build smoke", () => {
  const config = loadReleaseConfig(realConfigPath);

  it("smokes every configured path over real HTTP in input order", async () => {
    const validBuildRoot = createValidBuild(config);

    const results = await smokeBuild(validBuildRoot, config.smokePaths);

    expect(
      results.map(({ pathname, status }) => ({ pathname, status })),
    ).toEqual(config.smokePaths.map((pathname) => ({ pathname, status: 200 })));
    expect(results.every(({ bytes }) => bytes > 0)).toBe(true);
  });

  it("reports actual response bytes and parses JSON payloads", async () => {
    const buildRoot = createTemporaryRoot("smoke-bytes");
    const jsonText = JSON.stringify({ title: "胡了卜" });
    writeFileSync(join(buildRoot, "unicode.json"), jsonText, "utf8");

    await expect(smokeBuild(buildRoot, ["/unicode.json"])).resolves.toEqual([
      {
        pathname: "/unicode.json",
        status: 200,
        bytes: Buffer.byteLength(jsonText),
      },
    ]);
  });

  it.each([
    ["missing response", "/missing.json", undefined, "HTTP 404"],
    ["empty response", "/empty.txt", "", "empty"],
    ["malformed JSON", "/invalid.json", "not-json", "invalid JSON"],
  ])(
    "rejects a path-specific %s and closes its server",
    async (_label, pathname, content, expectedMessage) => {
      const buildRoot = createTemporaryRoot("smoke-failure");
      if (content !== undefined) {
        writeFileSync(join(buildRoot, pathname.slice(1)), content, "utf8");
      }

      await expect(smokeBuild(buildRoot, [pathname])).rejects.toThrow(pathname);
      await expect(smokeBuild(buildRoot, [pathname])).rejects.toThrow(
        expectedMessage,
      );
      writeFileSync(
        join(buildRoot, "healthy.json"),
        '{"healthy":true}',
        "utf8",
      );
      await expect(smokeBuild(buildRoot, ["/healthy.json"])).resolves.toEqual([
        expect.objectContaining({ pathname: "/healthy.json", status: 200 }),
      ]);
    },
  );

  it("wraps response-body transport failures and closes the server", async () => {
    const buildRoot = createTemporaryRoot("smoke-body-failure");
    const pathname = "/broken.bin";
    writeFileSync(join(buildRoot, pathname.slice(1)), Buffer.alloc(256 * 1024));
    const originalCreateReadStream = mutableFs.createReadStream;
    let failureInjected = false;
    mutableFs.createReadStream = (...args: unknown[]) => {
      const stream = originalCreateReadStream(...args);
      if (!failureInjected) {
        failureInjected = true;
        stream.once("data", () => {
          stream.destroy(new Error("simulated response-body failure"));
        });
      }
      return stream;
    };

    let failure: unknown;
    try {
      failure = await smokeBuild(buildRoot, [pathname]).catch(
        (error: unknown) => error,
      );
    } finally {
      mutableFs.createReadStream = originalCreateReadStream;
    }

    expect(failure).toBeInstanceOf(HulebuReleaseError);
    expect((failure as Error).message).toContain(pathname);

    writeFileSync(join(buildRoot, "healthy.json"), '{"healthy":true}', "utf8");
    await expect(smokeBuild(buildRoot, ["/healthy.json"])).resolves.toEqual([
      expect.objectContaining({ pathname: "/healthy.json", status: 200 }),
    ]);
  });

  it("rejects full and protocol-relative smoke URLs", async () => {
    const buildRoot = createTemporaryRoot("smoke-url");

    await expect(
      smokeBuild(buildRoot, ["https://example.com/"]),
    ).rejects.toThrow(HulebuReleaseError);
    await expect(smokeBuild(buildRoot, ["//example.com/"])).rejects.toThrow(
      HulebuReleaseError,
    );
  });
});

describe("Hulebu Cocos production build CLI", () => {
  const config = loadReleaseConfig(realConfigPath);

  function createSuccessfulReleaseEffects(
    outputRoot: string,
    projectRoot: string,
    overrides: Record<string, unknown> = {},
  ): Record<string, unknown> {
    const lifecycle = createMockReleaseLifecycle(outputRoot, projectRoot);
    return {
      ...lifecycle,
      captureReleaseSourceState: () => ({
        commit: FULL_COMMIT_A,
        sourceInputs: ["formal"],
        sourceState: "clean",
        sourceTreeSha256: SOURCE_TREE_SHA256,
      }),
      environment: {},
      evaluateCreatorBuild: () => ({
        accepted: true,
        actualCreatorVersion: config.creatorVersion,
        normalized: false,
        originalExitCode: 0,
      }),
      hashFileSha256: () => RELEASE_CONFIG_SHA256,
      loadReleaseConfig: () => config,
      now: () => new Date("2026-07-11T01:02:03.000Z"),
      paths: { configPath: realConfigPath, projectRoot, repositoryRoot },
      readBuildManifest: () => ({
        buildId: `${FULL_COMMIT_A.slice(0, 12)}-20260711T010203Z`,
        commit: FULL_COMMIT_A,
        createdAt: "2026-07-11T01:02:03.000Z",
      }),
      releaseSourceInputs: ["formal"],
      runCreatorProcess: async () => ({
        logPath: lifecycle.attemptLogPath,
        logText: `Build with Cocos Creator 3.8.8\n${config.finishedMarker}`,
        outcome: { kind: "exit", exitCode: 0 },
      }),
      smokeBuild: async () => [],
      validateBuildArtifacts: () => ({ ok: true, errors: [] }),
      writeBuildManifest: () => ({ path: "manifest", data: {} }),
      ...overrides,
    };
  }

  it("registers import-safe build and verify commands", () => {
    const rootPackage = JSON.parse(readFileSync(rootPackagePath, "utf8"));
    const cli = loadBuildCli();

    expect(rootPackage.scripts).toMatchObject({
      "game:hulebu:build":
        "node apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs",
      "game:hulebu:verify-build":
        "node apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs --verify-only",
    });
    expect(cli.DEFAULT_CREATOR_EXECUTABLE).toBe(
      "/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator",
    );
  });

  it("pins the complete formal source input allowlist", () => {
    const cli = loadBuildCli();

    expect(cli.RELEASE_SOURCE_INPUTS).toEqual([
      "apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/.creator",
      "apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets",
      "apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/package.json",
      "apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/settings/v2/packages",
      "apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/tsconfig.json",
      "apps/game/mahjong-roguelike/release/hulebu-v1.release.json",
      "apps/game/mahjong-roguelike/scripts/build-hulebu-cocos.cjs",
      "apps/game/mahjong-roguelike/scripts/hulebu-cocos-release.cjs",
      "package.json",
    ]);
  });

  it.each([
    [" M formal/tracked.txt\0", "formal/tracked.txt"],
    [" D formal/deleted.txt\0", "formal/deleted.txt"],
    ["?? formal/untracked.txt\0", "formal/untracked.txt"],
    ["!! formal/ignored.txt\0", "formal/ignored.txt"],
  ])("rejects dirty formal input status %j", (status, expectedPath) => {
    const cli = loadBuildCli();
    const repositoryRoot = createTemporaryRoot("cli-dirty-source");
    const git = (...args: string[]) => {
      expect(args).toEqual([
        "status",
        "--porcelain=v1",
        "-z",
        "--untracked-files=all",
        "--ignored=matching",
        "--no-renames",
        "--",
        ":(literal)formal",
      ]);
      return status;
    };

    expect(() =>
      cli.assertReleaseInputsClean({
        repositoryRoot,
        sourceInputs: ["formal"],
        git,
      } as never),
    ).toThrow(`formal build inputs are dirty: ${expectedPath}`);
  });

  it("accepts clean formal inputs while ignoring unrelated paths", () => {
    const cli = loadBuildCli();
    const temporaryRepositoryRoot = createTemporaryGitRepository(
      "cli-clean-source",
    );
    writeFileSync(join(temporaryRepositoryRoot, "unrelated.txt"), "dirty\n", "utf8");

    const evidence = cli.assertReleaseInputsClean({
      repositoryRoot: temporaryRepositoryRoot,
      sourceInputs: ["formal/a.txt", "formal/b.txt"],
    });

    expect(evidence).toMatchObject({
      sourceInputs: ["formal/a.txt", "formal/b.txt"],
      sourceState: "clean",
    });
    expect(evidence.sourceTreeSha256).toMatch(/^[0-9a-f]{64}$/);
  });

  it("rejects a source input root that matches no tracked file", () => {
    const cli = loadBuildCli();
    const temporaryRepositoryRoot = createTemporaryGitRepository(
      "cli-missing-source-root",
    );

    expect(() =>
      cli.assertReleaseInputsClean({
        repositoryRoot: temporaryRepositoryRoot,
        sourceInputs: ["formal/missing"],
      }),
    ).toThrow(
      "formal build input paths do not match tracked files: formal/missing",
    );
  });

  it.each(["--assume-unchanged", "--skip-worktree"])(
    "rejects the special index flag %s even when status is clean",
    (flag) => {
      const cli = loadBuildCli();
      const temporaryRepositoryRoot = createTemporaryGitRepository(
        "cli-special-index",
      );
      execFileSync("git", ["update-index", flag, "formal/a.txt"], {
        cwd: temporaryRepositoryRoot,
      });
      writeFileSync(join(temporaryRepositoryRoot, "formal/a.txt"), "hidden\n", "utf8");

      expect(() =>
        cli.assertReleaseInputsClean({
          repositoryRoot: temporaryRepositoryRoot,
          sourceInputs: ["formal"],
        }),
      ).toThrow("formal build inputs use special index flags: formal/a.txt");
    },
  );

  it.each(["120000", "160000"])(
    "rejects tracked variable source entry mode %s",
    (mode) => {
      const cli = loadBuildCli();
      let callCount = 0;

      expect(() =>
        cli.assertReleaseInputsClean({
          repositoryRoot: createTemporaryRoot("cli-variable-entry"),
          sourceInputs: ["formal"],
          git: (...args: string[]) => {
            callCount += 1;
            if (args[0] === "status") return "";
            return `${mode} ${"a".repeat(40)} 0\tformal/link\0`;
          },
        } as never),
      ).toThrow("formal build inputs contain a symlink or gitlink: formal/link");
      expect(callCount).toBe(2);
    },
  );

  it("rejects malformed or non-UTF-8 Git status", () => {
    const cli = loadBuildCli();
    const repositoryRoot = createTemporaryRoot("cli-malformed-status");

    expect(() =>
      cli.assertReleaseInputsClean({
        repositoryRoot,
        sourceInputs: ["formal"],
        git: () => "broken\0",
      } as never),
    ).toThrow("Git returned malformed formal build status");
    expect(() =>
      cli.assertReleaseInputsClean({
        repositoryRoot,
        sourceInputs: ["formal"],
        git: () => Buffer.from([0xff, 0]),
      } as never),
    ).toThrow("Git returned non-UTF-8 formal build status");
  });

  it("parses strict arguments with CLI-over-environment precedence", () => {
    const cli = loadBuildCli();

    expect(cli.parseArguments([], {})).toEqual({
      creatorExecutable: cli.DEFAULT_CREATOR_EXECUTABLE,
      verifyOnly: false,
    });
    expect(
      cli.parseArguments([], { COCOS_CREATOR_BIN: "/env/creator" }),
    ).toEqual({
      creatorExecutable: "/env/creator",
      verifyOnly: false,
    });
    expect(
      cli.parseArguments(
        [
          "--output-root",
          "relative-output",
          "--verify-only",
          "--creator",
          "/cli/creator",
        ],
        { COCOS_CREATOR_BIN: "/env/creator" },
      ),
    ).toEqual({
      creatorExecutable: "/cli/creator",
      outputRoot: "relative-output",
      verifyOnly: true,
    });
  });

  it.each([
    [["--creator"], "Missing value for --creator"],
    [["--creator", "--verify-only"], "Missing value for --creator"],
    [["--output-root"], "Missing value for --output-root"],
    [["--creator", "/a", "--creator", "/b"], "Duplicate argument: --creator"],
    [
      ["--output-root", "/a", "--output-root", "/b"],
      "Duplicate argument: --output-root",
    ],
    [["--verify-only", "--verify-only"], "Duplicate argument: --verify-only"],
    [["--creator=/a"], "Unknown argument: --creator=/a"],
    [["positional"], "Unknown argument: positional"],
  ])("rejects invalid argv %j", (argv, message) => {
    expect(() => loadBuildCli().parseArguments(argv, {})).toThrow(message);
  });

  it("resolves the production output and exact Creator argv", () => {
    const cli = loadBuildCli();
    const projectRoot = createTemporaryRoot("cli-project");
    const paths = cli.resolveOutputPaths({
      config,
      cwd: repositoryRoot,
      projectRoot,
    });

    expect(paths).toEqual({
      outputRoot: join(projectRoot, "build/production"),
      buildRoot: join(projectRoot, "build/production/web-mobile"),
    });
    expect(
      cli.buildCreatorArguments({
        config,
        outputRoot: paths.outputRoot,
        projectRoot,
      }),
    ).toEqual([
      "--project",
      projectRoot,
      "--build",
      `platform=web-mobile;debug=false;buildPath=${paths.outputRoot};outputName=web-mobile`,
    ]);
    expect(() =>
      cli.resolveOutputPaths({
        config,
        cwd: repositoryRoot,
        outputRoot: "/",
        projectRoot,
      }),
    ).toThrow("output root must not be a filesystem root");
    expect(() =>
      cli.resolveOutputPaths({
        config,
        cwd: repositoryRoot,
        outputRoot: "build;debug=true",
        projectRoot,
      }),
    ).toThrow("output root contains characters unsupported by Creator");
  });

  it("rejects an output root overlapping formal release inputs before locking", async () => {
    const cli = loadBuildCli();
    let lockCalled = false;

    await expect(
      cli.runRelease(
        [
          "--output-root",
          "apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/assets/build",
        ],
        {
          acquireOutputLock: () => {
            lockCalled = true;
            return { release: () => undefined };
          },
          cwd: repositoryRoot,
          environment: {},
          hashFileSha256: () => RELEASE_CONFIG_SHA256,
          loadReleaseConfig: () => config,
        },
      ),
    ).rejects.toThrow("output root overlaps formal build inputs");
    expect(lockCalled).toBe(false);
  });

  it("creates an isolated project snapshot from the exact commit", () => {
    const cli = loadBuildCli();
    const temporaryRepositoryRoot = createTemporaryGitRepository(
      "cli-exact-snapshot",
    );
    const projectRoot = join(temporaryRepositoryRoot, "formal");
    const informationPath = join(
      projectRoot,
      "settings/v2/packages/information.json",
    );
    mkdirSync(dirname(informationPath), { recursive: true });
    writeFileSync(informationPath, '{"enable":false}\n', "utf8");
    execFileSync("git", ["add", "formal/settings/v2/packages/information.json"], {
      cwd: temporaryRepositoryRoot,
    });
    execFileSync("git", ["commit", "--quiet", "-m", "fixture information"], {
      cwd: temporaryRepositoryRoot,
    });
    const commit = execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: temporaryRepositoryRoot,
      encoding: "utf8",
    }).trim();
    writeFileSync(join(projectRoot, "a.txt"), "working-tree-b\n", "utf8");
    const snapshotContainer = createTemporaryRoot("cli-snapshot-container");
    const snapshotContainerAlias = join(
      createTemporaryRoot("cli-snapshot-container-alias"),
      "snapshot-root",
    );
    symlinkSync(snapshotContainer, snapshotContainerAlias, "dir");

    const snapshot = cli.createExactCommitProjectSnapshot({
      commit,
      projectRoot,
      repositoryRoot: temporaryRepositoryRoot,
      temporaryRoot: snapshotContainerAlias,
    });
    expect(readFileSync(join(snapshot.projectRoot, "a.txt"), "utf8")).toBe(
      "tracked-a\n",
    );
    expect(snapshot.checkoutRoot).toBe(realpathSync(snapshot.checkoutRoot));
    expect(
      snapshot.checkoutRoot.startsWith(`${realpathSync(snapshotContainer)}/`),
    ).toBe(true);
    expect(realpathSync(snapshot.projectRoot)).not.toBe(realpathSync(projectRoot));
    const snapshotInformationPath = join(
      snapshot.projectRoot,
      "settings/v2/packages/information.json",
    );
    expect(statSync(snapshotInformationPath).mode & 0o777).toBe(0o444);
    expect(() =>
      writeFileSync(snapshotInformationPath, '{"enable":true}\n', "utf8"),
    ).toThrow();
    expect(
      execFileSync("git", ["worktree", "list", "--porcelain"], {
        cwd: temporaryRepositoryRoot,
        encoding: "utf8",
      }),
    ).toContain(snapshot.checkoutRoot);

    snapshot.release();
    expect(existsSync(snapshot.checkoutRoot)).toBe(false);
    expect(
      execFileSync("git", ["worktree", "list", "--porcelain"], {
        cwd: temporaryRepositoryRoot,
        encoding: "utf8",
      }),
    ).not.toContain(snapshot.checkoutRoot);
  });

  it("retries only snapshot container cleanup after worktree removal succeeds", () => {
    const cli = loadBuildCli();
    const temporaryRepositoryRoot = createTemporaryGitRepository(
      "cli-snapshot-release-retry",
    );
    const informationPath = join(
      temporaryRepositoryRoot,
      "formal/settings/v2/packages/information.json",
    );
    mkdirSync(dirname(informationPath), { recursive: true });
    writeFileSync(informationPath, '{"enable":false}\n', "utf8");
    execFileSync("git", ["add", "formal/settings/v2/packages/information.json"], {
      cwd: temporaryRepositoryRoot,
    });
    execFileSync("git", ["commit", "--quiet", "-m", "fixture information"], {
      cwd: temporaryRepositoryRoot,
    });
    const commit = execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: temporaryRepositoryRoot,
      encoding: "utf8",
    }).trim();
    const snapshot = cli.createExactCommitProjectSnapshot({
      commit,
      projectRoot: join(temporaryRepositoryRoot, "formal"),
      repositoryRoot: temporaryRepositoryRoot,
      temporaryRoot: createTemporaryRoot("cli-snapshot-release-container"),
    });
    const containerRoot = dirname(snapshot.checkoutRoot);
    const originalRmSync = mutableFs.rmSync;
    let failedOnce = false;
    mutableFs.rmSync = (...args: unknown[]) => {
      if (args[0] === containerRoot && !failedOnce) {
        failedOnce = true;
        throw new Error("simulated snapshot container cleanup failure");
      }
      return originalRmSync(...args);
    };

    try {
      expect(() => snapshot.release()).toThrow(
        "simulated snapshot container cleanup failure",
      );
      expect(
        execFileSync("git", ["worktree", "list", "--porcelain"], {
          cwd: temporaryRepositoryRoot,
          encoding: "utf8",
        }),
      ).not.toContain(snapshot.checkoutRoot);
      expect(() => snapshot.release()).not.toThrow();
      expect(existsSync(containerRoot)).toBe(false);
    } finally {
      mutableFs.rmSync = originalRmSync;
    }
  });

  it("promotes a validated attempt and can finalize old backups", () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-promote-success");
    const finalBuildRoot = join(outputRoot, "web-mobile");
    const finalLogPath = join(outputRoot, "hulebu-cocos-build.log");
    mkdirSync(finalBuildRoot);
    writeFileSync(join(finalBuildRoot, "version.txt"), "old", "utf8");
    writeFileSync(finalLogPath, "old-log", "utf8");
    const attempt = cli.createBuildAttempt({
      outputName: "web-mobile",
      outputRoot,
    });
    mkdirSync(attempt.buildRoot);
    writeFileSync(join(attempt.buildRoot, "version.txt"), "new", "utf8");
    writeFileSync(attempt.logPath, "new-log", "utf8");

    const promotion = cli.beginBuildPromotion({
      attemptBuildRoot: attempt.buildRoot,
      attemptLogPath: attempt.logPath,
      finalBuildRoot,
      finalLogPath,
      outputRoot,
    });
    expect(readFileSync(join(finalBuildRoot, "version.txt"), "utf8")).toBe(
      "new",
    );
    expect(readFileSync(finalLogPath, "utf8")).toBe("new-log");
    expect(promotion.finalize()).toEqual({ cleanupWarnings: [] });
    attempt.cleanup();
    expect(
      readdirSync(outputRoot).filter((entry) =>
        entry.startsWith(".hulebu-backup-"),
      ),
    ).toEqual([]);
  });

  it("restores the old build and log when promotion fails midway", () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-promote-rollback");
    const finalBuildRoot = join(outputRoot, "web-mobile");
    const finalLogPath = join(outputRoot, "hulebu-cocos-build.log");
    mkdirSync(finalBuildRoot);
    writeFileSync(join(finalBuildRoot, "version.txt"), "old", "utf8");
    writeFileSync(finalLogPath, "old-log", "utf8");
    const attempt = cli.createBuildAttempt({
      outputName: "web-mobile",
      outputRoot,
    });
    mkdirSync(attempt.buildRoot);
    writeFileSync(join(attempt.buildRoot, "version.txt"), "new", "utf8");
    writeFileSync(attempt.logPath, "new-log", "utf8");
    let renameCount = 0;

    expect(() =>
      cli.beginBuildPromotion({
        attemptBuildRoot: attempt.buildRoot,
        attemptLogPath: attempt.logPath,
        finalBuildRoot,
        finalLogPath,
        outputRoot,
        renameSync: (oldPath, newPath) => {
          renameCount += 1;
          if (renameCount === 4) throw new Error("simulated log promotion failure");
          renameSync(oldPath, newPath);
        },
      }),
    ).toThrow("simulated log promotion failure");
    expect(readFileSync(join(finalBuildRoot, "version.txt"), "utf8")).toBe(
      "old",
    );
    expect(readFileSync(finalLogPath, "utf8")).toBe("old-log");
    expect(readFileSync(join(attempt.buildRoot, "version.txt"), "utf8")).toBe(
      "new",
    );
    expect(readFileSync(attempt.logPath, "utf8")).toBe("new-log");
  });

  it("continues a partially failed rollback without moving restored files twice", () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-promote-rollback-retry");
    const finalBuildRoot = join(outputRoot, "web-mobile");
    const finalLogPath = join(outputRoot, "hulebu-cocos-build.log");
    mkdirSync(finalBuildRoot);
    writeFileSync(join(finalBuildRoot, "version.txt"), "old", "utf8");
    writeFileSync(finalLogPath, "old-log", "utf8");
    const attempt = cli.createBuildAttempt({
      outputName: "web-mobile",
      outputRoot,
    });
    mkdirSync(attempt.buildRoot);
    writeFileSync(join(attempt.buildRoot, "version.txt"), "new", "utf8");
    writeFileSync(attempt.logPath, "new-log", "utf8");
    let failNewBuildRollback = true;
    const promotion = cli.beginBuildPromotion({
      attemptBuildRoot: attempt.buildRoot,
      attemptLogPath: attempt.logPath,
      finalBuildRoot,
      finalLogPath,
      outputRoot,
      renameSync: (oldPath, newPath) => {
        if (
          failNewBuildRollback &&
          oldPath === finalBuildRoot &&
          newPath === attempt.buildRoot
        ) {
          failNewBuildRollback = false;
          throw new Error("simulated first rollback failure");
        }
        renameSync(oldPath, newPath);
      },
    });

    expect(() => promotion.rollback()).toThrow(
      "simulated first rollback failure",
    );
    expect(() => promotion.rollback()).not.toThrow();
    expect(readFileSync(join(finalBuildRoot, "version.txt"), "utf8")).toBe(
      "old",
    );
    expect(readFileSync(finalLogPath, "utf8")).toBe("old-log");
    expect(readFileSync(join(attempt.buildRoot, "version.txt"), "utf8")).toBe(
      "new",
    );
    expect(readFileSync(attempt.logPath, "utf8")).toBe("new-log");
  });

  it("rolls back an interrupted promotion journal before the next build", () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-promote-journal-rollback");
    const token = "e".repeat(32);
    const attemptName = ".hulebu-attempt-crashed";
    const attemptRoot = join(outputRoot, attemptName);
    const finalBuildRoot = join(outputRoot, "web-mobile");
    const finalLogPath = join(outputRoot, "hulebu-cocos-build.log");
    const backupBuildName = `.hulebu-backup-build-${token}`;
    const backupLogName = `.hulebu-backup-log-${token}`;
    mkdirSync(finalBuildRoot);
    writeFileSync(join(finalBuildRoot, "version.txt"), "new", "utf8");
    mkdirSync(attemptRoot);
    writeFileSync(join(attemptRoot, "hulebu-cocos-build.log"), "new-log", "utf8");
    mkdirSync(join(outputRoot, backupBuildName));
    writeFileSync(
      join(outputRoot, backupBuildName, "version.txt"),
      "old",
      "utf8",
    );
    writeFileSync(join(outputRoot, backupLogName), "old-log", "utf8");
    writeFileSync(
      join(outputRoot, ".hulebu-cocos-promotion.json"),
      `${JSON.stringify({
        schemaVersion: 1,
        token,
        phase: "promoting",
        step: "new-build-published",
        attemptName,
        backupBuildName,
        backupLogName,
        finalBuildName: "web-mobile",
        finalLogName: "hulebu-cocos-build.log",
        hadOldBuild: true,
        hadOldLog: true,
      })}\n`,
      { encoding: "utf8", mode: 0o600 },
    );

    expect(cli.recoverPendingBuildPromotion(outputRoot)).toEqual({
      action: "rolled-back",
      cleanupWarnings: [],
      recovered: true,
    });
    expect(readFileSync(join(finalBuildRoot, "version.txt"), "utf8")).toBe(
      "old",
    );
    expect(readFileSync(finalLogPath, "utf8")).toBe("old-log");
    expect(existsSync(attemptRoot)).toBe(false);
    expect(existsSync(join(outputRoot, backupBuildName))).toBe(false);
    expect(existsSync(join(outputRoot, backupLogName))).toBe(false);
    expect(
      existsSync(join(outputRoot, ".hulebu-cocos-promotion.json")),
    ).toBe(false);
  });

  it("completes cleanup for a committed promotion journal", () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-promote-journal-committed");
    const token = "f".repeat(32);
    const attemptName = ".hulebu-attempt-committed";
    const backupBuildName = `.hulebu-backup-build-${token}`;
    const backupLogName = `.hulebu-backup-log-${token}`;
    const attemptRoot = join(outputRoot, attemptName);
    const finalBuildRoot = join(outputRoot, "web-mobile");
    const finalLogPath = join(outputRoot, "hulebu-cocos-build.log");
    mkdirSync(finalBuildRoot);
    writeFileSync(join(finalBuildRoot, "version.txt"), "new", "utf8");
    writeFileSync(finalLogPath, "new-log", "utf8");
    mkdirSync(attemptRoot);
    mkdirSync(join(outputRoot, backupBuildName));
    writeFileSync(
      join(outputRoot, backupBuildName, "version.txt"),
      "old",
      "utf8",
    );
    writeFileSync(join(outputRoot, backupLogName), "old-log", "utf8");
    writeFileSync(
      join(outputRoot, ".hulebu-cocos-promotion.json"),
      `${JSON.stringify({
        schemaVersion: 1,
        token,
        phase: "committed",
        step: "publication-verified",
        attemptName,
        backupBuildName,
        backupLogName,
        finalBuildName: "web-mobile",
        finalLogName: "hulebu-cocos-build.log",
        hadOldBuild: true,
        hadOldLog: true,
      })}\n`,
      { encoding: "utf8", mode: 0o600 },
    );

    expect(cli.recoverPendingBuildPromotion(outputRoot)).toEqual({
      action: "completed",
      cleanupWarnings: [],
      recovered: true,
    });
    expect(readFileSync(join(finalBuildRoot, "version.txt"), "utf8")).toBe(
      "new",
    );
    expect(readFileSync(finalLogPath, "utf8")).toBe("new-log");
    expect(existsSync(attemptRoot)).toBe(false);
    expect(existsSync(join(outputRoot, backupBuildName))).toBe(false);
    expect(existsSync(join(outputRoot, backupLogName))).toBe(false);
    expect(
      existsSync(join(outputRoot, ".hulebu-cocos-promotion.json")),
    ).toBe(false);
  });

  it("does not overwrite a pending promotion journal", () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-promote-journal-pending");
    const pendingToken = "d".repeat(32);
    const journalPath = join(outputRoot, ".hulebu-cocos-promotion.json");
    const pendingJournal = `${JSON.stringify({
      schemaVersion: 1,
      token: pendingToken,
      phase: "promoting",
      step: "old-build-parked",
      attemptName: ".hulebu-attempt-existing",
      backupBuildName: `.hulebu-backup-build-${pendingToken}`,
      backupLogName: `.hulebu-backup-log-${pendingToken}`,
      finalBuildName: "web-mobile",
      finalLogName: "hulebu-cocos-build.log",
      hadOldBuild: true,
      hadOldLog: true,
    })}\n`;
    writeFileSync(journalPath, pendingJournal, { encoding: "utf8", mode: 0o600 });
    const attempt = cli.createBuildAttempt({
      outputName: "web-mobile",
      outputRoot,
    });
    mkdirSync(attempt.buildRoot);
    writeFileSync(join(attempt.buildRoot, "version.txt"), "new", "utf8");
    writeFileSync(attempt.logPath, "new-log", "utf8");

    expect(() =>
      cli.beginBuildPromotion({
        attemptBuildRoot: attempt.buildRoot,
        attemptLogPath: attempt.logPath,
        finalBuildRoot: join(outputRoot, "web-mobile"),
        finalLogPath: join(outputRoot, "hulebu-cocos-build.log"),
        outputRoot,
      }),
    ).toThrow("pending build promotion must be recovered");
    expect(readFileSync(journalPath, "utf8")).toBe(pendingJournal);
    expect(readFileSync(join(attempt.buildRoot, "version.txt"), "utf8")).toBe(
      "new",
    );
  });

  it("creates an isolated attempt without touching the formal build", () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-attempt-isolation");
    const buildRoot = join(outputRoot, "web-mobile");
    mkdirSync(buildRoot);
    writeFileSync(join(buildRoot, "old.txt"), "old", "utf8");
    writeFileSync(join(outputRoot, "keep.txt"), "keep", "utf8");

    const attempt = cli.createBuildAttempt({
      outputName: "web-mobile",
      outputRoot,
    });

    expect(readFileSync(join(buildRoot, "old.txt"), "utf8")).toBe("old");
    expect(readFileSync(join(outputRoot, "keep.txt"), "utf8")).toBe("keep");
    expect(dirname(attempt.outputRoot)).toBe(outputRoot);
    expect(attempt.buildRoot).toBe(join(attempt.outputRoot, "web-mobile"));
    attempt.cleanup();
    expect(existsSync(buildRoot)).toBe(true);
  });

  it("reaps a stale orphan attempt only after its wrapper and Creator are dead", () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-attempt-reap");
    const createdAt = new Date("2026-07-11T01:00:00.000Z");
    const attempt = cli.createBuildAttempt({
      hostname: "test-host",
      now: () => createdAt,
      outputName: "web-mobile",
      outputRoot,
      pid: 4242,
      tokenFactory: () => "a".repeat(64),
    });
    mkdirSync(attempt.buildRoot);
    writeFileSync(join(attempt.buildRoot, "large-output.bin"), "orphan", "utf8");
    attempt.markCreatorSpawning();
    attempt.recordCreatorPid(4343);

    expect(
      cli.reapOrphanBuildAttempts(outputRoot, {
        hostname: "test-host",
        now: () => new Date("2026-07-11T03:00:00.000Z"),
        probePid: () => "dead",
        staleGraceMs: 30_000,
      }),
    ).toEqual({
      cleanupWarnings: [],
      reapedAttempts: [basename(attempt.outputRoot)],
    });
    expect(existsSync(attempt.outputRoot)).toBe(false);
  });

  it("never reaps an indeterminate spawning attempt", () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-attempt-spawning");
    const attempt = cli.createBuildAttempt({
      hostname: "test-host",
      now: () => new Date("2026-07-11T01:00:00.000Z"),
      outputName: "web-mobile",
      outputRoot,
      pid: 4242,
      tokenFactory: () => "c".repeat(64),
    });
    attempt.markCreatorSpawning();

    const result = cli.reapOrphanBuildAttempts(outputRoot, {
      hostname: "test-host",
      now: () => new Date("2026-07-12T03:00:00.000Z"),
      probePid: () => "dead",
      staleGraceMs: 30_000,
    });

    expect(result.reapedAttempts).toEqual([]);
    expect(result.cleanupWarnings).toEqual([
      expect.stringContaining("indeterminate Creator spawn"),
    ]);
    expect(existsSync(attempt.outputRoot)).toBe(true);
  });

  it("retries a quarantined orphan tombstone after deletion is interrupted", () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-attempt-tombstone-retry");
    const attempt = cli.createBuildAttempt({
      hostname: "test-host",
      now: () => new Date("2026-07-11T01:00:00.000Z"),
      outputName: "web-mobile",
      outputRoot,
      pid: 4242,
      tokenFactory: () => "d".repeat(64),
    });
    mkdirSync(attempt.buildRoot);
    writeFileSync(join(attempt.buildRoot, "large-output.bin"), "orphan", "utf8");
    const originalRmSync = mutableFs.rmSync;
    let interrupted = false;
    mutableFs.rmSync = (...args: unknown[]) => {
      if (
        !interrupted &&
        typeof args[0] === "string" &&
        basename(args[0]).startsWith(".hulebu-reaped-")
      ) {
        interrupted = true;
        originalRmSync(join(args[0], ".hulebu-attempt-owner.json"), {
          force: true,
        });
        throw new Error("simulated tombstone deletion interruption");
      }
      return originalRmSync(...args);
    };

    try {
      const first = cli.reapOrphanBuildAttempts(outputRoot, {
        hostname: "test-host",
        now: () => new Date("2026-07-11T03:00:00.000Z"),
        probePid: () => "dead",
        staleGraceMs: 30_000,
      });
      expect(first.reapedAttempts).toEqual([]);
      expect(first.cleanupWarnings).toEqual([
        expect.stringContaining("simulated tombstone deletion interruption"),
      ]);
    } finally {
      mutableFs.rmSync = originalRmSync;
    }

    const tombstone = readdirSync(outputRoot).find((entry) =>
      entry.startsWith(".hulebu-reaped-"),
    );
    expect(tombstone).toBeDefined();
    expect(
      cli.reapOrphanBuildAttempts(outputRoot, {
        hostname: "test-host",
        now: () => new Date("2026-07-11T03:01:00.000Z"),
        probePid: () => "dead",
        staleGraceMs: 30_000,
      }),
    ).toEqual({
      cleanupWarnings: [],
      reapedAttempts: [basename(attempt.outputRoot)],
    });
    expect(existsSync(join(outputRoot, tombstone!))).toBe(false);
  });

  it("preserves live, unknown, fresh, malformed, and symlink attempt entries", () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-attempt-preserve");
    const createdAt = new Date("2026-07-11T01:00:00.000Z");
    const liveAttempt = cli.createBuildAttempt({
      hostname: "test-host",
      now: () => createdAt,
      outputName: "web-mobile",
      outputRoot,
      pid: 4242,
      tokenFactory: () => "b".repeat(64),
    });
    const malformedRoot = join(outputRoot, ".hulebu-attempt-malformed");
    mkdirSync(malformedRoot);
    writeFileSync(join(malformedRoot, "keep.txt"), "keep", "utf8");
    const externalRoot = createTemporaryRoot("cli-attempt-external");
    writeFileSync(join(externalRoot, "keep.txt"), "external", "utf8");
    const symlinkRoot = join(outputRoot, ".hulebu-attempt-symlink");
    symlinkSync(externalRoot, symlinkRoot, "dir");

    const result = cli.reapOrphanBuildAttempts(outputRoot, {
      hostname: "test-host",
      now: () => new Date("2026-07-11T03:00:00.000Z"),
      probePid: () => "alive",
      staleGraceMs: 30_000,
    });

    expect(result.reapedAttempts).toEqual([]);
    expect(result.cleanupWarnings).toEqual(
      expect.arrayContaining([
        expect.stringContaining("malformed"),
        expect.stringContaining("symlink"),
      ]),
    );
    expect(existsSync(liveAttempt.outputRoot)).toBe(true);
    expect(existsSync(malformedRoot)).toBe(true);
    expect(readFileSync(join(externalRoot, "keep.txt"), "utf8")).toBe("external");
  });

  it("does not clean an attempt through a replaced output root path", () => {
    const cli = loadBuildCli();
    const parentRoot = createTemporaryRoot("cli-attempt-root-replaced");
    const outputRoot = join(parentRoot, "output");
    const parkedRoot = join(parentRoot, "parked-output");
    mkdirSync(outputRoot);
    const attempt = cli.createBuildAttempt({
      outputName: "web-mobile",
      outputRoot,
    });
    const attemptName = basename(attempt.outputRoot);

    renameSync(outputRoot, parkedRoot);
    mkdirSync(join(outputRoot, attemptName), { recursive: true });
    const replacementSentinel = join(outputRoot, attemptName, "keep.txt");
    writeFileSync(replacementSentinel, "replacement", "utf8");

    expect(() => attempt.cleanup()).toThrow("output root identity changed");
    expect(readFileSync(replacementSentinel, "utf8")).toBe("replacement");
  });

  it("creates a diagnostic 0600 lock and rejects a concurrent live holder", () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-lock-live");
    const lockPath = join(outputRoot, ".hulebu-cocos-build.lock");
    const acquiredAt = new Date("2026-07-11T01:02:03.000Z");
    const lock = cli.acquireOutputLock(outputRoot, {
      hostname: "test-host",
      now: () => acquiredAt,
      pid: 4242,
      tokenFactory: () => "a".repeat(64),
    });

    expect(JSON.parse(readFileSync(lockPath, "utf8"))).toEqual({
      schemaVersion: 1,
      token: "a".repeat(64),
      pid: 4242,
      hostname: "test-host",
      acquiredAt: acquiredAt.toISOString(),
    });
    expect(statSync(lockPath).mode & 0o777).toBe(0o600);
    expect(() =>
      cli.acquireOutputLock(outputRoot, {
        hostname: "test-host",
        now: () => acquiredAt,
        pid: 5252,
        probePid: () => "alive",
        tokenFactory: () => "b".repeat(64),
      }),
    ).toThrow("another Hulebu build is using output root");

    lock.release();
    expect(existsSync(lockPath)).toBe(false);
    expect(() => lock.release()).not.toThrow();
  });

  it("invalidates a lock when the output root path is replaced", () => {
    const cli = loadBuildCli();
    const parentRoot = createTemporaryRoot("cli-lock-root-identity");
    const outputRoot = join(parentRoot, "output");
    const parkedRoot = join(parentRoot, "parked-output");
    mkdirSync(outputRoot);
    const lock = cli.acquireOutputLock(outputRoot, {
      hostname: "test-host",
      now: () => new Date("2026-07-11T01:02:03.000Z"),
      pid: 4242,
      tokenFactory: () => "a".repeat(64),
    });

    renameSync(outputRoot, parkedRoot);
    mkdirSync(outputRoot);

    expect(() => lock.assertOwnership()).toThrow(
      "output root identity changed",
    );
  });

  it("does not acquire a concurrent lock through a replaced output root path", () => {
    const cli = loadBuildCli();
    const parentRoot = createTemporaryRoot("cli-lock-root-replaced");
    const outputRoot = join(parentRoot, "output");
    const parkedRoot = join(parentRoot, "parked-output");
    mkdirSync(outputRoot);
    cli.acquireOutputLock(outputRoot, {
      hostname: "test-host",
      now: () => new Date("2026-07-11T01:02:03.000Z"),
      pid: 4242,
      tokenFactory: () => "a".repeat(64),
    });

    renameSync(outputRoot, parkedRoot);
    mkdirSync(outputRoot);

    expect(() =>
      cli.acquireOutputLock(outputRoot, {
        hostname: "test-host",
        now: () => new Date("2026-07-11T01:02:04.000Z"),
        pid: 5252,
        probePid: () => "alive",
        tokenFactory: () => "b".repeat(64),
      }),
    ).toThrow("another Hulebu build is using output root");
  });

  it("stops before validation and promotion when Creator replaces the output root", async () => {
    const cli = loadBuildCli();
    const parentRoot = createTemporaryRoot("cli-lock-root-build-race");
    const outputRoot = join(parentRoot, "output");
    const parkedRoot = join(parentRoot, "parked-output");
    const projectRoot = createTemporaryRoot("cli-lock-root-build-project");
    mkdirSync(outputRoot);
    let validationCalled = false;
    let promotionCalled = false;

    await expect(
      cli.runRelease(["--output-root", outputRoot], {
        assertReleaseInputsClean: () => ({
          sourceInputs: ["formal"],
          sourceState: "clean",
          sourceTreeSha256: SOURCE_TREE_SHA256,
        }),
        createExactCommitProjectSnapshot: () => ({
          checkoutRoot: join(projectRoot, "checkout"),
          projectRoot,
          release: () => undefined,
        }),
        environment: {},
        getCommit: () => FULL_COMMIT_A,
        hashFileSha256: () => RELEASE_CONFIG_SHA256,
        inspectCreatorExecutable: () => CREATOR_EXECUTABLE_EVIDENCE,
        loadReleaseConfig: () => config,
        paths: {
          configPath: realConfigPath,
          projectRoot,
          repositoryRoot,
        },
        releaseSourceInputs: ["formal"],
        runCreatorProcess: async () => {
          renameSync(outputRoot, parkedRoot);
          mkdirSync(outputRoot);
          return {
            logPath: join(parkedRoot, "attempt.log"),
            logText: `Build with Cocos Creator 3.8.8\n${config.finishedMarker}`,
            outcome: { kind: "exit", exitCode: 0 },
          };
        },
        validateBuildArtifacts: () => {
          validationCalled = true;
          return { ok: true, errors: [] };
        },
        beginBuildPromotion: () => {
          promotionCalled = true;
          throw new Error("promotion must not run");
        },
      }),
    ).rejects.toThrow("output root identity changed");

    expect(validationCalled).toBe(false);
    expect(promotionCalled).toBe(false);
    expect(existsSync(join(outputRoot, "web-mobile"))).toBe(false);
  });

  it("does not delete a replacement lock when the old holder releases", () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-lock-replaced");
    const lockPath = join(outputRoot, ".hulebu-cocos-build.lock");
    const parkedPath = join(outputRoot, "parked.lock");
    const lock = cli.acquireOutputLock(outputRoot, {
      hostname: "test-host",
      now: () => new Date("2026-07-11T01:02:03.000Z"),
      pid: 4242,
      tokenFactory: () => "a".repeat(64),
    });
    renameSync(lockPath, parkedPath);
    writeFileSync(
      lockPath,
      `${JSON.stringify({
        schemaVersion: 1,
        token: "b".repeat(64),
        pid: 5252,
        hostname: "test-host",
        acquiredAt: "2026-07-11T01:02:04.000Z",
      })}\n`,
      { encoding: "utf8", mode: 0o600 },
    );

    expect(() => lock.release()).toThrow("build lock ownership changed");
    expect(JSON.parse(readFileSync(lockPath, "utf8"))).toMatchObject({
      token: "b".repeat(64),
    });
  });

  it("reclaims a confirmed-dead stale lock through a recovery claim", () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-lock-stale");
    const lockPath = join(outputRoot, ".hulebu-cocos-build.lock");
    writeFileSync(
      lockPath,
      `${JSON.stringify({
        schemaVersion: 1,
        token: "a".repeat(64),
        pid: 1111,
        hostname: "test-host",
        acquiredAt: "2026-07-11T01:00:00.000Z",
      })}\n`,
      { encoding: "utf8", mode: 0o600 },
    );

    const lock = cli.acquireOutputLock(outputRoot, {
      hostname: "test-host",
      now: () => new Date("2026-07-11T01:02:03.000Z"),
      pid: 2222,
      probePid: () => "dead",
      staleGraceMs: 30_000,
      tokenFactory: () => "b".repeat(64),
    });
    expect(JSON.parse(readFileSync(lockPath, "utf8"))).toMatchObject({
      token: "b".repeat(64),
      pid: 2222,
    });
    expect(
      readdirSync(outputRoot).filter((entry) => entry.includes(".reap-")),
    ).toEqual([]);
    lock.release();
  });

  it("recovers an orphaned dead stale-lock recovery claim", () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-lock-stale-claim");
    const lockPath = join(outputRoot, ".hulebu-cocos-build.lock");
    const staleLockText = `${JSON.stringify({
      schemaVersion: 1,
      token: "a".repeat(64),
      pid: 1111,
      hostname: "test-host",
      acquiredAt: "2026-07-11T01:00:00.000Z",
    })}\n`;
    const targetFingerprint = createHash("sha256")
      .update(staleLockText)
      .digest("hex");
    const claimPath = `${lockPath}.reap-${targetFingerprint.slice(0, 32)}`;
    writeFileSync(lockPath, staleLockText, {
      encoding: "utf8",
      mode: 0o600,
    });
    writeFileSync(
      claimPath,
      `${JSON.stringify({
        schemaVersion: 1,
        token: "c".repeat(64),
        pid: 3333,
        hostname: "test-host",
        acquiredAt: "2026-07-11T01:00:30.000Z",
        targetFingerprint,
      })}\n`,
      { encoding: "utf8", mode: 0o600 },
    );

    const lock = cli.acquireOutputLock(outputRoot, {
      hostname: "test-host",
      now: () => new Date("2026-07-11T01:02:03.000Z"),
      pid: 2222,
      probePid: () => "dead",
      staleGraceMs: 30_000,
      tokenFactory: () => "b".repeat(64),
    });

    expect(JSON.parse(readFileSync(lockPath, "utf8"))).toMatchObject({
      token: "b".repeat(64),
      pid: 2222,
    });
    expect(existsSync(claimPath)).toBe(false);
    lock.release();
  });

  it.each(["", '{"schemaVersion":1'])(
    "recovers an old invalid stale-lock recovery claim %j",
    (claimText) => {
      const cli = loadBuildCli();
      const outputRoot = createTemporaryRoot("cli-lock-invalid-claim");
      const lockPath = join(outputRoot, ".hulebu-cocos-build.lock");
      const staleLockText = `${JSON.stringify({
        schemaVersion: 1,
        token: "a".repeat(64),
        pid: 1111,
        hostname: "test-host",
        acquiredAt: "2026-07-11T01:00:00.000Z",
      })}\n`;
      const targetFingerprint = createHash("sha256")
        .update(staleLockText)
        .digest("hex");
      const claimPath = `${lockPath}.reap-${targetFingerprint.slice(0, 32)}`;
      writeFileSync(lockPath, staleLockText, { encoding: "utf8", mode: 0o600 });
      writeFileSync(claimPath, claimText, { encoding: "utf8", mode: 0o600 });
      const oldTime = new Date("2026-07-11T01:00:30.000Z");
      utimesSync(claimPath, oldTime, oldTime);

      const lock = cli.acquireOutputLock(outputRoot, {
        hostname: "test-host",
        now: () => new Date("2026-07-11T01:02:03.000Z"),
        pid: 2222,
        probePid: () => "dead",
        staleGraceMs: 30_000,
        tokenFactory: () => "b".repeat(64),
      });

      expect(existsSync(claimPath)).toBe(false);
      expect(JSON.parse(readFileSync(lockPath, "utf8"))).toMatchObject({
        token: "b".repeat(64),
      });
      lock.release();
    },
  );

  it.each([
    ["fresh dead", "dead", "2026-07-11T01:01:50.000Z"],
    ["old alive", "alive", "2026-07-11T01:00:30.000Z"],
  ] as const)(
    "does not reclaim through a %s stale-lock recovery claim",
    (_label, claimProbe, claimAcquiredAt) => {
      const cli = loadBuildCli();
      const outputRoot = createTemporaryRoot("cli-lock-held-claim");
      const lockPath = join(outputRoot, ".hulebu-cocos-build.lock");
      const staleLockText = `${JSON.stringify({
        schemaVersion: 1,
        token: "a".repeat(64),
        pid: 1111,
        hostname: "test-host",
        acquiredAt: "2026-07-11T01:00:00.000Z",
      })}\n`;
      const targetFingerprint = createHash("sha256")
        .update(staleLockText)
        .digest("hex");
      const claimPath = `${lockPath}.reap-${targetFingerprint.slice(0, 32)}`;
      writeFileSync(lockPath, staleLockText, {
        encoding: "utf8",
        mode: 0o600,
      });
      writeFileSync(
        claimPath,
        `${JSON.stringify({
          schemaVersion: 1,
          token: "c".repeat(64),
          pid: 3333,
          hostname: "test-host",
          acquiredAt: claimAcquiredAt,
          targetFingerprint,
        })}\n`,
        { encoding: "utf8", mode: 0o600 },
      );

      expect(() =>
        cli.acquireOutputLock(outputRoot, {
          hostname: "test-host",
          now: () => new Date("2026-07-11T01:02:03.000Z"),
          pid: 2222,
          probePid: (pid) => (pid === 1111 ? "dead" : claimProbe),
          staleGraceMs: 30_000,
          tokenFactory: () => "b".repeat(64),
        }),
      ).toThrow("another process is recovering the stale Hulebu build lock");
      expect(existsSync(lockPath)).toBe(true);
      expect(existsSync(claimPath)).toBe(true);
    },
  );

  it.each([
    ["fresh dead", "dead", "2026-07-11T01:01:50.000Z"],
    ["old alive", "alive", "2026-07-11T01:00:00.000Z"],
    ["old unknown", "unknown", "2026-07-11T01:00:00.000Z"],
  ] as const)("does not reclaim a %s lock", (_label, probe, acquiredAt) => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-lock-not-stale");
    const lockPath = join(outputRoot, ".hulebu-cocos-build.lock");
    writeFileSync(
      lockPath,
      `${JSON.stringify({
        schemaVersion: 1,
        token: "a".repeat(64),
        pid: 1111,
        hostname: "test-host",
        acquiredAt,
      })}\n`,
      { encoding: "utf8", mode: 0o600 },
    );

    expect(() =>
      cli.acquireOutputLock(outputRoot, {
        hostname: "test-host",
        now: () => new Date("2026-07-11T01:02:03.000Z"),
        pid: 2222,
        probePid: () => probe,
        staleGraceMs: 30_000,
        tokenFactory: () => "b".repeat(64),
      }),
    ).toThrow("another Hulebu build is using output root");
    expect(JSON.parse(readFileSync(lockPath, "utf8"))).toMatchObject({
      token: "a".repeat(64),
    });
  });

  it("rejects a symlink used as the output root", () => {
    const cli = loadBuildCli();
    const parentRoot = createTemporaryRoot("cli-output-symlink");
    const externalRoot = createTemporaryRoot("cli-output-symlink-target");
    const outputRoot = join(parentRoot, "output");
    if (!tryCreateSymlink(externalRoot, outputRoot, "dir")) return;

    expect(() =>
      cli.createBuildAttempt({ outputName: "web-mobile", outputRoot }),
    ).toThrow("output root must be a real directory");
  });

  it("captures one combined Creator log with shell disabled", async () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-log");
    const projectRoot = createTemporaryRoot("cli-log-project");
    const creatorArguments = cli.buildCreatorArguments({
      config,
      outputRoot,
      projectRoot,
    });
    let captured: unknown[] | undefined;
    const spawn = (...args: unknown[]) => {
      captured = args;
      const child = new EventEmitter();
      const options = args[2] as { stdio: [string, number, number] };
      queueMicrotask(() => {
        writeSync(options.stdio[1], "stdout line\n");
        writeSync(options.stdio[2], `${config.finishedMarker}\n`);
        child.emit("close", 36, null);
      });
      return child;
    };

    const result = await cli.runCreatorProcess({
      creatorArguments,
      creatorExecutable: "/fake/creator",
      environment: {},
      outputRoot,
      projectRoot,
      spawn,
    });

    expect(captured?.[0]).toBe("/fake/creator");
    expect(captured?.[1]).toEqual(creatorArguments);
    expect(captured?.[2]).toMatchObject({
      cwd: projectRoot,
      shell: false,
      windowsHide: true,
    });
    expect(result.outcome).toEqual({ kind: "exit", exitCode: 36 });
    expect(result.logText).toContain("stdout line");
    expect(result.logText).toContain(config.finishedMarker);
    expect(readFileSync(result.logPath, "utf8")).toBe(result.logText);
    expect(
      readdirSync(outputRoot).filter((name) => name.endsWith(".tmp")),
    ).toEqual([]);
  });

  it.each([
    ["signal", { kind: "signal", signal: "SIGTERM" }],
    ["spawn-error", { kind: "spawn-error", error: new Error("ENOENT") }],
  ] as const)(
    "publishes a diagnostic log for a %s outcome",
    async (_label, outcome) => {
      const cli = loadBuildCli();
      const outputRoot = createTemporaryRoot(`cli-${outcome.kind}`);
      const projectRoot = createTemporaryRoot(`cli-${outcome.kind}-project`);
      const spawn = () => {
        if (outcome.kind === "spawn-error") throw outcome.error;
        const child = new EventEmitter();
        queueMicrotask(() => child.emit("close", null, outcome.signal));
        return child;
      };

      const result = await cli.runCreatorProcess({
        creatorArguments: [],
        creatorExecutable: "/fake/creator",
        environment: {},
        outputRoot,
        projectRoot,
        spawn,
      });

      expect(result.outcome.kind).toBe(outcome.kind);
      expect(result.logText).toContain("Hulebu wrapper:");
      expect(existsSync(result.logPath)).toBe(true);
    },
  );

  it("waits for close after an asynchronous child error", async () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-async-error");
    const projectRoot = createTemporaryRoot("cli-async-error-project");
    let closeSeen = false;
    let lateWriteError: unknown;
    const spawn = (...args: unknown[]) => {
      const child = new EventEmitter();
      const options = args[2] as { stdio: [string, number, number] };
      queueMicrotask(() => {
        child.emit("error", new Error("async ENOENT"));
        queueMicrotask(() => {
          try {
            writeSync(options.stdio[1], "late child output\n");
          } catch (error) {
            lateWriteError = error;
          }
          closeSeen = true;
          child.emit("close", -1, null);
        });
      });
      return child;
    };

    const result = await cli.runCreatorProcess({
      creatorArguments: [],
      creatorExecutable: "/fake/creator",
      environment: {},
      outputRoot,
      projectRoot,
      spawn,
    });

    expect(closeSeen).toBe(true);
    expect(lateWriteError).toBeUndefined();
    expect(result.outcome).toMatchObject({ kind: "spawn-error" });
    expect(result.logText).toContain("late child output");
    expect(result.logText).toContain("async ENOENT");
  });

  it("does not mark Creator exited when failed PID publication cannot close the child", async () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-spawn-marker-failure");
    const projectRoot = createTemporaryRoot(
      "cli-spawn-marker-failure-project",
    );
    const signals: string[] = [];
    let exited = false;
    const spawn = () => {
      const child = new EventEmitter() as EventEmitter & {
        kill: (signal: string) => boolean;
        pid: number;
      };
      child.pid = 4242;
      child.kill = (signal: string) => {
        signals.push(signal);
        return true;
      };
      return child;
    };

    await expect(
      cli.runCreatorProcess({
        creatorArguments: [],
        creatorExecutable: "/fake/creator",
        environment: {},
        onExit: () => {
          exited = true;
        },
        onSpawn: () => {
          throw new Error("simulated PID marker failure");
        },
        outputRoot,
        projectRoot,
        spawn,
        terminationGraceMs: 5,
      }),
    ).rejects.toThrow("Creator child did not close");

    expect(signals).toEqual(["SIGTERM", "SIGKILL"]);
    expect(exited).toBe(false);
  });

  it("rejects a Creator log replaced between publication and reading", async () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-log-replacement");
    const projectRoot = createTemporaryRoot("cli-log-replacement-project");
    const logPath = join(outputRoot, "hulebu-cocos-build.log");
    const originalRenameSync = mutableFs.renameSync;
    mutableFs.renameSync = (...args: unknown[]) => {
      const result = originalRenameSync(...args);
      if (args[1] === logPath) {
        const foreignPath = join(outputRoot, "foreign.log");
        writeFileSync(foreignPath, `${config.finishedMarker}\n`, "utf8");
        originalRenameSync(foreignPath, logPath);
      }
      return result;
    };
    const spawn = (...args: unknown[]) => {
      const child = new EventEmitter();
      const options = args[2] as { stdio: [string, number, number] };
      queueMicrotask(() => {
        writeSync(options.stdio[1], "current attempt without marker\n");
        child.emit("close", 36, null);
      });
      return child;
    };

    try {
      await expect(
        cli.runCreatorProcess({
          creatorArguments: [],
          creatorExecutable: "/fake/creator",
          environment: {},
          outputRoot,
          projectRoot,
          spawn,
        }),
      ).rejects.toThrow("Creator log changed during publication");
    } finally {
      mutableFs.renameSync = originalRenameSync;
    }
  });

  it("verifies an existing build without touching Creator evidence", async () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-verify");
    const buildRoot = join(outputRoot, config.outputName);
    cpSync(createValidBuild(config), buildRoot, { recursive: true });
    const logPath = join(outputRoot, "hulebu-cocos-build.log");
    writeFileSync(logPath, "existing log", "utf8");
    const manifest = writeBuildManifest(buildRoot, {
      buildId: `${FULL_COMMIT_A.slice(0, 12)}-20260711T010203Z`,
      commit: FULL_COMMIT_A,
      config,
      cocosTypecheckPassed: true,
      creatorDecision: {
        accepted: true,
        actualCreatorVersion: config.creatorVersion,
        normalized: false,
        originalExitCode: 0,
      },
      creatorExecutableEvidence: CREATOR_EXECUTABLE_EVIDENCE,
      createdAt: "2026-07-11T01:02:03.000Z",
      releaseConfigSha256: RELEASE_CONFIG_SHA256,
      sourceInputs: ["formal"],
      sourceState: "clean",
      sourceTreeSha256: SOURCE_TREE_SHA256,
      smokeResults: createSmokeEvidence(config, buildRoot),
    });
    const manifestPath = manifest.path;
    const before = {
      log: readFileSync(logPath, "utf8"),
      logMtime: statSync(logPath).mtimeMs,
      manifest: readFileSync(manifestPath, "utf8"),
      manifestMtime: statSync(manifestPath).mtimeMs,
    };
    let creatorInvoked = false;

    const summary = await cli.runRelease(
      ["--verify-only", "--output-root", outputRoot],
      {
        cwd: repositoryRoot,
        environment: {},
        assertReleaseInputsClean: () => ({
          sourceInputs: ["formal"],
          sourceState: "clean",
          sourceTreeSha256: SOURCE_TREE_SHA256,
        }),
        getCommit: () => FULL_COMMIT_A,
        hashFileSha256: () => RELEASE_CONFIG_SHA256,
        now: () => new Date("2026-07-11T01:02:03.456Z"),
        paths: {
          configPath: realConfigPath,
          projectRoot: createTemporaryRoot("cli-verify-project"),
          repositoryRoot,
        },
        releaseSourceInputs: ["formal"],
        runCreatorProcess: () => {
          creatorInvoked = true;
          throw new Error("Creator must not run");
        },
      },
    );

    expect(summary).toMatchObject({
      ok: true,
      mode: "verify-only",
      buildRoot,
      buildId: `${FULL_COMMIT_A.slice(0, 12)}-20260711T010203Z`,
      commit: FULL_COMMIT_A,
      creatorInvoked: false,
      manifestWritten: false,
      sourceInputs: ["formal"],
      sourceState: "clean",
      sourceTreeSha256: SOURCE_TREE_SHA256,
      verifiedAt: "2026-07-11T01:02:03.456Z",
    });
    expect(creatorInvoked).toBe(false);
    expect(readFileSync(logPath, "utf8")).toBe(before.log);
    expect(statSync(logPath).mtimeMs).toBe(before.logMtime);
    expect(readFileSync(manifestPath, "utf8")).toBe(before.manifest);
    expect(statSync(manifestPath).mtimeMs).toBe(before.manifestMtime);
  });

  it("orders build gates and preserves original Creator exit 36", async () => {
    const cli = loadBuildCli();
    const events: string[] = [];
    const outputRoot = createTemporaryRoot("cli-order");
    const projectRoot = createTemporaryRoot("cli-order-project");
    const lifecycle = createMockReleaseLifecycle(
      outputRoot,
      projectRoot,
      events,
    );
    const smokeResults = [{ pathname: "/", status: 200, bytes: 10 }];
    const summary = await cli.runRelease(["--output-root", outputRoot], {
      cwd: repositoryRoot,
      environment: {},
      assertReleaseInputsClean: () => {
        events.push("source-clean");
        return {
          sourceInputs: ["formal"],
          sourceState: "clean",
          sourceTreeSha256: SOURCE_TREE_SHA256,
        };
      },
      evaluateCreatorBuild: (input: CreatorBuildInput) => {
        events.push("evaluate");
        expect(input.exitCode).toBe(36);
        return {
          accepted: true,
          actualCreatorVersion: config.creatorVersion,
          normalized: true,
          originalExitCode: 36,
        };
      },
      getCommit: () => {
        events.push("commit");
        return FULL_COMMIT_A;
      },
      hashFileSha256: () => RELEASE_CONFIG_SHA256,
      loadReleaseConfig: () => config,
      now: () => new Date("2026-07-11T01:02:03.456Z"),
      paths: {
        configPath: realConfigPath,
        projectRoot,
        repositoryRoot,
      },
      ...lifecycle,
      releaseSourceInputs: ["formal"],
      readBuildManifest: () => {
        events.push("manifest-read");
        return {
          buildId: `${FULL_COMMIT_A.slice(0, 12)}-20260711T010203Z`,
          commit: FULL_COMMIT_A,
          createdAt: "2026-07-11T01:02:03.456Z",
        };
      },
      runCreatorProcess: async () => {
        events.push("creator");
        return {
          logPath: join(outputRoot, "hulebu-cocos-build.log"),
          logText: config.finishedMarker,
          outcome: { kind: "exit", exitCode: 36 },
        };
      },
      smokeBuild: async () => {
        events.push("smoke");
        return smokeResults;
      },
      validateBuildArtifacts: () => {
        events.push("validate");
        return { ok: true, errors: [] };
      },
      writeBuildManifest: (
        _buildRoot: string,
        input: Record<string, unknown>,
      ) => {
        events.push("manifest");
        expect(input).toMatchObject({
          buildId: `${FULL_COMMIT_A.slice(0, 12)}-20260711T010203Z`,
          commit: FULL_COMMIT_A,
          createdAt: "2026-07-11T01:02:03.456Z",
          sourceInputs: ["formal"],
          sourceState: "clean",
          sourceTreeSha256: SOURCE_TREE_SHA256,
          releaseConfigSha256: RELEASE_CONFIG_SHA256,
      creatorExecutableEvidence: CREATOR_EXECUTABLE_EVIDENCE,
      cocosTypecheckPassed: true,
      smokeResults,
        });
        return {
          path: join(outputRoot, "web-mobile/hulebu-build.json"),
          data: {},
        };
      },
    });

    expect(events).toEqual([
      "promotion-recover",
      "attempt-reap",
      "commit",
      "source-clean",
      "commit",
      "creator-inspect",
      "snapshot",
      "attempt",
      "creator-inspect",
      "creator",
      "creator-inspect",
      "snapshot-source-clean",
      "validate",
      "evaluate",
      "typecheck",
      "snapshot-source-clean",
      "smoke",
      "commit",
      "source-clean",
      "commit",
      "manifest",
      "manifest-read",
      "commit",
      "source-clean",
      "commit",
      "snapshot-release",
      "promote",
      "manifest-read",
      "commit",
      "source-clean",
      "commit",
      "promote-finalize",
      "attempt-cleanup",
      "manifest-read",
    ]);
    expect(summary).toMatchObject({
      ok: true,
      mode: "build",
      buildId: `${FULL_COMMIT_A.slice(0, 12)}-20260711T010203Z`,
      creatorExitCode: 36,
      creatorExitNormalized: true,
      cocosTypecheckPassed: true,
      ...CREATOR_EXECUTABLE_EVIDENCE,
      sourceInputs: ["formal"],
      sourceState: "clean",
      sourceTreeSha256: SOURCE_TREE_SHA256,
      smokeResults,
    });
  });

  it("rejects dirty inputs before acquiring the output lock or running Creator", async () => {
    const cli = loadBuildCli();
    let lockCalled = false;
    let lockReleased = false;
    let creatorCalled = false;

    await expect(
      cli.runRelease([], {
        assertReleaseInputsClean: () => {
          throw new Error("formal build inputs are dirty: formal/input.ts");
        },
        acquireOutputLock: () => {
          lockCalled = true;
          return { release: () => { lockReleased = true; } };
        },
        environment: {},
        getCommit: () => FULL_COMMIT_A,
        hashFileSha256: () => RELEASE_CONFIG_SHA256,
        loadReleaseConfig: () => config,
        paths: {
          configPath: realConfigPath,
          projectRoot: createTemporaryRoot("cli-preflight-project"),
          repositoryRoot,
        },
        runCreatorProcess: async () => {
          creatorCalled = true;
          throw new Error("Creator must not run");
        },
      }),
    ).rejects.toThrow("formal build inputs are dirty: formal/input.ts");
    expect(lockCalled).toBe(true);
    expect(lockReleased).toBe(true);
    expect(creatorCalled).toBe(false);
  });

  it("reports both the build failure and the lock release failure", async () => {
    const cli = loadBuildCli();

    await expect(
      cli.runRelease([], {
        acquireOutputLock: () => ({
          release: () => {
            throw new Error("simulated unlock failure");
          },
        }),
        assertReleaseInputsClean: () => {
          throw new Error("simulated source failure");
        },
        environment: {},
        getCommit: () => FULL_COMMIT_A,
        hashFileSha256: () => RELEASE_CONFIG_SHA256,
        loadReleaseConfig: () => config,
        paths: {
          configPath: realConfigPath,
          projectRoot: createTemporaryRoot("cli-combined-failure-project"),
          repositoryRoot,
        },
      }),
    ).rejects.toThrow(
      "simulated source failure; unable to release build lock: simulated unlock failure",
    );
  });

  it("reports a post-publication unlock failure as a cleanup warning", async () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-post-publish-unlock");
    const projectRoot = createTemporaryRoot("cli-post-publish-project");
    const lifecycle = createMockReleaseLifecycle(outputRoot, projectRoot);

    const summary = await cli.runRelease(["--output-root", outputRoot], {
      ...lifecycle,
      acquireOutputLock: () => ({
        assertOwnership: () => undefined,
        release: () => {
          throw new Error("simulated post-publish unlock failure");
        },
      }),
      captureReleaseSourceState: () => ({
        commit: FULL_COMMIT_A,
        sourceInputs: ["formal"],
        sourceState: "clean",
        sourceTreeSha256: SOURCE_TREE_SHA256,
      }),
      environment: {},
      evaluateCreatorBuild: () => ({
        accepted: true,
        actualCreatorVersion: config.creatorVersion,
        normalized: false,
        originalExitCode: 0,
      }),
      hashFileSha256: () => RELEASE_CONFIG_SHA256,
      loadReleaseConfig: () => config,
      now: () => new Date("2026-07-11T01:02:03.000Z"),
      paths: { configPath: realConfigPath, projectRoot, repositoryRoot },
      readBuildManifest: () => ({
        buildId: `${FULL_COMMIT_A.slice(0, 12)}-20260711T010203Z`,
        commit: FULL_COMMIT_A,
        createdAt: "2026-07-11T01:02:03.000Z",
      }),
      releaseSourceInputs: ["formal"],
      runCreatorProcess: async () => ({
        logPath: lifecycle.attemptLogPath,
        logText: `Build with Cocos Creator 3.8.8\n${config.finishedMarker}`,
        outcome: { kind: "exit", exitCode: 0 },
      }),
      smokeBuild: async () => [],
      validateBuildArtifacts: () => ({ ok: true, errors: [] }),
      writeBuildManifest: () => ({ path: "manifest", data: {} }),
    });

    expect(summary).toMatchObject({
      ok: true,
      cleanupWarnings: [
        "build lock release: simulated post-publish unlock failure",
      ],
    });
  });

  it("fails after commit when attempt cleanup reports output ownership loss", async () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-post-commit-attempt-ownership");
    const projectRoot = createTemporaryRoot("cli-post-commit-attempt-project");
    const baseLifecycle = createMockReleaseLifecycle(outputRoot, projectRoot);
    let finalized = false;
    let rolledBack = false;
    const effects = createSuccessfulReleaseEffects(outputRoot, projectRoot, {
      ...baseLifecycle,
      beginBuildPromotion: () => ({
        finalize: () => {
          finalized = true;
          return { cleanupWarnings: [] };
        },
        rollback: () => {
          rolledBack = true;
        },
      }),
      createBuildAttempt: () => {
        const attempt = baseLifecycle.createBuildAttempt();
        return {
          ...attempt,
          cleanup: () => {
            throw Object.assign(new Error("output root identity changed"), {
              code: "HULEBU_OUTPUT_OWNERSHIP_LOST",
            });
          },
        };
      },
    });

    await expect(
      cli.runRelease(["--output-root", outputRoot], effects),
    ).rejects.toThrow(
      "publication committed but canonical output cannot be verified",
    );
    expect(finalized).toBe(true);
    expect(rolledBack).toBe(false);
  });

  it("fails after commit when releasing the lock reports ownership loss", async () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-post-commit-lock-ownership");
    const projectRoot = createTemporaryRoot("cli-post-commit-lock-project");
    const effects = createSuccessfulReleaseEffects(outputRoot, projectRoot, {
      acquireOutputLock: () => ({
        assertOwnership: () => undefined,
        release: () => {
          throw Object.assign(new Error("output root identity changed"), {
            code: "HULEBU_OUTPUT_OWNERSHIP_LOST",
          });
        },
      }),
    });

    await expect(
      cli.runRelease(["--output-root", outputRoot], effects),
    ).rejects.toThrow(
      "publication committed but canonical output cannot be verified",
    );
  });

  it("keeps a generic post-commit attempt cleanup failure as a warning", async () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-post-commit-cleanup-warning");
    const projectRoot = createTemporaryRoot("cli-post-commit-cleanup-project");
    const baseLifecycle = createMockReleaseLifecycle(outputRoot, projectRoot);
    const summary = await cli.runRelease(
      ["--output-root", outputRoot],
      createSuccessfulReleaseEffects(outputRoot, projectRoot, {
        ...baseLifecycle,
        createBuildAttempt: () => {
          const attempt = baseLifecycle.createBuildAttempt();
          return {
            ...attempt,
            cleanup: () => {
              throw new Error("simulated ordinary cleanup failure");
            },
          };
        },
      }),
    );

    expect(summary).toMatchObject({
      ok: true,
      cleanupWarnings: [
        "build attempt cleanup: simulated ordinary cleanup failure",
      ],
    });
  });

  it("spawns the canonical Creator path and reattests it before and after execution", async () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-creator-reattest");
    const projectRoot = createTemporaryRoot("cli-creator-reattest-project");
    const aliasPath = join(projectRoot, "creator-alias");
    const inspectedPaths: string[] = [];
    let executedPath = "";
    const effects = createSuccessfulReleaseEffects(outputRoot, projectRoot, {
      inspectCreatorExecutable: (candidate: string) => {
        inspectedPaths.push(candidate);
        return CREATOR_EXECUTABLE_EVIDENCE;
      },
      runCreatorProcess: async (input: { creatorExecutable: string }) => {
        executedPath = input.creatorExecutable;
        return {
          logPath: join(outputRoot, "attempt.log"),
          logText: `Build with Cocos Creator 3.8.8\n${config.finishedMarker}`,
          outcome: { kind: "exit", exitCode: 0 },
        };
      },
    });

    await cli.runRelease(
      ["--creator", aliasPath, "--output-root", outputRoot],
      effects,
    );

    expect(inspectedPaths).toEqual([
      aliasPath,
      CREATOR_EXECUTABLE_EVIDENCE.creatorExecutableRealPath,
      CREATOR_EXECUTABLE_EVIDENCE.creatorExecutableRealPath,
    ]);
    expect(executedPath).toBe(
      CREATOR_EXECUTABLE_EVIDENCE.creatorExecutableRealPath,
    );
  });

  it.each([
    [2, false],
    [3, true],
  ])(
    "rejects Creator provenance changed at attestation %i",
    async (changedInspection, creatorExpected) => {
      const cli = loadBuildCli();
      const outputRoot = createTemporaryRoot(
        `cli-creator-provenance-change-${changedInspection}`,
      );
      const projectRoot = createTemporaryRoot(
        `cli-creator-provenance-project-${changedInspection}`,
      );
      let inspections = 0;
      let creatorCalled = false;
      const effects = createSuccessfulReleaseEffects(outputRoot, projectRoot, {
        inspectCreatorExecutable: () => {
          inspections += 1;
          return inspections === changedInspection
            ? {
                ...CREATOR_EXECUTABLE_EVIDENCE,
                creatorBuildResourcesSha256: "0".repeat(64),
              }
            : CREATOR_EXECUTABLE_EVIDENCE;
        },
        runCreatorProcess: async () => {
          creatorCalled = true;
          return {
            logPath: join(outputRoot, "attempt.log"),
            logText: `Build with Cocos Creator 3.8.8\n${config.finishedMarker}`,
            outcome: { kind: "exit", exitCode: 0 },
          };
        },
      });

      await expect(
        cli.runRelease(["--output-root", outputRoot], effects),
      ).rejects.toThrow("Creator provenance changed");
      expect(creatorCalled).toBe(creatorExpected);
    },
  );

  it("rejects a Creator-mutated exact snapshot before artifact validation", async () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-snapshot-mutated");
    const projectRoot = createTemporaryRoot("cli-snapshot-mutated-project");
    let validationCalled = false;
    let manifestCalled = false;
    const effects = createSuccessfulReleaseEffects(outputRoot, projectRoot, {
      captureSnapshotReleaseSourceState: () => {
        throw new Error(
          "exact Creator snapshot formal inputs are dirty: information.json",
        );
      },
      validateBuildArtifacts: () => {
        validationCalled = true;
        return { ok: true, errors: [] };
      },
      writeBuildManifest: () => {
        manifestCalled = true;
        return { path: "manifest", data: {} };
      },
    });

    await expect(
      cli.runRelease(["--output-root", outputRoot], effects),
    ).rejects.toThrow("exact Creator snapshot formal inputs are dirty");
    expect(validationCalled).toBe(false);
    expect(manifestCalled).toBe(false);
  });

  it("rejects sources or HEAD changed during the build before writing manifest", async () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-source-race");
    let sourceCheckCount = 0;
    let commitReadCount = 0;
    let manifestCalled = false;
    const projectRoot = createTemporaryRoot("cli-source-race-project");
    const lifecycle = createMockReleaseLifecycle(outputRoot, projectRoot);

    await expect(
      cli.runRelease(["--output-root", outputRoot], {
        assertReleaseInputsClean: () => {
          sourceCheckCount += 1;
          if (sourceCheckCount === 2) {
            throw new Error("formal build inputs are dirty: formal/changed.ts");
          }
          return {
            sourceInputs: ["formal"],
            sourceState: "clean",
            sourceTreeSha256: SOURCE_TREE_SHA256,
          };
        },
        environment: {},
        evaluateCreatorBuild: () => ({
          accepted: true,
          actualCreatorVersion: config.creatorVersion,
          normalized: false,
          originalExitCode: 0,
        }),
        getCommit: () => {
          commitReadCount += 1;
          return FULL_COMMIT_A;
        },
        hashFileSha256: () => RELEASE_CONFIG_SHA256,
        loadReleaseConfig: () => config,
      paths: {
        configPath: realConfigPath,
        projectRoot,
        repositoryRoot,
      },
      ...lifecycle,
        runCreatorProcess: async () => ({
          logPath: join(outputRoot, "hulebu-cocos-build.log"),
          logText: config.finishedMarker,
          outcome: { kind: "exit", exitCode: 0 },
        }),
        smokeBuild: async () => [],
        validateBuildArtifacts: () => ({ ok: true, errors: [] }),
        writeBuildManifest: () => {
          manifestCalled = true;
          return { path: "/tmp/manifest", data: {} };
        },
      }),
    ).rejects.toThrow("formal build inputs are dirty: formal/changed.ts");
    expect(sourceCheckCount).toBe(2);
    expect(commitReadCount).toBe(3);
    expect(manifestCalled).toBe(false);
  });

  it("rejects a HEAD change before promotion and cleans the attempt manifest", async () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-manifest-race");
    const projectRoot = createTemporaryRoot("cli-manifest-race-project");
    const lifecycle = createMockReleaseLifecycle(outputRoot, projectRoot);
    const manifestPath = join(
      lifecycle.attemptBuildRoot,
      "hulebu-build.json",
    );
    let captureCount = 0;

    await expect(
      cli.runRelease(["--output-root", outputRoot], {
        captureReleaseSourceState: () => {
          captureCount += 1;
          return {
            commit: captureCount < 3 ? FULL_COMMIT_A : FULL_COMMIT_B,
            sourceInputs: ["formal"],
            sourceState: "clean",
            sourceTreeSha256: SOURCE_TREE_SHA256,
          };
        },
        environment: {},
        evaluateCreatorBuild: () => ({
          accepted: true,
          actualCreatorVersion: config.creatorVersion,
          normalized: false,
          originalExitCode: 0,
        }),
        hashFileSha256: () => RELEASE_CONFIG_SHA256,
        loadReleaseConfig: () => config,
      paths: {
        configPath: realConfigPath,
        projectRoot,
        repositoryRoot,
      },
      ...lifecycle,
        readBuildManifest: () => ({
          buildId: `${FULL_COMMIT_A.slice(0, 12)}-20260711T010203Z`,
          commit: FULL_COMMIT_A,
          createdAt: "2026-07-11T01:02:03.000Z",
        }),
        runCreatorProcess: async () => ({
          logPath: join(outputRoot, "hulebu-cocos-build.log"),
          logText: config.finishedMarker,
          outcome: { kind: "exit", exitCode: 0 },
        }),
        smokeBuild: async () => [],
        validateBuildArtifacts: () => ({ ok: true, errors: [] }),
        writeBuildManifest: () => {
          mkdirSync(lifecycle.attemptBuildRoot, { recursive: true });
          writeFileSync(manifestPath, '{"temporary":true}\n', "utf8");
          return { path: manifestPath, data: {} };
        },
      }),
    ).rejects.toThrow("HEAD changed while preparing build publication");
    expect(captureCount).toBe(3);
    expect(existsSync(manifestPath)).toBe(false);
  });

  it("preserves the attempt when publication rollback cannot complete", async () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-rollback-preserve-attempt");
    const projectRoot = createTemporaryRoot("cli-rollback-preserve-project");
    const attemptRoot = join(outputRoot, ".hulebu-attempt-preserve");
    const attemptBuildRoot = join(attemptRoot, "web-mobile");
    const attemptLogPath = join(attemptRoot, "hulebu-cocos-build.log");
    let attemptCleanupCalled = false;
    let manifestReadCount = 0;
    let rollbackCount = 0;

    await expect(
      cli.runRelease(["--output-root", outputRoot], {
        acquireOutputLock: () => ({
          assertOwnership: () => undefined,
          release: () => undefined,
        }),
        beginBuildPromotion: () => ({
          finalize: () => ({ cleanupWarnings: [] }),
          rollback: () => {
            rollbackCount += 1;
            throw new Error("simulated persistent rollback failure");
          },
        }),
        captureReleaseSourceState: () => ({
          commit: FULL_COMMIT_A,
          sourceInputs: ["formal"],
          sourceState: "clean",
          sourceTreeSha256: SOURCE_TREE_SHA256,
        }),
        captureSnapshotReleaseSourceState: () => ({
          commit: FULL_COMMIT_A,
          sourceInputs: ["formal"],
          sourceState: "clean",
          sourceTreeSha256: SOURCE_TREE_SHA256,
        }),
        createBuildAttempt: () => {
          mkdirSync(attemptBuildRoot, { recursive: true });
          writeFileSync(attemptLogPath, "new-log", "utf8");
          return {
            buildRoot: attemptBuildRoot,
            cleanup: () => {
              attemptCleanupCalled = true;
              rmSync(attemptRoot, { force: true, recursive: true });
            },
            logPath: attemptLogPath,
            outputRoot: attemptRoot,
          };
        },
        createExactCommitProjectSnapshot: () => ({
          checkoutRoot: join(projectRoot, "checkout"),
          projectRoot,
          release: () => undefined,
        }),
        environment: {},
        evaluateCreatorBuild: () => ({
          accepted: true,
          actualCreatorVersion: config.creatorVersion,
          normalized: false,
          originalExitCode: 0,
        }),
        hashFileSha256: () => RELEASE_CONFIG_SHA256,
        inspectCreatorExecutable: () => CREATOR_EXECUTABLE_EVIDENCE,
        loadReleaseConfig: () => config,
        paths: { configPath: realConfigPath, projectRoot, repositoryRoot },
        readBuildManifest: () => {
          manifestReadCount += 1;
          if (manifestReadCount === 2) {
            throw new Error("simulated published manifest failure");
          }
          return {
            buildId: `${FULL_COMMIT_A.slice(0, 12)}-20260711T010203Z`,
            commit: FULL_COMMIT_A,
            createdAt: "2026-07-11T01:02:03.000Z",
          };
        },
        recoverPendingBuildPromotion: () => ({
          cleanupWarnings: [],
          recovered: false,
        }),
        releaseSourceInputs: ["formal"],
        runCreatorProcess: async () => ({
          logPath: attemptLogPath,
          logText: `Build with Cocos Creator 3.8.8\n${config.finishedMarker}`,
          outcome: { kind: "exit", exitCode: 0 },
        }),
        runCocosTypeCheck: () => ({ passed: true }),
        smokeBuild: async () => [],
        validateBuildArtifacts: () => ({ ok: true, errors: [] }),
        writeBuildManifest: () => ({ path: "manifest", data: {} }),
      }),
    ).rejects.toThrow("simulated persistent rollback failure");

    expect(rollbackCount).toBe(2);
    expect(attemptCleanupCalled).toBe(false);
    expect(existsSync(attemptRoot)).toBe(true);
  });

  it.each([
    [{ kind: "signal", signal: "SIGTERM" }, "signal SIGTERM"],
    [
      { kind: "spawn-error", error: new Error("ENOENT") },
      "unable to start Creator: ENOENT",
    ],
  ] as const)(
    "rejects terminal Creator outcome %j before smoke or manifest",
    async (outcome, message) => {
      const cli = loadBuildCli();
      let smokeCalled = false;
      let manifestCalled = false;
      const outputRoot = createTemporaryRoot(`cli-terminal-${outcome.kind}`);
      const projectRoot = createTemporaryRoot(
        `cli-terminal-project-${outcome.kind}`,
      );
      const lifecycle = createMockReleaseLifecycle(outputRoot, projectRoot);

      await expect(
        cli.runRelease(["--output-root", outputRoot], {
          assertReleaseInputsClean: () => ({
            sourceInputs: ["formal"],
            sourceState: "clean",
            sourceTreeSha256: SOURCE_TREE_SHA256,
          }),
          environment: {},
          getCommit: () => FULL_COMMIT_A,
          hashFileSha256: () => RELEASE_CONFIG_SHA256,
          loadReleaseConfig: () => config,
          paths: {
            configPath: realConfigPath,
            projectRoot,
            repositoryRoot,
          },
          ...lifecycle,
          releaseSourceInputs: ["formal"],
          runCreatorProcess: async () => ({
            logPath: "/tmp/fake.log",
            logText: "wrapper failure",
            outcome,
          }),
          smokeBuild: async () => {
            smokeCalled = true;
            return [];
          },
          validateBuildArtifacts: () => ({ ok: true, errors: [] }),
          writeBuildManifest: () => {
            manifestCalled = true;
            return { path: "/tmp/manifest", data: {} };
          },
        }),
      ).rejects.toThrow(message);
      expect(smokeCalled).toBe(false);
      expect(manifestCalled).toBe(false);
    },
  );

  it("preserves the formal build when a failed attempt writes an untrusted manifest", async () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-failed-manifest");
    const buildRoot = join(outputRoot, config.outputName);
    const manifestPath = join(buildRoot, "hulebu-build.json");
    const logPath = join(outputRoot, "hulebu-cocos-build.log");
    const projectRoot = createTemporaryRoot("cli-failed-manifest-project");
    const lifecycle = createMockReleaseLifecycle(outputRoot, projectRoot);
    mkdirSync(buildRoot, { recursive: true });
    writeFileSync(manifestPath, '{"trusted":"old"}\n', "utf8");
    writeFileSync(logPath, "old-log\n", "utf8");
    const before = {
      log: readFileSync(logPath, "utf8"),
      logMtime: statSync(logPath).mtimeMs,
      manifest: readFileSync(manifestPath, "utf8"),
      manifestMtime: statSync(manifestPath).mtimeMs,
    };
    const untrustedManifestPath = join(
      lifecycle.attemptBuildRoot,
      "hulebu-build.json",
    );

    await expect(
      cli.runRelease(["--output-root", outputRoot], {
        assertReleaseInputsClean: () => ({
          sourceInputs: ["formal"],
          sourceState: "clean",
          sourceTreeSha256: SOURCE_TREE_SHA256,
        }),
        environment: {},
        getCommit: () => FULL_COMMIT_A,
        hashFileSha256: () => RELEASE_CONFIG_SHA256,
        loadReleaseConfig: () => config,
        paths: {
          configPath: realConfigPath,
          projectRoot,
          repositoryRoot,
        },
        ...lifecycle,
        releaseSourceInputs: ["formal"],
        runCreatorProcess: async () => {
          mkdirSync(lifecycle.attemptBuildRoot, { recursive: true });
          writeFileSync(
            untrustedManifestPath,
            '{"untrusted":true}\n',
            "utf8",
          );
          return {
            logPath: lifecycle.attemptLogPath,
            logText: "partial build",
            outcome: { kind: "signal", signal: "SIGTERM" },
          };
        },
        validateBuildArtifacts: () => ({ ok: true, errors: [] }),
      }),
    ).rejects.toThrow("signal SIGTERM");

    expect(readFileSync(manifestPath, "utf8")).toBe(before.manifest);
    expect(statSync(manifestPath).mtimeMs).toBe(before.manifestMtime);
    expect(readFileSync(logPath, "utf8")).toBe(before.log);
    expect(statSync(logPath).mtimeMs).toBe(before.logMtime);
    expect(existsSync(untrustedManifestPath)).toBe(false);
  });

  it("prints one compact success line or one sanitized error line", async () => {
    const cli = loadBuildCli();
    const stdout: string[] = [];
    const stderr: string[] = [];
    const exitCodes: number[] = [];

    await cli.main([], {
      runRelease: async () => ({ ok: true, mode: "verify-only" }),
      setExitCode: (code: number) => exitCodes.push(code),
      stderr: (line: string) => stderr.push(line),
      stdout: (line: string) => stdout.push(line),
    });
    expect(stdout).toEqual(['{"ok":true,"mode":"verify-only"}\n']);
    expect(stderr).toEqual([]);

    stdout.length = 0;
    await cli.main([], {
      runRelease: async () => {
        throw new Error("bad\n   multi-line\r message");
      },
      setExitCode: (code: number) => exitCodes.push(code),
      stderr: (line: string) => stderr.push(line),
      stdout: (line: string) => stdout.push(line),
    });
    expect(stdout).toEqual([]);
    expect(stderr).toEqual([
      "Hulebu Cocos build failed: bad multi-line message\n",
    ]);
    expect(exitCodes).toEqual([1]);
  });
});

describe("Hulebu formal runtime documentation", () => {
  const cocosReadmePath = join(
    repositoryRoot,
    "apps/game/mahjong-roguelike/cocos/hulebu-cocos-3.8.8/README.md",
  );
  const legacyPaths = [
    "apps/game/mahjong-roguelike/prototypes/config-playable/LEGACY.md",
    "apps/web/public/games/hulebu-demo/LEGACY.md",
  ];

  it("documents the only formal runtime and its release operations", () => {
    const readme = readFileSync(cocosReadmePath, "utf8");

    for (const required of [
      "唯一正式运行时",
      "Cocos Creator 3.8.8",
      "/Applications/Cocos/Creator/3.8.8/CocosCreator.app",
      "Cocos Dashboard",
      "assets/scripts/GameSceneController.ts",
      "npm run game:hulebu:build",
      "npm run game:hulebu:verify-build",
      "build/production/web-mobile/",
      "build/production/hulebu-cocos-build.log",
      "build/production/web-mobile/hulebu-build.json",
      "build Task (web-mobile) Finished",
      "退出码 36",
      "HTTP smoke",
      "build/**",
    ]) {
      expect(readme).toContain(required);
    }
    for (const generated of ["library/", "temp/", "local/", "profiles/"]) {
      expect(readme).toContain(generated);
    }
    expect(readme).not.toContain("工程壳");
  });

  it.each(legacyPaths)("freezes legacy reference %s", (relativePath) => {
    const absolutePath = join(repositoryRoot, relativePath);
    expect(existsSync(absolutePath)).toBe(true);
    const marker = existsSync(absolutePath)
      ? readFileSync(absolutePath, "utf8")
      : "";

    expect(marker).toMatch(/^# .*Legacy Reference/m);
    expect(marker).toContain("只读的行为与视觉参考");
    expect(marker).toContain("不是生产运行时");
    expect(marker).toContain("不得从正式发布入口链接");
    expect(marker).toContain("不得继续扩展玩法");
    for (const frozenArea of ["平衡", "模式", "存档", "UI"]) {
      expect(marker).toContain(frozenArea);
    }
    expect(marker).toContain("编号任务");
    expect(marker).toContain("Cocos Creator 3.8.8");
  });
});
