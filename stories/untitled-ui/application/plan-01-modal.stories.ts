/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { plan01Modal } from "../../../src/application.ts";
import type { Plan01 } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Plan = S.Literals(["basic", "business", "enterprise"]);
const Args = S.Struct({});
const Model = S.Struct({ isOpen: S.Boolean, selectedPlan: Plan });
type Model = typeof Model.Type;
const Shown = m("Plan01ModalShown");
const Closed = m("Plan01ModalClosed");
type Message =
  | Readonly<{ _tag: "Cancel" | "Confirm" | "Dismiss" }>
  | Readonly<{ _tag: "Select"; plan: Plan01 }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowPlan01Modal = Command.define("ShowPlan01Modal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: '[aria-label="Close dialog"]' }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const ClosePlan01Modal = Command.define("ClosePlan01Modal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (tag: "Cancel" | "Confirm" | "Dismiss"): Message => ({ _tag: tag });
const select = (plan: Plan01): Message => ({ _tag: "Select", plan });

const definition = {
  Args,
  Model,
  init: () =>
    [
      { isOpen: true, selectedPlan: "basic" } satisfies Model,
      [ShowPlan01Modal({ selector: "#plan-01-modal-story" })],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "Select") {
      return [{ ...model, selectedPlan: next.plan }, []] as const;
    }
    const updated = {
      ...model,
      isOpen: next._tag === "Plan01ModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Cancel" || next._tag === "Confirm" || next._tag === "Dismiss"
      ? ([updated, [ClosePlan01Modal({ selector: "#plan-01-modal-story" })]] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof plan01Modal<Message>>[1]) =>
    plan01Modal(
      {
        id: "plan-01-modal-story",
        isOpen: model.isOpen,
        onCancel: action("Cancel"),
        onConfirm: action("Confirm"),
        onDismiss: action("Dismiss"),
        onSelect: select,
        selectedPlan: model.selectedPlan,
      },
      h,
    ),
};

const meta = componentMeta("plan-01-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/Plan 01 Modal",
};
export const AllVariants = { ...liveCommandStory(definition), args: {} };
export const Dark = {
  ...liveCommandStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args: {},
};
export const Responsive = { ...liveCommandStory(definition), args: {} };
export const Interactions = {
  ...liveCommandStory(definition),
  args: {},
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    let dialog = await page.findByRole("dialog", { name: "Change your plan" });
    await userEvent.click(
      within(dialog).getByRole("radio", { name: /Business plan \$20\/month/u }),
    );
    dialog = await page.findByRole("dialog", { name: "Change your plan" });
    await expect(
      within(dialog).getByRole("radio", { name: /Business plan \$20\/month/u }),
    ).toBeChecked();
    await userEvent.click(within(dialog).getByRole("button", { name: "Confirm" }));
    await waitFor(() =>
      expect(canvasElement.ownerDocument.querySelector("#plan-01-modal-story")).toBeNull(),
    );
  },
};
