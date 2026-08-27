// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `Schema.Struct({ _tag: Schema.Literal("Foo"), ... })`.
 * Use `Schema.TaggedStruct("Foo", { ... })` instead.
 *
 * Source: language-service/schemaStructWithTag
 */
import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";
import * as Arr from "effect/Array";
import * as Option from "effect/Option";

import { AST } from "../sdk.ts";

const isTagKey = (key: ESTree.Node): boolean =>
  (key.type === "Identifier" && key.name === "_tag") ||
  (key.type === "Literal" && key.value === "_tag");

/** A `_tag: Schema.Literal(...)` field — the thing `TaggedStruct` already provides. */
const isTaggedLiteralProperty = (property: ESTree.Node): boolean =>
  property.type === "Property" &&
  isTagKey(property.key) &&
  property.value.type === "CallExpression" &&
  Option.isSome(AST.matchCallOf(property.value, "Schema", "Literal"));

export const noSchemaStructWithTag = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        if (Option.isNone(AST.matchCallOf(node, "Schema", "Struct"))) {
          return;
        }

        const args = node.arguments;
        if (args.length !== 1) {
          return;
        }
        const [arg] = args;
        if (arg.type !== "ObjectExpression") {
          return;
        }

        if (!Arr.some(arg.properties, isTaggedLiteralProperty)) {
          return;
        }

        context.report({
          message:
            'Use Schema.TaggedStruct("Tag", { ... }) instead of Schema.Struct({ _tag: Schema.Literal(...), ... }).',
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        'Use Schema.TaggedStruct("Tag", { ... }) instead of Schema.Struct({ _tag: Schema.Literal("Tag"), ... }).',
      recommended: true,
    },
    type: "suggestion",
  },
});
