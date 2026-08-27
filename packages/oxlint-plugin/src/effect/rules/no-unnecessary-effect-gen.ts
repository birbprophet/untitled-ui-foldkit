// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Detect unnecessary `Effect.gen` wrappers with a single `yield*` + return.
 *
 * ```ts
 * // BAD
 * Effect.gen(function* () { return yield* someEffect })
 *
 * // GOOD
 * someEffect
 * ```
 *
 * Source: language-service/unnecessaryEffectGen
 */
import { defineRule } from "@oxlint/plugins";
import * as Arr from "effect/Array";
import * as P from "effect/Predicate";

import { AST } from "../sdk.ts";

/**
 * Is this statement `return yield* expr`?
 *
 * Read structurally: `hasProperty` is the exact spelling of the
 * `x != null && typeof x === "object" && "k" in x` guard upstream used.
 */
const isDelegatedYieldReturn = function isDelegatedYieldReturn(statement: unknown): boolean {
  if (!P.hasProperty(statement, "type") || statement.type !== "ReturnStatement") {
    return false;
  }
  if (!P.hasProperty(statement, "argument")) {
    return false;
  }
  const { argument } = statement;
  return (
    P.hasProperty(argument, "type") &&
    argument.type === "YieldExpression" &&
    P.hasProperty(argument, "delegate") &&
    argument.delegate === true
  );
};

/** A generator function expression whose whole body is one `return yield*`. */
const isSoleDelegatedYield = function isSoleDelegatedYield(arg: unknown): boolean {
  if (!P.hasProperty(arg, "type") || arg.type !== "FunctionExpression") {
    return false;
  }
  if (!P.hasProperty(arg, "generator") || arg.generator !== true) {
    return false;
  }
  if (!P.hasProperty(arg, "body")) {
    return false;
  }
  const { body } = arg;
  if (!P.hasProperty(body, "type") || body.type !== "BlockStatement") {
    return false;
  }
  if (!P.hasProperty(body, "body") || !Arr.isArray(body.body) || body.body.length !== 1) {
    return false;
  }
  return isDelegatedYieldReturn(body.body[0]);
};

export const noUnnecessaryEffectGen = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        if (!AST.isCallOf(node, "Effect", "gen")) {
          return;
        }

        // Only the single-arg form: Effect.gen(function* () { ... })
        const args = node.arguments;
        if (args.length !== 1) {
          return;
        }

        const [arg] = args;
        if (!isSoleDelegatedYield(arg)) {
          return;
        }

        context.report({
          message:
            "Unnecessary Effect.gen — single yield*. Replace with the yielded effect directly.",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Unnecessary Effect.gen — single yield can be replaced with the yielded effect directly.",
      recommended: true,
    },
    fixable: "code",
    type: "suggestion",
  },
});
