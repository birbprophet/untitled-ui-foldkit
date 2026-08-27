// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `class Foo extends Error`.
 *
 * Use Schema.TaggedError or Data.TaggedError instead.
 *
 * Source: language-service/extendsNativeError
 */
import type { ESTree } from "@oxlint/plugins";
import { defineRule } from "@oxlint/plugins";
import * as P from "effect/Predicate";

const nativeErrors = new Set([
  "Error",
  "TypeError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "URIError",
  "EvalError",
]);

/** A superclass named after one of the built-in error constructors. */
const isNativeErrorSuperClass = (candidate: unknown): boolean =>
  P.hasProperty(candidate, "type") &&
  candidate.type === "Identifier" &&
  P.hasProperty(candidate, "name") &&
  P.isString(candidate.name) &&
  nativeErrors.has(candidate.name);

export const noExtendsNativeError = defineRule({
  create(context) {
    const reportNativeError = function reportNativeError(node: ESTree.Class) {
      if (!isNativeErrorSuperClass(node.superClass)) {
        return;
      }
      context.report({
        message: "Avoid extending native Error. Use Schema.TaggedError or Data.TaggedError.",
        node,
      });
    };
    // Both class forms, one predicate. A class expression carries the same
    // `superClass` field and the same problem — `const X = class extends Error {}`
    // is a class declaration written into a `const` — but it arrives under its
    // own visitor key, so registering the declaration alone exempted it silently.
    return {
      ClassDeclaration: reportNativeError,
      ClassExpression: reportNativeError,
    };
  },
  meta: {
    docs: {
      description: "Avoid extending native Error. Use Schema.TaggedError or Data.TaggedError.",
      recommended: true,
    },
    type: "suggestion",
  },
});
