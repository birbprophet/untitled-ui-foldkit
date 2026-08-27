import { Rule } from "effect-oxlint";
import type { CreateRule, ESTree } from "effect-oxlint";

// Keep this list intentionally small and explicit. The rule protects the
// repository's chosen validation boundary; an unfamiliar source is not, by
// itself, evidence that it performs validation.
const KNOWN_VALIDATION_SOURCE_PREFIXES = [
  "arktype",
  "io-ts",
  "joi",
  "runtypes",
  "superstruct",
  "valibot",
  "yup",
  "zod",
];

const sourceMatchesPrefix = function sourceMatchesPrefix(source: string, prefix: string): boolean {
  if (source === prefix) {
    return true;
  }
  if (prefix.endsWith("/")) {
    return source.startsWith(prefix);
  }
  return source.startsWith(`${prefix}/`);
};

const isKnownValidationSource = (source: string): boolean =>
  KNOWN_VALIDATION_SOURCE_PREFIXES.some((prefix) => sourceMatchesPrefix(source, prefix));

const isValueImport = (declaration: ESTree.ImportDeclaration): boolean =>
  declaration.importKind !== "type" &&
  declaration.specifiers.some(
    (specifier) => specifier.type !== "ImportSpecifier" || specifier.importKind !== "type",
  );

const isValidationImport = function isValidationImport(
  declaration: ESTree.ImportDeclaration,
): boolean {
  const source = declaration.source.value;
  return isKnownValidationSource(source) && isValueImport(declaration);
};

const banKnownValidationImport = Rule.banImport(isKnownValidationSource, {
  message: 'Use Effect Schema from "effect/Schema" for validation.',
  meta: { type: "problem" },
});

/** Known validation-library imports must use Effect Schema instead. */
export const effectSchemaOnlyRule: CreateRule = {
  create(context) {
    const visitor = banKnownValidationImport.create(context);
    return {
      ImportDeclaration(node: ESTree.ImportDeclaration) {
        if (isValidationImport(node)) {
          visitor.ImportDeclaration?.(node);
        }
      },
    };
  },
  meta: {
    docs: {
      description: "Flag known validation-library imports that bypass Effect Schema.",
      recommended: true,
    },
    type: "problem",
  },
};
