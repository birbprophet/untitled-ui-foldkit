import type { CreateRule, ESTree } from "effect-oxlint";

const message =
  "Test APIs come from @effect/vitest (describe/it) and @effect/vitest/utils (assert*); importing vitest, vite-plus/test, or bun:test inside a test file bypasses the Effect test runtime.";

const isRawRunnerSource = (specifier: unknown): boolean =>
  specifier === "vitest" || specifier === "vite-plus/test" || specifier === "bun:test";

const isFixturePath = (filename: string): boolean => filename.includes("/fixtures/");

const filenameOf = (context: { filename?: string; physicalFilename?: string }): string =>
  context.physicalFilename ?? context.filename ?? "";

const reportsLiteralSource = (node: ESTree.Node): boolean =>
  node.type === "Literal" && isRawRunnerSource(node.value);

/** Ban raw vitest / bun:test runner imports. Scoped to test files by vite.config.ts. */
export const noRawVitestImportsRule: CreateRule = {
  create(context) {
    if (isFixturePath(filenameOf(context))) {
      return {};
    }

    return {
      ImportDeclaration(node: ESTree.ImportDeclaration) {
        if (isRawRunnerSource(node.source.value)) {
          context.report({ message, node });
        }
      },
      ImportExpression(node: ESTree.ImportExpression) {
        if (reportsLiteralSource(node.source)) {
          context.report({ message, node });
        }
      },
    };
  },
  meta: {
    docs: {
      description:
        "Disallow vitest, vite-plus/test, and bun:test imports; the runner API is @effect/vitest.",
      recommended: true,
    },
    type: "problem",
  },
};
