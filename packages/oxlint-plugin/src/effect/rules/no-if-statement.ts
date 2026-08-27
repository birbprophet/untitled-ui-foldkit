// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `if` statements in Effect codebases.
 *
 * Use `Option.match`, `Either.match`, `Match.value`, or data combinators.
 *
 * Source: biome-effect-linting-rules/no-if-statement
 *
 * Note: Very opinionated — recommended for strict functional presets only.
 */
import { defineRule } from "@oxlint/plugins";

const message = "Avoid if statements. Use Option.match, Either.match, Match.value, or Effect.if.";

export const noIfStatement = defineRule({
  create(context) {
    return {
      IfStatement(node) {
        context.report({ message, node });
      },
    };
  },
  meta: {
    docs: { description: message, recommended: true },
    type: "suggestion",
  },
});
