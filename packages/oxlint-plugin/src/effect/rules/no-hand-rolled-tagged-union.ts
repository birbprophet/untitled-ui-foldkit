// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban inline hand-rolled `_tag` discriminated unions.
 *
 * Use Schema.TaggedUnion / Schema.TaggedStruct / Schema.TaggedError so
 * constructors, encode/decode, and tag discrimination share one schema source.
 */
import { defineRule } from "@oxlint/plugins";
import * as Arr from "effect/Array";
import * as Option from "effect/Option";
import * as P from "effect/Predicate";
import * as Str from "effect/String";

/**
 * A type-level node, read by field name.
 *
 * The TS-specific nodes this rule walks (`TSUnionType`, `TSPropertySignature`,
 * `TSLiteralType`) are not in the ESTree union oxlint declares, so the walk is
 * structural rather than typed.
 */
interface AstNode {
  readonly type: string;
  readonly [key: string]: unknown;
}

const isAstNode = (candidate: unknown): candidate is AstNode =>
  P.hasProperty(candidate, "type") && P.isString(candidate.type);

const nodeField = function nodeField(node: AstNode, field: string): Option.Option<AstNode> {
  const candidate = node[field];
  if (isAstNode(candidate)) {
    return Option.some(candidate);
  }
  return Option.none();
};

const stringField = function stringField(node: AstNode, field: string): Option.Option<string> {
  const candidate = node[field];
  if (P.isString(candidate)) {
    return Option.some(candidate);
  }
  return Option.none();
};

const nodeArrayField = function nodeArrayField(
  node: AstNode,
  field: string,
): Option.Option<readonly AstNode[]> {
  const candidate = node[field];
  if (Arr.isArray(candidate)) {
    return Option.some(Arr.filter(candidate, isAstNode));
  }
  return Option.none();
};

const propertyKeyName = function propertyKeyName(node: AstNode): Option.Option<string> {
  if (node.type !== "Identifier" && node.type !== "StringLiteral" && node.type !== "Literal") {
    return Option.none();
  }
  return Option.orElse(stringField(node, "name"), () => stringField(node, "value"));
};

const isPascalCaseTag = function isPascalCaseTag(tag: string): boolean {
  if (Str.isEmpty(tag)) {
    return false;
  }
  const first = tag.charAt(0);
  return first === first.toUpperCase() && first !== first.toLowerCase();
};

/** A `_tag: "Foo"` field on a type literal — the hand-rolled discriminant. */
const isReportableTagLiteral = function isReportableTagLiteral(member: AstNode): boolean {
  if (member.type !== "TSPropertySignature") {
    return false;
  }
  const key = Option.getOrUndefined(nodeField(member, "key"));
  if (key === undefined || Option.getOrUndefined(propertyKeyName(key)) !== "_tag") {
    return false;
  }

  const inner = Option.getOrUndefined(
    Option.flatMap(nodeField(member, "typeAnnotation"), (annotation) =>
      nodeField(annotation, "typeAnnotation"),
    ),
  );
  if (inner === undefined || inner.type !== "TSLiteralType") {
    return false;
  }

  const literal = Option.getOrUndefined(nodeField(inner, "literal"));
  if (literal === undefined) {
    return false;
  }
  if (literal.type !== "StringLiteral" && literal.type !== "Literal") {
    return false;
  }

  const tag = Option.getOrUndefined(stringField(literal, "value"));
  return tag !== undefined && isPascalCaseTag(tag);
};

const literalHasTag = (node: AstNode): boolean =>
  node.type === "TSTypeLiteral" &&
  Option.match(nodeArrayField(node, "members"), {
    onNone: () => false,
    onSome: (members) => Arr.some(members, isReportableTagLiteral),
  });

export const noHandRolledTaggedUnion = defineRule({
  create(context) {
    return {
      TSUnionType(node) {
        if (!isAstNode(node)) {
          return;
        }
        const types = Option.getOrUndefined(nodeArrayField(node, "types"));
        if (types === undefined || types.length < 2) {
          return;
        }

        // Two tagged members is what makes it a discriminated union.
        if (Arr.filter(types, literalHasTag).length < 2) {
          return;
        }

        context.report({
          message:
            "Hand-rolled `_tag` discriminated union. Use Schema.TaggedUnion, Schema.TaggedStruct, or Schema.TaggedError instead.",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Use Schema.TaggedUnion, Schema.TaggedStruct, or Schema.TaggedError instead of inline _tag union literals.",
      recommended: true,
    },
    type: "suggestion",
  },
});
