import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import nodePath from "node:path";
import * as Arr from "effect/Array";
import * as Effect from "effect/Effect";
import * as Order from "effect/Order";
import { describe, it } from "@effect/vitest";
import { deepStrictEqual } from "@effect/vitest/utils";

/**
 * What each vendored rule actually reports, measured against a fixture.
 *
 * These 67 rules arrived from someone else's repository and were enforced across
 * this tree at error before anything checked that they work. An audit found rules
 * that fire on nothing (`noManualEffectChannels`, `noMultipleEffectProvide`),
 * rules that fire on far more than they document (`noInstanceofSchema` reports
 * every `instanceof`), and dead branches inside otherwise-working rules. None of
 * it was visible: a lint rule that reports nothing looks exactly like a codebase
 * with no violations.
 *
 * So each rule gets a fixture in `fixtures/`, and every line that should be
 * reported carries `// EXPECT <ruleId>`. This file runs the real oxlint binary
 * over each fixture with **only that rule enabled**, and asserts the set of
 * reported lines equals the set of annotated lines. Both directions matter: a
 * missing report is a dead rule, an extra one is over-firing.
 *
 * It exists mainly to make the migration off the vendored `Rule.define` shim
 * safe. Rewriting 58 AST matchers is 58 chances to silently stop matching, and
 * this is the only thing that would notice.
 */

const HERE = new URL(".", import.meta.url).pathname;
const REPO = nodePath.join(HERE, "..", "..", "..");

/**
 * Where the throwaway configs go, and it is NOT the repository root.
 *
 * ⚠️ THEY USED TO LAND IN THE ROOT, AND THAT MADE THE GATE FLAKY FOR EVERYBODY.
 * `vp check`'s formatter walks the repo root, so a config written here while
 * another `bun run ready` was running made that gate fail on its FIRST step with
 * an unrelated I/O error — observed on 2026-08-03:
 *
 *   x Failed to read file: .../siglata/_rule-behaviour-56046-effect-noEffectAs.json
 *     Formatting failed before analysis started
 *
 * An interrupted run also left the files untracked in `git status`, which is how
 * a stray artifact gets misread as somebody's uncommitted work.
 *
 * ⚠️ STILL INSIDE THE REPO, WHICH IS THE CONSTRAINT THAT PUT THEM IN THE ROOT.
 * The plugin specifier resolves RELATIVE TO THE CONFIG FILE, so a config in the
 * system temp directory cannot see the workspace at all. `node_modules/.cache`
 * is inside the tree — so `oxlint-plugin/effect` still resolves by walking up to
 * `node_modules` — while being ignored by git and skipped by the formatter.
 *
 * The pid stays in the name: it solves collisions between concurrent test
 * PROCESSES, which is a different problem from the location and still real.
 */
const SCRATCH = nodePath.join(REPO, "node_modules", ".cache", "rule-behaviour");
const FIXTURES = nodePath.join(HERE, "fixtures");

/**
 * The real binary, not `node_modules/.bin/oxlint` — that shim is the IDE/LSP
 * wrapper and refuses a `-c`. Resolved rather than hard-coded because the path
 * carries a content hash that changes on every dependency bump.
 *
 * ⚠️ RESOLVED ONCE, AND IT USED TO BE ONCE PER CASE. The `find` walks the whole
 * of `node_modules/.bun`: measured at 0.33s on a quiet machine, and there are 66
 * cases, so the suite spent ~22s of pure filesystem walk finding the same path 66
 * times — while every other package's tests contended for the same disk. That is
 * what put cases over vitest's 5s default: not the assertion, not oxlint, but the
 * lookup in front of it. Run from inside this package the suite passed; run from
 * the repo root it timed out, which is the shape of a load problem rather than a
 * logic one.
 *
 * A module-level constant is safe precisely because the comment above says when
 * the path changes — on a dependency bump, which cannot happen mid-run.
 */
const findOxlintBinary = (): string => {
  const found = execFileSync(
    "find",
    [nodePath.join(REPO, "node_modules", ".bun"), "-path", "*oxlint/bin/oxlint"],
    { encoding: "utf-8" },
  ).split("\n");
  return found.find((line) => line.length > 0) ?? "";
};

/** Resolved once, when this module loads. */
const OXLINT_BINARY: string = findOxlintBinary();

/** Lines carrying `// EXPECT <ruleId>`, as `line number -> rule id`. */
const expectedIn = (source: string): ReadonlyMap<number, string> => {
  const wanted = new Map<number, string>();
  for (const [index, line] of source.split("\n").entries()) {
    const marker = /\/\/ EXPECT (?<rule>[a-zA-Z@/-]+)/u.exec(line)?.groups?.rule;
    if (marker !== undefined) {
      wanted.set(index + 1, marker);
    }
  }
  return wanted;
};

/** What oxlint actually reports, as `line number -> rule id`. */
const reportedIn = (
  fixture: string,
  ruleId: string,
  jsPlugins: readonly { readonly name: string; readonly specifier: string }[] = [
    { name: "effect", specifier: "oxlint-plugin/effect" },
  ],
): ReadonlyMap<number, string> => {
  // Why this path and not the repo root, and not the system temp directory: see
  // `SCRATCH` above.
  mkdirSync(SCRATCH, { recursive: true });
  const configPath = nodePath.join(
    SCRATCH,
    `${String(process.pid)}-${ruleId.replace("/", "-")}.json`,
  );
  writeFileSync(
    configPath,
    JSON.stringify({
      jsPlugins,
      rules: { [ruleId]: "error" },
    }),
  );
  // `spawnSync`, not `execFileSync`: oxlint exits non-zero whenever it reports
  // anything, which here is the expected outcome rather than a failure.
  const binary = OXLINT_BINARY;
  // `--format=unix` is pinned deliberately. oxlint picks its renderer from whether
  // stdout is a TTY, so the default format is compact in a terminal and graphical
  // under a test runner — and a location regex written against one silently matches
  // nothing against the other. That is how every one of these 67 assertions came
  // back "this rule reported nothing" when run through `vp run -r test` while
  // passing in the package: the harness was reading a format it had never seen.
  const run = spawnSync(binary, ["-c", configPath, "--format=unix", fixture], {
    cwd: REPO,
    encoding: "utf-8",
  });
  rmSync(configPath, { force: true });
  const output = `${run.stdout ?? ""}${run.stderr ?? ""}`;

  // A harness that cannot run the linter must say so, not report an empty set.
  // Silence and "this rule found nothing" are the same value here, and telling
  // them apart is the entire purpose of this suite — so the one failure mode it
  // must never have is producing a clean-looking empty result when it is broken.
  if (binary === "" || run.error !== undefined) {
    throw new Error(
      `could not run oxlint (binary=${JSON.stringify(binary)}, repo=${REPO}): ${String(run.error)}`,
    );
  }
  if (!output.includes(nodePath.basename(fixture))) {
    throw new Error(`oxlint produced no diagnostics for ${fixture}; raw output: ${output.trim()}`);
  }

  const seen = new Map<number, string>();
  for (const line of output.split("\n")) {
    // unix format: `<path>:<line>:<col>: <message> [Error/<plugin>(<rule>)]`
    const hit = /:(?<line>\d+):\d+:.*\[\w+\/(?<plugin>[a-zA-Z@-]+)\((?<rule>[a-zA-Z-]+)\)\]/u.exec(
      line,
    )?.groups;
    if (hit?.line !== undefined && hit.plugin !== undefined && hit.rule !== undefined) {
      seen.set(Number(hit.line), `${hit.plugin}/${hit.rule}`);
    }
  }
  return seen;
};

const fixtureNames = (): readonly string[] =>
  readdirSync(FIXTURES)
    .filter(
      (name) =>
        name.endsWith(".ts") && name !== "no-hardcoded-secrets.ts" && name !== "copyLintScope.ts",
    )
    .toSorted();

describe("every vendored rule reports exactly what its fixture says", () => {
  for (const name of fixtureNames()) {
    const ruleId = `effect/${name.replace(/\.ts$/u, "")}`;
    it.effect(`${ruleId} fires on its positives and nothing else`, () =>
      Effect.sync(() => {
        const fixture = nodePath.join(FIXTURES, name);
        const expected = expectedIn(readFileSync(fixture, "utf-8"));
        const reported = reportedIn(fixture, ruleId);

        // Asserted as sorted pairs so a failure names the exact line that stopped
        // firing, or the exact line that started.
        const byLine = Order.mapInput(Order.Number, (pair: readonly [number, string]) => pair[0]);
        deepStrictEqual(
          Arr.sort(Array.from(reported.entries()), byLine),
          Arr.sort(Array.from(expected.entries()), byLine),
        );
      }),
    );
  }
});

describe("upstream security rules", () => {
  it.effect("reports typed object literals as hardcoded secrets", () =>
    Effect.sync(() => {
      const fixture = nodePath.join(FIXTURES, "no-hardcoded-secrets.ts");
      const ruleId = "@rikalabs/no-hardcoded-secrets";
      const expected = expectedIn(readFileSync(fixture, "utf-8"));
      const reported = reportedIn(fixture, ruleId, [
        { name: "@rikalabs", specifier: "@rikalabs/oxlint-standards/plugin" },
      ]);

      const byLine = Order.mapInput(Order.Number, (pair: readonly [number, string]) => pair[0]);
      deepStrictEqual(
        Arr.sort(Array.from(reported.entries()), byLine),
        Arr.sort(Array.from(expected.entries()), byLine),
      );
    }),
  );
});
