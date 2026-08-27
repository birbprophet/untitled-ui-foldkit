import * as Testing from "effect-oxlint/testing";
import * as Effect from "effect/Effect";
import { describe, it } from "@effect/vitest";
import { strictEqual } from "@effect/vitest/utils";

import { accessLayerRule } from "../src/access-layer/rule.ts";

const sqlTagged = {
  quasi: {
    expressions: [],
    quasis: [
      {
        tail: true,
        type: "TemplateElement",
        value: { cooked: "SELECT 1", raw: "SELECT 1" },
      },
    ],
    type: "TemplateLiteral",
  },
  tag: { name: "sql", type: "Identifier" },
  type: "TaggedTemplateExpression",
};

const withTransaction = Testing.callOfMember("sql", "withTransaction", []);

describe("access-layer", () => {
  it.effect("reports raw SQL outside the access layer", () =>
    Effect.sync(() => {
      const diagnostics = Testing.runRule(accessLayerRule, "TaggedTemplateExpression", sqlTagged, {
        filename: "/repo/apps/api/src/worker.ts",
      });

      strictEqual(diagnostics.length, 1);
      strictEqual(diagnostics[0]?.diagnostic.messageId, "rawSql");
    }),
  );

  it.effect("allows raw SQL in the access layer", () =>
    Effect.sync(() => {
      const diagnostics = Testing.runRule(accessLayerRule, "TaggedTemplateExpression", sqlTagged, {
        filename: "/repo/packages/db/src/database.ts",
      });

      Testing.expectNoDiagnostics(diagnostics);
    }),
  );

  it.effect("allows raw SQL in the auth adapter", () =>
    Effect.sync(() => {
      const diagnostics = Testing.runRule(accessLayerRule, "TaggedTemplateExpression", sqlTagged, {
        filename: "/repo/packages/auth/src/adapter.ts",
      });

      Testing.expectNoDiagnostics(diagnostics);
    }),
  );

  it.effect("ignores raw SQL in tests", () =>
    Effect.sync(() => {
      const diagnostics = Testing.runRule(accessLayerRule, "TaggedTemplateExpression", sqlTagged, {
        filename: "/repo/apps/api/tests/worker.test.ts",
      });

      Testing.expectNoDiagnostics(diagnostics);
    }),
  );

  it.effect("ignores raw SQL outside apps and packages", () =>
    Effect.sync(() => {
      const diagnostics = Testing.runRule(accessLayerRule, "TaggedTemplateExpression", sqlTagged, {
        filename: "/repo/tools/local/teardown-organization.ts",
      });

      Testing.expectNoDiagnostics(diagnostics);
    }),
  );

  it.effect("reports sql.withTransaction outside AtomicWrites", () =>
    Effect.sync(() => {
      const diagnostics = Testing.runRule(accessLayerRule, "CallExpression", withTransaction, {
        filename: "/repo/packages/db/src/database.ts",
      });

      strictEqual(diagnostics.length, 1);
      strictEqual(diagnostics[0]?.diagnostic.messageId, "d1Transaction");
    }),
  );

  it.effect("allows sql.withTransaction in AtomicWrites", () =>
    Effect.sync(() => {
      const diagnostics = Testing.runRule(accessLayerRule, "CallExpression", withTransaction, {
        filename: "/repo/packages/db/src/atomic.ts",
      });

      Testing.expectNoDiagnostics(diagnostics);
    }),
  );

  it.effect("ignores sql.withTransaction in tests", () =>
    Effect.sync(() => {
      const diagnostics = Testing.runRule(accessLayerRule, "CallExpression", withTransaction, {
        filename: "/repo/packages/db/tests/atomic.test.ts",
      });

      Testing.expectNoDiagnostics(diagnostics);
    }),
  );

  it.effect("ignores sql.withTransaction outside apps and packages", () =>
    Effect.sync(() => {
      const diagnostics = Testing.runRule(accessLayerRule, "CallExpression", withTransaction, {
        filename: "/repo/tools/local/teardown-organization.ts",
      });

      Testing.expectNoDiagnostics(diagnostics);
    }),
  );
});
