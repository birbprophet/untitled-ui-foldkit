// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban consecutive `Effect.provide()` calls — merge into one.
 *
 * Detects: `effect.pipe(Effect.provide(A), Effect.provide(B))`
 * Suggests: `effect.pipe(Effect.provide(Layer.mergeAll(A, B)))`
 *
 * This is an AST heuristic — it catches the common patterns without
 * needing the type checker to confirm they're actually Layer values.
 *
 * Source: language-service/multipleEffectProvide
 */
import type { ESTree } from "@oxlint/plugins";
import { defineRule } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Arr from "effect/Array";
import * as Option from "effect/Option";

const isEffectProvide = (node: ESTree.Node): boolean =>
  node.type === "CallExpression" && Option.isSome(AST.matchCallOf(node, "Effect", "provide"));

const provideCount = (args: readonly ESTree.Node[]): number =>
  Arr.filter(args, isEffectProvide).length;

/** `x.pipe(...)`, written plainly — not `x[expr](...)`. */
const isPipeMember = (callee: ESTree.Node): boolean =>
  callee.type === "MemberExpression" &&
  !callee.computed &&
  "name" in callee.property &&
  callee.property.name === "pipe";

/**
 * `Effect.provide(Effect.provide(x, a), b)` — two provides without a pipe.
 *
 * The pipe check below cannot see this shape: the outer call is a `provide`, not
 * a `pipe`, and it holds one `Effect.provide` argument rather than two. Only the
 * outer call reports, because the inner one's own first argument is the effect.
 */
const isNestedProvide = (node: ESTree.CallExpression): boolean =>
  Option.isSome(AST.matchCallOf(node, "Effect", "provide")) &&
  Option.exists(Arr.get(node.arguments, 0), isEffectProvide);

export const noMultipleEffectProvide = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        const args = node.arguments;
        // Two arguments is the whole of `effect.pipe(provide, provide)`, the shape
        // this rule's own header advertises. The guard used to demand three, which
        // is `pipe(effect, provide, provide)` only — so the method form, the one
        // people write, never reached the count below and the rule reported
        // nothing. `provideCount` is what decides; this only skips calls too short
        // to hold two of anything.
        if (args.length < 2) {
          return;
        }

        // Bare pipe() or .pipe() with multiple Effect.provide args
        const isPipe =
          Option.getOrUndefined(AST.calleeName(node)) === "pipe" || isPipeMember(node.callee);
        const isMultiplePipeProvides = isPipe && provideCount(args) >= 2;
        if (!isMultiplePipeProvides && !isNestedProvide(node)) {
          return;
        }

        context.report({
          message:
            "Multiple Effect.provide() in one pipeline. Merge into Effect.provide(Layer.mergeAll(...)).",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Avoid consecutive Effect.provide() calls. Merge into Effect.provide(Layer.mergeAll(...)).",
      recommended: true,
    },
    type: "suggestion",
  },
});
