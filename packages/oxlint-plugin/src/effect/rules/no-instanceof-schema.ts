// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `instanceof` checks against Schema-derived classes.
 *
 * Use `Schema.is(SchemaType)` instead.
 *
 * Source: language-service/instanceOfSchema
 *
 * Note: there is no type information here, so "is this a Schema class?" is
 * decided by what the right-hand operand is NOT. A constructor the platform
 * provides — `Error` and its subclasses, `Date`, `Map`, a typed array — is the
 * one case where `instanceof` is the only way to ask the question, since no
 * Schema exists to ask instead. Everything else is a class this codebase wrote,
 * which is where the Schema alternative applies.
 *
 * The previous implementation reported every `instanceof` in the file, which is
 * a different rule than the one documented above and than the one its name says.
 */
import type { ESTree } from "@oxlint/plugins";
import { defineRule } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Arr from "effect/Array";
import * as Option from "effect/Option";

/**
 * Constructors `instanceof` may legitimately name.
 *
 * The error hierarchy, because narrowing a caught `unknown` against it is how
 * you tell what was thrown; and the platform types whose identity is the whole
 * point of the check.
 */
const nativeConstructors = new Set([
  "AbortSignal",
  "AggregateError",
  "ArrayBuffer",
  "Array",
  "Blob",
  "DataView",
  "Date",
  "DOMException",
  "Error",
  "EvalError",
  "Event",
  "File",
  "FormData",
  "Function",
  "Headers",
  "Map",
  "Promise",
  "RangeError",
  "ReadableStream",
  "ReferenceError",
  "RegExp",
  "Request",
  "Response",
  "Set",
  "SharedArrayBuffer",
  "SyntaxError",
  "TransformStream",
  "TypeError",
  "URIError",
  "URL",
  "URLSearchParams",
  "Uint8Array",
  "WeakMap",
  "WeakSet",
  "WritableStream",
]);

/**
 * The constructor a right-hand operand names.
 *
 * `Error`, and `globalThis.Error` — the last segment of a static member path is
 * the constructor either way. Anything computed or built by a call has no name
 * to read, and reports.
 */
const constructorName = function constructorName(node: ESTree.Node): Option.Option<string> {
  const identifier = AST.narrow(node, "Identifier").pipe(Option.map((named) => named.name));
  return Option.orElse(identifier, () =>
    AST.narrow(node, "MemberExpression").pipe(
      Option.flatMap(AST.memberPath),
      Option.flatMap(Arr.last),
    ),
  );
};

const isNativeConstructor = (node: ESTree.Node): boolean =>
  Option.exists(constructorName(node), (name) => nativeConstructors.has(name));

export const noInstanceofSchema = defineRule({
  create(context) {
    return {
      BinaryExpression(node) {
        if (node.operator !== "instanceof") {
          return;
        }
        if (isNativeConstructor(node.right)) {
          return;
        }
        context.report({
          message:
            "Avoid instanceof. Add a static `is` field to your class: `static is = Schema.is(this)`, then use `MyClass.is(value)`. For tagged types, use `_tag` checks.",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description: "Avoid instanceof with Schema types. Use Schema.is(SchemaType) instead.",
      recommended: true,
    },
    type: "suggestion",
  },
});
