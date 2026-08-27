// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `return null`, `return undefined`, `return void 0`. Context-aware messaging.
 *
 * Inside Effect.gen/fn: "Use Option.none() or Effect.void"
 * Outside: "Use Option.none() — convert nullish at system boundaries with Option.fromNullable"
 *
 * Source: biome-effect-linting-rules/no-return-null (extended)
 */
import { defineRule } from "@oxlint/plugins";
import * as P from "effect/Predicate";

import { makeEffectContextTracker } from "./_effect-context.ts";

/** A returned `null` literal. */
const isNullLiteral = (candidate: unknown): boolean =>
  P.hasProperty(candidate, "type") &&
  candidate.type === "Literal" &&
  P.hasProperty(candidate, "value") &&
  candidate.value === null;

/** A returned `undefined` identifier. */
const isUndefinedIdentifier = (candidate: unknown): boolean =>
  P.hasProperty(candidate, "type") &&
  candidate.type === "Identifier" &&
  P.hasProperty(candidate, "name") &&
  candidate.name === "undefined";

/** A returned `void <expr>` unary. */
const isVoidExpression = (candidate: unknown): boolean =>
  P.hasProperty(candidate, "type") &&
  candidate.type === "UnaryExpression" &&
  P.hasProperty(candidate, "operator") &&
  candidate.operator === "void";

/**
 * Effect-context messaging, picked with a guard rather than a ternary — the
 * two texts are long enough that nesting them in an expression hides which is
 * which.
 */
const messageAt = function messageAt(depth: number, inside: string, outside: string): string {
  if (depth > 0) {
    return inside;
  }
  return outside;
};

export const noReturnNullish = defineRule({
  create(context) {
    const tracker = makeEffectContextTracker();

    // The tracker rides on CallExpression while the rule reports on
    // ReturnStatement, so unlike its siblings there is no ordering question
    // between them — they never see the same node.
    return {
      CallExpression(node) {
        tracker.enter(node);
      },
      "CallExpression:exit"(node) {
        tracker.exit(node);
      },
      ReturnStatement(node) {
        const { argument } = node;
        if (P.isNullish(argument)) {
          return;
        }
        const depth = tracker.depth();
        if (isNullLiteral(argument)) {
          context.report({
            message: messageAt(
              depth,
              "Avoid returning null inside Effect.gen/fn. Use Option.none() for absence, or yield* Effect.fail(new MyError()) for errors.",
              "Avoid returning null. Use Option.none() for absence — convert nullish values at system boundaries with Option.fromNullOr().",
            ),
            node,
          });
          return;
        }
        if (isUndefinedIdentifier(argument)) {
          context.report({
            message: messageAt(
              depth,
              "Avoid returning undefined inside Effect.gen/fn. Use Effect.void for void effects, or Option.none() for absence.",
              "Avoid returning undefined. Use Option.none() for absence, or restructure as an Effect returning void.",
            ),
            node,
          });
          return;
        }
        if (isVoidExpression(argument)) {
          context.report({
            message: messageAt(
              depth,
              "Avoid returning void inside Effect.gen/fn. Use Effect.void for void effects.",
              "Avoid returning void expression. Use Option.none() for absence.",
            ),
            node,
          });
        }
      },
    };
  },
  meta: {
    docs: {
      description:
        "Avoid returning null/undefined. Use Option.none() for absence or Effect.void for void effects.",
      recommended: true,
    },
    type: "suggestion",
  },
});
