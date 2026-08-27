/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, mps/avoid-direct-tag-checks -- Storybook CSF and keyboard play functions stay direct. */
import * as S from "effect/Schema";
import { tags } from "ui/base";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({ label: S.String });
const Model = S.Struct({ focusedId: S.String, label: S.String, selectedId: S.String });
type Model = typeof Model.Type;
type Message = Readonly<{ _tag: "Focused" | "Selected" | "Removed"; id: string }>;
const items = (
  model: Model,
): readonly [
  {
    readonly id: "design";
    readonly label: string;
    readonly onFocus: Message;
    readonly onRemove: Message;
    readonly onSelect: Message;
    readonly isSelected: boolean;
    readonly avatarSeed: "design";
  },
  {
    readonly count: 12;
    readonly dot: true;
    readonly id: "engineering";
    readonly label: "Engineering";
    readonly onFocus: Message;
    readonly onSelect: Message;
    readonly isSelected: boolean;
  },
] => [
  {
    avatarSeed: "design",
    id: "design",
    isSelected: model.selectedId === "design",
    label: model.label,
    onFocus: { _tag: "Focused", id: "design" },
    onRemove: { _tag: "Removed", id: "design" },
    onSelect: { _tag: "Selected", id: "design" },
  },
  {
    count: 12,
    dot: true,
    id: "engineering",
    isSelected: model.selectedId === "engineering",
    label: "Engineering",
    onFocus: { _tag: "Focused", id: "engineering" },
    onSelect: { _tag: "Selected", id: "engineering" },
  },
];
const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({
    focusedId: "design",
    label: args.label,
    selectedId: "design",
  }),
  update: (model: Model, message: Message): Model =>
    message._tag === "Focused"
      ? { ...model, focusedId: message.id }
      : message._tag === "Selected"
        ? { ...model, selectedId: message.id }
        : { ...model, selectedId: "" },
  view: (model: Model, h: Parameters<typeof tags<Message>>[1]) =>
    tags(
      {
        ariaLabel: "Teams",
        focusedId: model.focusedId,
        items: items(model),
        selectionMode: "single",
      },
      h,
    ),
} as const;

export default { ...componentMeta("tags"), title: "Untitled UI/Base/Tags" };
export const AllVariants = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      matrix(
        [
          [
            "Sizes",
            (["sm", "md", "lg"] as const).map((size) =>
              tags(
                {
                  ariaLabel: `${size} tags`,
                  focusedId: model.focusedId,
                  items: items(model),
                  selectionMode: "multiple",
                  size,
                },
                h,
              ),
            ),
          ],
        ],
        h,
      ),
  }),
  args: { label: "Design" },
};
export const States = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      tags(
        {
          ariaLabel: "States",
          focusedId: model.focusedId,
          items: [
            ...items(model),
            {
              id: "disabled",
              isDisabled: true,
              label: "Disabled",
              onFocus: { _tag: "Focused", id: "disabled" },
              onSelect: { _tag: "Selected", id: "disabled" },
            },
          ],
          selectionMode: "multiple",
        },
        h,
      ),
  }),
  args: { label: "Design" },
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args: { label: "Design" },
};
export const Interactions = {
  ...liveStory(definition),
  args: { label: "Design" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const engineering = await canvas.findByRole("option", { name: /Engineering/u });
    await userEvent.click(engineering);
    await expect(await canvas.findByRole("option", { name: /Engineering/u })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    engineering.focus();
    await userEvent.keyboard("{ArrowLeft}");
    await expect(await canvas.findByRole("option", { name: /Design/u })).toHaveFocus();
  },
};
