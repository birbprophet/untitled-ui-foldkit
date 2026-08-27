// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `new Error()` inside `Effect.fail()`.
 *
 * Use Schema.TaggedError or Data.TaggedError instead.
 *
 * Source: language-service/globalErrorInEffectFailure
 */
import type { ESTree } from "@oxlint/plugins";
import { defineRule } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Arr from "effect/Array";
import * as Option from "effect/Option";

const nativeErrors = new Set([
  "Error",
  "TypeError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "URIError",
  "EvalError",
]);

const isNativeErrorNew = (node: ESTree.Node): boolean =>
  node.type === "NewExpression" &&
  node.callee.type === "Identifier" &&
  nativeErrors.has(node.callee.name);

const isFailure = (node: ESTree.CallExpression): boolean =>
  Option.isSome(AST.matchCallOf(node, "Effect", "fail")) ||
  Option.isSome(AST.matchCallOf(node, "Effect", "failSync")) ||
  Option.isSome(AST.matchCallOf(node, "Effect", "failCause"));

export const noGlobalErrorInFailure = defineRule({
  create(context) {
    const report = (node: ESTree.Node, message: string) => {
      context.report({ message, node });
    };

    return {
      CallExpression(node) {
        if (!isFailure(node)) {
          return;
        }

        const last = Arr.last(node.arguments);
        if (Option.isNone(last)) {
          return;
        }
        const arg = last.value;

        // Effect.fail(new Error(...))
        if (isNativeErrorNew(arg)) {
          report(
            arg,
            "Avoid native Error in Effect.fail(). Use Schema.TaggedError or Data.TaggedError.",
          );
          return;
        }

        // Effect.failSync(() => new Error(...))
        if (
          arg.type === "ArrowFunctionExpression" &&
          arg.body.type !== "BlockStatement" &&
          isNativeErrorNew(arg.body)
        ) {
          report(
            arg,
            "Avoid native Error in Effect.failSync(). Use Schema.TaggedError or Data.TaggedError.",
          );
        }
      },
    };
  },
  meta: {
    docs: {
      description:
        "Avoid native Error in Effect.fail(). Use Schema.TaggedError or Data.TaggedError.",
      recommended: true,
    },
    type: "suggestion",
  },
});
