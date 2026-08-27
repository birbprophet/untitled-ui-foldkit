// A widening canary: identifiers, import bindings, module specifiers, and
// property keys are not customer copy. Only the last line is prose the rule
// should judge.
import * as Effect from "effect/Effect";

const contentHash = "abc123";

const headers = {
  "x-content-hash": contentHash,
  "x-expected-hash": contentHash,
};

const computedHeaders = {
  [`x-content-hash`]: contentHash,
  [`x-expected-hash`]: contentHash,
};

declare const Href: (path: string) => unknown;
declare const literal: (path: string) => unknown;
declare const navClass: (route: string) => unknown;
declare const r: (route: string) => unknown;

const route = r("Workforce");
const segment = literal("workforce");
const className = navClass("Workforce");
const link = Href("/app/workforce");
const state = { _tag: "Workforce" };

const dynamicModule = import(`effect/Effect`);

void Effect.void;
void headers;
void computedHeaders;
void route;
void segment;
void className;
void link;
void state;
void dynamicModule;
void contentHash;

const customer = "Your monthly report is ready to send.";
const prohibited = "The file has been hashed.";
