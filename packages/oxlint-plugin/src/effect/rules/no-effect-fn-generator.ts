// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `Effect.fn(function* () { ... })` called with a generator argument.
 *
 * Effect.fn should wrap a plain function or arrow that builds a pipeline,
 * not a generator (use Effect.gen for generators).
 *
 * Source: biome-effect-linting-rules/no-effect-fn-generator
 *
 * Note: This rule may be too aggressive. In Effect v4, `Effect.fn("name")(function*() {...})`
 * is actually the idiomatic pattern. This rule targets `Effect.fn(function*() {...})` without
 * a name span, which is the discouraged pattern from the biome rules.
 */
import { defineRule } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as P from "effect/Predicate";

/** `function* () { ... }` in argument position. */
const isGeneratorExpression = (candidate: unknown): boolean =>
  P.hasProperty(candidate, "type") &&
  candidate.type === "FunctionExpression" &&
  P.hasProperty(candidate, "generator") &&
  candidate.generator === true;

export const noEffectFnGenerator = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        if (!AST.isCallOf(node, "Effect", "fn") || node.arguments.length !== 1) {
          return;
        }
        // Effect.fn(function*() {...}) — single arg that's a generator
        const [only] = node.arguments;
        if (!isGeneratorExpression(only)) {
          return;
        }
        context.report({
          message: "Use Effect.fn('spanName')(function*() {...}) — provide a trace span name.",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Effect.fn should not directly wrap a generator. Use Effect.fn('name')(function*() {...}) with a span name.",
      recommended: true,
    },
    type: "suggestion",
  },
});
