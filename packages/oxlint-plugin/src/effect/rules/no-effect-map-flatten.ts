// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `.map(f).flatMap(g)` — use `.flatMap(x => g(f(x)))` or refactor.
 *
 * Detects `.pipe(Effect.map(f), Effect.flatMap(g))` chains where
 * the map + flatMap can be fused.
 *
 * Source: language-service/effectMapFlatten
 */
import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Arr from "effect/Array";
import * as Option from "effect/Option";

const isEffectMap = (node: ESTree.Node): boolean =>
  node.type === "CallExpression" && Option.isSome(AST.matchCallOf(node, "Effect", "map"));

const isEffectFlatMap = (node: ESTree.Node): boolean =>
  node.type === "CallExpression" && Option.isSome(AST.matchCallOf(node, "Effect", "flatMap"));

/** Do two adjacent pipe arguments read `Effect.map(f), Effect.flatMap(g)`? */
const hasMapFlatMapSequence = (args: readonly ESTree.Node[]): boolean =>
  Arr.some(
    Arr.zip(args, Arr.drop(args, 1)),
    ([first, second]) => isEffectMap(first) && isEffectFlatMap(second),
  );

/** Is this callee a `.pipe` member — read structurally, exactly as upstream did. */
const isPipeMember = (callee: ESTree.Node): boolean =>
  callee.type === "MemberExpression" &&
  "name" in callee.property &&
  callee.property.name === "pipe";

export const noEffectMapFlatten = defineRule({
  create(context) {
    const report = (node: ESTree.Node): void => {
      context.report({
        message: "Effect.map followed by Effect.flatMap can be fused into a single Effect.flatMap.",
        node,
      });
    };

    return {
      CallExpression(node) {
        const args = node.arguments;

        // Bare pipe(value, Effect.map(f), Effect.flatMap(g))
        const calleeName = Option.getOrUndefined(AST.calleeName(node));
        if (calleeName === "pipe" && hasMapFlatMapSequence(args)) {
          report(node);
          return;
        }

        // .pipe(Effect.map(f), Effect.flatMap(g))
        if (isPipeMember(node.callee) && hasMapFlatMapSequence(args)) {
          report(node);
        }
      },
    };
  },
  meta: {
    docs: {
      description:
        "Avoid Effect.map followed by Effect.flatMap in pipe. Fuse into a single Effect.flatMap.",
      recommended: true,
    },
    type: "suggestion",
  },
});
