// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban nested IIFE chains — `((x) => ((y) => ...)(arg2))(arg1)`.
 *
 * Use named const bindings + flat pipeline.
 *
 * Source: biome-effect-linting-rules/no-arrow-ladder
 */
import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Arr from "effect/Array";
import * as Option from "effect/Option";
import * as P from "effect/Predicate";

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

/** A branch of a node is either one child or a list of them. */
const branchesOf = function branchesOf(branch: unknown): readonly unknown[] {
  if (Arr.isArray(branch)) {
    return branch;
  }
  return [branch];
};

const branchesIn = (node: ESTree.Node, name: string): readonly unknown[] =>
  Option.match(fieldOf(node, name), {
    onNone: (): readonly unknown[] => [],
    onSome: branchesOf,
  });

/** Only a list counts here — `arguments` is read as one or not at all. */
const listIn = function listIn(node: ESTree.Node, name: string): readonly unknown[] {
  const found = Option.getOrUndefined(fieldOf(node, name));
  if (Arr.isArray(found)) {
    return found;
  }
  return [];
};

/** `((x) => ...)(arg)` — a function called where it is written. */
const isIife = (node: ESTree.Node): boolean =>
  Option.isSome(
    Option.filter(
      AST.narrow(node, "CallExpression"),
      (call) =>
        call.callee.type === "ArrowFunctionExpression" || call.callee.type === "FunctionExpression",
    ),
  );

/**
 * Is there an IIFE anywhere under this node?
 *
 * A guard-and-recurse function rather than `Match`: matching over an `unknown`
 * input widens the whole pipe to `any`, and a walk that silently returns `any`
 * is one that stops being checked at all.
 */
const containsIife = function containsIife(candidate: unknown): boolean {
  if (!isNode(candidate)) {
    return false;
  }
  if (isIife(candidate)) {
    return true;
  }
  if (Arr.some(branchesIn(candidate, "body"), containsIife)) {
    return true;
  }
  if (Option.exists(fieldOf(candidate, "argument"), containsIife)) {
    return true;
  }
  if (Arr.some(listIn(candidate, "arguments"), containsIife)) {
    return true;
  }
  return Option.exists(fieldOf(candidate, "expression"), containsIife);
};

export const noArrowLadder = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        const nested = AST.narrow(node, "CallExpression").pipe(
          Option.filter(isIife),
          // Check if the body of the IIFE itself contains another IIFE
          Option.filter((call) => Option.exists(fieldOf(call.callee, "body"), containsIife)),
        );
        if (Option.isSome(nested)) {
          context.report({
            message: "Nested IIFE chain detected. Use named const bindings + flat pipeline.",
            node,
          });
        }
      },
    };
  },
  meta: {
    docs: {
      description: "Avoid nested IIFE chains. Use named const bindings + flat pipeline.",
      recommended: true,
    },
    type: "suggestion",
  },
});
