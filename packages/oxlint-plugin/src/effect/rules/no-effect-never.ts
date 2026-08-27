// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `Effect.never`.
 *
 * Use `Stream` or explicit acquire/release lifecycles instead.
 *
 * Source: biome-effect-linting-rules/no-effect-never
 */
import { defineRule } from "@oxlint/plugins";
import { AST } from "../sdk.ts";

const message = "Avoid Effect.never. Use Stream or explicit acquire/release lifecycles.";

export const noEffectNever = defineRule({
  create(context) {
    return {
      MemberExpression(node) {
        if (AST.isMember(node, "Effect", "never")) {
          context.report({ message, node });
        }
      },
    };
  },
  meta: {
    docs: { description: message, recommended: true },
    type: "suggestion",
  },
});
