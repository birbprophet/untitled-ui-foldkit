// Vendored from oxlint-plugin-effect (0.5.0) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/** Ban Node builtin capabilities only when Effect supplies a direct replacement. */
import type { ESTree } from "@oxlint/plugins";
import { defineRule } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Arr from "effect/Array";
import * as Option from "effect/Option";

const replacedModules = new Map([
  ["child_process", "ChildProcessSpawner from 'effect/unstable/process'"],
  ["console", "Console or Effect logging"],
  ["fs", "FileSystem"],
  ["http", "HttpClient or HttpServer from 'effect/unstable/http'"],
  ["https", "HttpClient or HttpServer from 'effect/unstable/http'"],
  ["path", "Path"],
  ["readline", "Terminal or Stdio"],
  ["stream", "Stream, Sink, or Channel"],
  ["timers", "Effect.sleep or Schedule"],
  ["tty", "Terminal or Stdio"],
  ["worker_threads", "Worker from 'effect/unstable/workers'"],
]);

const cryptoOperations = new Set([
  "getRandomValues",
  "randomBytes",
  "randomFill",
  "randomFillSync",
  "randomInt",
  "randomUUID",
]);

const processOperations = new Set([
  "argv",
  "chdir",
  "env",
  "exit",
  "hrtime",
  "nextTick",
  "stderr",
  "stdin",
  "stdout",
]);

type PartialModule = "crypto" | "process" | "subtle" | "webcrypto";

type ImportSpecifierNode = ESTree.ImportDeclaration["specifiers"][number];

const withoutNodePrefix = function withoutNodePrefix(source: string): string {
  if (source.startsWith("node:")) {
    return source.slice(5);
  }
  return source;
};

const moduleBase = function moduleBase(source: string): string {
  const withoutPrefix = withoutNodePrefix(source);
  return withoutPrefix.split("/")[0] ?? withoutPrefix;
};

const importedName = function importedName(specifier: ESTree.ImportSpecifier): string {
  const { imported } = specifier;
  if (imported.type === "Identifier") {
    return imported.name;
  }
  return imported.value;
};

/** `a.b.c` read as `["a", "b", "c"]`, or none if any segment is computed. */
const memberPath = function memberPath(
  node: ESTree.MemberExpression,
): Option.Option<readonly string[]> {
  if (node.computed || node.property.type !== "Identifier") {
    return Option.none();
  }
  const leaf = node.property.name;
  if (node.object.type === "Identifier") {
    return Option.some([node.object.name, leaf]);
  }
  if (node.object.type !== "MemberExpression") {
    return Option.none();
  }
  return Option.map(memberPath(node.object), (parentPath) => Arr.append(parentPath, leaf));
};

const partialReplacement = function partialReplacement(
  module: PartialModule,
  path: readonly string[],
): Option.Option<string> {
  const operation = path.at(-1);
  if (operation === undefined) {
    return Option.none();
  }

  if (module === "process") {
    if (processOperations.has(operation) && path.length === 2) {
      return Option.some("Config, Stdio, Clock, or Effect scheduling");
    }
    return Option.none();
  }
  if (module === "subtle") {
    if (operation === "digest" && path.length === 2) {
      return Option.some("Crypto.digest");
    }
    return Option.none();
  }
  if (module === "webcrypto") {
    if (cryptoOperations.has(operation) && path.length === 2) {
      return Option.some("Crypto");
    }
    if (operation === "digest" && path.at(-2) === "subtle") {
      return Option.some("Crypto.digest");
    }
    return Option.none();
  }

  if (cryptoOperations.has(operation) && path.length === 2) {
    return Option.some("Crypto");
  }
  if (path.at(-2) === "webcrypto" && cryptoOperations.has(operation)) {
    return Option.some("Crypto");
  }
  if (operation === "digest" && path.at(-2) === "subtle") {
    return Option.some("Crypto.digest");
  }
  return Option.none();
};

export const noNodeBuiltinImport = defineRule({
  create(context) {
    const partialModuleByAlias = new Map<string, PartialModule>();
    const report = (node: ESTree.Node, used: string, alternative: string) => {
      context.report({
        message: `Avoid ${used}. Use ${alternative}; platform adapters may disable this rule explicitly.`,
        node,
      });
    };

    /**
     * What one specifier of a `crypto`/`process` import earns.
     *
     * Namespace and default imports name an alias the MemberExpression visitor
     * follows later, so they register rather than report.
     */
    const reportSpecifier = function reportSpecifier(
      module: "crypto" | "process",
      specifier: ImportSpecifierNode,
    ): void {
      if (
        specifier.type === "ImportDefaultSpecifier" ||
        specifier.type === "ImportNamespaceSpecifier"
      ) {
        partialModuleByAlias.set(specifier.local.name, module);
        return;
      }
      const imported = importedName(specifier);
      if (module === "crypto") {
        if (imported === "webcrypto" || imported === "subtle") {
          partialModuleByAlias.set(specifier.local.name, imported);
          return;
        }
        if (cryptoOperations.has(imported)) {
          report(specifier, `node:crypto ${imported}`, "Crypto");
        }
        return;
      }
      if (processOperations.has(imported)) {
        report(specifier, `node:process ${imported}`, "Config, Stdio, Clock, or Effect scheduling");
      }
    };

    return {
      ImportDeclaration(declaration) {
        const source = AST.importSource(declaration);
        const module = moduleBase(source);
        const alternative = replacedModules.get(module);
        if (alternative !== undefined) {
          report(declaration, `importing '${source}'`, alternative);
          return;
        }
        if (module !== "crypto" && module !== "process") {
          return;
        }

        // Source order: these are diagnostics, not work to overlap.
        Arr.forEach(declaration.specifiers, (specifier) => {
          reportSpecifier(module, specifier);
        });
      },
      MemberExpression(member) {
        const path = Option.getOrUndefined(memberPath(member));
        if (path === undefined) {
          return;
        }
        const [alias] = path;
        if (alias === undefined) {
          return;
        }
        const module = partialModuleByAlias.get(alias);
        if (module === undefined) {
          return;
        }
        const alternative = Option.getOrUndefined(partialReplacement(module, path));
        if (alternative === undefined) {
          return;
        }
        report(member, path.join("."), alternative);
      },
    };
  },
  meta: {
    docs: {
      description: "Avoid Node builtin capabilities that Effect replaces.",
      recommended: true,
    },
    type: "problem",
  },
});
