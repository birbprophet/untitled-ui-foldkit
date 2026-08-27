// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban nested `pipe()` calls — `pipe(pipe(...), ...)` or `.pipe(...).pipe(...)`.
 *
 * Flatten into a single pipeline.
 *
 * Sources: biome-effect-linting-rules/no-pipe-ladder, language-service/unnecessaryPipeChain
 */
import { defineRule } from "@oxlint/plugins";
import * as Arr from "effect/Array";
import * as Option from "effect/Option";
import * as P from "effect/Predicate";

/**
 * Is this `pipe(...)` or `x.pipe(...)`?
 *
 * Read structurally: `hasProperty` is the exact spelling of the
 * `x != null && typeof x === "object" && "k" in x` guard upstream used.
 */
const isPipeCall = function isPipeCall(node: unknown): boolean {
  if (!P.hasProperty(node, "type") || node.type !== "CallExpression") {
    return false;
  }
  if (!P.hasProperty(node, "callee")) {
    return false;
  }
  const { callee } = node;
  if (!P.hasProperty(callee, "type")) {
    return false;
  }

  // pipe(...)
  if (callee.type === "Identifier" && P.hasProperty(callee, "name") && callee.name === "pipe") {
    return true;
  }

  // x.pipe(...)
  if (callee.type !== "MemberExpression" || !P.hasProperty(callee, "property")) {
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

export const noNestedPipe = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        if (!isPipeCall(node)) {
          return;
        }

        // Any argument that is itself a pipe call
        const nested = Arr.findFirst(node.arguments, isPipeCall);
        if (Option.isNone(nested)) {
          return;
        }

        context.report({
          message: "Nested pipe() detected. Flatten into a single pipeline.",
          node: nested.value,
        });
      },
    };
  },
  meta: {
    docs: {
      description: "Avoid nested pipe() calls. Flatten into a single pipeline.",
      recommended: true,
    },
    type: "suggestion",
  },
});
