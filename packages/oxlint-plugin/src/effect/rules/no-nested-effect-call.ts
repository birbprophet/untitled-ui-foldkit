// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban nested Effect pipeline calls — `Effect.flatMap(Effect.map(...))`.
 *
 * The "call tower" antipattern: Effect pipeline combinators nested directly
 * inside each other instead of composed through `.pipe(...)`.
 *
 * Only fires when BOTH outer and inner are pipeline combinators. Standard
 * combinators that canonically take an Effect argument (`ensuring`,
 * `scoped`, `fork`, `either`, etc.) are not flagged.
 *
 * Sources: biome-effect-linting-rules/no-nested-effect-call, no-call-tower, no-effect-ladder
 */
import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Arr from "effect/Array";
import * as Option from "effect/Option";

// Pipeline combinators — the user normally chains with .pipe(). Required for
// the OUTER call: only these form a "call tower" when nested.
const pipelineCombinators = new Set([
  "flatMap",
  "map",
  "mapBoth",
  "mapError",
  "andThen",
  "tap",
  "tapError",
  "tapBoth",
  "zipRight",
  "zipLeft",
  "zip",
  "as",
  "asVoid",
  "catchAll",
  "catchAllCause",
  "catch",
  "catchCause",
  "catchTag",
  "catchTags",
]);

// Combinators that accept an Effect (not a function) as their second arg.
// For these, a bare Effect constructor as the second arg is legitimate code
// and flattenable: `Effect.andThen(x, Effect.sync(...))` → `x.pipe(Effect.andThen(Effect.sync(...)))`.
const effectAcceptingCombinators = new Set(["andThen", "tap", "zipRight", "zipLeft"]);

// Effect producers — constructors that return an Effect.
//
// `async` is v3's name for the callback bridge; Effect 4 calls it `callback`.
// Both are listed: the v4 name is what this tree can actually write, the v3 name
// costs nothing and still catches a leftover. `zipRight` above is the same case
// in the pipeline set — removed in v4, kept because a superset is harmless here.
const effectProducers = new Set([
  "gen",
  "fn",
  "succeed",
  "fail",
  "failCause",
  "sync",
  "promise",
  "tryPromise",
  "try",
  "async",
  "callback",
  "void",
  "die",
  "dieMessage",
]);

/**
 * The `x` in `Effect.x(...)`, when the node is such a call.
 *
 * Deliberately blind to `computed`: `Effect[map](...)` counts, exactly as it
 * did before this rule was reshaped.
 */
const effectMethodName = (node: ESTree.Node): Option.Option<string> =>
  AST.narrow(node, "CallExpression").pipe(
    Option.flatMap((call) => AST.narrow(call.callee, "MemberExpression")),
    Option.filter(
      (member) => member.object.type === "Identifier" && member.object.name === "Effect",
    ),
    Option.flatMap((member) => AST.narrow(member.property, "Identifier")),
    Option.map((property) => property.name),
  );

/** The first argument that is itself an `Effect.x(...)` worth flattening. */
const nestedName = (call: ESTree.CallExpression, outerName: string): Option.Option<string> =>
  Arr.head(
    Arr.filter(
      Arr.getSomes(Arr.map(call.arguments, effectMethodName)),
      (innerName) =>
        // Call tower: outer AND inner both pipeline combinators
        // (e.g. Effect.map(x, Effect.flatMap(y, f))).
        pipelineCombinators.has(innerName) ||
        // Producer arg: outer accepts an effect and inner is an effect
        // producer (e.g. Effect.andThen(x, Effect.sync(...))).
        (effectAcceptingCombinators.has(outerName) && effectProducers.has(innerName)),
    ),
  );

const nestedCallMessage = (call: ESTree.CallExpression): Option.Option<string> =>
  effectMethodName(call).pipe(
    Option.filter((outerName) => pipelineCombinators.has(outerName)),
    // Only the data-first form is flaggable: `Effect.flatMap(self, fn)`,
    // `Effect.andThen(self, next)`. The data-last (pipeable) form takes a
    // single argument that IS the "inner" — and it's called inside a
    // `.pipe(...)` so there's no nesting to flatten. Require 2+ args.
    Option.filter(() => Option.isSome(Arr.get(call.arguments, 1))),
    Option.flatMap((outerName) =>
      Option.map(
        nestedName(call, outerName),
        (innerName) =>
          `Nested Effect.${outerName}(Effect.${innerName}(...)). Use .pipe(Effect.${innerName}(...), Effect.${outerName}(...)) instead.`,
      ),
    ),
  );

export const noNestedEffectCall = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        const message = Option.getOrUndefined(nestedCallMessage(node));
        if (message === undefined) {
          return;
        }
        context.report({ message, node });
      },
    };
  },
  meta: {
    docs: {
      description: "Avoid nested Effect pipeline calls. Compose with .pipe() instead of nesting.",
      recommended: true,
    },
    type: "suggestion",
  },
});
