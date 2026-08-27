// Fixture for `effect/noIfStatement`. Bans the `if` statement outright — a
// branch is data, matched with Option/Either/Match, not a control-flow keyword.
declare const flag: boolean;

export const chosen = (): number => {
  if (flag) { // EXPECT effect/noIfStatement
    return 1;
  }
  return 0;
};

// A conditional expression is not a statement, and neither is a boolean guard.
export const inline = flag ? 1 : 0;
export const guarded = flag && 1;
