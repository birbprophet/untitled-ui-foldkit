// Fixture for `effect/noEffectSucceedString`. Bans `Effect.succeed` of a string,
// which is a sentinel rather than a domain value.
import * as Effect from "effect/Effect";

export const sentinel = Effect.succeed("ready"); // EXPECT effect/noEffectSucceedString

// Also a string sentinel, but the rule only inspects `Literal` nodes, so this
// template literal is missed today.
export const templated = Effect.succeed(`ready`); // EXPECT effect/noEffectSucceedString

// A non-string value is fine.
export const counted = Effect.succeed(1);
