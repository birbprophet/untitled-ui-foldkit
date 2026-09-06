import type { Preview } from "@storybook/html-vite";

import "./preview.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "Untitled light",
      values: [
        { name: "Untitled light", value: "#ffffff" },
        { name: "Untitled dark", value: "#0c0e12" },
      ],
    },
    layout: "centered",
  },
};

export default preview;
