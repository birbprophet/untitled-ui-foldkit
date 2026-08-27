// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban redundant `_tag` in `Schema.TaggedStruct("Foo", { _tag: Schema.Literal("Foo") })`.
 *
 * `TaggedStruct` already provides `_tag` automatically.
 *
 * Source: language-service/redundantSchemaTagIdentifier
 */
import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";
import * as Arr from "effect/Array";
import * as Option from "effect/Option";

import { AST } from "../sdk.ts";

const isTagKey = (key: ESTree.Node): boolean =>
  (key.type === "Identifier" && key.name === "_tag") ||
  (key.type === "Literal" && key.value === "_tag");

const isTagProperty = (property: ESTree.Node): boolean =>
  property.type === "Property" && isTagKey(property.key);

export const noRedundantSchemaTagIdentifier = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        if (Option.isNone(AST.matchCallOf(node, "Schema", "TaggedStruct"))) {
          return;
        }

        // TaggedStruct("tag", { fields })
        const args = node.arguments;
        if (args.length < 2) {
          return;
        }
        const [, fieldsArg] = args;
        if (fieldsArg === undefined || fieldsArg.type !== "ObjectExpression") {
          return;
        }

        const property = Arr.findFirst(fieldsArg.properties, isTagProperty);
        if (Option.isNone(property)) {
          return;
        }

        context.report({
          message:
            "Redundant _tag property. Schema.TaggedStruct already provides _tag automatically.",
          node: property.value,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Redundant _tag in TaggedStruct. TaggedStruct already provides _tag automatically.",
      recommended: true,
    },
    type: "suggestion",
  },
});
