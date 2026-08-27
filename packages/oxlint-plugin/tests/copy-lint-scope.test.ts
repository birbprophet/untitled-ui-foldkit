import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import nodePath from "node:path";
import * as Effect from "effect/Effect";
import { describe, it } from "@effect/vitest";
import { assertInclude, strictEqual } from "@effect/vitest/utils";

const HERE = new URL(".", import.meta.url).pathname;
const REPO = nodePath.join(HERE, "..", "..", "..");
const SCRATCH = nodePath.join(REPO, "node_modules", ".cache", "rule-behaviour");
const FIXTURE = nodePath.join(HERE, "fixtures", "copyLintScope.ts");

const findOxlintBinary = (): string => {
  const found = execFileSync(
    "find",
    [nodePath.join(REPO, "node_modules", ".bun"), "-path", "*oxlint/bin/oxlint"],
    { encoding: "utf-8" },
  ).split("\n");
  return found.find((line) => line.length > 0) ?? "";
};

const OXLINT_BINARY = findOxlintBinary();

describe("copy-lint scope over product wiring", () => {
  it.effect("does not flag import bindings, identifiers, module paths, or header keys", () =>
    Effect.sync(() => {
      mkdirSync(SCRATCH, { recursive: true });
      const configPath = nodePath.join(SCRATCH, `${String(process.pid)}-copy-lint.json`);
      writeFileSync(
        configPath,
        JSON.stringify({
          jsPlugins: [{ name: "siglata", specifier: "oxlint-plugin" }],
          rules: { "siglata/copy-lint": "error" },
        }),
      );
      const run = spawnSync(OXLINT_BINARY, ["-c", configPath, "--format=unix", FIXTURE], {
        cwd: REPO,
        encoding: "utf-8",
      });
      rmSync(configPath, { force: true });
      const output = `${run.stdout ?? ""}${run.stderr ?? ""}`;
      if (OXLINT_BINARY === "" || run.error !== undefined) {
        throw new Error(`could not run oxlint: ${String(run.error)}`);
      }
      strictEqual(run.status, 1);
      const diagnostics = output
        .split("\n")
        .filter((line) => line.includes("[Error/siglata(copy-lint)]"));
      strictEqual(diagnostics.length, 1);
      assertInclude(diagnostics[0], "hashed");
      assertInclude(readFileSync(FIXTURE, "utf-8"), "Your monthly report is ready to send.");
    }),
  );
});
