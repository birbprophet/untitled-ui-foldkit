/* oxlint-disable effect/noSpread -- Static CSF exports extend the exact controlled integration-menu fixture. */
import { commandMenuIntegrationsMenu } from "ui/application";

import { componentMeta } from "../story.ts";
import { commandMenuIntegrationsPreviewStories } from "./command-menu-integrations-preview.story.ts";

export default {
  ...componentMeta("command-menu-integrations-menu"),
  title: "Untitled UI/Application/Command Menu Integrations Menu",
};

const stories = commandMenuIntegrationsPreviewStories(
  commandMenuIntegrationsMenu,
  "command-menu-integrations-menu",
);

export const AllVariants = { ...stories.AllVariants };
export const States = { ...stories.States };
export const Dark = { ...stories.Dark };
export const Interactions = { ...stories.Interactions };
