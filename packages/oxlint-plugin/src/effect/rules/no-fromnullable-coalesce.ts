// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `Option.fromNullOr(x ?? null)` / `Option.fromUndefinedOr(x ?? undefined)`
 * and the `fromNullishOr` pair.
 *
 * The nullish coalescing is redundant — pass the source directly.
 *
 * Source: biome-effect-linting-rules/no-fromnullable-nullish-coalesce
 *
 * Ported from v3: upstream matched `Option.fromNullable`, which Effect 4 split
 * into `fromNullOr`, `fromUndefinedOr` and `fromNullishOr` (verified against the
 * installed `effect@4.0.0-beta.102`). The v3 name is kept — it is absent from
 * v4 rather than repurposed, so a leftover is still the same mistake.
 *
 * The split is not a rename, and the rule cannot treat it as one: which sentinel
 * is redundant now depends on which constructor received it. See `absorbs`.
 */
import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Arr from "effect/Array";
import * as Option from "effect/Option";
import * as P from "effect/Predicate";

/** `null`, written as a literal. */
const isNullLiteral = (candidate: unknown): boolean =>
  P.hasProperty(candidate, "type") &&
  candidate.type === "Literal" &&
  P.hasProperty(candidate, "value") &&
  candidate.value === null;

/** `undefined`, written as the global identifier. */
const isUndefinedIdentifier = (candidate: unknown): boolean =>
  P.hasProperty(candidate, "type") &&
  candidate.type === "Identifier" &&
  P.hasProperty(candidate, "name") &&
  candidate.name === "undefined";

/** The sentinel on the right of a `??`, when it is one this rule reads. */
const coalescedSentinel = function coalescedSentinel(candidate: unknown): Option.Option<string> {
  const isCoalesce =
    P.hasProperty(candidate, "type") &&
    candidate.type === "LogicalExpression" &&
    P.hasProperty(candidate, "operator") &&
    candidate.operator === "??" &&
    P.hasProperty(candidate, "right");
  if (!isCoalesce) {
    return Option.none();
  }
  if (isNullLiteral(candidate.right)) {
    return Option.some("null");
  }
  if (isUndefinedIdentifier(candidate.right)) {
    return Option.some("undefined");
  }
  return Option.none();
};

/** The lifting constructors, v4's three plus the v3 name they replaced. */
const liftingConstructors = new Set([
  "fromNullOr",
  "fromUndefinedOr",
  "fromNullishOr",
  "fromNullable",
]);

/**
 * Does this constructor already treat that sentinel as absent?
 *
 * Read off the installed `effect@4.0.0-beta.102`: `fromNullOr` is `a === null`,
 * `fromUndefinedOr` is `a === undefined`, `fromNullishOr` is `a == null`, and v3's
 * `fromNullable` was the nullish one. So `?? null` is dead weight only in front of
 * `fromNullOr`/`fromNullishOr`, `?? undefined` only in front of
 * `fromUndefinedOr`/`fromNullishOr`.
 *
 * The mismatched pairings are deliberately silent. `Option.fromNullOr(x ?? undefined)`
 * is not redundant — the coalesce defeats the constructor and yields `Some(undefined)`
 * — and reporting it as "pass the value directly" would hand the author a fix that
 * changes behaviour. It wants its own rule, not this one's message.
 */
const absorbs = function absorbs(constructor: string, sentinel: string): boolean {
  if (constructor === "fromNullable" || constructor === "fromNullishOr") {
    return true;
  }
  if (constructor === "fromNullOr") {
    return sentinel === "null";
  }
  return sentinel === "undefined";
};

/** The `Option.fromX` this call is, when it is one of the lifting constructors. */
const liftingConstructor = (call: ESTree.CallExpression): Option.Option<string> =>
  Option.flatMap(AST.narrow(call.callee, "MemberExpression"), AST.memberNames).pipe(
    Option.filter((names) => names[0] === "Option"),
    Option.map((names) => names[1]),
    Option.filter((name) => liftingConstructors.has(name)),
  );

export const noFromNullableCoalesce = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        const constructor = Option.getOrUndefined(liftingConstructor(node));
        if (constructor === undefined) {
          return;
        }
        // Only the first argument carries the value being lifted.
        const sentinel = Option.getOrUndefined(
          Option.flatMap(Arr.head(node.arguments), coalescedSentinel),
        );
        if (sentinel === undefined || !absorbs(constructor, sentinel)) {
          return;
        }
        context.report({
          message: `Redundant ?? ${sentinel} in Option.${constructor}. Pass the value directly.`,
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Redundant nullish coalescing in Option.fromNullOr/fromUndefinedOr/fromNullishOr. Pass the value directly.",
      recommended: true,
    },
    type: "suggestion",
  },
});
