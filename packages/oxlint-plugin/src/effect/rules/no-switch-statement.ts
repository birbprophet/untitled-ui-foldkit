// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `switch` statements.
 *
 * Use `Match.value`, `Option.match`, `Either.match` instead.
 *
 * Source: biome-effect-linting-rules/no-switch-statement
 */
import { defineRule } from "@oxlint/plugins";

const message = "Avoid switch statements. Use Match.value, Option.match, or Either.match.";

export const noSwitchStatement = defineRule({
  create(context) {
    return {
      SwitchStatement(node) {
        context.report({ message, node });
      },
    };
  },
  meta: {
    docs: {
      description: message,
      recommended: true,
    },
    type: "suggestion",
  },
});
