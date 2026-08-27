import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";
import * as Match from "effect/Match";
import * as Option from "effect/Option";
import * as P from "effect/Predicate";

import { isBareTestCallee, isInertEffectMember } from "./scan.ts";

// One message for two shapes, worded to be true of both: `Effect.gen` is never
// started at all, while `Effect.runFork` starts work and hands back a Fiber the
// case does not wait on. In each the case ends first, so the assertions inside
// never decide anything.
const messages: Record<string, string> = {
  unrunEffect:
    "`{{callee}}` neither runs nor awaits an Effect, so `{{expression}}` does not finish before this case ends and assertions inside it are unreachable. Use `{{callee}}.effect` (or `{{callee}}.scoped`), or hand back a promise with Effect.runPromise.",
};

/**
 * A node's own name, read structurally.
 *
 * Structural for the same reason `test-clock/rule.ts` gives: oxlint's AST spells
 * identifiers with several node types and does not export them under one name,
 * and this rule only ever needs "does it call itself something".
 */
const nameOf = (node: unknown): Option.Option<string> =>
  Match.value(node).pipe(
    Match.when(
      (candidate: unknown): candidate is { readonly name: string } =>
        P.hasProperty(candidate, "name") && P.isString(candidate.name),
      (named) => Option.some(named.name),
    ),
    Match.orElse(() => Option.none<string>()),
  );

/** The two names in `object.property`, written plainly — not `a[b]`. */
const memberNames = (node: ESTree.Node): Option.Option<readonly [string, string]> =>
  Match.value(node).pipe(
    Match.when({ computed: false, type: "MemberExpression" }, (member) =>
      Option.flatMap(nameOf(member.object), (object) =>
        Option.map(nameOf(member.property), (property) => [object, property] as const),
      ),
    ),
    Match.orElse(() => Option.none<readonly [string, string]>()),
  );

/**
 * The body a zero-argument arrow returns as an expression, if that is its shape.
 *
 * Only the expression form. A block-bodied arrow — `() => { … }` — returns
 * `undefined` unless it says otherwise, and a `return Effect.gen(…)` inside one
 * is the same bug; it is left out because the arrow that actually appears in this
 * codebase is the concise one, and a rule that reports what it has not seen is a
 * rule whose false positives nobody can weigh.
 */
const expressionBody = (node: ESTree.Node): Option.Option<ESTree.Node> =>
  Match.value(node).pipe(
    Match.when({ expression: true, type: "ArrowFunctionExpression" }, (arrow) =>
      Option.some(arrow.body),
    ),
    Match.orElse(() => Option.none<ESTree.Node>()),
  );

/** `Effect.<member>` when that member leaves a description rather than running it. */
const inertEffectCall = (node: ESTree.Node): Option.Option<string> =>
  Match.value(node).pipe(
    Match.when({ type: "CallExpression" }, (call) =>
      Option.map(
        Option.filter(memberNames(call.callee), (names) => isInertEffectMember(names[0], names[1])),
        (names) => `${names[0]}.${names[1]}`,
      ),
    ),
    Match.orElse(() => Option.none<string>()),
  );

/**
 * A test case that builds an Effect and never runs it.
 *
 * ⚠️ THIS IS THE `test-clock` FAILURE ONE STEP FURTHER ALONG. That rule catches a
 * timing assertion that cannot fail; this one catches a whole case that cannot
 * fail, because vitest was handed a description of work instead of work. Both
 * report green, which is what makes them worth a rule rather than a comment — a
 * red test asks to be looked at, and these never do.
 *
 * The check is deliberately syntactic and narrow: a plain-identifier `it`/`test`
 * whose second argument is a concise arrow returning a non-runner `Effect.*` call.
 * Everything about that shape is visible in the file, so the rule needs no type
 * information and produces no judgement call about what a variable holds.
 */
export const unrunEffectRule = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        const callee = Option.filter(nameOf(node.callee), isBareTestCallee);
        if (Option.isNone(callee)) {
          return;
        }
        // `it("name", body)`. The body is the second argument; a one-argument
        // `it("todo")` declares a pending case and has nothing to run.
        const [, body] = node.arguments;
        if (body === undefined) {
          return;
        }
        const expression = Option.flatMap(expressionBody(body), inertEffectCall);
        if (Option.isNone(expression)) {
          return;
        }
        context.report({
          data: { callee: callee.value, expression: expression.value },
          messageId: "unrunEffect",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Forbid a bare `it`/`test` whose body returns an un-run Effect, where every assertion inside is unreachable and the case is green regardless.",
      recommended: true,
    },
    messages,
    type: "problem",
  },
});
