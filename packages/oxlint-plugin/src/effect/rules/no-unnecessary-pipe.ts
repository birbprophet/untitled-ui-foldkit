// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `pipe(x)` with zero pipe arguments.
 *
 * Just use `x` directly.
 *
 * Source: language-service/unnecessaryPipe
 */
import { defineRule } from "@oxlint/plugins";
import * as Option from "effect/Option";

import { AST } from "../sdk.ts";

export const noUnnecessaryPipe = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        // Match pipe(x) — bare pipe call with exactly one arg
        if (!Option.exists(AST.calleeName(node), (name) => name === "pipe")) {
          return;
        }
        if (node.arguments.length !== 1) {
          return;
        }
        context.report({
          message: "Unnecessary pipe() with single argument. Use the value directly.",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description: "Unnecessary pipe() with single argument. Use the value directly.",
      recommended: true,
    },
    fixable: "code",
    type: "suggestion",
  },
});
