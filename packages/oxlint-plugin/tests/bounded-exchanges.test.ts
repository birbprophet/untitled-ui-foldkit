import * as Testing from "effect-oxlint/testing";
import * as Effect from "effect/Effect";
import { describe, it } from "@effect/vitest";
import { strictEqual } from "@effect/vitest/utils";
import { boundedExchangesRule } from "../src/bounded-exchanges/rule.ts";

const resultOf = (program: unknown) => Testing.callOfMember("Effect", "result", [program]);

describe("bounded-exchanges", () => {
  it.effect("reports an unwrapped exchange", () =>
    Effect.sync(() => {
      const diagnostics = Testing.runRule(
        boundedExchangesRule,
        "CallExpression",
        resultOf(Testing.callExpr("exchange")),
        { filename: "/repo/apps/app/src/people.ts" },
      );

      strictEqual(diagnostics.length, 1);
      strictEqual(diagnostics[0]?.diagnostic.messageId, "unboundedExchange");
    }),
  );

  it.effect("allows an exchange wrapped in within", () =>
    Effect.sync(() => {
      const diagnostics = Testing.runRule(
        boundedExchangesRule,
        "CallExpression",
        resultOf(Testing.callExpr("within", [Testing.callExpr("exchange")])),
        { filename: "/repo/apps/app/src/people.ts" },
      );

      Testing.expectNoDiagnostics(diagnostics);
    }),
  );
});
