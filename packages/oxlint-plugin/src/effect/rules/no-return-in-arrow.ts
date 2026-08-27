// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban explicit `return` in arrow function callbacks (info severity).
 *
 * Use expression-only callbacks + pipeline logic.
 * Excludes Schema.filter callbacks where return is required.
 *
 * Source: biome-effect-linting-rules/no-return-in-arrow
 */
import { defineRule } from "@oxlint/plugins";
import * as Arr from "effect/Array";
import * as Option from "effect/Option";
import * as P from "effect/Predicate";

/**
 * Is this arrow the callback of a `.filter(...)` or `.check(...)` call?
 *
 * Those two require a `return`, so they are exempt. The walk upward is
 * structural because `parent` is a back-reference oxlint's node types do not
 * declare; `hasProperty` is the exact spelling of the
 * `x != null && typeof x === "object" && "k" in x` guard upstream used.
 */
const isFilterCallback = function isFilterCallback(node: unknown): boolean {
  if (!P.hasProperty(node, "parent")) {
    return false;
  }
  const { parent } = node;
  if (!P.hasProperty(parent, "type") || parent.type !== "CallExpression") {
    return false;
  }
  if (!P.hasProperty(parent, "callee")) {
    return false;
  }
  const { callee } = parent;
  if (!P.hasProperty(callee, "type") || callee.type !== "MemberExpression") {
    return false;
  }
  if (!P.hasProperty(callee, "property")) {
    return false;
  }
  const { property } = callee;
  return (
    P.hasProperty(property, "name") && (property.name === "filter" || property.name === "check")
  );
};

export const noReturnInArrow = defineRule({
  create(context) {
    return {
      ArrowFunctionExpression(node) {
        if (node.body.type !== "BlockStatement") {
          return;
        }

        const statement = Arr.findFirst(
          node.body.body,
          (candidate) => candidate.type === "ReturnStatement",
        );
        if (Option.isNone(statement) || isFilterCallback(node)) {
          return;
        }

        context.report({
          message: "Prefer expression-only arrow callbacks over explicit return.",
          node: statement.value,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Prefer expression-only arrow callbacks. Avoid explicit return in arrow functions.",
      recommended: true,
    },
    type: "suggestion",
  },
});
