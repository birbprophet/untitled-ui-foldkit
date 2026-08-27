// Vendored from oxlint-plugin-effect (0.5.0) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/** Ban test lifecycle hooks in favor of Effect scopes and scoped test variants. */
import { defineRule } from "@oxlint/plugins";
import * as Option from "effect/Option";

import { AST } from "../sdk.ts";

const lifecycleHooks = new Set(["afterAll", "afterEach", "beforeAll", "beforeEach"]);

export const noTestLifecycleHooks = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        const name = AST.calleeName(node);
        if (Option.isNone(name) || !lifecycleHooks.has(name.value)) {
          return;
        }
        context.report({
          message: `Avoid ${name.value}(). Use effect-bun-test scoped tests and Effect.acquireRelease for fixture lifecycles.`,
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description: "Model test fixtures with Effect scopes instead of lifecycle hooks.",
      recommended: true,
    },
    type: "problem",
  },
});
