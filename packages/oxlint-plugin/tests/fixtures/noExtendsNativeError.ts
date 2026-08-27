// Fixture for `effect/noExtendsNativeError`. Bans extending a native error class.
export class ParseFailure extends Error {} // EXPECT effect/noExtendsNativeError

// The same ban in expression position. The rule registers `ClassDeclaration`
// only, so this one is missed today.
export const LoadFailure = class extends Error {}; // EXPECT effect/noExtendsNativeError

// Extending a domain class, not a native error.
export class SchemaFailure extends ParseFailure {}
