// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban spread syntax.
 *
 * Prefer explicit construction/transformation so value boundaries stay visible.
 */
import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";

const message = "Avoid spread syntax. Use explicit construction or a named transformation instead.";

export const noSpread = defineRule({
  create(context) {
    const reportSpread = function reportSpread(node: ESTree.Node) {
      context.report({ message, node });
    };

    return {
      JSXSpreadAttribute: reportSpread,
      SpreadElement: reportSpread,
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
