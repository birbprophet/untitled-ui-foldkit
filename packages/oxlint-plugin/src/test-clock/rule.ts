import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";
import * as Arr from "effect/Array";
import * as Match from "effect/Match";
import * as Option from "effect/Option";
import * as P from "effect/Predicate";

import { isFrozenClockRead, isFrozenRunner, liveCounterpart } from "./scan.ts";

const messages: Record<string, string> = {
  frozenClock:
    "`{{runner}}` installs a TestClock, so `Clock.{{read}}` cannot advance and a timing assertion here always passes. Use `{{live}}` if this test measures elapsed time.",
};

/** An ESTree node, as far as a generic walk needs to know. */
const isNode = (candidate: unknown): candidate is ESTree.Node =>
  P.hasProperty(candidate, "type") && P.isString(candidate.type);

/**
 * A node's own name, read structurally.
 *
 * Structural rather than by type: oxlint's AST distinguishes several identifier
 * types and does not export them under one name, and this rule only ever needs
 * "does it call itself something".
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
 * A branch of a node is either one child or a list of them.
 *
 * A guard rather than `Match`: matching over an `unknown` input widens the whole
 * pipe to `any`, which `typescript/no-unsafe-return` catches — and an AST walk
 * that silently returns `any` is one that stops being checked at all.
 */
const branchesOf = function branchesOf(branch: unknown): readonly unknown[] {
  if (Arr.isArray(branch)) {
    return branch;
  }
  return [branch];
};

const childrenOf = (node: ESTree.Node): readonly ESTree.Node[] =>
  Arr.flatMap(
    // `parent` is a back-reference, so following it walks upward forever. Skipped
    // by name AND guarded by identity below, because the next version of this AST
    // may spell its back-reference differently.
    Arr.filter(Object.entries(node), ([key]) => key !== "parent"),
    ([, branch]) => Arr.filter(branchesOf(branch), isNode),
  );

/**
 * Every node beneath `root`, itself included.
 *
 * Hand-rolled rather than tracked with a depth counter. `CallExpression:exit`
 * does exist — @oxlint/plugins declares 164 exit keys — so a counter was always
 * possible; an earlier version of this comment claimed otherwise and was simply
 * wrong. The subtree walk is still the better shape here because it holds no
 * state between visits: there is no counter to forget to decrement, and no
 * ordering assumption to break when a rule later gains a second visitor.
 *
 * The `seen` set is not an optimisation. This AST carries parent back-references,
 * so a plain recursive walk climbs out of the subtree and back down it forever —
 * which it did, crashing oxlint with a stack overflow on the first test file that
 * actually invoked this rule. Identity is the right guard because it holds
 * whatever the back-reference happens to be called.
 */
const beneath = function beneath(
  root: ESTree.Node,
  seen: Set<ESTree.Node> = new Set<ESTree.Node>(),
): readonly ESTree.Node[] {
  if (seen.has(root)) {
    return [];
  }
  seen.add(root);
  return Arr.appendAll(
    [root],
    Arr.flatMap(childrenOf(root), (child) => beneath(child, seen)),
  );
};

/** A clock read that cannot advance, and the name to put in the message. */
interface FrozenRead {
  readonly at: ESTree.Node;
  readonly read: string;
}

const frozenReadsIn = (node: ESTree.Node): readonly FrozenRead[] =>
  Arr.flatMap(beneath(node), (inner) =>
    Arr.map(
      Arr.filter(Arr.getSomes([memberNames(inner)]), (names) =>
        isFrozenClockRead(names[0], names[1]),
      ),
      (names) => ({ at: inner, read: names[1] }),
    ),
  );

/**
 * A timing assertion that cannot fail.
 *
 * `it.effect` (and `it.scoped`, and the `suite.effect` that `it.layer` hands
 * back) install a TestContext, and with it a TestClock that does not advance on
 * its own. A bounded-time guard written under one reads its budget as `0 < 0` and
 * passes however slow the code under test becomes — the worst kind of test,
 * because it is green.
 *
 * This exists because four such guards in `packages/sdk/tests/read/xlsx-robustness.test.ts`
 * sit on `it.live` for exactly this reason, and nothing but a comment stopped a
 * later tidy-up from making them consistent with their neighbours and switching
 * them off in the process.
 */
export const testClockRule = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        const runner = Option.filter(memberNames(node.callee), (names) => isFrozenRunner(names[1]));
        if (Option.isNone(runner)) {
          return;
        }
        const [object, property] = runner.value;
        Arr.forEach(frozenReadsIn(node), (frozen) => {
          context.report({
            data: {
              live: `${object}.${liveCounterpart(property)}`,
              read: frozen.read,
              runner: `${object}.${property}`,
            },
            messageId: "frozenClock",
            node: frozen.at,
          });
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Forbid reading Effect's Clock inside a test whose runner installs a TestClock, where the reading cannot advance.",
      recommended: true,
    },
    messages,
    type: "problem",
  },
});
