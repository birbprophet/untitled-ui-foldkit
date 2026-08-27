// Vendored from oxlint-plugin-effect (0.5.1) — https://github.com/cevr/effect-oxlint
// MIT. Upstream ships no LICENSE file; the licence is declared in its package.json.
// Do not edit to change behaviour without a test that fails first: see ../README.md.
/** Ban ambient runtime capabilities that have direct Effect replacements. */
import type { Context, ESTree } from "@oxlint/plugins";
import { defineRule } from "@oxlint/plugins";
import { AST, Scope } from "../sdk.ts";
import * as Arr from "effect/Array";
import * as Option from "effect/Option";
import * as P from "effect/Predicate";

type MemberBan = readonly [object: string, properties: ReadonlySet<string>, alternative: string];

const memberBans: readonly MemberBan[] = [
  [
    "console",
    new Set(["debug", "error", "info", "log", "trace", "warn"]),
    "Effect logging or Console",
  ],
  ["Date", new Set(["now"]), "Clock or DateTime"],
  ["Math", new Set(["random"]), "Random"],
  ["performance", new Set(["now"]), "Clock.currentTimeNanos"],
  ["crypto", new Set(["getRandomValues", "randomUUID"]), "Crypto"],
  ["JSON", new Set(["parse", "stringify"]), "Schema JSON codecs"],
  [
    "process",
    new Set(["argv", "chdir", "env", "exit", "hrtime", "nextTick", "stderr", "stdin", "stdout"]),
    "Config, Stdio, Clock, or Effect scheduling",
  ],
  [
    "Bun",
    new Set([
      "$",
      "Glob",
      "connect",
      "env",
      "file",
      "listen",
      "nanoseconds",
      "randomUUIDv7",
      "redis",
      "serve",
      "sleep",
      "spawn",
      "spawnSync",
      "stderr",
      "stdin",
      "stdout",
      "write",
    ]),
    "the corresponding Effect platform service",
  ],
  [
    "Deno",
    new Set([
      "args",
      "env",
      "exit",
      "mkdir",
      "open",
      "readDir",
      "readFile",
      "readTextFile",
      "remove",
      "serve",
      "stat",
      "stderr",
      "stdin",
      "stdout",
      "writeFile",
      "writeTextFile",
    ]),
    "the corresponding Effect platform service",
  ],
  ["localStorage", new Set(["clear", "getItem", "key", "removeItem", "setItem"]), "KeyValueStore"],
  [
    "sessionStorage",
    new Set(["clear", "getItem", "key", "removeItem", "setItem"]),
    "KeyValueStore",
  ],
];

const callBans = new Map([
  ["atob", "Encoding.decodeBase64"],
  ["btoa", "Encoding.encodeBase64"],
  ["fetch", "HttpClient"],
  ["queueMicrotask", "Effect scheduling"],
  ["setImmediate", "Effect scheduling"],
  ["setInterval", "Effect.sleep with Schedule"],
  ["setTimeout", "Effect.sleep or Schedule"],
]);

const constructorBans = new Map([
  ["Date", "Clock or DateTime"],
  ["SharedWorker", "Effect Worker"],
  ["WebSocket", "Socket"],
  ["Worker", "Effect Worker"],
]);

const isUnshadowedGlobal = (context: Context, node: ESTree.Node, name: string): boolean =>
  Option.match(Scope.findVariableUp(context.sourceCode.getScope(node), name), {
    onNone: () => true,
    onSome: (variable) => Arr.isReadonlyArrayEmpty(variable.defs),
  });

/** `crypto.subtle`, written plainly — not `crypto[expr]`. */
const isCryptoSubtle = (node: ESTree.Node): boolean =>
  node.type === "MemberExpression" &&
  !node.computed &&
  node.object.type === "Identifier" &&
  node.object.name === "crypto" &&
  node.property.type === "Identifier" &&
  node.property.name === "subtle";

/**
 * `process.stdout`, `process.stderr` and `process.stdin` — the three the 0.5.1
 * exemption below covers.
 */
const processStreams: ReadonlySet<string> = new Set(["stderr", "stdin", "stdout"]);

/**
 * A read of `.isTTY` on the member being judged, exempted upstream in 0.5.1.
 *
 * `process.stdout.write` is a capability and belongs to a Stdio service. Reading
 * `process.stdout.isTTY` asks whether a terminal is attached, which is what a
 * program consults to decide whether to emit colour — and Effect supplies no
 * service that answers it.
 */
const isTtyRead = (node: ESTree.Node): boolean =>
  P.isNotNullish(node.parent) &&
  node.parent.type === "MemberExpression" &&
  !node.parent.computed &&
  node.parent.object === node &&
  node.parent.property.type === "Identifier" &&
  node.parent.property.name === "isTTY";

const isCryptoDigest = (node: ESTree.MemberExpression): boolean =>
  !node.computed &&
  node.property.type === "Identifier" &&
  node.property.name === "digest" &&
  isCryptoSubtle(node.object);

export const noGlobals = defineRule({
  create(context) {
    const report = (node: ESTree.Node, used: string, alternative: string) => {
      context.report({
        message: `Avoid ${used}. Use ${alternative}; platform adapters may disable this rule explicitly.`,
        node,
      });
    };

    return {
      CallExpression(call) {
        const name = Option.getOrUndefined(AST.calleeName(call));
        if (name === undefined || !isUnshadowedGlobal(context, call, name)) {
          return;
        }
        const alternative = callBans.get(name);
        if (alternative === undefined) {
          return;
        }
        report(call, `${name}()`, alternative);
      },
      MemberExpression(memberExpression) {
        if (
          isCryptoDigest(memberExpression) &&
          isUnshadowedGlobal(context, memberExpression, "crypto")
        ) {
          report(memberExpression, "crypto.subtle.digest", "Crypto.digest");
          return;
        }

        const names = AST.memberNames(memberExpression);
        if (Option.isNone(names)) {
          return;
        }
        const [object, property] = names.value;
        if (!isUnshadowedGlobal(context, memberExpression, object)) {
          return;
        }

        const ban = Arr.findFirst(
          memberBans,
          ([bannedObject, properties]) => object === bannedObject && properties.has(property),
        );
        if (Option.isNone(ban)) {
          return;
        }
        if (object === "process" && processStreams.has(property) && isTtyRead(memberExpression)) {
          return;
        }
        report(memberExpression, `${object}.${property}`, ban.value[2]);
      },
      NewExpression(expression) {
        if (expression.callee.type !== "Identifier") {
          return;
        }
        const { name } = expression.callee;
        if (!isUnshadowedGlobal(context, expression, name)) {
          return;
        }
        const alternative = constructorBans.get(name);
        if (alternative === undefined) {
          return;
        }
        report(expression, `new ${name}()`, alternative);
      },
    };
  },
  meta: {
    docs: {
      description: "Avoid ambient runtime capabilities that Effect provides as services.",
      recommended: true,
    },
    type: "problem",
  },
});
