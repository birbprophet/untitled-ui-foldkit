// Fixture for `effect/noNodeBuiltinImport`. Bans importing a Node builtin that
// Effect already replaces with a service — the filesystem, paths, HTTP, timers.
import * as fs from "node:fs"; // EXPECT effect/noNodeBuiltinImport
import { randomUUID } from "node:crypto"; // EXPECT effect/noNodeBuiltinImport
import * as os from "node:os";

// `node:os` has no Effect replacement, so importing it is not this rule's
// business; only the two above are.
export const capabilities = { fs, os, randomUUID };
