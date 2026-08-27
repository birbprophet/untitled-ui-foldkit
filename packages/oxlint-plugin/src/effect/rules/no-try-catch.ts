// Vendored from oxlint-plugin-effect (0.5.0) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/** Ban every try statement, including catch and finally variants. */
import { defineRule } from "@oxlint/plugins";

export const noTryCatch = defineRule({
  create(context) {
    return {
      TryStatement(node) {
        context.report({
          message:
            "Avoid try/catch/finally. Use Effect.try or Effect.tryPromise for failures and Effect.ensuring or Effect.acquireUseRelease for finalization.",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Avoid try/catch/finally blocks. Use Effect error handling and finalization operators.",
      recommended: true,
    },
    type: "suggestion",
  },
});
