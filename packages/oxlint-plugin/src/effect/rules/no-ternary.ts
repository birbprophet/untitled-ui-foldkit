// Vendored from oxlint-plugin-effect (0.5.0) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban ternary expressions in Effect codebases.
 *
 * Use `Option.match`, `Either.match`, `Match.value` instead.
 *
 * Source: biome-effect-linting-rules/no-ternary
 *
 * Note: Very opinionated — recommended for strict functional presets only.
 */
import { defineRule } from "@oxlint/plugins";

export const noTernary = defineRule({
  create(context) {
    return {
      ConditionalExpression(node) {
        context.report({
          message: "Avoid ternary expressions. Use Option.match, Either.match, or Match.value.",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description: "Avoid ternary expressions. Use Option.match, Either.match, or Match.value.",
      recommended: true,
    },
    type: "suggestion",
  },
});
