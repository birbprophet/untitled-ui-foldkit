// Vendored from oxlint-plugin-effect (0.5.0) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `Effect.Do` — the builder/do-notation entry point.
 *
 * Use flat pipe-based flow or `Effect.gen` instead.
 *
 * Sources: biome-effect-linting-rules/no-effect-do, language-service/effectDoNotation
 */
import { defineRule } from "@oxlint/plugins";
import { AST } from "../sdk.ts";

const message = "Avoid Effect.Do builder notation. Use flat pipe-based flow or Effect.gen.";

export const noEffectDo = defineRule({
  create(context) {
    return {
      MemberExpression(node) {
        if (AST.isMember(node, "Effect", "Do")) {
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
