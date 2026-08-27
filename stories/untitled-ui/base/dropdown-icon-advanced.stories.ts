/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noSpread -- Storybook interaction functions use the browser promise API directly. */
import { dropdownIconAdvanced } from "ui/base";
import { expect, userEvent, within } from "storybook/test";

import { advancedDefinition } from "./dropdown-advanced-fixture.ts";
import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

export default {
  ...componentMeta("dropdown-icon-advanced"),
  title: "Untitled UI/Base/Dropdown Icon Advanced",
};

const closed = advancedDefinition(dropdownIconAdvanced, false);
const open = advancedDefinition(dropdownIconAdvanced, true);
export const AllVariants = {
  ...liveStory({
    ...closed.definition,
    view: (model, h) => matrix([["Trigger", [closed.specimen(model, h)]]], h),
  }),
  args: {},
};
export const States = {
  ...liveStory({
    ...open.definition,
    view: (model, h) => matrix([["Open", [open.specimen(model, h)]]], h),
  }),
  args: {},
};
export const Dark = {
  ...liveStory({
    ...closed.definition,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
        [closed.specimen(model, h)],
      ),
  }),
  args: {},
};
export const Interactions = {
  ...liveStory(closed.definition),
  args: {},
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("button", { name: "Open menu" }));
    const bookmarks = await canvas.findByRole("menuitemcheckbox", { name: "Show bookmarks" });
    await expect(bookmarks).toHaveAttribute("aria-checked", "true");
    await userEvent.click(await canvas.findByRole("menuitem", { name: "More tools" }));
    await userEvent.click(await canvas.findByRole("menuitem", { name: "Developer" }));
    await userEvent.click(await canvas.findByRole("menuitem", { name: "Developer tools" }));
  },
};
