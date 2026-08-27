// Vendored from oxlint-plugin-effect (0.5.0) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `Effect.bind`.
 *
 * Use flat pipe or direct top-level `Effect.gen` with yields.
 *
 * Source: biome-effect-linting-rules/no-effect-bind
 */
import { defineRule } from "@oxlint/plugins";
import { AST } from "../sdk.ts";

const message = "Avoid Effect.bind. Use flat pipe or Effect.gen with yields.";

export const noEffectBind = defineRule({
  create(context) {
    return {
      MemberExpression(node) {
        if (AST.isMember(node, "Effect", "bind")) {
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
