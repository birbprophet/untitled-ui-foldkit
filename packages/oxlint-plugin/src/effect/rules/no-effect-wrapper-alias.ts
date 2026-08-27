// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban wrapper functions that just alias an Effect.fn or pipe(Effect.fn(...)).
 *
 * Inline the pipeline at the call site or define a real domain function.
 *
 * Source: biome-effect-linting-rules/no-effect-wrapper-alias
 */
import type { ESTree } from "@oxlint/plugins";
import { defineRule } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Arr from "effect/Array";
import * as Option from "effect/Option";

const aliasMessage =
  "Avoid aliasing Effect.fn. Inline the pipeline or define a real domain function.";
const pipeMessage =
  "Avoid wrapping Effect.fn in pipe. Inline the pipeline or define a real domain function.";
const wrapperMessage =
  "Avoid wrapper function aliasing Effect.fn. Inline or define a real domain function.";

/**
 * Is this node the name `name`, written plainly?
 *
 * Deliberately blind to `computed`: `Effect[fn]` counts, exactly as it did
 * before this rule was reshaped.
 */
const isNamed = (node: ESTree.Node, name: string): boolean =>
  node.type === "Identifier" && node.name === name;

const isEffectFnCall = (node: ESTree.Node): boolean =>
  Option.isSome(
    AST.narrow(node, "CallExpression").pipe(
      Option.flatMap((call) => AST.narrow(call.callee, "MemberExpression")),
      Option.filter((member) => isNamed(member.object, "Effect")),
      Option.filter((member) => isNamed(member.property, "fn")),
    ),
  );

const isPipeWrappingEffectFn = (node: ESTree.Node): boolean =>
  Option.isSome(
    AST.narrow(node, "CallExpression").pipe(
      Option.filter((call) => isNamed(call.callee, "pipe")),
      Option.flatMap((call) => Arr.head(call.arguments)),
      Option.filter(isEffectFnCall),
    ),
  );

/** The body of a function written as a value — the thing a wrapper hands back. */
const wrapperBody = (node: ESTree.Node): Option.Option<ESTree.Node> =>
  Option.orElse(
    Option.map(AST.narrow(node, "ArrowFunctionExpression"), (arrow) => arrow.body),
    () =>
      Option.flatMap(AST.narrow(node, "FunctionExpression"), (fn) => Option.fromNullishOr(fn.body)),
  );

/** Which of the three shapes this initialiser is, if it is any of them. */
const initMessage = function initMessage(init: ESTree.Node): Option.Option<string> {
  if (isEffectFnCall(init)) {
    return Option.some(aliasMessage);
  }
  if (isPipeWrappingEffectFn(init)) {
    return Option.some(pipeMessage);
  }
  return Option.map(
    Option.filter(
      wrapperBody(init),
      (body) => isEffectFnCall(body) || isPipeWrappingEffectFn(body),
    ),
    () => wrapperMessage,
  );
};

export const noEffectWrapperAlias = defineRule({
  create(context) {
    return {
      VariableDeclarator(node) {
        const message = Option.getOrUndefined(
          Option.flatMap(Option.fromNullishOr(node.init), initMessage),
        );
        if (message === undefined) {
          return;
        }
        context.report({ message, node });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Avoid wrapper functions aliasing Effect.fn. Inline or define a real domain function.",
      recommended: true,
    },
    type: "suggestion",
  },
});
