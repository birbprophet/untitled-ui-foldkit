import type { InlineConfig } from "vite";
import type { StorybookConfig } from "@storybook/html-vite";
import { foldkit } from "@foldkit/vite-plugin";
import tailwindcss from "@tailwindcss/vite";

const withStorybookVite = function withStorybookVite(viteConfig: InlineConfig): InlineConfig {
  viteConfig.plugins?.push(tailwindcss());
  viteConfig.plugins?.push(foldkit());
  return viteConfig;
};

const config: StorybookConfig = {
  core: { disableTelemetry: true },
  framework: "@storybook/html-vite",
  stories: ["../stories/untitled-ui/**/*.stories.ts"],
  viteFinal: withStorybookVite,
};

export default config;
