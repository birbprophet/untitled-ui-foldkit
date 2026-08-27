// Fixture for `effect/noSwitchStatement`. Bans every `switch` statement.
declare const tag: "a" | "b";

export const label = (): string => {
  switch (tag) { // EXPECT effect/noSwitchStatement
    case "a":
      return "first";
    default:
      return "second";
  }
};

// Branching that is not a switch.
export const other = (): string => (tag === "a" ? "first" : "second");
