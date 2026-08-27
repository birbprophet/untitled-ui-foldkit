/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { taggedStruct as m } from "foldkit/schema";
import { integrationModal } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const permissions = [
  {
    long: "Access basic company information and details",
    short: "Access basic company information",
  },
  {
    long: "Access and edit bug reports and create new issues",
    short: "Edit bug reports and create new issues",
  },
  {
    long: "Change issue status and assignee of issues",
    short: "Change issue status and assignee",
  },
  {
    long: "Open and resolve Intercom conversations",
    short: "Open and resolve Intercom conversations",
  },
  {
    long: "Add or remove users and change user roles",
    short: "Add or remove users and change roles",
  },
] as const;
/** Stable demo identity slot: png-free inline SVG rounded square a host swaps for its own mark. */
const demoMark =
  "data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2048%2048'%3E%3Crect%20width%3D'48'%20height%3D'48'%20rx%3D'12'%20fill%3D'%23C7CEDA'%2F%3E%3C%2Fsvg%3E";
const demoMarkAlt = "Product logo";

const Args = S.Struct({});
const Model = S.Struct({ isCopied: S.Boolean, isOpen: S.Boolean });
type Model = typeof Model.Type;
const Shown = m("IntegrationModalShown");
const Closed = m("IntegrationModalClosed");
type Message =
  | Readonly<{ _tag: "Connect" | "Copy" | "Dismiss" | "Documentation" }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowIntegrationModal = Command.define("ShowIntegrationModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});
const CloseIntegrationModal = Command.define("CloseIntegrationModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});
const action = (tag: "Connect" | "Copy" | "Dismiss" | "Documentation"): Message => ({
  _tag: tag,
});

/* Third-party artwork stays inline per the story identity doctrine: URL data stand-in, no upstream fetches. */
const linearIcon = (): string => {
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>" +
    "<rect width='48' height='48' rx='10' fill='#0B7D74'/>" +
    "<path d='M13 29c7-7 17-11 22-12' stroke='#FFFFFF' stroke-width='3' stroke-linecap='round' fill='none'/>" +
    "<path d='M15 35l18-18' stroke='#FFFFFF' stroke-width='3' stroke-linecap='round' opacity='.6' fill='none'/>" +
    "</svg>";
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const definition = {
  Args,
  Model,
  init: () =>
    [
      { isCopied: false, isOpen: true },
      [ShowIntegrationModal({ selector: "#integration-modal-story" })],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "Copy") {
      return [{ ...model, isCopied: true }, []] as const;
    }
    const updated = {
      ...model,
      isOpen: next._tag === "IntegrationModalClosed" ? false : model.isOpen,
    };
    return next._tag === "Connect" || next._tag === "Dismiss" || next._tag === "Documentation"
      ? ([updated, [CloseIntegrationModal({ selector: "#integration-modal-story" })]] as const)
      : ([updated, []] as const);
  },
  view: (model: Model, h: Parameters<typeof integrationModal<Message>>[1]) =>
    integrationModal(
      {
        copied: model.isCopied,
        description:
          "Prioritize work based on customer needs and build a tighter feedback loop with customers.",
        id: "integration-modal-story",
        integrationIconUrl: linearIcon(),
        integrationName: "Linear",
        isOpen: model.isOpen,
        linkUrl: "siglata.com/integrations/linear",
        onConnect: action("Connect"),
        onCopy: action("Copy"),
        onDismiss: action("Dismiss"),
        onDocumentation: action("Documentation"),
        permissions,
        wordmarkAlt: demoMarkAlt,
        wordmarkSrc: demoMark,
      },
      h,
    ),
};

const meta = componentMeta("integration-modal");
export default {
  ...meta,
  parameters: { ...meta.parameters, controls: { disable: true } },
  title: "Untitled UI/Application/Integration Modal",
};
export const AllVariants = { ...liveCommandStory(definition), args: {} };
export const States = {
  ...liveCommandStory({
    ...definition,
    init: () =>
      [
        { isCopied: true, isOpen: true },
        [ShowIntegrationModal({ selector: "#integration-modal-story" })],
      ] as const,
  }),
  args: {},
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
  args: {},
};
export const Responsive = { ...liveCommandStory(definition), args: {} };
export const Interactions = {
  ...liveCommandStory(definition),
  args: {},
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement.ownerDocument.body);
    const dialog = await canvas.findByRole("dialog", { name: "Connect Siglata to Linear" });
    await userEvent.click(within(dialog).getByRole("button", { name: "Copy" }));
    await expect(within(dialog).getByRole("button", { name: "Copied" })).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(canvasElement.ownerDocument.querySelector("#integration-modal-story")).toBeNull(),
    );
  },
};
