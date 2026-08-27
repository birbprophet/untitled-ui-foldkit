// Fixture for `effect/noDynamicImports`. Bans an inline `import()` that is not
// bound to a named lazy-loading boundary.
export const joiner = import("node:path").then((mod) => mod.join); // EXPECT effect/noDynamicImports

// A named lazy loader is the allowed shape.
export const loadPath = () => import("node:path");
