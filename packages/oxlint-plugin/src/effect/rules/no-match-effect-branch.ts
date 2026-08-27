// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban Match.when/orElse branches that contain multi-step Effect sequencing.
 *
 * Select the value in Match, then run one Effect pipeline outside.
 *
 * Source: biome-effect-linting-rules/no-match-effect-branch
 */
import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Arr from "effect/Array";
import * as Option from "effect/Option";
import * as P from "effect/Predicate";

/**
 * The combinators that sequence one Effect after another.
 *
 * `map` and `pipe` used to be in here, and they are the reason this rule
 * reported a branch holding a single `Effect.map(effect, f)` — which is the
 * one-step shape the rule's own message says is fine. Neither runs a second
 * Effect: `map` transforms the success value of the one it was given, and `pipe`
 * only composes. What is left is the set where a branch is already running a
 * pipeline the caller should own.
 */
const sequencingMethods = new Set(["flatMap", "andThen", "tap", "zipRight"]);

/** An ESTree node, as far as a generic walk needs to know. */
const isNode = (candidate: unknown): candidate is ESTree.Node =>
  P.hasProperty(candidate, "type") && P.isString(candidate.type);

/** A named field of a node, present or absent — the walk reads several. */
const fieldOf = function fieldOf(node: ESTree.Node, name: string): Option.Option<unknown> {
  if (P.hasProperty(node, name)) {
    return Option.some(node[name]);
  }
  return Option.none();
};

/**
 * `Effect.flatMap(...)` and friends.
 *
 * Deliberately blind to `computed`: `Effect[map](...)` counts, exactly as it
 * did before this rule was reshaped.
 */
const isEffectSequencingCall = (node: ESTree.Node): boolean =>
  Option.isSome(
    AST.narrow(node, "CallExpression").pipe(
      Option.flatMap((call) => AST.narrow(call.callee, "MemberExpression")),
      Option.filter(
        (member) => member.object.type === "Identifier" && member.object.name === "Effect",
      ),
      Option.flatMap((member) => AST.narrow(member.property, "Identifier")),
      Option.filter((property) => sequencingMethods.has(property.name)),
    ),
  );

/** A branch of a node is either one child or a list of them. */
const branchesOf = function branchesOf(branch: unknown): readonly unknown[] {
  if (Arr.isArray(branch)) {
    return branch;
  }
  return [branch];
};

const bodyBranches = (node: ESTree.Node): readonly unknown[] =>
  Option.match(fieldOf(node, "body"), {
    onNone: (): readonly unknown[] => [],
    onSome: branchesOf,
  });

/**
 * Does any Effect sequencing happen anywhere under this node?
 *
 * A guard-and-recurse function rather than `Match`: matching over an `unknown`
 * input widens the whole pipe to `any`, and a walk that silently returns `any`
 * is one that stops being checked at all.
 */
const containsEffectSequencing = function containsEffectSequencing(candidate: unknown): boolean {
  if (!isNode(candidate)) {
    return false;
  }
  if (candidate.type === "CallExpression") {
    if (isEffectSequencingCall(candidate)) {
      return true;
    }
    if (Arr.some(candidate.arguments, containsEffectSequencing)) {
      return true;
    }
  }
  if (Arr.some(bodyBranches(candidate), containsEffectSequencing)) {
    return true;
  }
  return (
    Option.exists(fieldOf(candidate, "argument"), containsEffectSequencing) ||
    Option.exists(fieldOf(candidate, "expression"), containsEffectSequencing)
  );
};

/** The branch body: `Match.when(pattern, body)`, `Match.orElse(body)`. */
const matchBranchBody = function matchBranchBody(
  call: ESTree.CallExpression,
): Option.Option<ESTree.Node> {
  if (AST.isCallOf(call, "Match", "when")) {
    return Arr.get(call.arguments, 1);
  }
  if (AST.isCallOf(call, "Match", "orElse")) {
    return Arr.get(call.arguments, 0);
  }
  return Option.none();
};

export const noMatchEffectBranch = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        const sequencing = Option.filter(matchBranchBody(node), containsEffectSequencing);
        if (Option.isNone(sequencing)) {
          return;
        }
        context.report({
          message:
            "Avoid Effect sequencing inside Match branches. Select value in Match, then run one Effect pipeline outside.",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Avoid Effect sequencing inside Match branches. Select value in Match, run Effect outside.",
      recommended: true,
    },
    type: "suggestion",
  },
});
