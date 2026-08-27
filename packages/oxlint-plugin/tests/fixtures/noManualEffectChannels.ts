// Fixture for `effect/noManualEffectChannels`. Audited DEAD — this fixture is
// expected to FAIL until the rule is fixed, which is the point of writing it now.
import * as Effect from "effect/Effect";

export const annotated: Effect.Effect<string, never, never> = Effect.succeed("x"); // EXPECT effect/noManualEffectChannels

// Inferred, which is what the rule is asking for.
export const inferred = Effect.succeed("x");

// An interface member and a type alias state a type rather than having one
// inferred, so there is nothing to drop — the rule's advice cannot be followed
// here and it must stay silent.
export interface Port {
  readonly get: (key: string) => Effect.Effect<string, Error>;
}

export type Query = (key: string) => Effect.Effect<string, Error>;
