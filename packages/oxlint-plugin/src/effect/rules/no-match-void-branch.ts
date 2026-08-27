// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `Match.when(true/false, () => Effect.void)` and `Match.orElse(() => Effect.void)`.
 *
 * Remove the no-op branch or restructure.
 *
 * Source: biome-effect-linting-rules/no-match-void-branch
 */
import { defineRule } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Arr from "effect/Array";
import * as P from "effect/Predicate";

/**
 * Is this node a plain identifier written `name`?
 *
 * Read structurally: `hasProperty` is the exact spelling of the
 * `x != null && typeof x === "object" && "k" in x` guard upstream used.
 */
const isIdentifierNamed = (node: unknown, name: string): boolean =>
  P.hasProperty(node, "type") &&
  node.type === "Identifier" &&
  P.hasProperty(node, "name") &&
  node.name === name;

const isEffectVoid = (node: unknown): boolean =>
  P.hasProperty(node, "type") &&
  node.type === "MemberExpression" &&
  P.hasProperty(node, "object") &&
  isIdentifierNamed(node.object, "Effect") &&
  P.hasProperty(node, "property") &&
  isIdentifierNamed(node.property, "void");

const isVoidCallback = (node: unknown): boolean =>
  P.hasProperty(node, "type") &&
  (node.type === "ArrowFunctionExpression" || node.type === "FunctionExpression") &&
  P.hasProperty(node, "body") &&
  isEffectVoid(node.body);

export const noMatchVoidBranch = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        const isMatchWhen = AST.isCallOf(node, "Match", "when");
        const isMatchOrElse = AST.isCallOf(node, "Match", "orElse");

        if (!isMatchWhen && !isMatchOrElse) {
          return;
        }

        const args = node.arguments;

        if (isMatchOrElse && Arr.isReadonlyArrayNonEmpty(args) && isVoidCallback(args[0])) {
          context.report({
            message:
              "Match.orElse returning Effect.void is a no-op. Remove the branch or restructure.",
            node,
          });
          return;
        }

        if (isMatchWhen && args.length >= 2 && isVoidCallback(args[1])) {
          context.report({
            message:
              "Match.when branch returning Effect.void is a no-op. Remove the branch or restructure.",
            node,
          });
        }
      },
    };
  },
  meta: {
    docs: {
      description:
        "Avoid no-op Match branches returning Effect.void. Remove the branch or restructure.",
      recommended: true,
    },
    type: "suggestion",
  },
});
