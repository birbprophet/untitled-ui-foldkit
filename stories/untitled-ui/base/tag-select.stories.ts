/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook CSF and interaction functions use the browser promise API directly. */
import * as S from "effect/Schema";
import { tagSelect } from "../../../src/base.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

import { agentFace } from "../../fixtures/brand.ts";

const Args = S.Struct({ placeholder: S.String });
const Model = S.Struct({
  focusedId: S.String,
  inputValue: S.String,
  isOpen: S.Boolean,
  placeholder: S.String,
  selectedIds: S.Array(S.String),
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Closed" }>
  | Readonly<{ _tag: "Opened" }>
  | Readonly<{ _tag: "Focused"; id: string }>
  | Readonly<{ _tag: "Removed"; id: string }>
  | Readonly<{ _tag: "Selected"; id: string }>
  | Readonly<{ _tag: "InputChanged"; value: string }>;

const items = [
  { id: "olivia", label: "Olivia Rhye", supportingText: "@olivia" },
  { id: "phoenix", label: "Phoenix Baker", supportingText: "@phoenix" },
  { id: "lori", label: "Lori Bryson", supportingText: "@lori" },
] as const;
const messages = items.map((item) => ({
  ...item,
  avatarUrl: agentFace(item.label),
  onFocus: { _tag: "Focused", id: item.id } as const,
  onRemove: { _tag: "Removed", id: item.id } as const,
  onSelect: { _tag: "Selected", id: item.id } as const,
}));
const closed: Message = { _tag: "Closed" };
const opened: Message = { _tag: "Opened" };

const specimen = (
  model: Model,
  h: Parameters<typeof tagSelect<Message>>[1],
  options: Readonly<{
    isDisabled?: boolean;
    isInvalid?: boolean;
    isOpen?: boolean;
    name: string;
    size?: "sm" | "md" | "lg";
  }>,
) =>
  tagSelect(
    {
      focusedId: model.focusedId,
      hint: options.isInvalid === true ? "Choose at least one team member" : undefined,
      inputValue: model.inputValue,
      isDisabled: options.isDisabled,
      isInvalid: options.isInvalid,
      isOpen: options.isOpen ?? model.isOpen,
      isRequired: true,
      items: messages,
      label: "Team members",
      name: options.name,
      onClose: closed,
      onInput: (value): Message => ({ _tag: "InputChanged", value }),
      onOpen: opened,
      placeholder: model.placeholder,
      selectedIds: model.selectedIds,
      shortcut: true,
      size: options.size,
    },
    h,
  );

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({
    focusedId: "phoenix",
    inputValue: "",
    isOpen: false,
    placeholder: args.placeholder,
    selectedIds: ["olivia"],
  }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "Opened") {
      return { ...model, isOpen: true };
    }
    if (message._tag === "Closed") {
      return { ...model, isOpen: false };
    }
    if (message._tag === "InputChanged") {
      return { ...model, inputValue: message.value };
    }
    if (message._tag === "Focused") {
      return { ...model, focusedId: message.id };
    }
    if (message._tag === "Removed") {
      return { ...model, selectedIds: model.selectedIds.filter((id) => id !== message.id) };
    }
    return {
      ...model,
      inputValue: "",
      selectedIds: [...model.selectedIds, message.id],
    };
  },
  view: (model: Model, h: Parameters<typeof tagSelect<Message>>[1]) =>
    h.div([h.Class("w-120")], [specimen(model, h, { name: "interaction" })]),
} as const;

export default { ...componentMeta("tag-select"), title: "Untitled UI/Base/Tag Select" };

export const AllVariants = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix(
        [
          [
            "Sizes",
            (["sm", "md", "lg"] as const).map((size) =>
              h.div([h.Class("w-96")], [specimen(model, h, { name: `tag-select-${size}`, size })]),
            ),
          ],
        ],
        h,
      ),
  }),
  args: { placeholder: "Search" },
};

export const States = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix(
        [
          [
            "States",
            [
              h.div(
                [h.Class("w-96")],
                [specimen(model, h, { isInvalid: true, name: "tag-select-invalid" })],
              ),
              h.div(
                [h.Class("w-96")],
                [specimen(model, h, { isDisabled: true, name: "tag-select-disabled" })],
              ),
            ],
          ],
        ],
        h,
      ),
  }),
  args: { placeholder: "Search" },
};

export const Dark = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
        [h.div([h.Class("w-96")], [specimen(model, h, { name: "tag-select-dark" })])],
      ),
  }),
  args: { placeholder: "Search" },
};

export const Interactions = {
  ...liveStory(definition),
  args: { placeholder: "Search" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const combobox = await canvas.findByRole("combobox", { name: /Team members/u });
    await userEvent.click(combobox);
    await userEvent.type(combobox, "pho");
    await userEvent.click(await canvas.findByRole("option", { name: /Phoenix Baker/u }));
    const remove = await canvas.findByRole("button", { name: "Remove Phoenix Baker" });
    await expect(remove).toBeEnabled();
    await userEvent.click(remove);
    await waitFor(() =>
      expect(
        canvas.queryByRole("button", { name: "Remove Phoenix Baker" }),
      ).not.toBeInTheDocument(),
    );
  },
};
