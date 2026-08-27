// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban immediately-invoked function expressions (IIFEs).
 *
 * Use named const binding + flat pipeline.
 *
 * Source: biome-effect-linting-rules/no-iife-wrapper
 */
import { defineRule } from "@oxlint/plugins";
import * as P from "effect/Predicate";

/** An arrow or `function` expression, in callee position. */
const isFunctionExpression = (candidate: unknown): boolean =>
  P.hasProperty(candidate, "type") &&
  (candidate.type === "ArrowFunctionExpression" || candidate.type === "FunctionExpression");

/** `(expr)(...)` where the parenthesised expression is itself a function. */
const isParenthesizedFunction = (candidate: unknown): boolean =>
  P.hasProperty(candidate, "type") &&
  candidate.type === "ParenthesizedExpression" &&
  P.hasProperty(candidate, "expression") &&
  isFunctionExpression(candidate.expression);

export const noIifeWrapper = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        const { callee } = node;
        if (!isFunctionExpression(callee) && !isParenthesizedFunction(callee)) {
          return;
        }
        context.report({
          message: "Avoid IIFEs. Use named const binding + flat pipeline.",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description: "Avoid IIFEs. Use named const bindings + flat pipeline.",
      recommended: true,
    },
    type: "suggestion",
  },
});
