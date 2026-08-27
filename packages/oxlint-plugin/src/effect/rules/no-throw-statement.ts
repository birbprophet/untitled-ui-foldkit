// Vendored from oxlint-plugin-effect (0.5.0) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/** Ban every throw statement. */
import { defineRule } from "@oxlint/plugins";

export const noThrowStatement = defineRule({
  create(context) {
    return {
      ThrowStatement(node) {
        context.report({
          message:
            "Avoid throw. Model expected failures with tagged errors and explicit defects with Effect.die.",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description: "Avoid throw. Use Effect.fail with tagged errors.",
      recommended: true,
    },
    type: "problem",
  },
});
