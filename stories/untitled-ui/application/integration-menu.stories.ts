/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { integrationMenu } from "../../../src/application.ts";

import { componentMeta, liveCommandStory, waitForStoryReady } from "../story.ts";

import { demoBrand } from "../../fixtures/brand.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const Args = S.Struct({ locale: Locale });
const Model = S.Struct({ isCopied: S.Boolean, isOpen: S.Boolean, locale: Locale });
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const Shown = m("IntegrationMenuShown");
const Closed = m("IntegrationMenuClosed");
const ShowFailed = m("IntegrationMenuShowFailed");
const CloseFailed = m("IntegrationMenuCloseFailed");
type Message =
  | Readonly<{ _tag: "Connect" | "Copy" | "Dismiss" | "Documentation" | "Open" }>
  | typeof Shown.Type
  | typeof Closed.Type
  | typeof ShowFailed.Type
  | typeof CloseFailed.Type;

const ShowIntegrationMenu = Command.define("ShowIntegrationMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: "[data-integration-menu-close]" }).pipe(
      Effect.match({ onFailure: () => ShowFailed(), onSuccess: () => Shown() }),
    ),
  messages: [Shown, ShowFailed],
});

const CloseIntegrationMenu = Command.define("CloseIntegrationMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => CloseFailed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed, CloseFailed],
});

const action = (tag: "Connect" | "Copy" | "Dismiss" | "Documentation" | "Open"): Message => ({
  _tag: tag,
});

const definitionWith = (copied: boolean, initiallyOpen = true) => ({
  Args,
  Model,
  init: (args: Args) =>
    [
      { isCopied: copied, isOpen: initiallyOpen, locale: args.locale } satisfies Model,
      initiallyOpen ? [ShowIntegrationMenu({ selector: "#integration-menu-story" })] : [],
    ] as const,
  update: (model: Model, message: Message) => {
    if (message._tag === "Copy") {
      return [{ ...model, isCopied: true }, []] as const;
    }
    if (message._tag === "Open") {
      return [
        { ...model, isOpen: true },
        [ShowIntegrationMenu({ selector: "#integration-menu-story" })],
      ] as const;
    }
    if (
      message._tag === "Connect" ||
      message._tag === "Dismiss" ||
      message._tag === "Documentation"
    ) {
      return [model, [CloseIntegrationMenu({ selector: "#integration-menu-story" })]] as const;
    }
    if (message._tag === "IntegrationMenuClosed") {
      return [{ ...model, isOpen: false }, []] as const;
    }
    if (message._tag === "IntegrationMenuShowFailed") {
      return [{ ...model, isOpen: false }, []] as const;
    }
    return [model, []] as const;
  },
  view: (model: Model, h: Parameters<typeof integrationMenu<Message>>[1]) =>
    integrationMenu(
      {
        brandMark: demoBrand().mark,
        copied: model.isCopied,
        id: "integration-menu-story",
        isOpen: model.isOpen,
        locale: model.locale,
        onConnect: action("Connect"),
        onCopy: action("Copy"),
        onDismiss: action("Dismiss"),
        onDocumentation: action("Documentation"),
      },
      h,
    ),
});

const defaultDefinition = definitionWith(false);
const copiedDefinition = definitionWith(true);
const interactiveDefinition = {
  ...definitionWith(false, false),
  view: (model: Model, h: Parameters<typeof integrationMenu<Message>>[1]) =>
    h.div(
      [h.Class("min-h-dvh bg-bg-primary")],
      [
        h.button(
          [
            h.Class(
              "fixed top-4 right-4 rounded-lg bg-bg-brand-solid px-3 py-2 text-sm font-semibold text-text-primary-on-brand outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
            ),
            h.DataAttribute("integration-menu-trigger", ""),
            h.OnClick(action("Open")),
            h.Type("button"),
          ],
          ["Open integration menu"],
        ),
        defaultDefinition.view(model, h),
      ],
    ),
};

export default {
  ...componentMeta("integration-menu"),
  argTypes: { locale: { control: "inline-radio", options: ["en-US", "pt-BR"] } },
  title: "Untitled UI/Application/Integration Menu",
};

export const AllVariants = {
  ...liveCommandStory(defaultDefinition),
  args: { locale: "en-US" },
};
export const States = { ...liveCommandStory(copiedDefinition), args: { locale: "en-US" } };
export const Dark = {
  ...liveCommandStory({
    ...defaultDefinition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [defaultDefinition.view(model, h)],
      ),
  }),
  args: { locale: "en-US" },
};
export const Responsive = {
  ...liveCommandStory(defaultDefinition),
  args: { locale: "en-US" },
};
export const Interactions = {
  ...liveCommandStory(interactiveDefinition),
  args: { locale: "en-US" },
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = await page.findByRole("button", { name: "Open integration menu" });
    await userEvent.click(trigger);
    const currentMenu = async () =>
      await page.findByRole("dialog", { name: "Slideout menu" }, { timeout: 15_000 });
    let menu = await currentMenu();
    await expect(within(menu).getByRole("button", { name: "Close" })).toHaveFocus();
    await expect(within(menu).getByText("Connect Siglata to Linear")).toBeVisible();
    await userEvent.tab({ shift: true });
    await expect(within(menu).getByRole("button", { name: "Connect" })).toHaveFocus();
    await userEvent.tab();
    await expect(within(menu).getByRole("button", { name: "Close" })).toHaveFocus();
    await userEvent.click(within(menu).getByRole("button", { name: "Copy" }));
    await waitFor(async () => {
      menu = await currentMenu();
      const copyButton = within(menu).getByRole("button", { name: "Copy" });
      await expect(copyButton.querySelector('[data-icon="check"]')).not.toBeNull();
    });
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(page.queryByRole("dialog", { name: "Slideout menu" })).toBeNull());
    await expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    menu = await currentMenu();
    const backdrop = canvasElement.ownerDocument.querySelector<HTMLButtonElement>(
      '[data-slideout-overlay="integration-menu-story"] > button',
    );
    await expect(backdrop).not.toBeNull();
    if (backdrop !== null) {
      await userEvent.click(backdrop);
    }
    await waitFor(() => expect(page.queryByRole("dialog", { name: "Slideout menu" })).toBeNull());
    await expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    menu = await currentMenu();
    await expect(within(menu).getByRole("button", { name: "Close" })).toHaveFocus();
    await expect(
      within(menu).getByRole("button", { name: "Copy" }).querySelector('[data-icon="check"]'),
    ).not.toBeNull();
  },
};
