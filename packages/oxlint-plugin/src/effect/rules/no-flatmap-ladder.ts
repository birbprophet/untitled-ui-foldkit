// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban nested `Effect.flatMap` calls (flatMap ladder).
 *
 * Build context once with `Effect.all`/`Effect.map` and run a single flatMap.
 *
 * Source: biome-effect-linting-rules/no-flatmap-ladder
 */
import type { ESTree } from "@oxlint/plugins";
import { defineRule } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Arr from "effect/Array";
import * as P from "effect/Predicate";

const isEffectFlatMap = (node: ESTree.CallExpression): boolean =>
  AST.isCallOf(node, "Effect", "flatMap");

/**
 * An ESTree node, as far as this walk needs to know.
 *
 * The walk is structural because it descends through `arguments` and `body`
 * without knowing which node kind it is standing on.
 */
const isNode = (candidate: unknown): candidate is ESTree.Node =>
  P.hasProperty(candidate, "type") && P.isString(candidate.type);

const containsEffectFlatMap = function containsEffectFlatMap(node: unknown): boolean {
  if (!P.isObjectKeyword(node)) {
    return false;
  }
  if (isNode(node) && node.type === "CallExpression" && isEffectFlatMap(node)) {
    return true;
  }
  if (
    P.hasProperty(node, "arguments") &&
    Arr.isArray(node.arguments) &&
    Arr.some(node.arguments, containsEffectFlatMap)
  ) {
    return true;
  }
  if (P.hasProperty(node, "body")) {
    return containsEffectFlatMap(node.body);
  }
  return false;
};

/** A flatMap directly in an argument, or one buried in a callback body. */
const isNestedFlatMap = (arg: ESTree.Node): boolean =>
  (arg.type === "CallExpression" && isEffectFlatMap(arg)) ||
  ((arg.type === "ArrowFunctionExpression" || arg.type === "FunctionExpression") &&
    containsEffectFlatMap(arg.body));

export const noFlatmapLadder = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        if (!isEffectFlatMap(node)) {
          return;
        }
        if (!Arr.some(node.arguments, isNestedFlatMap)) {
          return;
        }

        context.report({
          message:
            "Nested Effect.flatMap detected. Build context with Effect.all, then single flatMap.",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Avoid nested Effect.flatMap (flatMap ladder). Build context once with Effect.all and run a single flatMap.",
      recommended: true,
    },
    type: "suggestion",
  },
});
