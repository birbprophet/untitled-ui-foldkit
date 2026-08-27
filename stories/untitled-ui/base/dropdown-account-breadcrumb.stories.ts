/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions use the browser promise API directly. */
import * as S from "effect/Schema";
import { dropdownAccountBreadcrumb } from "ui/base";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const AccountId = S.Literals(["caitlyn", "sienna"]);
const Args = S.Struct({});
const Model = S.Struct({
  focusedAccountId: S.String,
  isOpen: S.Boolean,
  selectedAccountId: AccountId,
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Closed" }>
  | Readonly<{ _tag: "Toggled" }>
  | Readonly<{ _tag: "Focused"; id: string }>
  | Readonly<{ _tag: "Selected"; id: typeof AccountId.Type }>;

const specimen = (model: Model, h: Parameters<typeof dropdownAccountBreadcrumb<Message>>[1]) =>
  dropdownAccountBreadcrumb(
    {
      focusedAccountId: model.focusedAccountId,
      isOpen: model.isOpen,
      onClose: { _tag: "Closed" },
      onFocus: (id): Message => ({ _tag: "Focused", id }),
      onSelect: (id): Message => ({ _tag: "Selected", id }),
      onToggle: { _tag: "Toggled" },
      selectedAccountId: model.selectedAccountId,
    },
    h,
  );

const definition = (initiallyOpen: boolean) => ({
  Args,
  Model,
  init: (_args: typeof Args.Type): Model => ({
    focusedAccountId: "caitlyn",
    isOpen: initiallyOpen,
    selectedAccountId: "caitlyn",
  }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "Toggled") {
      return { ...model, isOpen: !model.isOpen };
    }
    if (message._tag === "Closed") {
      return { ...model, isOpen: false };
    }
    if (message._tag === "Focused") {
      return { ...model, focusedAccountId: message.id };
    }
    return { ...model, isOpen: false, selectedAccountId: message.id };
  },
  view: (model: Model, h: Parameters<typeof dropdownAccountBreadcrumb<Message>>[1]) =>
    h.div([h.Class("min-h-[24rem]")], [specimen(model, h)]),
});

export default {
  ...componentMeta("dropdown-account-breadcrumb"),
  title: "Untitled UI/Base/Dropdown Account Breadcrumb",
};

export const AllVariants = {
  ...liveStory({
    ...definition(false),
    view: (model, h) => matrix([["Account", [specimen(model, h)]]], h),
  }),
  args: {},
};
export const States = {
  ...liveStory({
    ...definition(true),
    view: (model, h) => matrix([["Open", [specimen(model, h)]]], h),
  }),
  args: {},
};
export const Dark = {
  ...liveStory({
    ...definition(false),
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
        [specimen(model, h)],
      ),
  }),
  args: {},
};
export const Interactions = {
  ...liveStory(definition(false)),
  args: {},
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("button", { name: "Caitlyn King" }));
    await userEvent.click(await canvas.findByRole("menuitemradio", { name: /Sienna Hewitt/u }));
    await expect(await canvas.findByRole("button", { name: "Sienna Hewitt" })).toBeInTheDocument();
  },
};
