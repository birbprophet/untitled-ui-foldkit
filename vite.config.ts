import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    overrides: [
      {
        files: ["src/catalog.ts"],
        rules: { "@rikalabs/no-placeholder-implementation": "off" },
      },
      {
        files: ["tests/catalog.test.ts"],
        rules: {
          "effect/noGlobals": "off",
          "mps/avoid-direct-json": "off",
          "mps/avoid-sync-fs": "off",
          "mps/casting-awareness": "off",
          "mps/use-filesystem-service": "off",
          "typescript/no-unsafe-type-assertion": "off",
        },
      },
    ],
  },
});
