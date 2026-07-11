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
  writeSync,
  writeFileSync,
} from "node:fs";
import { EventEmitter } from "node:events";
import { request as httpRequest } from "node:http";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

type HulebuReleaseConfig = {
  schemaVersion: number;
  gameId: string;
  displayName: string;
  creatorVersion: string;
  platform: string;
  debug: boolean;
  outputName: string;
  contentVersion: string;
  saveSchemaVersion: number;
  finishedMarker: string;
  allowedNonZeroExitCodes: number[];
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
  normalized: boolean;
  originalExitCode: number;
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
const {
  HulebuReleaseError,
  collectBuildStats,
  evaluateCreatorBuild,
  loadReleaseConfig,
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
    normalized: boolean;
    originalExitCode: number;
  };
  loadReleaseConfig: (configPath: string) => HulebuReleaseConfig;
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
      createdAt: string;
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
  buildCreatorArguments: (input: {
    config: HulebuReleaseConfig;
    outputRoot: string;
    projectRoot: string;
  }) => string[];
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
  prepareBuildOutput: (paths: {
    buildRoot: string;
    outputRoot: string;
  }) => void;
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
    outputRoot: string;
    projectRoot: string;
    spawn: (...args: unknown[]) => EventEmitter;
  }) => Promise<{
    logPath: string;
    logText: string;
    outcome:
      | { kind: "exit"; exitCode: number }
      | { kind: "signal"; signal: string }
      | { kind: "spawn-error"; error: Error };
  }>;
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
      debug: false,
      platform: "web-mobile",
      outputName: "web-mobile",
      allowedNonZeroExitCodes: [36],
    });
  });

  it("accepts the checked-in release contract", () => {
    const config = loadReleaseConfig(realConfigPath);

    expect(() => validateReleaseConfig(config)).not.toThrow();
  });

  it.each([
    ["schemaVersion", 2, "release schemaVersion must be 1"],
    ["creatorVersion", "3.8.7", "creatorVersion must be 3.8.8"],
    ["platform", "web-desktop", "platform must be web-mobile"],
    ["debug", true, "debug must be false"],
    ["outputName", "release", "outputName must be web-mobile"],
    ["requiredFiles", [], "requiredFiles must be a non-empty array"],
    ["requiredJsonFiles", [], "requiredJsonFiles must be a non-empty array"],
    ["smokePaths", [], "smokePaths must be a non-empty array"],
    [
      "allowedNonZeroExitCodes",
      [],
      "allowedNonZeroExitCodes must be a non-empty array",
    ],
    ["finishedMarker", "", "finishedMarker must be a non-empty string"],
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
        logText: config.finishedMarker,
        artifactErrors: [],
        config,
      }),
    ).toEqual({ accepted: true, normalized: false, originalExitCode: 0 });
  });

  it("normalizes Creator exit 36 when the build is otherwise valid", () => {
    expect(
      evaluateCreatorBuild({
        exitCode: 36,
        logText: config.finishedMarker,
        artifactErrors: [],
        config,
      }),
    ).toEqual({ accepted: true, normalized: true, originalExitCode: 36 });
  });

  it("rejects an allowed non-zero exit without the finished marker", () => {
    expect(() =>
      evaluateCreatorBuild({
        exitCode: 36,
        logText: "build started",
        artifactErrors: [],
        config,
      }),
    ).toThrow("Creator build log is missing the finished marker");
  });

  it("rejects invalid build artifacts", () => {
    expect(() =>
      evaluateCreatorBuild({
        exitCode: 36,
        logText: config.finishedMarker,
        artifactErrors: ["missing required file: index.html"],
        config,
      }),
    ).toThrow("Creator build artifacts are invalid");
  });

  it("rejects unsupported Creator exit codes", () => {
    expect(() =>
      evaluateCreatorBuild({
        exitCode: 9,
        logText: config.finishedMarker,
        artifactErrors: [],
        config,
      }),
    ).toThrow("Creator exited with unsupported code 9");
  });
});

describe("Hulebu Cocos build manifest", () => {
  const config = loadReleaseConfig(realConfigPath);

  it("counts regular files exactly while excluding only root manifest files", () => {
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
      fileCount: 3,
      totalBytes:
        Buffer.byteLength("abc") +
        Buffer.byteLength("世界") +
        Buffer.byteLength("nested"),
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
      buildId: "abc1234-20260711T010203Z",
      commit: "abc1234",
      config,
      creatorDecision: {
        accepted: true,
        normalized: true,
        originalExitCode: 36,
      },
      createdAt: "2026-07-11T01:02:03.000Z",
      smokeResults,
    };

    const manifest = writeBuildManifest(validBuildRoot, input);
    const expectedData = {
      schemaVersion: 1,
      buildId: input.buildId,
      gameId: config.gameId,
      displayName: config.displayName,
      creatorVersion: config.creatorVersion,
      platform: config.platform,
      debug: config.debug,
      contentVersion: config.contentVersion,
      saveSchemaVersion: config.saveSchemaVersion,
      commit: input.commit,
      createdAt: input.createdAt,
      creatorExitCode: 36,
      creatorExitNormalized: true,
      smokeResults,
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
      buildId: "def5678-20260711T020304Z",
      createdAt: "2026-07-11T02:03:04.000Z",
    });
    expect(replacement.data).toMatchObject({
      buildId: "def5678-20260711T020304Z",
      createdAt: "2026-07-11T02:03:04.000Z",
      ...expectedStats,
    });
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
      buildId: "safe-build",
      commit: "abc1234",
      config,
      creatorDecision: {
        accepted: true,
        normalized: false,
        originalExitCode: 0,
      },
      createdAt: "2026-07-11T01:02:03.000Z",
      smokeResults: [],
    });

    expect(readFileSync(externalPath, "utf8")).toBe(externalContent);
    expect(lstatSync(manifest.path).isFile()).toBe(true);
    expect(lstatSync(manifest.path).isSymbolicLink()).toBe(false);
    expect(JSON.parse(readFileSync(manifest.path, "utf8"))).toMatchObject({
      buildId: "safe-build",
    });
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
          buildId: "failure-build",
          commit: "abc1234",
          config,
          creatorDecision: {
            accepted: true,
            normalized: false,
            originalExitCode: 0,
          },
          createdAt: "2026-07-11T01:02:03.000Z",
          smokeResults: [],
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
  });

  it("removes only the validated web-mobile child and rejects a symlink", () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-delete");
    const buildRoot = join(outputRoot, "web-mobile");
    mkdirSync(buildRoot);
    writeFileSync(join(buildRoot, "old.txt"), "old", "utf8");
    writeFileSync(join(outputRoot, "keep.txt"), "keep", "utf8");

    cli.prepareBuildOutput({ buildRoot, outputRoot });

    expect(existsSync(buildRoot)).toBe(false);
    expect(readFileSync(join(outputRoot, "keep.txt"), "utf8")).toBe("keep");

    const externalRoot = createTemporaryRoot("cli-delete-target");
    writeFileSync(join(externalRoot, "outside.txt"), "outside", "utf8");
    if (!tryCreateSymlink(externalRoot, buildRoot, "dir")) return;

    expect(() => cli.prepareBuildOutput({ buildRoot, outputRoot })).toThrow(
      "build root must not be a symlink",
    );
    expect(readFileSync(join(externalRoot, "outside.txt"), "utf8")).toBe(
      "outside",
    );
  });

  it("aborts when the output directory identity changes before deletion", () => {
    const cli = loadBuildCli();
    const parentRoot = createTemporaryRoot("cli-delete-swap");
    const outputRoot = join(parentRoot, "output");
    const parkedOutputRoot = join(parentRoot, "output-original");
    const buildRoot = join(outputRoot, "web-mobile");
    const externalRoot = createTemporaryRoot("cli-delete-swap-target");
    const externalBuildRoot = join(externalRoot, "web-mobile");
    mkdirSync(buildRoot, { recursive: true });
    mkdirSync(externalBuildRoot, { recursive: true });
    writeFileSync(join(buildRoot, "old.txt"), "old", "utf8");
    writeFileSync(join(externalBuildRoot, "outside.txt"), "outside", "utf8");

    const probePath = join(parentRoot, "symlink-probe");
    if (!tryCreateSymlink(externalRoot, probePath, "dir")) return;
    rmSync(probePath);

    const originalLstatSync = mutableFs.lstatSync;
    let swapped = false;
    mutableFs.lstatSync = (...args: unknown[]) => {
      const status = originalLstatSync(...args);
      if (!swapped && args[0] === buildRoot) {
        swapped = true;
        renameSync(outputRoot, parkedOutputRoot);
        symlinkSync(externalRoot, outputRoot, "dir");
      }
      return status;
    };

    try {
      expect(() => cli.prepareBuildOutput({ buildRoot, outputRoot })).toThrow(
        "output root changed during cleanup",
      );
      expect(readFileSync(join(externalBuildRoot, "outside.txt"), "utf8")).toBe(
        "outside",
      );
      expect(
        readFileSync(join(parkedOutputRoot, "web-mobile/old.txt"), "utf8"),
      ).toBe("old");
    } finally {
      mutableFs.lstatSync = originalLstatSync;
      if (existsSync(outputRoot) && lstatSync(outputRoot).isSymbolicLink()) {
        rmSync(outputRoot);
      }
      if (existsSync(parkedOutputRoot)) {
        renameSync(parkedOutputRoot, outputRoot);
      }
    }
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
    const manifestPath = join(buildRoot, "hulebu-build.json");
    writeFileSync(logPath, "existing log", "utf8");
    writeFileSync(manifestPath, '{"existing":true}\n', "utf8");
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
        getCommit: () => "abcdef123456",
        now: () => new Date("2026-07-11T01:02:03.456Z"),
        paths: {
          configPath: realConfigPath,
          projectRoot: createTemporaryRoot("cli-verify-project"),
          repositoryRoot,
        },
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
      commit: "abcdef123456",
      creatorInvoked: false,
      manifestWritten: false,
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
    const smokeResults = [{ pathname: "/", status: 200, bytes: 10 }];
    const summary = await cli.runRelease(["--output-root", outputRoot], {
      cwd: repositoryRoot,
      environment: {},
      evaluateCreatorBuild: (input: CreatorBuildInput) => {
        events.push("evaluate");
        expect(input.exitCode).toBe(36);
        return { accepted: true, normalized: true, originalExitCode: 36 };
      },
      getCommit: () => {
        events.push("commit");
        return "abcdef123456";
      },
      loadReleaseConfig: () => config,
      now: () => new Date("2026-07-11T01:02:03.456Z"),
      paths: {
        configPath: realConfigPath,
        projectRoot: createTemporaryRoot("cli-order-project"),
        repositoryRoot,
      },
      prepareBuildOutput: () => events.push("prepare"),
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
          buildId: "abcdef123456-20260711T010203Z",
          commit: "abcdef123456",
          createdAt: "2026-07-11T01:02:03.456Z",
          smokeResults,
        });
        return {
          path: join(outputRoot, "web-mobile/hulebu-build.json"),
          data: {},
        };
      },
    });

    expect(events).toEqual([
      "commit",
      "prepare",
      "creator",
      "validate",
      "evaluate",
      "smoke",
      "manifest",
    ]);
    expect(summary).toMatchObject({
      ok: true,
      mode: "build",
      buildId: "abcdef123456-20260711T010203Z",
      creatorExitCode: 36,
      creatorExitNormalized: true,
      smokeResults,
    });
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

      await expect(
        cli.runRelease([], {
          environment: {},
          getCommit: () => "abcdef123456",
          loadReleaseConfig: () => config,
          paths: {
            configPath: realConfigPath,
            projectRoot: createTemporaryRoot("cli-terminal-project"),
            repositoryRoot,
          },
          prepareBuildOutput: () => undefined,
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

  it("removes a final-named manifest recreated by a failed Creator attempt", async () => {
    const cli = loadBuildCli();
    const outputRoot = createTemporaryRoot("cli-failed-manifest");
    const buildRoot = join(outputRoot, config.outputName);
    const manifestPath = join(buildRoot, "hulebu-build.json");

    await expect(
      cli.runRelease(["--output-root", outputRoot], {
        environment: {},
        getCommit: () => "abcdef123456",
        loadReleaseConfig: () => config,
        paths: {
          configPath: realConfigPath,
          projectRoot: createTemporaryRoot("cli-failed-manifest-project"),
          repositoryRoot,
        },
        runCreatorProcess: async () => {
          mkdirSync(buildRoot, { recursive: true });
          writeFileSync(manifestPath, '{"untrusted":true}\n', "utf8");
          return {
            logPath: join(outputRoot, "hulebu-cocos-build.log"),
            logText: "partial build",
            outcome: { kind: "signal", signal: "SIGTERM" },
          };
        },
        validateBuildArtifacts: () => ({ ok: true, errors: [] }),
      }),
    ).rejects.toThrow("signal SIGTERM");

    expect(existsSync(manifestPath)).toBe(false);
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
