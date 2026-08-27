/* oxlint-disable effect/noSpread -- Static CSF exports extend the exact controlled preview-menu fixture. */
import { commandMenuUsersMenuStacked } from "../../../src/application.ts";

import { componentMeta } from "../story.ts";
import { commandMenuPreviewStories } from "./command-menu-preview.story.ts";

export default {
  ...componentMeta("command-menu-users-menu-stacked"),
  title: "Untitled UI/Application/Command Menu Users Menu Stacked",
};

const stories = commandMenuPreviewStories(
  commandMenuUsersMenuStacked,
  "command-menu-users-menu-stacked",
);

export const AllVariants = { ...stories.AllVariants };
export const States = { ...stories.States };
export const Dark = { ...stories.Dark };
export const Interactions = { ...stories.Interactions };
