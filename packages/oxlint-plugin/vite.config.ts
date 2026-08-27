import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {},
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  /**
   * ⚠️ THE SCRATCH DIRECTORY IS NOT AN INPUT, AND UNTRACKED IT MADE THIS THE ONE
   * TASK THAT NEVER CACHED. `rule-behaviour.test.ts` writes a config per rule
   * into `node_modules/.cache/rule-behaviour` — it has to be inside the tree,
   * because the plugin specifier resolves relative to the config file and a
   * config in the system temp directory cannot see the workspace at all.
   *
   * Vite Task tracked those writes as the task modifying its own input, so every
   * run reported `oxlint-plugin#test not cached because it modified its input`
   * and the workspace sat at 15/16 rather than 16/16. That is the exact
   * condition `github-actions-cache.md` says to fix BEFORE restoring a cache
   * across runs: a task that misses locally will miss in CI, and the restore
   * only adds transfer time to a result nobody reuses.
   *
   * Excluded from both sides, because it is neither: not an input the result
   * depends on, and not an output worth restoring.
   */
  run: {
    tasks: {
      test: {
        command: "vp test",
        input: [{ auto: true }, "!../../node_modules/.cache/rule-behaviour/**"],
        output: [{ auto: true }, "!../../node_modules/.cache/rule-behaviour/**"],
      },
    },
  },
  test: {
    // `rule-behaviour.test.ts` spawns the real oxlint binary once per rule — 67
    // processes, each loading the JS plugin. Vitest's 5s default is sized for
    // in-process unit tests, and under parallel load these lose the race and
    // report a timeout where nothing is wrong. That is worse than slow: a
    // behaviour suite that goes red for unrelated reasons is one people learn to
    // re-run rather than read, which is exactly how the dead rules survived.
    testTimeout: 60_000,
  },
});
