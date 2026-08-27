// Fixture for `effect/noEffectTypeAlias`. Bans a type alias whose right-hand side
// mentions `Effect.Effect`.
import type * as Effect from "effect/Effect";

export type Loaded = Effect.Effect<string>; // EXPECT effect/noEffectTypeAlias

// The same ban, one level down. The rule's recursion reads `typeParameters` and
// never visits type-literal members, so both of these are missed today.
export type Boxed = ReadonlyArray<Effect.Effect<string>>; // EXPECT effect/noEffectTypeAlias
export type Holder = { readonly run: Effect.Effect<string> }; // EXPECT effect/noEffectTypeAlias

// No Effect anywhere in the alias.
export type Plain = { readonly name: string };
