/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { userSelectionModal } from "ui/application";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const Args = S.Struct({ count: S.Finite, locale: Locale });
const Model = S.Struct({ count: S.Finite, isOpen: S.Boolean, locale: Locale });
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const Shown = m("UserSelectionModalShown");
const Closed = m("UserSelectionModalClosed");
type Message =
  | Readonly<{ _tag: "Cancel" | "Decrease" | "Dismiss" | "Increase" | "Purchase" }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowUserSelectionModal = Command.define("ShowUserSelectionModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: "[autofocus]" }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseUserSelectionModal = Command.define("CloseUserSelectionModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (tag: "Cancel" | "Decrease" | "Dismiss" | "Increase" | "Purchase"): Message => ({
  _tag: tag,
});

const definition = {
  Args,
  Model,
  init: (args: Args) =>
    [
      { count: args.count, isOpen: true, locale: args.locale } satisfies Model,
      [ShowUserSelectionModal({ selector: "#user-selection-modal-story" })],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "Decrease") {
      return [{ ...model, count: Math.max(model.count - 1, 1) }, []] as const;
    }
    if (next._tag === "Increase") {
      return [{ ...model, count: Math.min(model.count + 1, 100) }, []] as const;
    }
    const updated = {
      ...model,
      isOpen: next._tag === "UserSelectionModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Cancel" || next._tag === "Dismiss" || next._tag === "Purchase"
      ? ([updated, [CloseUserSelectionModal({ selector: "#user-selection-modal-story" })]] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof userSelectionModal<Message>>[1]) =>
    userSelectionModal(
      {
        count: model.count,
        id: "user-selection-modal-story",
        isOpen: model.isOpen,
        locale: model.locale,
        onCancel: action("Cancel"),
        onDecrease: action("Decrease"),
        onDismiss: action("Dismiss"),
        onIncrease: action("Increase"),
        onPurchase: action("Purchase"),
      },
      h,
    ),
};

const fixture = { count: 32, locale: "en-US" } satisfies Args;
const meta = componentMeta("user-selection-modal");
export default {
  ...meta,
  argTypes: { locale: { control: "select", options: ["en-US", "pt-BR"] } },
  title: "Untitled UI/Application/User Selection Modal",
};
export const AllVariants = { ...liveCommandStory(definition), args: fixture };
export const States = {
  ...liveCommandStory(definition),
  args: { count: 1, locale: "pt-BR" } satisfies Args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    let dialog = await page.findByRole("dialog", { name: "Comprar assentos" });
    await userEvent.click(within(dialog).getAllByRole("button", { name: "Diminuir" })[0]);
    dialog = await page.findByRole("dialog", { name: "Comprar assentos" });
    await expect(within(dialog).getByRole("heading", { name: "1" })).toBeVisible();
    await expect(within(dialog).getAllByText("US$ 10")).toHaveLength(2);
  },
};
export const Dark = {
  ...liveCommandStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args: fixture,
};
export const Responsive = {
  ...liveCommandStory(definition),
  args: { count: 32, locale: "pt-BR" } satisfies Args,
};
export const Interactions = {
  ...liveCommandStory(definition),
  args: { count: 99, locale: "en-US" } satisfies Args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    let dialog = await page.findByRole("dialog", { name: "Purchase seats" });
    await expect(within(dialog).getByRole("button", { name: "Close" })).toHaveFocus();
    await expect(within(dialog).getByRole("heading", { name: "99" })).toBeVisible();
    await expect(within(dialog).getByText("$990")).toBeVisible();

    await userEvent.click(within(dialog).getAllByRole("button", { name: "Increase" })[0]);
    dialog = await page.findByRole("dialog", { name: "Purchase seats" });
    await expect(within(dialog).getByRole("heading", { name: "100" })).toBeVisible();
    await expect(within(dialog).getByText("$1000")).toBeVisible();

    await userEvent.click(within(dialog).getAllByRole("button", { name: "Increase" })[0]);
    dialog = await page.findByRole("dialog", { name: "Purchase seats" });
    await expect(within(dialog).getByRole("heading", { name: "100" })).toBeVisible();
    await expect(within(dialog).getByText("$1000")).toBeVisible();
  },
};
