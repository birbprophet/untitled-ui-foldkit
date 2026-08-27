// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `Effect.provide(layer)` used inline inside Effect.gen/fn.
 *
 * Provide layers at the boundary, not deep in generators.
 *
 * Source: biome-effect-linting-rules/no-inline-runtime-provide
 */
import { defineRule } from "@oxlint/plugins";

import { AST } from "../sdk.ts";
import { makeEffectContextTracker } from "./_effect-context.ts";

const message = "Avoid Effect.provide inside Effect.gen/fn. Provide layers at the boundary.";

export const noInlineProvide = defineRule({
  create(context) {
    const tracker = makeEffectContextTracker();
    return {
      CallExpression(node) {
        // Counted first, matching the old `Visitor.merge(tracker, handler)` order.
        tracker.enter(node);
        if (tracker.depth() > 0 && AST.isCallOf(node, "Effect", "provide")) {
          context.report({ message, node });
        }
      },
      "CallExpression:exit"(node) {
        tracker.exit(node);
      },
    };
  },
  meta: {
    docs: { description: message, recommended: true },
    type: "suggestion",
  },
});
