// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `Effect.map(() => undefined)` / `Effect.map(() => void 0)` / `Effect.map(() => {})`.
 *
 * Use `Effect.asVoid` instead.
 *
 * Source: language-service/effectMapVoid
 */
import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Arr from "effect/Array";
import * as P from "effect/Predicate";

/**
 * Does an arrow body produce nothing?
 *
 * Read structurally rather than through the node union: `hasProperty` is the
 * exact spelling of the `x != null && typeof x === "object" && "k" in x` guard
 * upstream used, and the three shapes below are matched by their own fields.
 */
const isVoidArrowBody = function isVoidArrowBody(body: unknown): boolean {
  if (!P.hasProperty(body, "type")) {
    return false;
  }

  // () => undefined
  if (body.type === "Identifier" && P.hasProperty(body, "name") && body.name === "undefined") {
    return true;
  }

  // () => void 0
  if (
    body.type === "UnaryExpression" &&
    P.hasProperty(body, "operator") &&
    body.operator === "void"
  ) {
    return true;
  }

  // () => {}  (empty block)
  return (
    body.type === "BlockStatement" &&
    P.hasProperty(body, "body") &&
    Arr.isArray(body.body) &&
    Arr.isReadonlyArrayEmpty(body.body)
  );
};

const isVoidCallback = (arg: unknown): boolean =>
  P.hasProperty(arg, "type") &&
  arg.type === "ArrowFunctionExpression" &&
  P.hasProperty(arg, "body") &&
  isVoidArrowBody(arg.body);

/** `Effect.map(effect, fn)` carries the callback second; as a pipe argument, first. */
const callbackIndex = function callbackIndex(args: readonly ESTree.Node[]): number {
  if (args.length === 2) {
    return 1;
  }
  return 0;
};

export const noEffectMapVoid = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        if (!AST.isCallOf(node, "Effect", "map")) {
          return;
        }

        const args = node.arguments;
        if (Arr.isReadonlyArrayEmpty(args) || !isVoidCallback(args[callbackIndex(args)])) {
          return;
        }

        context.report({
          message: "Use Effect.asVoid instead of Effect.map(() => undefined).",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description: "Avoid Effect.map(() => undefined). Use Effect.asVoid instead.",
      recommended: true,
    },
    type: "suggestion",
  },
});
