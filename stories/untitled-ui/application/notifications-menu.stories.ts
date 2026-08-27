/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- The certification story exercises the controlled native slideout lifecycle. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { notificationsMenu, notificationsMenuFixture } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { agentFace } from "../../fixtures/brand.ts";
import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const faces = {
  "Ava Wright": agentFace("Ava Wright"),
  "Candice Wu": agentFace("Candice Wu"),
  "Demi Wilkinson": agentFace("Demi Wilkinson"),
  "Drew Cano": agentFace("Drew Cano"),
  "Eve Leroy": agentFace("Eve Leroy"),
  "Kate Morrison": agentFace("Kate Morrison"),
  "Koray Okumus": agentFace("Koray Okumus"),
  "Lana Steiner": agentFace("Lana Steiner"),
  "Natali Craig": agentFace("Natali Craig"),
  "Orlando Diggs": agentFace("Orlando Diggs"),
  "Phoenix Baker": agentFace("Phoenix Baker"),
} as const;

const Locale = S.Literals(["en-US", "pt-BR"]);
const Args = S.Struct({ locale: Locale });
const Model = S.Struct({ isOpen: S.Boolean, locale: Locale });
type Args = typeof Args.Type;
type Model = typeof Model.Type;

const Shown = m("NotificationsMenuShown");
const ShowFailed = m("NotificationsMenuShowFailed");
const Closed = m("NotificationsMenuClosed");
const CloseFailed = m("NotificationsMenuCloseFailed");
type Message =
  | Readonly<{ _tag: "Dismiss" | "Open" }>
  | typeof Shown.Type
  | typeof ShowFailed.Type
  | typeof Closed.Type
  | typeof CloseFailed.Type;

const dismiss: Message = { _tag: "Dismiss" };
const open: Message = { _tag: "Open" };

const ShowNotificationsMenu = Command.define("ShowNotificationsMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: "[data-notifications-menu-close]" }).pipe(
      Effect.tap(() =>
        Effect.sync(() => {
          const dialog = document.querySelector<HTMLDialogElement>(selector);
          if (dialog?.localName === "dialog") {
            dialog.style.left = "auto";
          }
        }),
      ),
      Effect.match({ onFailure: () => ShowFailed(), onSuccess: () => Shown() }),
    ),
  messages: [Shown, ShowFailed],
});

const CloseNotificationsMenu = Command.define("CloseNotificationsMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => CloseFailed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed, CloseFailed],
});

const definition = (showTrigger = false) => ({
  Args,
  Model,
  init: (args: Args) =>
    [
      { isOpen: !showTrigger, locale: args.locale } satisfies Model,
      showTrigger ? [] : [ShowNotificationsMenu({ selector: "#notifications-menu-story" })],
    ] as const,
  update: (model: Model, message: Message) => {
    if (message._tag === "Open") {
      return [
        { ...model, isOpen: true },
        [ShowNotificationsMenu({ selector: "#notifications-menu-story" })],
      ] as const;
    }
    if (message._tag === "Dismiss") {
      return [model, [CloseNotificationsMenu({ selector: "#notifications-menu-story" })]] as const;
    }
    if (
      message._tag === "NotificationsMenuClosed" ||
      message._tag === "NotificationsMenuCloseFailed" ||
      message._tag === "NotificationsMenuShowFailed"
    ) {
      return [{ ...model, isOpen: false }, []] as const;
    }
    return [model, []] as const;
  },
  view: (model: Model, h: Parameters<typeof notificationsMenu<Message>>[1]) =>
    h.div(
      [h.Class("min-h-24")],
      [
        ...(showTrigger
          ? [
              h.button(
                [
                  h.Class(
                    model.isOpen
                      ? "pointer-events-none opacity-0"
                      : "rounded-lg bg-brand-solid px-4 py-2.5 text-sm font-semibold text-white shadow-xs outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.DataAttribute("notifications-menu-trigger", ""),
                  h.OnClick(open),
                  h.Type("button"),
                ],
                ["Open notifications"],
              ),
            ]
          : []),
        notificationsMenu(
          {
            id: "notifications-menu-story",
            isOpen: model.isOpen,
            items: notificationsMenuFixture(model.locale, faces),
            locale: model.locale,
            onDismiss: dismiss,
          },
          h,
        ),
      ],
    ),
});

const enUs = { locale: "en-US" } satisfies Args;

export default {
  ...componentMeta("notifications-menu"),
  title: "Untitled UI/Application/Notifications Menu",
};

export const AllVariants = { ...liveCommandStory(definition()), args: enUs };
export const Dark = {
  ...liveCommandStory({
    ...definition(),
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition().view(model, h)],
      ),
  }),
  args: enUs,
};
export const Responsive = { ...liveCommandStory(definition()), args: enUs };
export const Interactions = {
  ...liveCommandStory(definition(true)),
  args: enUs,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = await page.findByRole("button", { name: "Open notifications" });
    await userEvent.click(trigger);
    const dialog = await page.findByRole("dialog", { name: "Slideout menu" });

    await expect(within(dialog).getByRole("button", { name: "Close slideout menu" })).toHaveFocus();
    await expect(within(dialog).getByRole("heading", { name: "Notifications" })).toBeVisible();
    await expect(within(dialog).getAllByRole("listitem")).toHaveLength(15);
    await expect(within(dialog).getByText("Tech requirements.pdf")).toBeVisible();

    await userEvent.tab();
    await expect(within(dialog).getByRole("link", { name: "Phoenix Baker" })).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(page.queryByRole("dialog", { name: "Slideout menu" })).toBeNull());
    await expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    await expect(await page.findByRole("dialog", { name: "Slideout menu" })).toBeVisible();
    const overlayDismiss = canvasElement.ownerDocument.querySelector<HTMLButtonElement>(
      '[data-slideout-overlay="notifications-menu-story"] > button',
    );
    await expect(overlayDismiss).not.toBeNull();
    if (overlayDismiss !== null) {
      await userEvent.click(overlayDismiss);
    }
    await waitFor(() => expect(page.queryByRole("dialog", { name: "Slideout menu" })).toBeNull());
    await expect(trigger).toHaveFocus();
    await waitFor(() => expect(trigger).not.toHaveClass("pointer-events-none"));

    await userEvent.click(trigger);
    await expect(await page.findByRole("dialog", { name: "Slideout menu" })).toBeVisible();
  },
};
