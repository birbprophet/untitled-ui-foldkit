// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `Effect.succeed(undefined)` and `Effect.succeed(void 0)`.
 *
 * Use `Effect.void` instead.
 *
 * Source: language-service/effectSucceedWithVoid
 */
import { defineRule } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as P from "effect/Predicate";

/** The `undefined` identifier. */
const isUndefinedIdentifier = (candidate: unknown): boolean =>
  P.hasProperty(candidate, "type") &&
  candidate.type === "Identifier" &&
  P.hasProperty(candidate, "name") &&
  candidate.name === "undefined";

/** `void 0`, and only `void 0` — the operand has to be the literal zero. */
const isVoidZero = (candidate: unknown): boolean =>
  P.hasProperty(candidate, "type") &&
  candidate.type === "UnaryExpression" &&
  P.hasProperty(candidate, "operator") &&
  candidate.operator === "void" &&
  P.hasProperty(candidate, "argument") &&
  P.hasProperty(candidate.argument, "type") &&
  candidate.argument.type === "Literal" &&
  P.hasProperty(candidate.argument, "value") &&
  candidate.argument.value === 0;

const isUndefinedLike = (candidate: unknown): boolean =>
  isUndefinedIdentifier(candidate) || isVoidZero(candidate);

export const noEffectSucceedVoid = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        if (!AST.isCallOf(node, "Effect", "succeed") || node.arguments.length !== 1) {
          return;
        }
        const [only] = node.arguments;
        if (!isUndefinedLike(only)) {
          return;
        }
        context.report({
          message: "Use Effect.void instead of Effect.succeed(undefined).",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description: "Avoid Effect.succeed(undefined). Use Effect.void instead.",
      recommended: true,
    },
    type: "suggestion",
  },
});
