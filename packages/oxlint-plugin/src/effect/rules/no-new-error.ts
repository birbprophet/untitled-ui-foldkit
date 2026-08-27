// Vendored from oxlint-plugin-effect (0.5.0) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/** Ban native Error construction except as the direct input to a defect constructor. */
import type { ESTree } from "@oxlint/plugins";
import { defineRule } from "@oxlint/plugins";

const nativeErrors = new Set([
  "Error",
  "TypeError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "URIError",
  "EvalError",
]);

const defectNamespaces = new Set(["Effect", "Cause", "Exit"]);

const isDirectDefectArgument = function isDirectDefectArgument(
  node: ESTree.NewExpression,
): boolean {
  const { parent } = node;
  if (parent?.type !== "CallExpression" || !parent.arguments.includes(node)) {
    return false;
  }
  const { callee } = parent;
  if (callee.type !== "MemberExpression" || callee.computed) {
    return false;
  }
  if (callee.object.type !== "Identifier" || callee.property.type !== "Identifier") {
    return false;
  }
  return defectNamespaces.has(callee.object.name) && callee.property.name === "die";
};

export const noNewError = defineRule({
  create(context) {
    return {
      NewExpression(expression) {
        if (
          expression.callee.type !== "Identifier" ||
          !nativeErrors.has(expression.callee.name) ||
          isDirectDefectArgument(expression)
        ) {
          return;
        }
        context.report({
          message:
            "Avoid native Error constructors for expected failures. Use a tagged error, or pass the Error directly to Effect.die, Cause.die, or Exit.die for an explicit defect.",
          node: expression,
        });
      },
    };
  },
  meta: {
    docs: {
      description: "Reserve native Error values for explicit Effect defects.",
      recommended: true,
    },
    type: "suggestion",
  },
});
