/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noSpread -- Storybook CSF and play functions use the browser promise API directly. */
import * as S from "effect/Schema";
import { buttonGroup } from "../../../src/base.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({ label: S.String });
const Model = S.Struct({ label: S.String, selectedId: S.String });
type Model = typeof Model.Type;
type Message = Readonly<{ _tag: "Selected"; id: string }>;
const selected = (id: string): Message => ({ _tag: "Selected", id });
const items = [
  { id: "day", label: "Day", message: selected("day") },
  { id: "week", label: "Week", message: selected("week") },
  { id: "month", label: "Month", message: selected("month") },
] as const;
const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, selectedId: "week" }),
  update: (model: Model, message: Message): Model => ({ ...model, selectedId: message.id }),
  view: (model: Model, h: Parameters<typeof buttonGroup<Message>>[1]) =>
    buttonGroup({ items, label: model.label, selectedId: model.selectedId }, h),
} as const;

export default { ...componentMeta("button-group"), title: "Untitled UI/Base/Button Group" };

export const AllVariants = {
  ...liveStory({
    ...definition,
    update: (model) => model,
    view: (model, h) =>
      matrix(
        [
          [
            "Sizes",
            (["sm", "md", "lg"] as const).map((size) =>
              buttonGroup({ items, label: `${size} ${model.label}`, selectedId: "week", size }, h),
            ),
          ],
        ],
        h,
      ),
  }),
  args: { label: "View" },
};

export const States = {
  ...liveStory({
    ...definition,
    update: (model) => model,
    view: (model, h) =>
      matrix(
        [
          [
            "States",
            [
              buttonGroup(
                {
                  items: items.map((item) => ({
                    ...item,
                    isDisabled: item.id === "month",
                  })),
                  label: model.label,
                  selectedId: "week",
                },
                h,
              ),
            ],
          ],
        ],
        h,
      ),
  }),
  args: { label: "Views" },
};

export const Dark = {
  ...liveStory({
    ...definition,
    update: (model) => model,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
        [buttonGroup({ items, label: model.label, selectedId: "week" }, h)],
      ),
  }),
  args: { label: "Views" },
};

export const Interactions = {
  ...liveStory(definition),
  args: { label: "Views" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const month = await within(canvasElement).findByRole("button", { name: "Month" });
    await userEvent.click(month);
    await waitFor(() => expect(month).toHaveAttribute("aria-pressed", "true"));
    const day = await within(canvasElement).findByRole("button", { name: "Day" });
    day.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(day).toHaveAttribute("aria-pressed", "true"));
  },
};
