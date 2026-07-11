import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
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
