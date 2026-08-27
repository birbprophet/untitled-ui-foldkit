// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban `type X = Effect.Effect<...>` type aliases.
 *
 * Keep Effect types on service methods or inline at call site.
 *
 * Source: biome-effect-linting-rules/no-effect-type-alias
 */
import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Arr from "effect/Array";
import * as Option from "effect/Option";
import * as P from "effect/Predicate";

/** An ESTree node, as far as a generic walk needs to know. */
const isNode = (candidate: unknown): candidate is ESTree.Node =>
  P.hasProperty(candidate, "type") && P.isString(candidate.type);

/** A named field of a node, present or absent — the walk reads two. */
const fieldOf = function fieldOf(node: ESTree.Node, name: string): Option.Option<unknown> {
  if (P.hasProperty(node, name)) {
    return Option.some(node[name]);
  }
  return Option.none();
};

const isNamed = (node: ESTree.Node, name: string): boolean =>
  node.type === "Identifier" && node.name === name;

/** `Effect.Effect<...>`, written qualified. */
const isEffectReference = (node: ESTree.Node): boolean =>
  Option.isSome(
    AST.narrow(node, "TSTypeReference").pipe(
      Option.flatMap((reference) => AST.narrow(reference.typeName, "TSQualifiedName")),
      Option.filter((qualified) => isNamed(qualified.left, "Effect")),
      Option.filter((qualified) => isNamed(qualified.right, "Effect")),
    ),
  );

/**
 * Everything written directly under a node, as a flat list of candidates.
 *
 * Read generically rather than field by field. The rule used to descend through
 * `typeAnnotation` and `typeParameters` only, and this AST spells a type
 * reference's arguments `typeArguments` — so `ReadonlyArray<Effect.Effect<A>>`
 * reached a dead end at the first hop, and a type literal's `members` were
 * never visited at all. Naming the fields is what broke it; a walk that reads
 * whatever a node carries cannot go stale against a rename.
 *
 * `parent` is the one field skipped: following the back-pointer would climb out
 * of the alias and never terminate.
 */
const valuesUnder = function valuesUnder(entry: readonly [string, unknown]): readonly unknown[] {
  const [key, value] = entry;
  if (key === "parent") {
    return Arr.empty<unknown>();
  }
  if (Arr.isArray(value)) {
    return value;
  }
  return Arr.of(value);
};

const childrenOf = function childrenOf(node: ESTree.Node): readonly unknown[] {
  const fields: readonly (readonly [string, unknown])[] = Object.entries(node);
  return Arr.flatMap(fields, valuesUnder);
};

/**
 * Is `Effect.Effect<...>` written anywhere under this node?
 *
 * A guard-and-recurse function rather than `Match`: matching over an `unknown`
 * input widens the whole pipe to `any`, and a walk that silently returns `any`
 * is one that stops being checked at all.
 */
const containsEffectType = function containsEffectType(candidate: unknown): boolean {
  if (!isNode(candidate)) {
    return false;
  }
  // TSTypeReference with Effect.Effect
  if (isEffectReference(candidate)) {
    return true;
  }
  return Arr.some(childrenOf(candidate), containsEffectType);
};

export const noEffectTypeAlias = defineRule({
  create(context) {
    return {
      TSTypeAliasDeclaration(node) {
        const wrapped = Option.filter(fieldOf(node, "typeAnnotation"), containsEffectType);
        if (Option.isSome(wrapped)) {
          context.report({
            message:
              "Avoid type alias wrapping Effect.Effect. Let Effect types flow from service methods.",
            node,
          });
        }
      },
    };
  },
  meta: {
    docs: {
      description: "Avoid Effect type aliases. Keep Effect types on service methods or inline.",
      recommended: true,
    },
    type: "suggestion",
  },
});
