// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban directly-nested `Effect.gen` calls that can be flattened.
 *
 * Fires only when an inner `Effect.gen` is `yield*`'d straight into the outer
 * gen body — the inner gen can be inlined (its statements hoisted into the
 * outer gen).
 *
 * Flagged:
 *   Effect.gen(function*() { yield* Effect.gen(function*() { ... }) })
 *
 * Allowed — wrapped in another operator (not directly yielded):
 *   Effect.gen(function*() {
 *     yield* Effect.scoped(Effect.gen(function*() { ... }))
 *     yield* Effect.forkDetach(Effect.gen(function*() { ... }))
 *   })
 *
 * Allowed — method-style (closes over outer-yielded deps):
 *   Effect.gen(function*() {
 *     const ref = yield* Ref.make(0)
 *     return { op: () => Effect.gen(function*() { yield* Ref.get(ref) }) }
 *   })
 *
 * Sources: biome-effect-linting-rules/no-nested-effect-gen, language-service/nestedEffectGenYield
 */
import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";

import { AST } from "../sdk.ts";
import * as P from "effect/Predicate";

/** An AST branch carrying a given `type` tag. */
const isTagged = (candidate: unknown, type: string): boolean =>
  P.hasProperty(candidate, "type") && candidate.type === type;

/** A `CallExpression`, established by its tag rather than asserted. */
const isCallExpression = (candidate: unknown): candidate is ESTree.CallExpression =>
  isTagged(candidate, "CallExpression");

/** `Effect.gen(...)` or `Effect.fn(...)`, read off an untyped branch. */
const isGenOrFnCall = (candidate: unknown): boolean =>
  isCallExpression(candidate) &&
  (AST.isCallOf(candidate, "Effect", "gen") || AST.isCallOf(candidate, "Effect", "fn"));

// An inner Effect.gen is "directly nested" only if its value is yielded
// straight into the outer gen's body — i.e. the parent chain is:
//
//   CallExpression (inner Effect.gen)
//     ← YieldExpression (delegate, i.e. yield*)
//     ← ExpressionStatement
//     ← BlockStatement
//     ← FunctionExpression (outer Effect.gen/fn callback)
//
// Any other shape — wrapped in another call (`Effect.scoped(Effect.gen(...))`,
// `Effect.forkDetach(Effect.gen(...))`), returned from a method, etc. — is an
// inline gen and not an antipattern.
const isDirectlyNestedGen = function isDirectlyNestedGen(node: unknown): boolean {
  if (!P.hasProperty(node, "parent")) {
    return false;
  }
  const yielded = node.parent;
  if (!isTagged(yielded, "YieldExpression")) {
    return false;
  }
  // Must be `yield*` (delegate), not `yield`
  if (!P.hasProperty(yielded, "delegate") || yielded.delegate !== true) {
    return false;
  }
  if (!P.hasProperty(yielded, "parent")) {
    return false;
  }
  const statement = yielded.parent;
  if (!isTagged(statement, "ExpressionStatement") || !P.hasProperty(statement, "parent")) {
    return false;
  }
  const block = statement.parent;
  if (!isTagged(block, "BlockStatement") || !P.hasProperty(block, "parent")) {
    return false;
  }
  const callback = block.parent;
  if (!isTagged(callback, "FunctionExpression") && !isTagged(callback, "ArrowFunctionExpression")) {
    return false;
  }
  if (!P.hasProperty(callback, "parent")) {
    return false;
  }
  return isGenOrFnCall(callback.parent);
};

export const noNestedEffectGen = defineRule({
  create(context) {
    // This counter tracks BOTH generator builders, because `isDirectlyNestedGen`
    // already accepts either as the enclosing one. Counting `Effect.gen` alone
    // left an `Effect.fn` outer at depth 1, so the guard below returned before
    // the shape check ever ran and the whole `Effect.fn` branch was unreachable.
    let depth = 0;
    return {
      CallExpression(node) {
        // Counted first, matching the old `Visitor.merge(tracked, handler)` order:
        // the enclosing call is already counted when its own node is examined.
        if (isGenOrFnCall(node)) {
          depth += 1;
        }
        if (depth <= 1 || !AST.isCallOf(node, "Effect", "gen") || !isDirectlyNestedGen(node)) {
          return;
        }
        context.report({
          message: "Nested Effect.gen detected. Flatten to a single Effect.gen.",
          node,
        });
      },
      "CallExpression:exit"(node) {
        if (isGenOrFnCall(node)) {
          depth -= 1;
        }
      },
    };
  },
  meta: {
    docs: {
      description: "Avoid nested Effect.gen. Flatten to a single Effect.gen per method.",
      recommended: true,
    },
    type: "suggestion",
  },
});
