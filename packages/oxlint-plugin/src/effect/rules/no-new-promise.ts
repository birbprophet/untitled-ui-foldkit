// Vendored from oxlint-plugin-effect (0.5.0) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/** Ban the global Promise constructor and its static APIs. */
import type { ESTree } from "@oxlint/plugins";
import { defineRule } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Option from "effect/Option";

const isPromiseIdentifier = (node: ESTree.Node): boolean =>
  node.type === "Identifier" && "name" in node && node.name === "Promise";

/** `Promise.<anything>` in callee position. */
const isPromiseMember = (callee: ESTree.MemberExpression): boolean =>
  Option.exists(AST.memberNames(callee), ([obj]) => obj === "Promise");

export const noNewPromise = defineRule({
  create(context) {
    const report = (node: ESTree.Node) => {
      context.report({
        message:
          "Avoid Promise APIs. Use Effect.async for callbacks and Effect.promise or Effect.tryPromise at promise boundaries.",
        node,
      });
    };

    return {
      CallExpression(call) {
        if (isPromiseIdentifier(call.callee)) {
          report(call);
          return;
        }
        if (call.callee.type !== "MemberExpression" || !isPromiseMember(call.callee)) {
          return;
        }
        report(call);
      },
      NewExpression(expression) {
        if (!isPromiseIdentifier(expression.callee)) {
          return;
        }
        report(expression);
      },
    };
  },
  meta: {
    docs: {
      description: "Avoid Promise APIs. Use Effect concurrency and promise boundaries.",
      recommended: true,
    },
    type: "suggestion",
  },
});
