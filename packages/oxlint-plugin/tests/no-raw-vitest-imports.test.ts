import * as Testing from "effect-oxlint/testing";
import * as Effect from "effect/Effect";
import { describe, it } from "@effect/vitest";
import { strictEqual } from "@effect/vitest/utils";

import { noRawVitestImportsRule } from "../src/no-raw-vitest-imports/rule.ts";

const namedImport = (source: string, imported: string) =>
  Testing.importDeclWithSpecifiers(source, [Testing.importSpecifier(imported)]);

describe("no-raw-vitest-imports", () => {
  it.effect("allows @effect/vitest runner and assertion imports", () =>
    Effect.sync(() => {
      const diagnostics = Testing.runRuleMulti(noRawVitestImportsRule, [
        ["ImportDeclaration", namedImport("@effect/vitest", "it")],
        ["ImportDeclaration", namedImport("@effect/vitest/utils", "strictEqual")],
      ]);
      strictEqual(diagnostics.length, 0);
    }),
  );

  it.effect("reports each raw runner source", () =>
    Effect.sync(() => {
      const diagnostics = Testing.runRuleMulti(noRawVitestImportsRule, [
        ["ImportDeclaration", namedImport("vitest", "expect")],
        ["ImportDeclaration", namedImport("vite-plus/test", "it")],
        ["ImportDeclaration", namedImport("bun:test", "test")],
      ]);
      strictEqual(diagnostics.length, 3);
    }),
  );
});
