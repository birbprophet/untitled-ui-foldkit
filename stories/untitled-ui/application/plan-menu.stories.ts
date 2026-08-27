/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Pending Storybook interactions exercise the controlled native dialog and radio lifecycle. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { planMenu } from "../../../src/application/plan-menu.ts";
import type { PlanMenuPlan } from "../../../src/application/plan-menu.ts";

import { componentMeta, liveCommandStory, waitForStoryReady } from "../story.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const Plan = S.Literals(["basic", "business", "enterprise"]);
const Args = S.Struct({ locale: Locale, selectedPlan: Plan });
const Model = S.Struct({
  isOpen: S.Boolean,
  locale: Locale,
  selectedPlan: Plan,
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const Shown = m("PlanMenuShown");
const Closed = m("PlanMenuClosed");
type Message =
  | Readonly<{ _tag: "Cancel" | "Confirm" | "Dismiss" }>
  | Readonly<{ _tag: "PlanSelect"; plan: PlanMenuPlan }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowPlanMenu = Command.define("ShowPlanMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: "[data-plan-menu-close]" }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});

const ClosePlanMenu = Command.define("ClosePlanMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});

const action = (tag: "Cancel" | "Confirm" | "Dismiss"): Message => ({ _tag: tag });
const selectPlan = (plan: PlanMenuPlan): Message => ({ _tag: "PlanSelect", plan });

const definition = {
  Args,
  Model,
  init: (args: Args) =>
    [
      { isOpen: true, locale: args.locale, selectedPlan: args.selectedPlan } satisfies Model,
      [ShowPlanMenu({ selector: "#plan-menu-story" })],
    ] as const,
  update: (model: Model, message: Message) => {
    if (message._tag === "PlanSelect") {
      return [{ ...model, selectedPlan: message.plan }, []] as const;
    }
    const next = {
      ...model,
      isOpen: message._tag === "PlanMenuClosed" ? false : model.isOpen,
    } satisfies Model;
    return message._tag === "Cancel" || message._tag === "Confirm" || message._tag === "Dismiss"
      ? ([next, [ClosePlanMenu({ selector: "#plan-menu-story" })]] as const)
      : ([next, []] as const);
  },
  view: (model: Model, h: Parameters<typeof planMenu<Message>>[1]) =>
    planMenu(
      {
        id: "plan-menu-story",
        isOpen: model.isOpen,
        locale: model.locale,
        onCancel: action("Cancel"),
        onConfirm: action("Confirm"),
        onDismiss: action("Dismiss"),
        onPlanSelect: selectPlan,
        selectedPlan: model.selectedPlan,
      },
      h,
    ),
};

const fixture = { locale: "en-US", selectedPlan: "basic" } satisfies Args;
const business = { locale: "en-US", selectedPlan: "business" } satisfies Args;
const meta = componentMeta("plan-menu");
export default {
  ...meta,
  argTypes: {
    locale: { control: "select", options: ["en-US", "pt-BR"] },
    selectedPlan: { control: "select", options: ["basic", "business", "enterprise"] },
  },
  title: "Untitled UI/Application/Plan Menu",
};

export const AllVariants = { ...liveCommandStory(definition), args: fixture };
export const States = {
  ...liveCommandStory(definition),
  args: { locale: "en-US", selectedPlan: "enterprise" } satisfies Args,
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
  args: business,
};
export const Responsive = { ...liveCommandStory(definition), args: fixture };
export const Interactions = {
  ...liveCommandStory(definition),
  args: fixture,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const currentDialog = () => page.findByRole("dialog", { name: "Slideout menu" });
    const currentRadio = async (name: RegExp) =>
      await within(await currentDialog()).findByRole("radio", { name });

    await expect(await currentDialog()).toHaveAttribute("dir", "ltr");
    await expect(await currentDialog()).toHaveAttribute("lang", "en-US");
    await expect(
      within(await currentDialog()).getByRole("button", { name: "Close" }),
    ).toHaveFocus();

    const basicPlan = await currentRadio(/Basic plan/u);
    await expect(basicPlan).toBeChecked();
    await userEvent.click(basicPlan);
    await userEvent.keyboard("{ArrowDown}");
    await waitFor(async () => {
      await expect(await currentRadio(/Business plan/u)).toBeChecked();
      await expect(await currentRadio(/Business plan/u)).toHaveFocus();
    });
    await userEvent.click(await currentRadio(/Enterprise plan/u));
    await waitFor(async () => {
      await expect(await currentRadio(/Enterprise plan/u)).toBeChecked();
      await expect(await currentDialog()).toBeVisible();
    });
  },
};
