/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native slideout commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { filtersMenu } from "../../../src/application/filters-menu.ts";
import type {
  FiltersMenuRoleId,
  FiltersMenuSavedFilterId,
  FiltersMenuTeamId,
} from "../../../src/application/filters-menu.ts";

import { componentMeta, waitForStoryReady, liveCommandStory } from "../story.ts";

const Locale = S.Literals(["en-US", "pt-BR"]);
const SavedFilter = S.Literals([
  "product-designers",
  "backend-developers",
  "frontend-developers",
  "fullstack-developers",
  "product-managers",
  "qa-engineers",
]);
const Team = S.Literals([
  "design",
  "product-blue",
  "marketing",
  "management",
  "sales",
  "product-slate",
  "operations",
]);
const Role = S.Literals([
  "backend-developer",
  "frontend-developer",
  "fullstack-developer",
  "product-designer",
  "product-manager",
  "qa-engineer",
  "ux-copywriter",
  "ux-designer",
]);
const Args = S.Struct({ locale: Locale });
const Model = S.Struct({
  focusedRoleId: S.optional(Role),
  focusedSavedFilterId: S.optional(SavedFilter),
  isOpen: S.Boolean,
  isRoleSearchOpen: S.Boolean,
  isSavedFilterOpen: S.Boolean,
  locale: Locale,
  roleQuery: S.String,
  searchedRoleId: S.optional(Role),
  selectedRoleIds: S.Array(Role),
  selectedSavedFilterId: S.optional(SavedFilter),
  selectedTeamIds: S.Array(Team),
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;
const Shown = m("FiltersMenuShown");
const Closed = m("FiltersMenuClosed");
type Message =
  | Readonly<{ _tag: "Apply" | "Cancel" | "Dismiss" | "SaveFilter" | "ShowMore" }>
  | Readonly<{ _tag: "RoleFocus" | "RoleSearchSelect" | "RoleToggle"; id: FiltersMenuRoleId }>
  | Readonly<{ _tag: "RoleQuery"; query: string }>
  | Readonly<{ _tag: "RoleSearchOpen" | "SavedFilterOpen"; isOpen: boolean }>
  | Readonly<{ _tag: "SavedFilterFocus" | "SavedFilterSelect"; id: FiltersMenuSavedFilterId }>
  | Readonly<{ _tag: "TeamToggle"; id: FiltersMenuTeamId }>
  | typeof Shown.Type
  | typeof Closed.Type;

const ShowFiltersMenu = Command.define("ShowFiltersMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.showDialog(selector, { focusSelector: "[data-filters-menu-close]" }).pipe(
      Effect.match({ onFailure: () => Shown(), onSuccess: () => Shown() }),
    ),
  messages: [Shown],
});

const CloseFiltersMenu = Command.define("CloseFiltersMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => Closed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed],
});

const action = (tag: "Apply" | "Cancel" | "Dismiss" | "SaveFilter" | "ShowMore"): Message => ({
  _tag: tag,
});
const roleAction = (
  tag: "RoleFocus" | "RoleSearchSelect" | "RoleToggle",
  id: FiltersMenuRoleId,
): Message => ({ _tag: tag, id });
const savedAction = (
  tag: "SavedFilterFocus" | "SavedFilterSelect",
  id: FiltersMenuSavedFilterId,
): Message => ({ _tag: tag, id });
const teamToggle = (id: FiltersMenuTeamId): Message => ({ _tag: "TeamToggle", id });
const roleQuery = (query: string): Message => ({ _tag: "RoleQuery", query });
const roleSearchOpen = (isOpen: boolean): Message => ({ _tag: "RoleSearchOpen", isOpen });
const savedFilterOpen = (isOpen: boolean): Message => ({ _tag: "SavedFilterOpen", isOpen });

type FixtureState = "activated" | "inactive" | "partial";
const teamsByState: Readonly<Record<FixtureState, readonly FiltersMenuTeamId[]>> = {
  activated: ["design", "product-blue"],
  inactive: [],
  partial: ["design"],
};

const initial = (args: Args, state: FixtureState): Model => ({
  focusedRoleId: undefined,
  focusedSavedFilterId: undefined,
  isOpen: true,
  isRoleSearchOpen: false,
  isSavedFilterOpen: false,
  locale: args.locale,
  roleQuery: "",
  searchedRoleId: state === "activated" ? "qa-engineer" : undefined,
  selectedRoleIds: state === "activated" ? ["product-designer"] : [],
  selectedSavedFilterId: state === "activated" ? "product-designers" : undefined,
  selectedTeamIds: teamsByState[state],
});

const toggle = <Id extends string>(ids: readonly Id[], id: Id): readonly Id[] =>
  ids.includes(id) ? ids.filter((current) => current !== id) : [...ids, id];

const definitionWith = (state: FixtureState) => ({
  Args,
  Model,
  init: (args: Args) =>
    [initial(args, state), [ShowFiltersMenu({ selector: "#filters-menu-story" })]] as const,
  update: (model: Model, message: Message) => {
    if (message._tag === "RoleFocus") {
      return [{ ...model, focusedRoleId: message.id }, []] as const;
    }
    if (message._tag === "RoleQuery") {
      return [{ ...model, isRoleSearchOpen: true, roleQuery: message.query }, []] as const;
    }
    if (message._tag === "RoleSearchOpen") {
      return [{ ...model, isRoleSearchOpen: message.isOpen }, []] as const;
    }
    if (message._tag === "RoleSearchSelect") {
      return [
        { ...model, isRoleSearchOpen: false, roleQuery: "", searchedRoleId: message.id },
        [],
      ] as const;
    }
    if (message._tag === "RoleToggle") {
      return [
        { ...model, selectedRoleIds: toggle(model.selectedRoleIds, message.id) },
        [],
      ] as const;
    }
    if (message._tag === "SavedFilterFocus") {
      return [{ ...model, focusedSavedFilterId: message.id }, []] as const;
    }
    if (message._tag === "SavedFilterOpen") {
      return [{ ...model, isSavedFilterOpen: message.isOpen }, []] as const;
    }
    if (message._tag === "SavedFilterSelect") {
      return [
        { ...model, isSavedFilterOpen: false, selectedSavedFilterId: message.id },
        [],
      ] as const;
    }
    if (message._tag === "TeamToggle") {
      return [
        { ...model, selectedTeamIds: toggle(model.selectedTeamIds, message.id) },
        [],
      ] as const;
    }
    const next = {
      ...model,
      isOpen: message._tag === "FiltersMenuClosed" ? false : model.isOpen,
    } satisfies Model;
    return message._tag === "Apply" || message._tag === "Cancel" || message._tag === "Dismiss"
      ? ([next, [CloseFiltersMenu({ selector: "#filters-menu-story" })]] as const)
      : ([next, []] as const);
  },
  view: (model: Model, h: Parameters<typeof filtersMenu<Message>>[1]) =>
    filtersMenu(
      {
        focusedRoleId: model.focusedRoleId,
        focusedSavedFilterId: model.focusedSavedFilterId,
        id: "filters-menu-story",
        isOpen: model.isOpen,
        locale: model.locale,
        onApply: action("Apply"),
        onCancel: action("Cancel"),
        onDismiss: action("Dismiss"),
        onRoleFocus: (id) => roleAction("RoleFocus", id),
        onRoleQueryInput: roleQuery,
        onRoleSearchOpenChanged: roleSearchOpen,
        onRoleSearchSelect: (id) => roleAction("RoleSearchSelect", id),
        onRoleToggle: (id) => roleAction("RoleToggle", id),
        onSaveFilter: action("SaveFilter"),
        onSavedFilterFocus: (id) => savedAction("SavedFilterFocus", id),
        onSavedFilterOpenChanged: savedFilterOpen,
        onSavedFilterSelect: (id) => savedAction("SavedFilterSelect", id),
        onShowMore: action("ShowMore"),
        onTeamToggle: teamToggle,
        roleQuery: model.roleQuery,
        roleSearchOpen: model.isRoleSearchOpen,
        savedFilterOpen: model.isSavedFilterOpen,
        searchedRoleId: model.searchedRoleId,
        selectedRoleIds: model.selectedRoleIds,
        selectedSavedFilterId: model.selectedSavedFilterId,
        selectedTeamIds: model.selectedTeamIds,
      },
      h,
    ),
});

const definition = definitionWith("partial");
const activatedDefinition = definitionWith("activated");
const fixture = { locale: "en-US" } satisfies Args;
const meta = componentMeta("filters-menu");
export default {
  ...meta,
  argTypes: { locale: { control: "select", options: ["en-US", "pt-BR"] } },
  title: "Untitled UI/Application/Filters Menu",
};

export const AllVariants = { ...liveCommandStory(definition), args: fixture };
export const States = { ...liveCommandStory(definitionWith("inactive")), args: fixture };
export const Dark = {
  ...liveCommandStory({
    ...activatedDefinition,
    view: (model, h) =>
      h.div(
        [h.Class("fixed inset-0 bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [activatedDefinition.view(model, h)],
      ),
  }),
  args: fixture,
};
export const Responsive = { ...liveCommandStory(definition), args: fixture };
export const Interactions = {
  ...liveCommandStory(definitionWith("inactive")),
  args: fixture,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const currentDialog = () => page.findByRole("dialog", { name: "Slideout menu" });
    const currentSavedFilter = async () =>
      within(await currentDialog()).getByRole("button", { name: "Filters" });
    const currentCheckbox = async (name: string) =>
      await within(await currentDialog()).findByRole("checkbox", { name });
    const currentRoleSearch = async () =>
      await within(await currentDialog()).findByRole("combobox", { name: "Search" });

    await expect(await currentDialog()).toBeVisible();
    await expect(await currentDialog()).toHaveAttribute("dir", "ltr");
    await expect(await currentDialog()).toHaveAttribute("lang", "en-US");
    await expect(
      within(await currentDialog()).getByRole("button", { name: "Close" }),
    ).toHaveFocus();

    await userEvent.click(await currentSavedFilter());
    await userEvent.keyboard("{ArrowDown}");
    await expect(await page.findByRole("option", { name: "Product designers" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(async () => {
      await expect(await currentSavedFilter()).toHaveFocus();
      await expect(
        page.queryByRole("option", { name: "Product designers" }),
      ).not.toBeInTheDocument();
    });

    await userEvent.click(await currentSavedFilter());
    const savedOption = await page.findByRole("option", { name: "Product designers" });
    await expect(savedOption).toBeVisible();
    await userEvent.click(savedOption);
    await waitFor(async () => {
      await expect(await currentSavedFilter()).toHaveTextContent("Product designers");
    });

    await userEvent.click(await currentCheckbox("Design"));
    await waitFor(async () => {
      await expect(await currentCheckbox("Design")).toBeChecked();
    });
    const [productTeam] = within(await currentDialog()).getAllByRole("checkbox", {
      name: "Product",
    });
    if (productTeam !== undefined) {
      await userEvent.click(productTeam);
    }
    await waitFor(async () => {
      const [currentProductTeam] = within(await currentDialog()).getAllByRole("checkbox", {
        name: "Product",
      });
      await expect(currentProductTeam).toBeChecked();
    });
    await userEvent.click(await currentCheckbox("Product Designer"));
    await waitFor(async () => {
      await expect(await currentCheckbox("Product Designer")).toBeChecked();
    });

    const search = await currentRoleSearch();
    await userEvent.click(search);
    await userEvent.type(search, "QA");
    await userEvent.keyboard("{ArrowDown}");
    await expect(await page.findByRole("option", { name: "QA Engineer" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(async () => {
      await expect(await currentRoleSearch()).toHaveValue("QA Engineer");
    });

    await waitFor(async () => {
      await expect(await currentDialog()).toBeVisible();
      await expect(await currentSavedFilter()).toHaveTextContent("Product designers");
      await expect(await currentCheckbox("Design")).toBeChecked();
      const [currentProductTeam] = within(await currentDialog()).getAllByRole("checkbox", {
        name: "Product",
      });
      await expect(currentProductTeam).toBeChecked();
      await expect(await currentCheckbox("Product Designer")).toBeChecked();
      await expect(await currentRoleSearch()).toHaveValue("QA Engineer");
      await expect(page.queryByRole("option", { name: "QA Engineer" })).not.toBeInTheDocument();
    });
  },
};
