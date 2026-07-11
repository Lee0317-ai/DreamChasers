import {
  mkdtempSync,
  mkdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
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

const require = createRequire(import.meta.url);
const mutableFs = require("node:fs") as {
  readFileSync: (...args: unknown[]) => unknown;
};
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const realConfigPath = join(
  repositoryRoot,
  "apps/game/mahjong-roguelike/release/hulebu-v1.release.json",
);
const releaseLibraryPath = join(
  repositoryRoot,
  "apps/game/mahjong-roguelike/scripts/hulebu-cocos-release.cjs",
);
const {
  HulebuReleaseError,
  evaluateCreatorBuild,
  loadReleaseConfig,
  validateBuildArtifacts,
  validateReleaseConfig,
} = require(releaseLibraryPath) as {
  HulebuReleaseError: new (message: string) => Error;
  evaluateCreatorBuild: (input: CreatorBuildInput) => {
    accepted: boolean;
    normalized: boolean;
    originalExitCode: number;
  };
  loadReleaseConfig: (configPath: string) => HulebuReleaseConfig;
  validateBuildArtifacts: (
    buildRoot: string,
    config: HulebuReleaseConfig,
  ) => { ok: boolean; errors: string[] };
  validateReleaseConfig: (config: unknown) => void;
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

    expect(() => validateReleaseConfig({ ...config, [key]: value })).toThrow(message);
  });

  it.each(
    (["requiredFiles", "requiredJsonFiles"] as const).flatMap((key) => [
      { key, label: "non-string", value: 42, message: "must be a non-empty string" },
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
        requiredFiles: config.requiredFiles.filter((entry) => entry !== "index.html"),
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
    const invalidConfigPath = join(createTemporaryRoot("config"), "release.json");
    writeFileSync(invalidConfigPath, "not-json", "utf8");

    expect(() => loadReleaseConfig(invalidConfigPath)).toThrow(HulebuReleaseError);
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
    writeFileSync(join(invalidJsonRoot, "src/settings.json"), "not-json", "utf8");

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
    writeFileSync(join(invalidIndexRoot, "index.html"), "<html></html>", "utf8");

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

    expect(() => validateBuildArtifacts(directoryArtifactRoot, config)).not.toThrow();
    expect(validateBuildArtifacts(directoryArtifactRoot, config).errors).toContain(
      "required artifact is not a regular file: index.html",
    );
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
    writeFileSync(join(externalRoot, "config.json"), JSON.stringify({ valid: true }));
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
      validateBuildArtifacts(invalidHierarchyRoot, invalidHierarchyConfig).errors,
    ).toContain("unable to inspect required file: index.html/child.js");
  });

  it("returns a structured error when a validated artifact read fails", () => {
    const readFailureRoot = createValidBuild(config);
    const failingPath = join(readFailureRoot, "src/settings.json");
    const originalReadFileSync = mutableFs.readFileSync;
    mutableFs.readFileSync = (...args: unknown[]) => {
      if (args[0] === failingPath) {
        throw Object.assign(new Error("simulated read failure"), { code: "EIO" });
      }
      return originalReadFileSync(...args);
    };

    try {
      expect(() => validateBuildArtifacts(readFailureRoot, config)).not.toThrow();
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
