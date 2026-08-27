// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `Schema.Struct(...)`.
 *
 * Effect v4 domain models should use `Schema.Class` so the schema and
 * constructor stay together.
 */
import { defineRule } from "@oxlint/plugins";
import * as Option from "effect/Option";

import { AST } from "../sdk.ts";

export const noSchemaStruct = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        if (Option.isNone(AST.matchCallOf(node, "Schema", "Struct"))) {
          return;
        }

        context.report({
          message: "Use Schema.Class instead of Schema.Struct.",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description: "Use Schema.Class instead of Schema.Struct.",
      recommended: true,
    },
    type: "suggestion",
  },
});
