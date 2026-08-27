// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `.makeUnsafe(...)` constructors.
 *
 * Unsafe constructors erase validation boundaries. Prefer safe constructors
 * that return Effect/Option or encode impossible failure in the owning module.
 */
import { defineRule } from "@oxlint/plugins";
import * as P from "effect/Predicate";

/**
 * `<receiver>.makeUnsafe`, whatever the receiver is.
 *
 * Reads the property and nothing else. `AST.memberNames` was doing this job, but
 * it also insists the receiver be a bare identifier — which exempted every
 * namespaced call, and a namespace import is the ordinary way to reach a
 * constructor here, so `Domain.Slug.makeUnsafe(...)` went unreported. The
 * receiver is not what this rule is about; the constructor it names is.
 */
const isMakeUnsafeProperty = (candidate: unknown): boolean =>
  P.hasProperty(candidate, "type") &&
  candidate.type === "Identifier" &&
  P.hasProperty(candidate, "name") &&
  candidate.name === "makeUnsafe";

export const noMakeUnsafe = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        const { callee } = node;
        if (callee.type !== "MemberExpression") {
          return;
        }
        // `computed` excluded: `x[makeUnsafe]` names a variable, not this method.
        if (callee.computed || !isMakeUnsafeProperty(callee.property)) {
          return;
        }

        context.report({
          message:
            "Do not call `.makeUnsafe(...)`. Use safe Effectful/Option-returning construction instead of bypassing validation.",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Avoid makeUnsafe constructors. Use safe Effectful or Option-returning construction.",
      recommended: true,
    },
    type: "problem",
  },
});
