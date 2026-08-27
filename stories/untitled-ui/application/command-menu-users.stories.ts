/* oxlint-disable effect/noSpread -- Storybook metadata and the shared controlled state are extended into static CSF exports. */
import { agentFace } from "../../fixtures/brand.ts";
import { commandMenuUsers } from "../../../src/application.ts";

import { componentMeta } from "../story.ts";
import { commandMenuActionStories } from "./command-menu-actions.story.ts";

const avatars = {
  "user-01": agentFace("Phoenix Baker"),
  "user-02": agentFace("Olivia Rhye"),
  "user-03": agentFace("Lana Steiner"),
  "user-04": agentFace("Demi Wilkinson"),
  "user-05": agentFace("Candice Wu"),
  "user-06": agentFace("Natali Craig"),
  "user-07": agentFace("Drew Cano"),
  "user-08": agentFace("Kari Rasmussen"),
} as const;

export default {
  ...componentMeta("command-menu-users"),
  title: "Untitled UI/Application/Command Menu Users",
};

const stories = commandMenuActionStories(
  (props, h) => commandMenuUsers({ ...props, avatars }, h),
  "command-menu-users",
  {
    filter: "olivia",
    filteredName: /Olivia Rhye/u,
    selectionName: /Phoenix Baker/u,
  },
);

export const AllVariants = { ...stories.AllVariants };
export const States = { ...stories.States };
export const Dark = { ...stories.Dark };
export const Interactions = { ...stories.Interactions };
