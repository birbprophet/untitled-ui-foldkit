// Fixture for `effect/noTryCatch`. Bans every try statement, catch or finally.
import * as Effect from "effect/Effect";

declare const parse: () => number;

export const guarded = () => {
  try { // EXPECT effect/noTryCatch
    return parse();
  } catch {
    return 0;
  }
};

// The Effect-shaped equivalent, which carries no try statement.
export const lifted = Effect.try(parse);
