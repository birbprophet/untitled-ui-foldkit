// Vendored from oxlint-plugin-effect (0.6.0) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban TypeScript `as` assertions.
 *
 * An `as` tells the checker to stop checking. `satisfies` asserts the same shape
 * and keeps the inferred type, so a later edit that breaks the shape still fails
 * to compile.
 *
 * Source: oxlint-plugin-effect/no-as, added in 0.6.0 and in its `recommended`.
 *
 * Reports every `TSAsExpression`, including `as const`.
 */
import { defineRule } from "@oxlint/plugins";

const message = "Avoid as assertions. Use satisfies instead.";

export const noAs = defineRule({
  create(context) {
    return {
      TSAsExpression(node) {
        context.report({ message, node });
      },
    };
  },
  meta: {
    docs: { description: message, recommended: true },
    type: "problem",
  },
});
