// Vendored from oxlint-plugin-effect (0.5.0) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/** Allow dynamic imports only at named lazy-loading boundaries. */
import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";
import { AST } from "../sdk.ts";
import * as Arr from "effect/Array";
import * as Option from "effect/Option";
import * as P from "effect/Predicate";

const identifierName = (node: ESTree.Node): Option.Option<string> =>
  Option.map(AST.narrow(node, "Identifier"), (identifier) => identifier.name);

const isIdentifier = (node: ESTree.Node, name: string): boolean =>
  Option.exists(identifierName(node), (found) => found === name);

const hasNamedBinding = function hasNamedBinding(pattern: ESTree.BindingPattern): boolean {
  if (pattern.type === "Identifier") {
    return true;
  }
  if (pattern.type === "ObjectPattern") {
    return Arr.isReadonlyArrayNonEmpty(pattern.properties);
  }
  if (pattern.type === "ArrayPattern") {
    return Arr.some(pattern.elements, P.isNotNull);
  }
  return false;
};

const isNamedVariable = (node: ESTree.Node, initialiser: ESTree.Node): boolean =>
  node.type === "VariableDeclarator" && node.init === initialiser && hasNamedBinding(node.id);

const transparentWrappers = new Set([
  "AwaitExpression",
  "ChainExpression",
  "TSAsExpression",
  "TSNonNullExpression",
  "TSTypeAssertion",
  "YieldExpression",
]);

const climbTransparent = function climbTransparent(start: ESTree.Node): ESTree.Node {
  const { parent } = start;
  if (P.isNotNullish(parent) && transparentWrappers.has(parent.type)) {
    return climbTransparent(parent);
  }
  return start;
};

const isNamedDirectBinding = function isNamedDirectBinding(node: ESTree.Node): boolean {
  const bound = climbTransparent(node);
  return P.isNotNullish(bound.parent) && isNamedVariable(bound.parent, bound);
};

const isNamedFunctionBoundary = function isNamedFunctionBoundary(node: ESTree.Node): boolean {
  const { parent } = node;
  if (parent?.type === "ArrowFunctionExpression" && parent.body === node) {
    return P.isNotNullish(parent.parent) && isNamedVariable(parent.parent, parent);
  }
  if (parent?.type !== "ReturnStatement" || parent.argument !== node) {
    return false;
  }
  const block = parent.parent;
  const fn = block?.parent;
  return block?.type === "BlockStatement" && fn?.type === "FunctionDeclaration" && fn.id !== null;
};

const promiseRunners = ["promise", "tryPromise"];

const isEffectPromiseCall = function isEffectPromiseCall(node: ESTree.Node): boolean {
  if (node.type !== "CallExpression") {
    return false;
  }
  const { callee } = node;
  if (callee.type !== "MemberExpression" || callee.computed) {
    return false;
  }
  return (
    isIdentifier(callee.object, "Effect") &&
    Option.exists(identifierName(callee.property), (name) => Arr.contains(promiseRunners, name))
  );
};

const isEffectPromiseBoundary = function isEffectPromiseBoundary(node: ESTree.Node): boolean {
  const callback = node.parent;
  if (callback?.type !== "ArrowFunctionExpression" || callback.body !== node) {
    return false;
  }
  const call = callback.parent;
  return P.isNotNullish(call) && isEffectPromiseCall(call);
};

const isNamedLazyBoundary = (node: ESTree.Node): boolean =>
  isNamedDirectBinding(node) || isNamedFunctionBoundary(node) || isEffectPromiseBoundary(node);

const dynamicRequireMessage = function dynamicRequireMessage(
  callee: ESTree.Node,
): Option.Option<string> {
  if (isIdentifier(callee, "require")) {
    return Option.some("Avoid require(). Use a static import.");
  }
  if (callee.type !== "MemberExpression") {
    return Option.none();
  }
  if (isIdentifier(callee.object, "module") && isIdentifier(callee.property, "require")) {
    return Option.some("Avoid module.require(). Use a static import.");
  }
  return Option.none();
};

const moduleSources = ["module", "node:module"];

/** The local names this import binds `createRequire` to. */
const createRequireLocals = function createRequireLocals(
  declaration: ESTree.ImportDeclaration,
): readonly string[] {
  if (!Arr.contains(moduleSources, AST.importSource(declaration))) {
    return [];
  }
  return Arr.getSomes(
    Arr.map(declaration.specifiers, (specifier) =>
      AST.narrow(specifier, "ImportSpecifier").pipe(
        Option.filter((imported) => isIdentifier(imported.imported, "createRequire")),
        Option.map((imported) => imported.local.name),
      ),
    ),
  );
};

export const noDynamicImports = defineRule({
  create(context) {
    const createRequireNames = new Set<string>();
    const requireAliases = new Set<string>();
    const report = (node: ESTree.Node, message: string): void => {
      context.report({ message, node });
    };
    return {
      CallExpression(node) {
        const message = Option.orElse(
          Option.map(
            Option.filter(identifierName(node.callee), (name) => requireAliases.has(name)),
            () => "Avoid createRequire aliases. Keep module loading static.",
          ),
          () => dynamicRequireMessage(node.callee),
        );
        const found = Option.getOrUndefined(message);
        if (found !== undefined) {
          report(node, found);
        }
      },
      ImportDeclaration(node) {
        Arr.forEach(createRequireLocals(node), (name) => {
          createRequireNames.add(name);
        });
      },
      ImportExpression(node) {
        if (!isNamedLazyBoundary(node)) {
          report(
            node,
            "Avoid inline dynamic imports. Bind the imported module or a lazy loader to a descriptive name before using it.",
          );
        }
      },
      VariableDeclarator(node) {
        const alias = AST.narrow(node, "VariableDeclarator").pipe(
          Option.filter((declaration) =>
            Option.exists(
              Option.flatMap(Option.fromNullishOr(declaration.init), (init) =>
                AST.narrow(init, "CallExpression"),
              ),
              (call) =>
                call.callee.type === "Identifier" && createRequireNames.has(call.callee.name),
            ),
          ),
          Option.flatMap((declaration) =>
            Option.map(identifierName(declaration.id), (name) => ({ declaration, name })),
          ),
        );
        const found = Option.getOrUndefined(alias);
        if (found !== undefined) {
          requireAliases.add(found.name);
          report(
            found.declaration,
            "Avoid createRequire(). Keep module loading static or use a named import() boundary.",
          );
        }
      },
    };
  },
  meta: {
    docs: {
      description: "Keep dynamic imports behind named lazy-loading boundaries.",
      recommended: true,
    },
    type: "problem",
  },
});
