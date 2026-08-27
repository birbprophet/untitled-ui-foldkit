/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook CSF and interaction functions use the browser promise API directly. */
import * as S from "effect/Schema";
import { combobox } from "../../../src/base.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

import { agentFace } from "../../fixtures/brand.ts";

const Args = S.Struct({ placeholder: S.String });
const Model = S.Struct({
  focusedId: S.String,
  inputValue: S.String,
  isOpen: S.Boolean,
  placeholder: S.String,
  selectedId: S.String,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Closed" | "Opened" }>
  | Readonly<{ _tag: "Focused" | "Selected"; id: string }>
  | Readonly<{ _tag: "InputChanged"; value: string }>;

const people = [
  { id: "olivia", label: "Olivia Rhye", supportingText: "@olivia" },
  { id: "phoenix", label: "Phoenix Baker", supportingText: "@phoenix" },
  { id: "lori", label: "Lori Bryson", supportingText: "@lori" },
] as const;
const items = people.map((option) => ({
  ...option,
  avatarUrl: agentFace(option.label),
  onFocus: { _tag: "Focused", id: option.id } as const,
  onSelect: { _tag: "Selected", id: option.id } as const,
}));
const closed: Message = { _tag: "Closed" };
const opened: Message = { _tag: "Opened" };

const specimen = (
  model: Model,
  h: Parameters<typeof combobox<Message>>[1],
  configuration: Readonly<{
    isDisabled?: boolean;
    isInvalid?: boolean;
    name: string;
    size?: "sm" | "md" | "lg";
  }>,
) =>
  combobox(
    {
      focusedId: model.focusedId,
      hint: configuration.isInvalid === true ? "Choose a team member" : undefined,
      inputValue: model.inputValue,
      isDisabled: configuration.isDisabled,
      isInvalid: configuration.isInvalid,
      isOpen: model.isOpen,
      isRequired: true,
      items,
      label: "Team member",
      name: configuration.name,
      onClose: closed,
      onInput: (value): Message => ({ _tag: "InputChanged", value }),
      onOpen: opened,
      placeholder: model.placeholder,
      selectedId: model.selectedId,
      shortcut: true,
      size: configuration.size,
    },
    h,
  );

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({
    focusedId: "olivia",
    inputValue: "",
    isOpen: false,
    placeholder: args.placeholder,
    selectedId: "olivia",
  }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "Opened") {
      return { ...model, isOpen: true };
    }
    if (message._tag === "Closed") {
      return { ...model, isOpen: false };
    }
    if (message._tag === "InputChanged") {
      return { ...model, inputValue: message.value, selectedId: "" };
    }
    if (message._tag === "Focused") {
      return { ...model, focusedId: message.id };
    }
    if (message._tag === "Selected") {
      return { ...model, inputValue: "", isOpen: false, selectedId: message.id };
    }
    return model;
  },
  view: (model: Model, h: Parameters<typeof combobox<Message>>[1]) =>
    h.div([h.Class("w-80")], [specimen(model, h, { name: "interaction" })]),
} as const;

export default { ...componentMeta("combobox"), title: "Untitled UI/Base/Combobox" };

export const AllVariants = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      h.div(
        [h.Class("w-80")],
        [
          matrix(
            [
              [
                "Sizes",
                (["sm", "md", "lg"] as const).map((size) =>
                  specimen(model, h, { name: `combobox-${size}`, size }),
                ),
              ],
            ],
            h,
          ),
        ],
      ),
  }),
  args: { placeholder: "Search" },
};

export const States = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      h.div(
        [h.Class("w-80")],
        [
          matrix(
            [
              [
                "States",
                [
                  specimen(model, h, { isDisabled: true, name: "combobox-disabled" }),
                  specimen(model, h, { isInvalid: true, name: "combobox-invalid" }),
                ],
              ],
            ],
            h,
          ),
        ],
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
        [h.div([h.Class("w-80")], [specimen(model, h, { name: "combobox-dark" })])],
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
    const input = await canvas.findByRole("combobox", { name: /Team member/u });
    await userEvent.click(input);
    await userEvent.clear(input);
    await userEvent.type(input, "pho");
    await userEvent.click(await canvas.findByRole("option", { name: /Phoenix Baker/u }));
    await waitFor(() => expect(input.parentElement).toHaveTextContent("Phoenix Baker"));
  },
};
