// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `Option.match(x, { onSome: (v) => v === true, onNone: () => false })`.
 *
 * Normalize at the schema boundary instead.
 *
 * Source: biome-effect-linting-rules/no-option-boolean-normalization
 */
import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";
import * as Arr from "effect/Array";
import * as Option from "effect/Option";

import { AST } from "../sdk.ts";

const message =
  "Avoid Option.match for boolean normalization. Normalize at schema boundary instead.";

/** The options object of `Option.match(self, { ... })`, when the call is one. */
const optionMatchOptions = (node: ESTree.Node): Option.Option<ESTree.ObjectExpression> =>
  AST.narrow(node, "CallExpression").pipe(
    Option.filter((call) => AST.isCallOf(call, "Option", "match")),
    Option.flatMap((call) => Arr.get(call.arguments, 1)),
    Option.flatMap((argument) => AST.narrow(argument, "ObjectExpression")),
  );

const isObjectProperty = (property: ESTree.ObjectPropertyKind): property is ESTree.ObjectProperty =>
  property.type === "Property";

/** The plainly-written properties of an object literal — a spread carries no key. */
const namedProperties = (options: ESTree.ObjectExpression): readonly ESTree.ObjectProperty[] =>
  Arr.filter(options.properties, isObjectProperty);

const isKeyNamed = (property: ESTree.ObjectProperty, name: string): boolean =>
  property.key.type === "Identifier" && property.key.name === name;

/** The body of `() => ...`, when the property's value is written that way. */
const arrowBody = (property: ESTree.ObjectProperty): Option.Option<ESTree.Node> =>
  Option.map(AST.narrow(property.value, "ArrowFunctionExpression"), (arrow) => arrow.body);

/** `onSome: (v) => v === true` — the "unwrap the boolean" half of the pattern. */
const isSomeTrue = (property: ESTree.ObjectProperty): boolean =>
  isKeyNamed(property, "onSome") &&
  Option.isSome(
    arrowBody(property).pipe(
      Option.flatMap((body) => AST.narrow(body, "BinaryExpression")),
      Option.filter((comparison) => comparison.operator === "==="),
      Option.flatMap((comparison) => AST.narrow(comparison.right, "Literal")),
      Option.filter((literal) => literal.value === true),
    ),
  );

/** `onNone: () => false` — the "default it away" half of the pattern. */
const isNoneFalse = (property: ESTree.ObjectProperty): boolean =>
  isKeyNamed(property, "onNone") &&
  Option.isSome(
    arrowBody(property).pipe(
      Option.flatMap((body) => AST.narrow(body, "Literal")),
      Option.filter((literal) => literal.value === false),
    ),
  );

const normalizesBoolean = (properties: readonly ESTree.ObjectProperty[]): boolean =>
  Arr.some(properties, isSomeTrue) && Arr.some(properties, isNoneFalse);

export const noOptionBooleanNormalization = defineRule({
  create(context) {
    return {
      CallExpression(node) {
        const normalizing = Option.filter(optionMatchOptions(node), (options) =>
          normalizesBoolean(namedProperties(options)),
        );
        if (Option.isNone(normalizing)) {
          return;
        }
        context.report({ message, node });
      },
    };
  },
  meta: {
    docs: {
      description: "Avoid Option.match for boolean normalization. Normalize at schema boundary.",
      recommended: true,
    },
    type: "suggestion",
  },
});
