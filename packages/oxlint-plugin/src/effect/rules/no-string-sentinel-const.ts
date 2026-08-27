// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `const x = "some-string"` string literal const declarations.
 *
 * Use tagged unions, Option, or meaningful domain values.
 *
 * Source: biome-effect-linting-rules/no-string-sentinel-const
 *
 * Note: Very aggressive — should probably be off by default or in a strict preset only.
 */
import { defineRule } from "@oxlint/plugins";
import * as P from "effect/Predicate";

/** A string literal initialiser. */
const isStringLiteral = (candidate: unknown): boolean =>
  P.hasProperty(candidate, "type") &&
  candidate.type === "Literal" &&
  P.hasProperty(candidate, "value") &&
  P.isString(candidate.value);

/** The declarator's enclosing statement, when it is a `const`. */
const isConstDeclaration = (candidate: unknown): boolean =>
  P.hasProperty(candidate, "type") &&
  candidate.type === "VariableDeclaration" &&
  P.hasProperty(candidate, "kind") &&
  candidate.kind === "const";

export const noStringSentinelConst = defineRule({
  create(context) {
    return {
      VariableDeclarator(node) {
        if (!isStringLiteral(node.init)) {
          return;
        }
        // `parent` is a back-reference oxlint populates but does not declare on
        // its node types, so it is read structurally rather than by property.
        if (!P.hasProperty(node, "parent") || !isConstDeclaration(node.parent)) {
          return;
        }
        context.report({
          message: "Avoid string literal const. Use tagged unions, Option, or domain values.",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description: "Avoid string literal const declarations. Use tagged unions or domain values.",
      recommended: true,
    },
    type: "suggestion",
  },
});
