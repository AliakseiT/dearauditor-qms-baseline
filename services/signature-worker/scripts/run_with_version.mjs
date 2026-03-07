#!/usr/bin/env node

import { execFileSync, spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workerDir = path.resolve(__dirname, "..");
const repoRoot = path.resolve(workerDir, "..", "..");

function utcDateStamp() {
  return new Date().toISOString().slice(0, 10);
}

function shortGitHash() {
  try {
    return execFileSync("git", ["rev-parse", "--short=8", "HEAD"], {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "nogit";
  }
}

function workerVersion() {
  return `${utcDateStamp()}-${shortGitHash()}`;
}

const mode = process.argv[2] || "print";
const passthroughArgs = process.argv.slice(3);
const version = workerVersion();

if (mode === "print") {
  process.stdout.write(`${version}\n`);
  process.exit(0);
}

if (mode !== "dev" && mode !== "deploy") {
  process.stderr.write(`Unsupported mode: ${mode}\n`);
  process.exit(1);
}

const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";
const wranglerArgs = ["wrangler", mode, ...passthroughArgs, "--var", `WORKER_VERSION:${version}`];

const child = spawn(npxCommand, wranglerArgs, {
  cwd: workerDir,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});

