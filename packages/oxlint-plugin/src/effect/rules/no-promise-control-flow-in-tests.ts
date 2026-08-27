// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban Promise-shaped control flow in test files.
 *
 * Effect tests should keep setup, cleanup, and assertions in Effect scopes so
 * finalizers compose with the test runtime.
 */
import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Option from "effect/Option";
import * as P from "effect/Predicate";

const isTestFilename = (filename: string): boolean =>
  /\.test\.tsx?$/u.test(filename) || /\/tests\/.*\.[cm]?tsx?$/u.test(filename);

const promiseChainMethods = new Set(["then", "catch", "finally"]);
const promiseStaticMethods = new Set(["all", "allSettled", "any", "race", "resolve", "reject"]);

const asyncMessage = "Do not use async test functions. Return an Effect from the test body.";

const isAsyncFunction = (node: ESTree.Node): boolean => "async" in node && node.async;

/** The two names in `object.property`, when the callee is written that way. */
const calleeNames = (call: ESTree.CallExpression): Option.Option<readonly [string, string]> =>
  Option.flatMap(AST.narrow(call.callee, "MemberExpression"), AST.memberNames);

/** The `Effect` namespace as a receiver — `Effect.catch` is not a Promise chain. */
const isEffectReceiver = (object: ESTree.Node): boolean =>
  object.type === "Identifier" && object.name === "Effect";

/**
 * `x.then(...)` and friends — `Effect.then` is not one of them.
 *
 * The receiver is any expression, not only a bare identifier. Reading it through
 * `AST.memberNames` meant `pending.then(...)` was seen and `work().then(...)` —
 * the commoner shape by far, and the one an async boundary actually produces —
 * was not, because a call expression has no name for `memberNames` to return.
 */
const promiseChainMethod = (call: ESTree.CallExpression): Option.Option<string> =>
  AST.narrow(call.callee, "MemberExpression").pipe(
    Option.filter((member) => !member.computed),
    Option.filter((member) => !isEffectReceiver(member.object)),
    Option.flatMap((member) => AST.narrow(member.property, "Identifier")),
    Option.map((property) => property.name),
    Option.filter((property) => promiseChainMethods.has(property)),
  );

/** `Promise.all(...)` and friends. */
const promiseStaticMethod = (call: ESTree.CallExpression): Option.Option<string> =>
  calleeNames(call).pipe(
    Option.filter((names) => names[0] === "Promise"),
    Option.map((names) => names[1]),
    Option.filter((property) => promiseStaticMethods.has(property)),
  );

const callMessage = (call: ESTree.CallExpression): Option.Option<string> =>
  Option.orElse(
    Option.map(
      promiseChainMethod(call),
      (method) =>
        `Do not use Promise.${method} style chains in tests. Keep control flow in Effect.`,
    ),
    () =>
      Option.map(
        promiseStaticMethod(call),
        (method) => `Do not use Promise.${method} in tests. Use Effect concurrency primitives.`,
      ),
  );

export const noPromiseControlFlowInTests = defineRule({
  create(context) {
    if (!isTestFilename(context.filename)) {
      return {};
    }

    const reportAsync = function reportAsync(node: ESTree.Node) {
      if (isAsyncFunction(node)) {
        context.report({ message: asyncMessage, node });
      }
    };

    return {
      ArrowFunctionExpression: reportAsync,
      AwaitExpression(node) {
        context.report({
          message: "Do not use `await` in tests. Use `yield*` inside Effect.gen.",
          node,
        });
      },
      CallExpression(node) {
        const message = Option.getOrUndefined(callMessage(node));
        if (message === undefined) {
          return;
        }
        context.report({ message, node });
      },
      FunctionDeclaration: reportAsync,
      FunctionExpression: reportAsync,
      NewExpression(node) {
        if (node.callee.type !== "Identifier" || node.callee.name !== "Promise") {
          return;
        }
        context.report({
          message:
            "Do not construct Promise directly in tests. Use Effect.promise/Effect.tryPromise at real boundaries.",
          node,
        });
      },
      TryStatement(node) {
        if (!P.isNotNullish(node.finalizer)) {
          return;
        }
        context.report({
          message: "Do not use `try/finally` cleanup in tests. Use Effect scopes.",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Keep test control flow in Effect instead of async/await, try/finally, or Promise chains.",
      recommended: true,
    },
    type: "problem",
  },
});
