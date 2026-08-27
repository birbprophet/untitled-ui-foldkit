/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Certified Storybook interactions and native slideout commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { profileMenu } from "ui/application";
import type { ProfileMenuExperience, ProfileMenuLocale } from "ui/application";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const Args = S.Struct({ locale: Locale });
const Model = S.Struct({ isOpen: S.Boolean, locale: Locale, tags: S.Array(S.String) });
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const Shown = m("ProfileMenuShown");
const ShowFailed = m("ProfileMenuShowFailed");
const Closed = m("ProfileMenuClosed");
const CloseFailed = m("ProfileMenuCloseFailed");
type Message =
  | Readonly<{ _tag: "AddTag" | "AddToProject" | "Dismiss" | "NewProject" | "Show" | "Studio" }>
  | typeof Shown.Type
  | typeof ShowFailed.Type
  | typeof Closed.Type
  | typeof CloseFailed.Type;

const ShowProfileMenu = Command.define("ShowProfileMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: "[data-profile-menu-close]" }).pipe(
      Effect.match({ onFailure: () => ShowFailed(), onSuccess: () => Shown() }),
    ),
  messages: [Shown, ShowFailed],
});
const CloseProfileMenu = Command.define("CloseProfileMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => CloseFailed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed, CloseFailed],
});
const action = (
  tag: "AddTag" | "AddToProject" | "Dismiss" | "NewProject" | "Show" | "Studio",
): Message => ({ _tag: tag });
const tagsFor = (locale: ProfileMenuLocale): readonly string[] =>
  locale === "pt-BR" ? ["Design", "Produto", "Design de UI"] : ["Design", "Product", "UI Design"];

const experiences = (locale: ProfileMenuLocale): readonly ProfileMenuExperience[] =>
  locale === "pt-BR"
    ? [
        {
          company: "Layers Studio™",
          companySeed: "layers-studio",
          dateRange: "mai. 2020 – presente",
          role: "Fundadora",
        },
        {
          company: "Sisyphus",
          companySeed: "sisyphus",
          dateRange: "jan. 2018 – mai. 2020",
          role: "Designer de UX",
        },
        {
          company: "Catalog",
          companySeed: "catalog",
          dateRange: "mar. 2017 – jan. 2018",
          role: "Designer visual",
        },
      ]
    : [
        {
          company: "Layers Studio™",
          companySeed: "layers-studio",
          dateRange: "May 2020 – Present",
          role: "Founder",
        },
        {
          company: "Sisyphus",
          companySeed: "sisyphus",
          dateRange: "Jan 2018 – May 2020",
          role: "UX Designer",
        },
        {
          company: "Catalog",
          companySeed: "catalog",
          dateRange: "Mar 2017 – Jan 2018",
          role: "Visual Designer",
        },
      ];

const makeDefinition = (initiallyOpen = true) => ({
  Args,
  Model,
  init: (args: Args) =>
    [
      {
        isOpen: initiallyOpen,
        locale: args.locale,
        tags: tagsFor(args.locale),
      } satisfies Model,
      initiallyOpen ? [ShowProfileMenu({ selector: "#profile-menu-story" })] : [],
    ] as const,
  update: (model: Model, message: Message) => {
    if (message._tag === "AddTag") {
      return [model, []] as const;
    }
    if (message._tag === "Dismiss") {
      return [model, [CloseProfileMenu({ selector: "#profile-menu-story" })]] as const;
    }
    if (message._tag === "Show") {
      return [
        { ...model, isOpen: true },
        [ShowProfileMenu({ selector: "#profile-menu-story" })],
      ] as const;
    }
    if (
      message._tag === "ProfileMenuClosed" ||
      message._tag === "ProfileMenuCloseFailed" ||
      message._tag === "ProfileMenuShowFailed"
    ) {
      return [{ ...model, isOpen: false }, []] as const;
    }
    return [model, []] as const;
  },
  view: (model: Model, h: Parameters<typeof profileMenu<Message>>[1]) =>
    h.div(
      [],
      [
        h.button(
          [
            h.AriaLabel(model.locale === "pt-BR" ? "Abrir menu de perfil" : "Open profile menu"),
            h.Class("fixed top-0 left-0 size-px opacity-0"),
            h.DataAttribute("profile-menu-opener", ""),
            h.OnClick(action("Show")),
            h.Type("button"),
          ],
          [model.locale === "pt-BR" ? "Abrir menu de perfil" : "Open profile menu"],
        ),
        profileMenu(
          {
            email: "olivia@siglata.com",
            experiences: experiences(model.locale),
            id: "profile-menu-story",
            isOpen: model.isOpen,
            locale: model.locale,
            location: model.locale === "pt-BR" ? "Melbourne, Austrália" : "Melbourne, Australia",
            name: "Olivia Rhye",
            onAddTag: action("AddTag"),
            onAddToProject: action("AddToProject"),
            onDismiss: action("Dismiss"),
            onNewProject: action("NewProject"),
            onStudio: action("Studio"),
            profileSeed: "olivia-rhye",
            tags: model.tags,
            website: "layers.studio",
          },
          h,
        ),
      ],
    ),
});

const definition = makeDefinition();
const enUs = { locale: "en-US" } satisfies Args;
export default {
  ...componentMeta("user-profile-menu"),
  argTypes: { locale: { control: "select", options: ["en-US", "pt-BR"] } },
  title: "Untitled UI/Application/User Profile Menu",
};
export const AllVariants = { ...liveCommandStory(definition), args: enUs };
export const States = { ...liveCommandStory(definition), args: enUs };
export const Dark = {
  ...liveCommandStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
      ),
  }),
  args: enUs,
};
export const Responsive = { ...liveCommandStory(definition), args: enUs };
export const Interactions = {
  ...liveCommandStory(makeDefinition(false)),
  args: enUs,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const opener = await page.findByRole(
      "button",
      { name: "Open profile menu" },
      { timeout: 15_000 },
    );
    await userEvent.click(opener);
    const dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    await waitFor(() =>
      expect(within(dialog).getByRole("button", { name: "Close slideout menu" })).toHaveFocus(),
    );
    await expect(within(dialog).getByText("Olivia Rhye")).toBeVisible();
    const addTag = within(dialog).getByRole("button", { name: "Add more" });
    await userEvent.click(addTag);
    await waitFor(() =>
      expect(within(dialog).getByRole("tooltip", { name: "Add more" })).toBeVisible(),
    );
    await userEvent.click(within(dialog).getByRole("button", { name: "Add to project" }));
    await expect(page.getByRole("dialog", { name: "Slideout menu" })).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(page.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(opener).toHaveFocus());

    await userEvent.click(opener);
    let reopened = await page.findByRole("dialog", { name: "Slideout menu" });
    await waitFor(() =>
      expect(within(reopened).getByRole("button", { name: "Close slideout menu" })).toHaveFocus(),
    );
    const backdrop = canvasElement.ownerDocument.querySelector<HTMLElement>(
      "[data-profile-menu-overlay] > button",
    );
    await expect(backdrop).not.toBeNull();
    if (backdrop !== null) {
      await userEvent.click(backdrop);
    }
    await waitFor(() => expect(page.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(opener).toHaveFocus());

    await userEvent.click(opener);
    reopened = await page.findByRole("dialog", { name: "Slideout menu" });
    await expect(within(reopened).getByText("Olivia Rhye")).toBeVisible();
    await waitFor(() =>
      expect(within(reopened).getByRole("button", { name: "Close slideout menu" })).toHaveFocus(),
    );
  },
};
