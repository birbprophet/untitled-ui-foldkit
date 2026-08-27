// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban an Effect built inside an `Effect.orElseSucceed` thunk.
 *
 * `orElseSucceed` takes a thunk producing a plain SUCCESS VALUE. Returning an
 * Effect from it does not run that Effect — it becomes the success value, so the
 * type widens to `Effect<Effect<…>>` and the fallback silently never executes.
 * `Effect.catch(() => fallback)` is what runs a fallback effect.
 *
 * Renamed from `no-effect-or-else-ladder`. Upstream wrote it for Effect v3's
 * `Effect.orElse`, banning fallback LADDERS. v4 has no `orElse` at all — only
 * `orElseSucceed` — so the rule could never fire, and the shape it can usefully
 * detect on v4 is this different, sharper bug. The old name described the v3
 * intent and would have misdescribed the v4 behaviour.
 *
 * Source: biome-effect-linting-rules/no-effect-orelse-ladder, retargeted for v4.
 */
import { defineRule } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Arr from "effect/Array";
import * as P from "effect/Predicate";

/**
 * The combinators that mark a fallback as a pipeline rather than a value.
 *
 * `zipRight` is v3's; Effect 4 dropped it. Kept because a leftover call is the
 * same signal, and its absence from v4 costs nothing here.
 */
const sequencingCombinators = new Set(["flatMap", "zipRight", "as", "tap", "andThen"]);

/** The fallback combinators, v4's survivor and the v3 name it replaced. */
const fallbackCombinators = ["orElseSucceed", "orElse"];

/** `Identifier` spelling exactly `name`, read structurally off an untyped branch. */
const isIdentifierNamed = (candidate: unknown, name: string): boolean =>
  P.hasProperty(candidate, "type") &&
  candidate.type === "Identifier" &&
  P.hasProperty(candidate, "name") &&
  candidate.name === name;

/** `Identifier` naming one of the sequencing combinators. */
const isSequencingIdentifier = (candidate: unknown): boolean =>
  P.hasProperty(candidate, "type") &&
  candidate.type === "Identifier" &&
  P.hasProperty(candidate, "name") &&
  P.isString(candidate.name) &&
  sequencingCombinators.has(candidate.name);

/** `Effect.<sequencing combinator>(...)`. */
const isSequencingCall = (candidate: unknown): boolean =>
  P.hasProperty(candidate, "type") &&
  candidate.type === "CallExpression" &&
  P.hasProperty(candidate, "callee") &&
  P.hasProperty(candidate.callee, "type") &&
  candidate.callee.type === "MemberExpression" &&
  P.hasProperty(candidate.callee, "object") &&
  P.hasProperty(candidate.callee, "property") &&
  isIdentifierNamed(candidate.callee.object, "Effect") &&
  isSequencingIdentifier(candidate.callee.property);

/** Arguments of `candidate`, when it is a call that carries a list of them. */
const argumentsOf = function argumentsOf(candidate: unknown): readonly unknown[] {
  if (
    P.hasProperty(candidate, "type") &&
    candidate.type === "CallExpression" &&
    P.hasProperty(candidate, "callee") &&
    P.hasProperty(candidate, "arguments") &&
    Arr.isArray(candidate.arguments)
  ) {
    return candidate.arguments;
  }
  return Arr.empty<unknown>();
};

/**
 * A named function expression rather than an arrow: this recurses over `unknown`,
 * and the guards that keep it honest are plain `if`s that an expression-only
 * arrow cannot hold.
 */
const containsSequencing = function containsSequencing(candidate: unknown): boolean {
  if (isSequencingCall(candidate)) {
    return true;
  }
  if (Arr.some(argumentsOf(candidate), containsSequencing)) {
    return true;
  }
  if (P.hasProperty(candidate, "body")) {
    return containsSequencing(candidate.body);
  }
  return false;
};

export const noEffectInOrElseSucceed = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        if (!AST.isCallOf(node, "Effect", fallbackCombinators)) {
          return;
        }
        if (!Arr.some(argumentsOf(node), containsSequencing)) {
          return;
        }
        context.report({
          message:
            "Effect sequencing inside an orElseSucceed fallback. The fallback produces a success value, not an effect — the chain never runs. Recover with Effect.catch instead.",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Avoid Effect sequencing inside an orElseSucceed fallback — it yields a nested effect. Recover with Effect.catch.",
      recommended: true,
    },
    type: "suggestion",
  },
});
