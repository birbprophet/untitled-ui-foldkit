/* oxlint-disable effect/noSpread -- Storybook metadata and the shared controlled state are extended into static CSF exports. */
import { commandMenuUsers } from "ui/application";

import { componentMeta } from "../story.ts";
import { commandMenuActionStories } from "./command-menu-actions.story.ts";

export default {
  ...componentMeta("command-menu-users"),
  title: "Untitled UI/Application/Command Menu Users",
};

const stories = commandMenuActionStories(commandMenuUsers, "command-menu-users", {
  filter: "olivia",
  filteredName: /Olivia Rhye/u,
  selectionName: /Phoenix Baker/u,
});

export const AllVariants = { ...stories.AllVariants };
export const States = { ...stories.States };
export const Dark = { ...stories.Dark };
export const Interactions = { ...stories.Interactions };
