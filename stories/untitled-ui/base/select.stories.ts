/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-placeholder-implementation, effect/noAsyncFunction, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook CSF and native popover play functions stay direct. */
import * as S from "effect/Schema";
import { select } from "ui/base";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Args = S.Struct({ label: S.String });
const Model = S.Struct({
  focusedId: S.String,
  isOpen: S.Boolean,
  label: S.String,
  selectedId: S.String,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Focused" | "Selected"; id: string }>
  | Readonly<{ _tag: "OpenChanged"; isOpen: boolean }>;
const options = [
  { id: "olivia", label: "Olivia Rhye", supportingText: "@olivia" },
  { id: "phoenix", label: "Phoenix Baker", supportingText: "@phoenix" },
  { id: "lori", label: "Lori Bryson", supportingText: "@lori" },
] as const;
const items = options.map((option) => ({
  ...option,
  avatarSeed: option.id,
  onFocus: { _tag: "Focused", id: option.id } as const,
  onSelect: { _tag: "Selected", id: option.id } as const,
}));
const opened = (isOpen: boolean): Message => ({ _tag: "OpenChanged", isOpen });
const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({
    focusedId: "olivia",
    isOpen: false,
    label: args.label,
    selectedId: "",
  }),
  update: (model: Model, message: Message): Model =>
    message._tag === "OpenChanged"
      ? { ...model, isOpen: message.isOpen }
      : message._tag === "Focused"
        ? { ...model, focusedId: message.id }
        : { ...model, selectedId: message.id },
  view: (model: Model, h: Parameters<typeof select<Message>>[1]) =>
    h.div(
      [h.Class("w-[320px]")],
      [
        select(
          {
            items,
            label: model.label,
            name: "assignee",
            onOpenChanged: opened,
            placeholder: "Select a team member",
            selectedId: model.selectedId,
          },
          h,
        ),
      ],
    ),
} as const;

export default { ...componentMeta("select"), title: "Untitled UI/Base/Select" };
export const AllVariants = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("w-[320px]")],
        [
          matrix(
            [
              [
                "Sizes",
                (["sm", "md", "lg"] as const).map((size) =>
                  select(
                    {
                      items,
                      label: model.label,
                      name: `assignee-${size}`,
                      onOpenChanged: opened,
                      placeholder: "Select a team member",
                      selectedId: "olivia",
                      size,
                    },
                    h,
                  ),
                ),
              ],
            ],
            h,
          ),
        ],
      ),
  }),
  args: { label: "Team member" },
};
export const States = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("w-[320px]")],
        [
          matrix(
            [
              [
                "States",
                [
                  select(
                    {
                      isDisabled: true,
                      items,
                      label: model.label,
                      name: "disabled",
                      onOpenChanged: opened,
                      selectedId: "olivia",
                    },
                    h,
                  ),
                  select(
                    {
                      hint: "Choose a team member",
                      isInvalid: true,
                      items,
                      label: model.label,
                      name: "invalid",
                      onOpenChanged: opened,
                    },
                    h,
                  ),
                ],
              ],
            ],
            h,
          ),
        ],
      ),
  }),
  args: { label: "Team member" },
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
  args: { label: "Team member" },
};
export const Interactions = {
  ...liveStory(definition),
  args: { label: "Team member" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("button", { name: "Team member" }));
    const option = await canvas.findByRole("option", { name: /Phoenix Baker/u });
    await userEvent.click(option);
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Team member" })).toHaveTextContent(
        "Phoenix Baker",
      ),
    );
  },
};
