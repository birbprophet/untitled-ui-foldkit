// Fixture for `effect/noTestLifecycleHooks`. Bans beforeAll/beforeEach/afterAll/
// afterEach. There is no filename guard — the rule fires wherever those names are
// called.
declare const beforeEach: (body: () => void) => void;
declare const afterAll: (body: () => void) => void;
declare const acquireFixture: (body: () => void) => void;

beforeEach(() => acquireFixture(() => {})); // EXPECT effect/noTestLifecycleHooks
afterAll(() => acquireFixture(() => {})); // EXPECT effect/noTestLifecycleHooks

// A setup call that is not one of the four hook names.
acquireFixture(() => {});
