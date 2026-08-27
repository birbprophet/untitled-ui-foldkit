/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-await-in-loop, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/imperative-loops -- The pending certification story exercises a controlled combobox and native dialog lifecycle. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  teamMembersMenu,
  teamMembersMenuFixture,
} from "../../../src/application/team-members-menu.ts";

import { agentFace } from "../../fixtures/brand.ts";
import { componentMeta, liveCommandStory, waitForStoryReady } from "../story.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const Args = S.Struct({ locale: Locale });
const Model = S.Struct({
  focusedMemberId: S.optional(S.String),
  isOpen: S.Boolean,
  isSearchOpen: S.Boolean,
  lastEmailedMemberId: S.optional(S.String),
  locale: Locale,
  searchQuery: S.String,
  selectedMemberId: S.optional(S.String),
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;

const Shown = m("TeamMembersMenuShown");
const ShowFailed = m("TeamMembersMenuShowFailed");
const Closed = m("TeamMembersMenuClosed");
const CloseFailed = m("TeamMembersMenuCloseFailed");
type Message =
  | Readonly<{
      _tag: "Cancel" | "Confirm" | "Dismiss" | "Open" | "SaveFilter" | "SearchClose" | "SearchOpen";
    }>
  | Readonly<{ _tag: "EmailMember" | "MemberFocus" | "MemberSelect"; memberId: string }>
  | Readonly<{ _tag: "SearchInput"; value: string }>
  | typeof Shown.Type
  | typeof ShowFailed.Type
  | typeof Closed.Type
  | typeof CloseFailed.Type;

const action = (
  tag: "Cancel" | "Confirm" | "Dismiss" | "Open" | "SaveFilter" | "SearchClose" | "SearchOpen",
): Message => ({ _tag: tag });
const memberAction = (
  tag: "EmailMember" | "MemberFocus" | "MemberSelect",
  memberId: string,
): Message => ({ _tag: tag, memberId });
const searchInput = (searchQuery: string): Message => ({
  _tag: "SearchInput",
  value: searchQuery,
});

const ShowTeamMembersMenu = Command.define("ShowTeamMembersMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: "[data-team-members-menu-close]" }).pipe(
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

const CloseTeamMembersMenu = Command.define("CloseTeamMembersMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => CloseFailed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed, CloseFailed],
});

type Fixture = "source" | "states" | "trigger";

const definition = (fixture: Fixture) => ({
  Args,
  Model,
  init: (args: Args) => {
    const isOpen = fixture !== "trigger";
    return [
      {
        ...(fixture === "states" ? { focusedMemberId: "olivia-rhye" } : {}),
        isOpen,
        isSearchOpen: fixture === "states",
        locale: args.locale,
        searchQuery: fixture === "states" ? "Olivia" : "",
      } satisfies Model,
      isOpen ? [ShowTeamMembersMenu({ selector: "#team-members-menu-story" })] : [],
    ] as const;
  },
  update: (model: Model, message: Message) => {
    if (message._tag === "Open") {
      return [
        { ...model, isOpen: true },
        [ShowTeamMembersMenu({ selector: "#team-members-menu-story" })],
      ] as const;
    }
    if (message._tag === "SearchOpen") {
      return [{ ...model, isSearchOpen: true }, []] as const;
    }
    if (message._tag === "SearchClose") {
      return [{ ...model, isSearchOpen: false }, []] as const;
    }
    if (message._tag === "SearchInput") {
      return [
        { ...model, focusedMemberId: undefined, isSearchOpen: true, searchQuery: message.value },
        [],
      ] as const;
    }
    if (message._tag === "MemberFocus") {
      return [{ ...model, focusedMemberId: message.memberId }, []] as const;
    }
    if (message._tag === "MemberSelect") {
      const selected = teamMembersMenuFixture(model.locale).find(
        (member) => member.id === message.memberId,
      );
      return [
        {
          ...model,
          focusedMemberId: message.memberId,
          isSearchOpen: false,
          searchQuery: selected === undefined ? model.searchQuery : "",
          selectedMemberId: message.memberId,
        },
        [],
      ] as const;
    }
    if (message._tag === "EmailMember") {
      return [{ ...model, lastEmailedMemberId: message.memberId }, []] as const;
    }
    if (message._tag === "TeamMembersMenuClosed") {
      return [{ ...model, isOpen: false, isSearchOpen: false }, []] as const;
    }
    if (
      message._tag === "TeamMembersMenuCloseFailed" ||
      message._tag === "TeamMembersMenuShowFailed"
    ) {
      return [{ ...model, isOpen: false, isSearchOpen: false }, []] as const;
    }
    if (message._tag === "Cancel" || message._tag === "Confirm" || message._tag === "Dismiss") {
      return [model, [CloseTeamMembersMenu({ selector: "#team-members-menu-story" })]] as const;
    }
    return [model, []] as const;
  },
  view: (model: Model, h: Parameters<typeof teamMembersMenu<Message>>[1]) =>
    h.div(
      [h.Class("min-h-24")],
      [
        ...(fixture === "trigger"
          ? [
              h.button(
                [
                  h.Class(
                    model.isOpen
                      ? "pointer-events-none opacity-0"
                      : "rounded-lg bg-bg-brand-solid px-4 py-2.5 text-sm font-semibold text-white shadow-xs outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.OnClick(action("Open")),
                  h.Type("button"),
                ],
                [model.locale === "pt-BR" ? "Abrir membros da equipe" : "Open team members"],
              ),
            ]
          : []),
        teamMembersMenu(
          {
            avatars: {
              "andi-lane": agentFace("Andi Lane"),
              "candice-wu": agentFace("Candice Wu"),
              "demi-wilkinson": agentFace("Demi Wilkinson"),
              "drew-cano": agentFace("Drew Cano"),
              "kate-morrison": agentFace("Kate Morrison"),
              "kelly-williams": agentFace("Kelly Wiliams"),
              "lana-steiner": agentFace("Lana Steiner"),
              "natali-craig": agentFace("Natali Craig"),
              "olivia-rhye": agentFace("Olivia Rhye"),
              "orlando-diggs": agentFace("Orlando Diggs"),
              "phoenix-baker": agentFace("Phoenix Baker"),
            },
            ...(model.focusedMemberId === undefined
              ? {}
              : { focusedMemberId: model.focusedMemberId }),
            id: "team-members-menu-story",
            isOpen: model.isOpen,
            isSearchOpen: model.isSearchOpen,
            locale: model.locale,
            members: teamMembersMenuFixture(model.locale),
            onCancel: action("Cancel"),
            onConfirm: action("Confirm"),
            onDismiss: action("Dismiss"),
            onEmailMember: (memberId) => memberAction("EmailMember", memberId),
            onMemberFocus: (memberId) => memberAction("MemberFocus", memberId),
            onMemberSelect: (memberId) => memberAction("MemberSelect", memberId),
            onSaveFilter: action("SaveFilter"),
            onSearchClose: action("SearchClose"),
            onSearchInput: searchInput,
            onSearchOpen: action("SearchOpen"),
            searchQuery: model.searchQuery,
            ...(model.selectedMemberId === undefined
              ? {}
              : { selectedMemberId: model.selectedMemberId }),
          },
          h,
        ),
      ],
    ),
});

const source = definition("source");
const enUs = { locale: "en-US" } satisfies Args;

export default {
  ...componentMeta("team-members-menu"),
  argTypes: { locale: { control: "inline-radio", options: ["en-US", "pt-BR"] } },
  title: "Untitled UI/Application/Team Members Menu",
};

export const AllVariants = { ...liveCommandStory(source), args: enUs };
export const States = { ...liveCommandStory(definition("states")), args: enUs };
export const Dark = {
  ...liveCommandStory({
    ...source,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [source.view(model, h)],
      ),
  }),
  args: enUs,
};
export const Responsive = { ...liveCommandStory(source), args: enUs };
export const Interactions = {
  ...liveCommandStory(definition("trigger")),
  args: enUs,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    let trigger = await page.findByRole("button", { name: "Open team members" });
    const existingDialog = page.queryByRole("dialog", { name: "Slideout menu" });
    if (existingDialog !== null) {
      await userEvent.click(within(existingDialog).getByRole("button", { name: "Close" }));
    }
    await waitFor(() => expect(page.queryByRole("dialog", { name: "Slideout menu" })).toBeNull());
    trigger = await page.findByRole("button", { name: "Open team members" });
    await waitFor(() => expect(trigger).not.toHaveClass("pointer-events-none"));
    await userEvent.click(trigger);
    let dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    await expect(within(dialog).getByRole("button", { name: "Close" })).toHaveFocus();
    await expect(within(dialog).getAllByRole("listitem")).toHaveLength(11);

    await userEvent.tab();
    await expect(within(dialog).getByRole("combobox", { name: "Search" })).toHaveFocus();
    for (const character of "Olivia") {
      dialog = await page.findByRole("dialog", { name: "Slideout menu" });
      await userEvent.type(within(dialog).getByRole("combobox", { name: "Search" }), character);
    }
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    await expect(within(dialog).getByRole("combobox", { name: "Search" })).toHaveValue("Olivia");
    await expect(within(dialog).getByRole("option", { name: "Olivia Rhye" })).toBeVisible();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await waitFor(() =>
      expect(
        within(page.getByRole("dialog", { name: "Slideout menu" })).getByRole("combobox", {
          name: "Search",
        }),
      ).toHaveValue(""),
    );
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    const selectedSearch = within(dialog).getByRole("combobox", { name: "Search" });
    await expect(
      within(selectedSearch.parentElement?.parentElement ?? dialog).getByText("Olivia Rhye"),
    ).toBeVisible();

    const email = within(dialog).getByRole("button", { name: "Email Olivia Rhye" });
    await userEvent.click(email);
    await expect(
      within(await page.findByRole("dialog", { name: "Slideout menu" })).getByRole("button", {
        name: "Email Olivia Rhye",
      }),
    ).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(page.queryByRole("dialog", { name: "Slideout menu" })).toBeNull());
    trigger = await page.findByRole("button", { name: "Open team members" });
    await expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    const backdrop = canvasElement.ownerDocument.querySelector<HTMLElement>(
      "[data-team-members-menu-backdrop]",
    );
    await expect(backdrop).not.toBeNull();
    if (backdrop !== null) {
      await userEvent.click(backdrop);
    }
    await waitFor(() => expect(page.queryByRole("dialog", { name: "Slideout menu" })).toBeNull());
    trigger = await page.findByRole("button", { name: "Open team members" });
    await expect(trigger).toHaveFocus();

    await userEvent.click(trigger);
    dialog = await page.findByRole("dialog", { name: "Slideout menu" });
    await expect(within(dialog).getByRole("combobox", { name: "Search" })).toHaveValue("");
    const persistedSearch = within(dialog).getByRole("combobox", { name: "Search" });
    await expect(
      within(persistedSearch.parentElement?.parentElement ?? dialog).getByText("Olivia Rhye"),
    ).toBeVisible();
    await expect(within(dialog).getByText("Product Designer")).toBeVisible();
  },
};
