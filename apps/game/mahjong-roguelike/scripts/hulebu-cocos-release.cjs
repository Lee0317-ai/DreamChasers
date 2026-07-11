"use strict";

const fs = require("node:fs");
const path = require("node:path");

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
  if (config?.schemaVersion !== 1) {
    throw new HulebuReleaseError("release schemaVersion must be 1");
  }
  if (config.creatorVersion !== "3.8.8") {
    throw new HulebuReleaseError("creatorVersion must be 3.8.8");
  }
  if (config.platform !== "web-mobile") {
    throw new HulebuReleaseError("platform must be web-mobile");
  }
  if (config.debug !== false) {
    throw new HulebuReleaseError("debug must be false");
  }
  if (config.outputName !== "web-mobile") {
    throw new HulebuReleaseError("outputName must be web-mobile");
  }
  for (const key of [
    "requiredFiles",
    "requiredJsonFiles",
    "smokePaths",
    "allowedNonZeroExitCodes",
  ]) {
    if (!Array.isArray(config[key]) || config[key].length === 0) {
      throw new HulebuReleaseError(`${key} must be a non-empty array`);
    }
  }
  if (typeof config.finishedMarker !== "string" || !config.finishedMarker) {
    throw new HulebuReleaseError("finishedMarker must be a non-empty string");
  }
}

function validateBuildArtifacts(buildRoot, config) {
  const errors = [];
  for (const relativePath of config.requiredFiles) {
    const filePath = path.join(buildRoot, relativePath);
    if (!fs.existsSync(filePath)) {
      errors.push(`missing required file: ${relativePath}`);
      continue;
    }
    if (fs.statSync(filePath).size === 0) {
      errors.push(`empty required file: ${relativePath}`);
    }
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
    if (!indexHtml.includes('id="GameCanvas"')) {
      errors.push("index.html missing GameCanvas");
    }
    if (!indexHtml.includes("System.import")) {
      errors.push("index.html missing System.import bootstrap");
    }
  }
  return { ok: errors.length === 0, errors };
}

function evaluateCreatorBuild({ exitCode, logText, artifactErrors, config }) {
  if (artifactErrors.length > 0) {
    throw new HulebuReleaseError(
      `Creator build artifacts are invalid: ${artifactErrors.join("; ")}`,
    );
  }
  if (!logText.includes(config.finishedMarker)) {
    throw new HulebuReleaseError("Creator build log is missing the finished marker");
  }
  if (exitCode === 0) {
    return { accepted: true, normalized: false, originalExitCode: 0 };
  }
  if (config.allowedNonZeroExitCodes.includes(exitCode)) {
    return { accepted: true, normalized: true, originalExitCode: exitCode };
  }
  throw new HulebuReleaseError(`Creator exited with unsupported code ${exitCode}`);
}

module.exports = {
  HulebuReleaseError,
  evaluateCreatorBuild,
  loadReleaseConfig,
  validateBuildArtifacts,
  validateReleaseConfig,
};
