import * as Testing from "effect-oxlint/testing";
import * as Effect from "effect/Effect";
import { describe, it } from "@effect/vitest";
import { assertTrue, strictEqual } from "@effect/vitest/utils";
import { noWallClockInProgramPathsRule } from "../src/no-wall-clock-in-program-paths/rule.ts";

describe("no-wall-clock-in-program-paths", () => {
  it.effect("reports Date.now and Math.random", () =>
    Effect.sync(() => {
      const diagnostics = Testing.runRuleMulti(noWallClockInProgramPathsRule, [
        ["MemberExpression", Testing.memberExpr("Date", "now")],
        ["MemberExpression", Testing.memberExpr("Math", "random")],
      ]);

      strictEqual(diagnostics.length, 2);
      assertTrue(
        diagnostics.every(({ diagnostic }) => diagnostic.message?.includes("ambient") ?? false),
      );
    }),
  );

  it.effect("allows the pinned Clock and seeded Random services", () =>
    Effect.sync(() => {
      const diagnostics = Testing.runRuleMulti(noWallClockInProgramPathsRule, [
        ["MemberExpression", Testing.memberExpr("Clock", "currentTimeMillis")],
        ["MemberExpression", Testing.memberExpr("Random", "next")],
      ]);

      Testing.expectNoDiagnostics(diagnostics);
    }),
  );
});
