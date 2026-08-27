// Vendored from oxlint-plugin-effect (0.5.0) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/** Ban async functions and await expressions. */
import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";
import * as P from "effect/Predicate";

const asyncMessage =
  "Avoid async functions. Use Effect.gen with Effect.promise or Effect.tryPromise.";

const awaitMessage = "Avoid await. Yield Effect.promise or Effect.tryPromise inside Effect.gen.";

export const noAsyncFunction = defineRule({
  create(context) {
    const reportIfAsync = function reportIfAsync(node: ESTree.Node) {
      if (P.hasProperty(node, "async") && node.async) {
        context.report({ message: asyncMessage, node });
      }
    };

    return {
      ArrowFunctionExpression: reportIfAsync,
      AwaitExpression(node) {
        context.report({ message: awaitMessage, node });
      },
      FunctionDeclaration: reportIfAsync,
      FunctionExpression: reportIfAsync,
    };
  },
  meta: {
    docs: {
      description: "Avoid async/await. Compose asynchronous work with Effect.",
      recommended: true,
    },
    type: "suggestion",
  },
});
