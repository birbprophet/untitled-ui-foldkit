// Vendored from oxlint-plugin-effect (0.2.3) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/**
 * Ban manual `Effect.Effect<A, E, R>` type annotations.
 *
 * Let return types infer from the Effect/Layer you return.
 *
 * Source: biome-effect-linting-rules/no-manual-effect-channels
 */
import type { ESTree } from "@oxlint/plugins";
import { defineRule } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Arr from "effect/Array";
import * as Option from "effect/Option";
import * as P from "effect/Predicate";

const isEffectOrLayerName = (node: ESTree.Node): boolean =>
  node.type === "Identifier" && (node.name === "Effect" || node.name === "Layer");

/** `Effect.Effect<...>`, `Layer.Layer<...>`, and the mixed spellings of both. */
const isEffectChannelReference = (reference: ESTree.TSTypeReference): boolean =>
  Option.isSome(
    AST.narrow(reference.typeName, "TSQualifiedName").pipe(
      Option.filter((qualified) => isEffectOrLayerName(qualified.left)),
      Option.filter((qualified) => isEffectOrLayerName(qualified.right)),
    ),
  );

/**
 * Are the channels spelled out rather than inferred?
 *
 * Two things were wrong here. The field was read as `typeParameters`, which no
 * node in this AST carries — a `TSTypeReference` calls it `typeArguments` — so
 * the rule reported nothing at all. And any type argument counted, which would
 * make this a ban on naming the success type as well.
 *
 * The channels are the error and context parameters, `E` and `R`: a bare
 * `Effect.Effect<A>` spells neither and leaves both to infer, which is what the
 * rule asks for. So a second type argument is the thing being reported, and
 * `Arr.get` at index 1 asks for exactly that.
 */
const hasExplicitChannels = (reference: ESTree.TSTypeReference): boolean =>
  P.isNotNullish(reference.typeArguments) &&
  Option.isSome(Arr.get(reference.typeArguments.params, 1));

/**
 * Declarations that state a type instead of having one inferred.
 *
 * An interface member and a type alias have no value to infer from — "let types
 * infer from the returned value" is not advice that can be followed where there
 * is no returned value, only a signature. Reporting there asks for a deletion
 * that would not compile.
 *
 * This matters beyond tidiness: repairing this rule made it fire 125 times, and
 * the first sites it named were `ContentStore`'s members — the port whose error
 * channel was added deliberately so an R2 outage could not be mistaken for a
 * missing capture. The rule would have argued for deleting the very annotation
 * that distinction lives in.
 */
const TYPE_ONLY_HOMES = new Set(["TSInterfaceDeclaration", "TSTypeAliasDeclaration"]);

/**
 * Whether this annotation sits in a type declaration rather than on a value.
 *
 * Walks the `parent` chain as `unknown` rather than as a node: the chain ends at
 * a `Program` whose parent is nothing at all, and typing the walk would mean
 * asserting each step back into a node it has not yet been shown to be.
 */
const isTypeOnlyPosition = function isTypeOnlyPosition(node: unknown): boolean {
  if (!P.hasProperty(node, "type") || !P.isString(node.type)) {
    return false;
  }
  if (TYPE_ONLY_HOMES.has(node.type)) {
    return true;
  }
  return P.hasProperty(node, "parent") && isTypeOnlyPosition(node.parent);
};

export const noManualEffectChannels = defineRule({
  create(context) {
    return {
      TSTypeReference(node) {
        if (
          !isEffectChannelReference(node) ||
          !hasExplicitChannels(node) ||
          isTypeOnlyPosition(node)
        ) {
          return;
        }
        context.report({
          message:
            "Avoid manual Effect/Layer channel annotations. Let types infer from the returned value.",
          node,
        });
      },
    };
  },
  meta: {
    docs: {
      description:
        "Avoid manual Effect.Effect<A, E, R> annotations. Let types infer from the returned Effect.",
      recommended: true,
    },
    type: "suggestion",
  },
});
