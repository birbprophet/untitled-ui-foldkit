// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * "Am I inside an `Effect.gen` or `Effect.fn` body?", shared by the three rules
 * that ask it.
 *
 * Upstream kept this in an Effect `Ref` and merged a `Visitor.tracked` pair into
 * each rule's visitor. That needed the `effect-oxlint` SDK; a plain counter and
 * the `CallExpression:exit` key do the same thing natively.
 *
 * The counter is per-`create`, and `create` runs once per file, so two files
 * cannot see each other's depth. `enter` must be called BEFORE the rule's own
 * check, because that is the order `Visitor.merge(tracker, handler)` produced:
 * the `Effect.gen(...)` node itself is already at depth 1 when the rule looks at
 * it. Preserving that ordering is what keeps these three rules reporting exactly
 * what they reported before.
 */
import type { ESTree } from "@oxlint/plugins";

import { AST } from "../sdk.ts";

/**
 * Both `Effect.gen` and `Effect.fn` establish a context where the ambient
 * services are already available, which is what these rules are about.
 */
export const isEffectContext = (node: ESTree.CallExpression): boolean =>
  AST.isCallOf(node, "Effect", "gen") || AST.isCallOf(node, "Effect", "fn");

export interface EffectContextTracker {
  /** Count this call if it opens an Effect context. Call before your own check. */
  readonly enter: (node: ESTree.CallExpression) => void;
  /** Uncount it on the way out. Wire to `"CallExpression:exit"`. */
  readonly exit: (node: ESTree.CallExpression) => void;
  /** How many Effect contexts enclose the node being visited. */
  readonly depth: () => number;
}

export const makeEffectContextTracker = function makeEffectContextTracker(): EffectContextTracker {
  let depth = 0;
  const step = function step(node: ESTree.CallExpression, by: number): void {
    if (isEffectContext(node)) {
      depth += by;
    }
  };
  return {
    depth: () => depth,
    enter: (node) => {
      step(node, 1);
    },
    exit: (node) => {
      step(node, -1);
    },
  };
};
