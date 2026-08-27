// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `() => { return x }` — use `() => x` instead.
 *
 * Source: language-service/unnecessaryArrowBlock
 */
import { defineRule } from "@oxlint/plugins";
import * as Arr from "effect/Array";
import * as P from "effect/Predicate";

/** `return <expression>;` — a return that actually carries a value. */
const isValueReturn = (candidate: unknown): boolean =>
  P.hasProperty(candidate, "type") &&
  candidate.type === "ReturnStatement" &&
  P.hasProperty(candidate, "argument") &&
  P.isNotNullish(candidate.argument);

/** A block whose whole content is one value-carrying `return`. */
const isSingleReturnBlock = function isSingleReturnBlock(candidate: unknown): boolean {
  if (
    !P.hasProperty(candidate, "type") ||
    candidate.type !== "BlockStatement" ||
    !P.hasProperty(candidate, "body") ||
    !Arr.isArray(candidate.body) ||
    candidate.body.length !== 1
  ) {
    return false;
  }
  const [statement] = candidate.body;
  return isValueReturn(statement);
};

export const noUnnecessaryArrowBlock = defineRule({
  create(context) {
    return {
      ArrowFunctionExpression(node) {
        if (!isSingleReturnBlock(node.body)) {
          return;
        }
        context.report({
          message:
            "Unnecessary arrow block body. Use `() => expr` instead of `() => { return expr }`.",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description: "Unnecessary arrow block body. Use concise arrow `() => expr`.",
      recommended: true,
    },
    fixable: "code",
    type: "suggestion",
  },
});
