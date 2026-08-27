// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `Schema.Union([Schema.Literal("a"), Schema.Literal("b")])`.
 * Use `Schema.Literals(["a", "b"])` instead.
 *
 * Source: language-service/schemaUnionOfLiterals
 *
 * Ported from v3, where both halves were spelled differently. `Schema.Union` took
 * its members variadically and now takes a single array, so the old
 * `arguments.length >= 2` test could never pass on v4 code; and the collapsed form
 * was `Schema.Literal("a", "b")`, where v4's `Schema.Literal` takes exactly one
 * literal and `Schema.Literals` takes the array. Both verified against the
 * installed `effect@4.0.0-beta.102`. The variadic shape is still matched — it is
 * a leftover, not a different operator.
 */
import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Arr from "effect/Array";
import * as Option from "effect/Option";
import * as P from "effect/Predicate";

/** A `CallExpression`, established by its tag rather than asserted. */
const isCallExpression = (candidate: unknown): candidate is ESTree.CallExpression =>
  P.hasProperty(candidate, "type") && candidate.type === "CallExpression";

const isSchemaLiteral = function isSchemaLiteral(candidate: unknown): boolean {
  if (!isCallExpression(candidate)) {
    return false;
  }
  return Option.isSome(AST.matchCallOf(candidate, "Schema", "Literal"));
};

/**
 * The union's members, however the call spells them.
 *
 * A lone `ArrayExpression` argument is v4's member list. Anything else is read as
 * the argument list itself, which is v3's variadic shape.
 */
const membersOf = function membersOf(call: ESTree.CallExpression): readonly unknown[] {
  const sole = Option.getOrUndefined(Arr.head(call.arguments));
  const isMemberArray =
    call.arguments.length === 1 &&
    P.hasProperty(sole, "type") &&
    sole.type === "ArrayExpression" &&
    P.hasProperty(sole, "elements") &&
    Arr.isArray(sole.elements);
  if (isMemberArray) {
    return sole.elements;
  }
  return call.arguments;
};

export const noSchemaUnionOfLiterals = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        if (Option.isNone(AST.matchCallOf(node, "Schema", "Union"))) {
          return;
        }

        const members = membersOf(node);
        if (members.length < 2) {
          return;
        }

        // Nothing to collapse unless every member is a Schema.Literal call.
        if (!Arr.every(members, isSchemaLiteral)) {
          return;
        }

        context.report({
          message:
            "Use Schema.Literals(['a', 'b']) instead of Schema.Union([Schema.Literal('a'), Schema.Literal('b')]).",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Use Schema.Literals(['a', 'b']) instead of Schema.Union([Schema.Literal('a'), Schema.Literal('b')]).",
      recommended: true,
    },
    type: "suggestion",
  },
});
