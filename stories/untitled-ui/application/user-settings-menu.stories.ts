/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Certification interactions and native slideout commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { userSettingsMenu } from "../../../src/application/user-settings-menu.ts";
import type {
  UserSettingsMenuCountry,
  UserSettingsMenuField,
} from "../../../src/application/user-settings-menu.ts";

import { componentMeta, liveCommandStory, waitForStoryReady } from "../story.ts";
import { agentFace } from "../../fixtures/brand.ts";

const countries: readonly UserSettingsMenuCountry[] = [
  {
    flagUrl: "https://www.untitledui.com/images/flags/AU.svg",
    id: "AU",
    label: "Australia",
    labelPtBr: "Austrália",
  },
  {
    flagUrl: "https://www.untitledui.com/images/flags/AT.svg",
    id: "AT",
    label: "Austria",
    labelPtBr: "Áustria",
  },
  {
    flagUrl: "https://www.untitledui.com/images/flags/BR.svg",
    id: "BR",
    label: "Brazil",
    labelPtBr: "Brasil",
  },
];

const Locale = S.Literals(["en-US", "pt-BR"]);
const Args = S.Struct({ locale: Locale });
const Model = S.Struct({
  email: S.String,
  firstName: S.String,
  focusedCountryId: S.String,
  isCountryOpen: S.Boolean,
  isOpen: S.Boolean,
  lastName: S.String,
  locale: Locale,
  selectedCountryId: S.String,
  shouldReopen: S.Boolean,
  username: S.String,
});
type Args = typeof Args.Type;
type Model = typeof Model.Type;
type FixtureState = "inactive" | "partial";
const Shown = m("UserSettingsMenuShown");
const ShowFailed = m("UserSettingsMenuShowFailed");
const Closed = m("UserSettingsMenuClosed");
const CloseFailed = m("UserSettingsMenuCloseFailed");
const Released = m("UserSettingsMenuReleased");
const Reopen = m("UserSettingsMenuReopen");
type Message =
  | Readonly<{ _tag: "Archive" | "Cancel" | "Dismiss" | "Edit" | "Open" | "Save" | "Unmount" }>
  | Readonly<{ _tag: "CountryFocus" | "CountrySelect"; countryId: string }>
  | Readonly<{ _tag: "CountryOpenChanged"; isOpen: boolean }>
  | Readonly<{ _tag: "FieldInput"; field: UserSettingsMenuField; value: string }>
  | typeof Shown.Type
  | typeof ShowFailed.Type
  | typeof Closed.Type
  | typeof CloseFailed.Type
  | typeof Released.Type
  | typeof Reopen.Type;

const ShowUserSettingsMenu = Command.define("ShowUserSettingsMenu", {
  args: { selector: S.String, triggerSelector: S.String },
  execute: ({ selector, triggerSelector }) =>
    Effect.gen(function* execute() {
      yield* Dom.focus(triggerSelector);
      yield* Dom.showDialog(selector, { focusSelector: "[data-user-settings-menu-close]" });
      yield* Dom.lockScroll;
      yield* Dom.inertOthers("user-settings-menu-story", [selector]);
    }).pipe(Effect.match({ onFailure: () => ShowFailed(), onSuccess: () => Shown() })),
  messages: [Shown, ShowFailed],
});
const CloseUserSettingsMenu = Command.define("CloseUserSettingsMenu", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Effect.gen(function* close() {
      yield* Dom.restoreInert("user-settings-menu-story");
      yield* Dom.closeDialog(selector);
      yield* Dom.unlockScroll;
    }).pipe(
      Effect.matchEffect({
        onFailure: () =>
          Effect.all(
            [
              Dom.releaseDialogResources("user-settings-menu-story"),
              Dom.restoreInert("user-settings-menu-story"),
              Dom.unlockScroll,
            ],
            { concurrency: 1 },
          ).pipe(Effect.map(() => CloseFailed())),
        onSuccess: () => Effect.succeed(Closed()),
      }),
    ),
  messages: [Closed, CloseFailed],
});
const ReleaseUserSettingsMenu = Command.define("ReleaseUserSettingsMenu", {
  args: { id: S.String },
  execute: ({ id }) =>
    Effect.all([Dom.releaseDialogResources(id), Dom.restoreInert(id), Dom.unlockScroll], {
      concurrency: 1,
    }).pipe(Effect.map(() => Released())),
  messages: [Released],
});
const ReopenUserSettingsMenu = Command.define("ReopenUserSettingsMenu", {
  args: { id: S.String },
  execute: () => Effect.sleep("700 millis").pipe(Effect.map(() => Reopen())),
  messages: [Reopen],
});

const action = (
  tag: "Archive" | "Cancel" | "Dismiss" | "Edit" | "Open" | "Save" | "Unmount",
): Message => ({ _tag: tag });
const countryFocus = (countryId: string): Message => ({ _tag: "CountryFocus", countryId });
const countryOpenChanged = (isOpen: boolean): Message => ({
  _tag: "CountryOpenChanged",
  isOpen,
});
const countrySelect = (countryId: string): Message => ({ _tag: "CountrySelect", countryId });
const fieldInput = (field: UserSettingsMenuField, fieldValue: string): Message => ({
  _tag: "FieldInput",
  field,
  value: fieldValue,
});

const definitionWith = (fixtureState: FixtureState, shouldReopen = false) => ({
  Args,
  Model,
  init: (args: Args) =>
    [
      {
        email: "hi@siennahewitt.com",
        firstName: "Sienna",
        focusedCountryId: "AU",
        isCountryOpen: false,
        isOpen: fixtureState !== "inactive",
        lastName: "Hewitt",
        locale: args.locale,
        selectedCountryId: "AU",
        shouldReopen,
        username: "siennahewitt",
      } satisfies Model,
      fixtureState === "inactive"
        ? []
        : [
            ShowUserSettingsMenu({
              selector: "#user-settings-menu-story",
              triggerSelector: "#user-settings-menu-trigger",
            }),
          ],
    ] as const,
  update: (model: Model, next: Message) => {
    if (next._tag === "FieldInput") {
      return [{ ...model, [next.field]: next.value }, []] as const;
    }
    if (next._tag === "CountryFocus") {
      return [{ ...model, focusedCountryId: next.countryId }, []] as const;
    }
    if (next._tag === "CountryOpenChanged") {
      return [{ ...model, isCountryOpen: next.isOpen }, []] as const;
    }
    if (next._tag === "CountrySelect") {
      return [
        { ...model, focusedCountryId: next.countryId, selectedCountryId: next.countryId },
        [],
      ] as const;
    }
    if (next._tag === "Open" || next._tag === "UserSettingsMenuReopen") {
      return [
        { ...model, isOpen: true },
        [
          ShowUserSettingsMenu({
            selector: "#user-settings-menu-story",
            triggerSelector: "#user-settings-menu-trigger",
          }),
        ],
      ] as const;
    }
    if (next._tag === "Cancel" || next._tag === "Dismiss" || next._tag === "Save") {
      return [model, [CloseUserSettingsMenu({ selector: "#user-settings-menu-story" })]] as const;
    }
    if (next._tag === "UserSettingsMenuClosed") {
      return model.shouldReopen
        ? ([
            { ...model, isOpen: false },
            [ReopenUserSettingsMenu({ id: "user-settings-menu-story" })],
          ] as const)
        : ([{ ...model, isOpen: false }, []] as const);
    }
    if (next._tag === "Unmount") {
      return [model, [ReleaseUserSettingsMenu({ id: "user-settings-menu-story" })]] as const;
    }
    if (next._tag === "UserSettingsMenuCloseFailed" || next._tag === "UserSettingsMenuShowFailed") {
      return [{ ...model, isOpen: false }, []] as const;
    }
    return [model, []] as const;
  },
  view: (model: Model, h: Parameters<typeof userSettingsMenu<Message>>[1]) =>
    h.div(
      [],
      [
        h.button(
          [
            h.AriaLabel(model.locale === "pt-BR" ? "Abrir configurações" : "Open user settings"),
            h.Class(
              model.isOpen
                ? "sr-only"
                : "rounded-lg bg-bg-brand-solid px-3 py-2 text-sm font-semibold text-text-primary-on-brand outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
            ),
            h.Id("user-settings-menu-trigger"),
            h.OnClick(action("Open")),
            h.Type("button"),
          ],
          [model.locale === "pt-BR" ? "Abrir configurações" : "Open user settings"],
        ),
        userSettingsMenu(
          {
            avatarUrl: agentFace(`${model.firstName} ${model.lastName}`),
            countries,
            email: model.email,
            firstName: model.firstName,
            id: "user-settings-menu-story",
            isOpen: model.isOpen,
            lastName: model.lastName,
            locale: model.locale,
            onArchive: action("Archive"),
            onCancel: action("Cancel"),
            onCountryFocus: countryFocus,
            onCountryOpenChanged: countryOpenChanged,
            onCountrySelect: countrySelect,
            onDismiss: action("Dismiss"),
            onEdit: action("Edit"),
            onFieldInput: fieldInput,
            onSave: action("Save"),
            onUnmount: action("Unmount"),
            selectedCountryId: model.selectedCountryId,
            username: model.username,
          },
          h,
        ),
      ],
    ),
});

const fixture = { locale: "en-US" } satisfies Args;
const definition = definitionWith("partial");
const interactiveDefinition = definitionWith("inactive", true);
const meta = componentMeta("user-settings-menu");
export default {
  ...meta,
  argTypes: { locale: { control: "inline-radio", options: ["en-US", "pt-BR"] } },
  title: "Untitled UI/Application/User Settings Menu",
};
export const AllVariants = { ...liveCommandStory(definition), args: fixture };
export const States = { ...liveCommandStory(definition), args: fixture };
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
export const Responsive = { ...liveCommandStory(definition), args: fixture };
export const Interactions = {
  ...liveCommandStory(interactiveDefinition),
  args: { locale: "pt-BR" } satisfies Args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = page.getByRole("button", { name: "Abrir configurações" });
    await userEvent.click(trigger);
    let dialog = await page.findByRole("dialog", { name: "Menu lateral" });
    await expect(dialog).toHaveAttribute("dir", "ltr");
    await expect(dialog).toHaveAttribute("lang", "pt-BR");
    await expect(within(dialog).getByRole("button", { name: "Fechar" })).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect(within(dialog).getByRole("button", { name: "Salvar" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(
      () => expect(page.queryByRole("dialog", { name: "Menu lateral" })).not.toBeInTheDocument(),
      { timeout: 5000 },
    );
    await expect(trigger).toHaveFocus();
    dialog = await page.findByRole("dialog", { name: "Menu lateral" }, { timeout: 5000 });
    await userEvent.click(within(dialog).getByRole("button", { name: "Cancelar" }));
    await waitFor(
      () => expect(page.queryByRole("dialog", { name: "Menu lateral" })).not.toBeInTheDocument(),
      { timeout: 5000 },
    );
    await expect(trigger).toHaveFocus();
    dialog = await page.findByRole("dialog", { name: "Menu lateral" }, { timeout: 5000 });
    const backdrop = canvasElement.ownerDocument.querySelector<HTMLElement>(
      '[data-slideout-overlay="user-settings-menu-story"] > button[aria-hidden="true"]',
    );
    await expect(backdrop).not.toBeNull();
    if (backdrop !== null) {
      await userEvent.click(backdrop);
    }
    await waitFor(
      () => expect(page.queryByRole("dialog", { name: "Menu lateral" })).not.toBeInTheDocument(),
      { timeout: 5000 },
    );
    await expect(trigger).toHaveFocus();
    dialog = await page.findByRole("dialog", { name: "Menu lateral" }, { timeout: 5000 });
    const firstName = within(dialog).getByRole("textbox", { name: /^Nome\s*\*$/u });
    const lastName = within(dialog).getByRole("textbox", { name: /^Sobrenome/u });
    const email = within(dialog).getByRole("textbox", { name: /^E-mail/u });
    const username = within(dialog).getByRole("textbox", { name: /^Nome de usuário/u });
    await userEvent.clear(firstName);
    await userEvent.type(firstName, "Maya");
    await userEvent.clear(lastName);
    await userEvent.type(lastName, "Chen");
    await userEvent.clear(email);
    await userEvent.type(email, "maya@siglata.com");
    await userEvent.clear(username);
    await userEvent.type(username, "mayachen");
    dialog = await page.findByRole("dialog", { name: "Menu lateral" });
    await expect(within(dialog).getByText("Maya Chen")).toBeVisible();
    await expect(within(dialog).getByText("@mayachen")).toBeVisible();
    await userEvent.click(within(dialog).getByRole("button", { name: /País/u }));
    await userEvent.tab();
    await expect(await page.findByRole("option", { name: /Austrália/u })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(await page.findByRole("option", { name: /Áustria/u })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() =>
      expect(canvasElement.ownerDocument.querySelector('[data-select-item="AT"]')).toHaveAttribute(
        "aria-selected",
        "true",
      ),
    );
    dialog = await page.findByRole("dialog", { name: "Menu lateral" });
    await expect(within(dialog).getByRole("button", { name: /País/u })).toHaveTextContent(
      "Áustria",
    );
    await userEvent.click(within(dialog).getByRole("button", { name: "Arquivar" }));
    await userEvent.click(within(dialog).getByRole("button", { name: "Editar" }));
    await userEvent.click(within(dialog).getByRole("button", { name: "Salvar" }));
    await waitFor(
      () => expect(page.queryByRole("dialog", { name: "Menu lateral" })).not.toBeInTheDocument(),
      { timeout: 5000 },
    );
    await expect(trigger).toHaveFocus();
    dialog = await page.findByRole("dialog", { name: "Menu lateral" }, { timeout: 5000 });
    await expect(within(dialog).getByText("Maya Chen")).toBeVisible();
    await expect(within(dialog).getByRole("button", { name: /País/u })).toHaveTextContent(
      "Áustria",
    );
    await expect(within(dialog).getByRole("button", { name: "Fechar" })).toHaveFocus();
  },
};
