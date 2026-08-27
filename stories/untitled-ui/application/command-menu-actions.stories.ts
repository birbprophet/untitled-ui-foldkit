/* oxlint-disable effect/noSpread -- Storybook component metadata is extended with the exact authenticated title. */
import { commandMenuActions } from "ui/application";

import { componentMeta } from "../story.ts";
import { commandMenuActionStories } from "./command-menu-actions.story.ts";

export default {
  ...componentMeta("command-menu-actions"),
  title: "Untitled UI/Application/Command Menu Actions",
};

const stories = commandMenuActionStories(commandMenuActions, "command-menu-actions");

export const AllVariants = { ...stories.AllVariants };
export const States = { ...stories.States };
export const Dark = { ...stories.Dark };
export const Interactions = { ...stories.Interactions };
