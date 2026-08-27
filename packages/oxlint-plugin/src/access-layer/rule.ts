import type { ESTree } from "@oxlint/plugins";
import type { CreateRule } from "effect-oxlint";

const messages: Record<string, string> = {
  d1Transaction:
    "sql.withTransaction dies on D1. Use AtomicWrites, which batches on D1 and uses a real transaction where one exists (R26-122).",
  rawSql:
    "Raw SQL belongs in packages/db — add a function there so the query carries its organizationId (R26-120).",
};

const posix = (filename: string): string => filename.replaceAll("\\", "/");

const isProductTree = (filename: string): boolean =>
  filename.includes("/apps/") || filename.includes("/packages/");

const isTestFile = (filename: string): boolean =>
  filename.includes("/tests/") || filename.endsWith(".test.ts") || filename.endsWith(".test.tsx");

const isAccessLayer = (filename: string): boolean =>
  filename.includes("/packages/db/src/") || filename.endsWith("/packages/auth/src/adapter.ts");

const isAtomicWrites = (filename: string): boolean =>
  filename.endsWith("/packages/db/src/atomic.ts");

const isSqlIdentifier = (node: ESTree.Node): boolean =>
  node.type === "Identifier" && node.name === "sql";

/** Confine raw SQL and D1-unsupported transactions to the access layer. */
export const accessLayerRule: CreateRule = {
  create(context) {
    const filename = posix(context.filename);
    if (!isProductTree(filename) || isTestFile(filename)) {
      return {};
    }

    return {
      CallExpression(node) {
        if (isAtomicWrites(filename)) {
          return;
        }

        const { callee } = node;
        if (
          callee.type === "MemberExpression" &&
          !callee.computed &&
          isSqlIdentifier(callee.object) &&
          callee.property.type === "Identifier" &&
          callee.property.name === "withTransaction"
        ) {
          context.report({ messageId: "d1Transaction", node });
        }
      },
      TaggedTemplateExpression(node) {
        if (isAccessLayer(filename)) {
          return;
        }

        if (isSqlIdentifier(node.tag)) {
          context.report({ messageId: "rawSql", node });
        }
      },
    };
  },
  meta: {
    docs: {
      description: "Confine raw SQL and D1-unsupported transactions to the access layer.",
      recommended: true,
    },
    messages,
    type: "problem",
  },
};
