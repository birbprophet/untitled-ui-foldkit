// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban positional error/cause arguments in Effect.log* calls.
 *
 * `Effect.logWarning("message", error)` loses error structure.
 * Use `Effect.logWarning("message").pipe(Effect.annotateLogs({ error }))` instead,
 * or pass cause via `Effect.logWarning("message", Cause.fail(error))`.
 *
 * Source: agent session analysis — 57 occurrences across 6 projects
 */
import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";
import * as Option from "effect/Option";

import { AST } from "../sdk.ts";

/**
 * The levels at which a second argument is plausibly a failure.
 *
 * Every `Effect.log*` used to be here, so `Effect.logInfo("hello", "world")` —
 * an ordinary two-part message, which the API takes and which carries no error
 * at all — was reported as an error passed positionally. A failure is logged at
 * warning or above; below that, a second argument is just more message.
 */
const errorLogMethods = new Set(["logWarning", "logError", "logFatal"]);

/**
 * A written-out value: a string, a number, a template.
 *
 * The rule is about an error object landing in a message slot, and a literal is
 * never one — it is the second half of what the caller wanted to say.
 */
const isLiteralArgument = (argument: ESTree.Node): boolean =>
  argument.type === "Literal" || argument.type === "TemplateLiteral";

/**
 * A `MemberExpression`, established rather than asserted — `AST.memberNames`
 * only accepts one, and a non-member callee already produced `Option.none`
 * when it was cast into place.
 */
const isMemberExpression = (node: ESTree.Node): node is ESTree.MemberExpression =>
  node.type === "MemberExpression";

/** `object.property` as a pair of plain names, when the callee is a static member. */
const calleeNames = function calleeNames(
  callee: ESTree.Node,
): Option.Option<readonly [string, string]> {
  if (!isMemberExpression(callee)) {
    return Option.none();
  }
  return AST.memberNames(callee);
};

/** `Cause.fail(...)` / `Cause.die(...)` — the supported way to pass a cause. */
const isCauseCall = function isCauseCall(argument: ESTree.Node): boolean {
  if (argument.type !== "CallExpression") {
    return false;
  }
  return Option.exists(calleeNames(argument.callee), ([obj]) => obj === "Cause");
};

export const noPositionalLogError = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        const names = calleeNames(node.callee);
        if (Option.isNone(names)) {
          return;
        }
        const [obj, prop] = names.value;
        if (obj !== "Effect" || !errorLogMethods.has(prop)) {
          return;
        }

        // Effect.log* with more than 1 argument — the second arg is likely
        // an error/cause being passed positionally
        const [, secondArg] = node.arguments;
        if (secondArg === undefined) {
          return;
        }

        // A second message part, not a failure.
        if (isLiteralArgument(secondArg)) {
          return;
        }

        // Allow Cause.fail/Cause.die as second arg (that's the proper API)
        if (isCauseCall(secondArg)) {
          return;
        }

        context.report({
          message: `Avoid passing errors as positional args to Effect.${prop}. Use .pipe(Effect.annotateLogs({ error: String(err) })) or pass a Cause.`,
          node: secondArg,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Avoid passing errors as positional arguments to Effect.log*. Use Effect.annotateLogs instead.",
      recommended: true,
    },
    type: "suggestion",
  },
});
