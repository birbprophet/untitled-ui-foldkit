// Fixture for `effect/noGlobals`. Bans ambient runtime capabilities that Effect
// supplies as services — the clock, randomness, logging, the network.
declare const seed: number;

export const roll = Math.random(); // EXPECT effect/noGlobals
export const stamp = new Date(); // EXPECT effect/noGlobals
export const shout = (message: string): void => console.log(message); // EXPECT effect/noGlobals

export const write = (line: string): void => process.stdout.write(line); // EXPECT effect/noGlobals

// Same objects, properties that are pure computation rather than a capability.
export const largest = Math.max(seed, 1);
export const parsed = Date.parse("2026-07-30");

// Exempted upstream in 0.5.1: reading `.isTTY` asks whether a terminal is
// attached, which no Effect service answers. The stream itself stays banned.
export const coloured = process.stdout.isTTY;
export const errorsColoured = process.stderr.isTTY;
export const interactive = process.stdin.isTTY;
