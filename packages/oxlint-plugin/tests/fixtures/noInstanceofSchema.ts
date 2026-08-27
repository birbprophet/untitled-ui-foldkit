// Fixture for `effect/noInstanceofSchema`. Scoped by its docs to `instanceof`
// against Schema-derived classes: use `Schema.is` or a `_tag` check instead.
//
// Audited OVER-FIRING — the implementation reports every `instanceof`, so the
// plain-JavaScript negative below is reported too and this fixture FAILS until
// the rule is narrowed to Schema classes.
import * as Schema from "effect/Schema";

declare const value: unknown;

class Person extends Schema.Class<Person>("Person")({ name: Schema.String }) {}

export const isPerson = value instanceof Person; // EXPECT effect/noInstanceofSchema

// Not a Schema class: narrowing a caught value against a native error type is
// the only way to tell what it is, and no Schema exists to ask instead.
export const describe = (error: unknown): string =>
  error instanceof TypeError ? "type error" : "other";
