// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Warn on `Effect.sync(() => someCall(...))` wrapping a plain function call.
 *
 * Consider whether the wrapped call truly needs to be in Effect.sync.
 *
 * Source: biome-effect-linting-rules/warn-effect-sync-wrapper
 */
import { defineRule } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Arr from "effect/Array";
import * as P from "effect/Predicate";

/**
 * Is this call `console.something(...)`?
 *
 * Read structurally: `hasProperty` is the exact spelling of the
 * `x != null && typeof x === "object" && "k" in x` guard upstream used.
 */
const isConsoleCall = function isConsoleCall(call: unknown): boolean {
  if (!P.hasProperty(call, "callee")) {
    return false;
  }
  const { callee } = call;
  if (!P.hasProperty(callee, "type") || callee.type !== "MemberExpression") {
    return false;
  }
  if (!P.hasProperty(callee, "object")) {
    return false;
  }
  const { object } = callee;
  return P.hasProperty(object, "name") && object.name === "console";
};

/**
 * Does this `Effect.sync` argument read `() => someCall(...)`?
 *
 * `console.*` is excluded — `no-effect-sync-console` owns that case.
 */
const wrapsPlainCall = function wrapsPlainCall(arg: unknown): boolean {
  if (!P.hasProperty(arg, "type") || arg.type !== "ArrowFunctionExpression") {
    return false;
  }
  if (!P.hasProperty(arg, "body")) {
    return false;
  }
  const { body } = arg;
  if (!P.hasProperty(body, "type") || body.type !== "CallExpression") {
    return false;
  }
  return !isConsoleCall(body);
};

export const noEffectSyncWrapper = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        if (!AST.isCallOf(node, "Effect", "sync")) {
          return;
        }

        const args = node.arguments;
        if (Arr.isReadonlyArrayEmpty(args)) {
          return;
        }

        const [arg] = args;
        if (!wrapsPlainCall(arg)) {
          return;
        }

        context.report({
          message:
            "Effect.sync wrapping a plain function call. Consider if Effect.sync is necessary.",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description: "Effect.sync wrapping a plain call. Consider if Effect.sync is necessary.",
      recommended: true,
    },
    type: "suggestion",
  },
});
