/* oxlint-disable effect/noSpread -- Static CSF exports extend the exact controlled stacked integration-menu fixture. */
import { commandMenuIntegrationsMenuStacked } from "ui/application";

import { componentMeta } from "../story.ts";
import { commandMenuIntegrationsPreviewStories } from "./command-menu-integrations-preview.story.ts";

export default {
  ...componentMeta("command-menu-integrations-menu-stacked"),
  title: "Untitled UI/Application/Command Menu Integrations Menu Stacked",
};

const stories = commandMenuIntegrationsPreviewStories(
  commandMenuIntegrationsMenuStacked,
  "command-menu-integrations-menu-stacked",
);

export const AllVariants = { ...stories.AllVariants };
export const States = { ...stories.States };
export const Dark = { ...stories.Dark };
export const Interactions = { ...stories.Interactions };
