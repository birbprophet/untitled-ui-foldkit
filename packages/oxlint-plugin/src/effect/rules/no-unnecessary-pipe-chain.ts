// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `x.pipe(f).pipe(g)` — merge into `x.pipe(f, g)`.
 *
 * Source: language-service/unnecessaryPipeChain
 */
import { defineRule } from "@oxlint/plugins";
import * as P from "effect/Predicate";

/**
 * Is this a `x.pipe(...)` method call?
 *
 * Read structurally: `hasProperty` is the exact spelling of the
 * `x != null && typeof x === "object" && "k" in x` guard upstream used.
 */
const isMethodPipe = function isMethodPipe(node: unknown): boolean {
  if (!P.hasProperty(node, "type") || node.type !== "CallExpression") {
    return false;
  }
  if (!P.hasProperty(node, "callee")) {
    return false;
  }
  const { callee } = node;
  if (!P.hasProperty(callee, "type") || callee.type !== "MemberExpression") {
    return false;
  }
  if (!P.hasProperty(callee, "property")) {
    return false;
  }
  const { property } = callee;
  return (
    P.hasProperty(property, "type") &&
    property.type === "Identifier" &&
    P.hasProperty(property, "name") &&
    property.name === "pipe"
  );
};

export const noUnnecessaryPipeChain = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        if (!isMethodPipe(node)) {
          return;
        }
        const { callee } = node;
        if (callee.type !== "MemberExpression" || !isMethodPipe(callee.object)) {
          return;
        }
        context.report({
          message: "Unnecessary .pipe() chain. Merge into a single .pipe() call.",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description: "Avoid chaining .pipe().pipe(). Merge into a single .pipe() call.",
      recommended: true,
    },
    type: "suggestion",
  },
});
