import type { ESTree } from "@oxlint/plugins";
import type { CreateRule } from "effect-oxlint";
import * as Match from "effect/Match";
import * as Option from "effect/Option";
import * as P from "effect/Predicate";

const messages: Record<string, string> = {
  unboundedExchange:
    "Wrap {{exchange}} in within(...) before passing it to Effect.result; every network exchange needs a deadline.",
};

const isAppAuthoringFile = (filename: string): boolean =>
  /(?:^|[/\\])apps[/\\]app[/\\]src[/\\]/u.test(filename);

const isEffectResult = (node: ESTree.CallExpression): boolean =>
  node.callee.type === "MemberExpression" &&
  !node.callee.computed &&
  node.callee.object.type === "Identifier" &&
  node.callee.object.name === "Effect" &&
  node.callee.property.type === "Identifier" &&
  node.callee.property.name === "result";

const nameOf = (node: unknown): Option.Option<string> =>
  Match.value(node).pipe(
    Match.when(
      (candidate: unknown): candidate is { readonly name: string } =>
        P.hasProperty(candidate, "name") && P.isString(candidate.name),
      (named) => Option.some(named.name),
    ),
    Match.orElse(() => Option.none<string>()),
  );

const exchangeName = (node: ESTree.Node): Option.Option<string> =>
  Match.value(node).pipe(
    Match.when(
      (candidate): candidate is ESTree.CallExpression =>
        candidate.type === "CallExpression" && candidate.callee.type === "Identifier",
      (call) =>
        Option.filter(nameOf(call.callee), (name) => name.toLowerCase().endsWith("exchange")),
    ),
    Match.orElse(() => Option.none<string>()),
  );

/** Catch the direct call shape used by the app authoring surface. */
export const boundedExchangesRule: CreateRule = {
  create(context) {
    return {
      CallExpression(node) {
        if (!isAppAuthoringFile(context.filename)) {
          return;
        }

        if (!isEffectResult(node)) {
          return;
        }

        const [exchange] = node.arguments;
        if (exchange === undefined) {
          return;
        }

        const name = exchangeName(exchange);
        if (Option.isNone(name)) {
          return;
        }

        context.report({
          data: { exchange: name.value },
          messageId: "unboundedExchange",
          node: exchange,
        });
      },
    };
  },
  meta: {
    docs: {
      description: "Require app exchange calls passed to Effect.result to carry a deadline.",
      recommended: true,
    },
    messages,
    type: "problem",
  },
};
