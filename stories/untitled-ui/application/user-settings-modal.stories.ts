/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions and native dialog commands use browser APIs. */
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { Command } from "foldkit";
import * as Dom from "foldkit/dom";
import { taggedStruct as m } from "foldkit/schema";
import { userSettingsModal } from "../../../src/application.ts";
import type { UserSettingsCountry, UserSettingsField } from "../../../src/application.ts";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { componentMeta, liveCommandStory, waitForStoryReady } from "../story.ts";

import { agentFace } from "../../fixtures/brand.ts";

const countryFixtures =
  "AF|Afghanistan~AL|Albania~DZ|Algeria~AD|Andorra~AO|Angola~AG|Antigua and Barbuda~AR|Argentina~AM|Armenia~AU|Australia~AT|Austria~AZ|Azerbaijan~BS|Bahamas~BH|Bahrain~BD|Bangladesh~BB|Barbados~BY|Belarus~BE|Belgium~BZ|Belize~BJ|Benin~BT|Bhutan~BO|Bolivia~BA|Bosnia and Herzegovina~BW|Botswana~BR|Brazil~BN|Brunei~BG|Bulgaria~BF|Burkina Faso~BI|Burundi~KH|Cambodia~CM|Cameroon~CA|Canada~CF|Central African Republic~TD|Chad~CL|Chile~CN|China~CO|Colombia~KM|Comoros~CR|Costa Rica~HR|Croatia~CU|Cuba~CY|Cyprus~CZ|Czech Republic~CD|Democratic Republic of the Congo~DK|Denmark~DJ|Djibouti~DM|Dominica~DO|Dominican Republic~TL|East Timor~EC|Ecuador~EG|Egypt~SV|El Salvador~GQ|Equatorial Guinea~ER|Eritrea~EE|Estonia~SZ|Eswatini~ET|Ethiopia~FJ|Fiji~FI|Finland~FR|France~GA|Gabon~GM|Gambia~GE|Georgia~DE|Germany~GH|Ghana~GR|Greece~GD|Grenada~GT|Guatemala~GN|Guinea~GW|Guinea-Bissau~GY|Guyana~HT|Haiti~HN|Honduras~HU|Hungary~IS|Iceland~IN|India~ID|Indonesia~IR|Iran~IQ|Iraq~IE|Ireland~IL|Israel~IT|Italy~JM|Jamaica~JP|Japan~JO|Jordan~KZ|Kazakhstan~KE|Kenya~KI|Kiribati~KW|Kuwait~KG|Kyrgyzstan~LA|Laos~LV|Latvia~LB|Lebanon~LS|Lesotho~LR|Liberia~LY|Libya~LI|Liechtenstein~LT|Lithuania~LU|Luxembourg~MG|Madagascar~MW|Malawi~MY|Malaysia~MV|Maldives~ML|Mali~MT|Malta~MH|Marshall Islands~MR|Mauritania~MU|Mauritius~MX|Mexico~FM|Micronesia~MD|Moldova~MC|Monaco~MN|Mongolia~ME|Montenegro~MA|Morocco~MZ|Mozambique~MM|Myanmar~NA|Namibia~NR|Nauru~NP|Nepal~NL|Netherlands~NZ|New Zealand~NI|Nicaragua~NE|Niger~NG|Nigeria~KP|North Korea~MK|North Macedonia~NO|Norway~OM|Oman~PK|Pakistan~PW|Palau~PA|Panama~PG|Papua New Guinea~PY|Paraguay~PE|Peru~PH|Philippines~PL|Poland~PT|Portugal~QA|Qatar~RO|Romania~RU|Russia~RW|Rwanda~KN|Saint Kitts and Nevis~LC|Saint Lucia~VC|Saint Vincent and the Grenadines~WS|Samoa~SM|San Marino~ST|Sao Tome and Principe~SA|Saudi Arabia~SN|Senegal~RS|Serbia~SC|Seychelles~SL|Sierra Leone~SG|Singapore~SK|Slovakia~SI|Slovenia~SB|Solomon Islands~SO|Somalia~ZA|South Africa~KR|South Korea~SS|South Sudan~ES|Spain~LK|Sri Lanka~SR|Suriname~SE|Sweden~CH|Switzerland~SY|Syria~TJ|Tajikistan~TZ|Tanzania~TH|Thailand~TG|Togo~TO|Tonga~TT|Trinidad and Tobago~TN|Tunisia~TR|Turkey~TM|Turkmenistan~TV|Tuvalu~UG|Uganda~UA|Ukraine~AE|United Arab Emirates~GB|United Kingdom~US|United States~UY|Uruguay~UZ|Uzbekistan~VU|Vanuatu~VE|Venezuela~VN|Vietnam~YE|Yemen~ZM|Zambia~ZW|Zimbabwe";
const countries: readonly UserSettingsCountry[] = countryFixtures.split("~").map((fixture) => {
  const [countryId = "", countryLabel = ""] = fixture.split("|");
  return {
    flagUrl: `https://www.untitledui.com/images/flags/${countryId}.svg`,
    id: countryId,
    label: countryLabel,
  };
});

const Args = S.Struct({ locale: S.Literals(["en-US", "pt-BR"]) });
const Model = S.Struct({
  email: S.String,
  firstName: S.String,
  focusedCountryId: S.String,
  isCountryOpen: S.Boolean,
  isOpen: S.Boolean,
  lastName: S.String,
  locale: S.Literals(["en-US", "pt-BR"]),
  selectedCountryId: S.String,
  username: S.String,
});
type Model = typeof Model.Type;
const Shown = m("UserSettingsModalShown");
const ShowFailed = m("UserSettingsModalShowFailed");
const Closed = m("UserSettingsModalClosed");
const CloseFailed = m("UserSettingsModalCloseFailed");
type Message =
  | Readonly<{ _tag: "Archive" | "Dismiss" | "Edit" | "Open" | "Publish" | "SaveDraft" }>
  | Readonly<{ _tag: "CountryFocus" | "CountrySelect"; countryId: string }>
  | Readonly<{ _tag: "CountryOpenChanged"; isOpen: boolean }>
  | Readonly<{ _tag: "FieldInput"; field: UserSettingsField; value: string }>
  | typeof Shown.Type
  | typeof ShowFailed.Type
  | typeof Closed.Type
  | typeof CloseFailed.Type;

const ShowUserSettingsModal = Command.define("ShowUserSettingsModal", {
  args: { returnFocusSelector: S.String, selector: S.String },
  execute: ({ returnFocusSelector, selector }) =>
    Dom.focus(returnFocusSelector).pipe(
      Effect.andThen(Dom.showDialog(selector, { focusSelector: "[data-user-settings-close]" })),
      Effect.match({ onFailure: () => ShowFailed(), onSuccess: () => Shown() }),
    ),
  messages: [Shown, ShowFailed],
});
const CloseUserSettingsModal = Command.define("CloseUserSettingsModal", {
  args: { selector: S.String },
  execute: ({ selector }) =>
    Dom.closeDialog(selector).pipe(
      Effect.match({ onFailure: () => CloseFailed(), onSuccess: () => Closed() }),
    ),
  messages: [Closed, CloseFailed],
});
const action = (
  tag: "Archive" | "Dismiss" | "Edit" | "Open" | "Publish" | "SaveDraft",
): Message => ({ _tag: tag });
const countryFocus = (countryId: string): Message => ({ _tag: "CountryFocus", countryId });
const countryOpenChanged = (isOpen: boolean): Message => ({
  _tag: "CountryOpenChanged",
  isOpen,
});
const countrySelect = (countryId: string): Message => ({ _tag: "CountrySelect", countryId });
const fieldInput = (field: UserSettingsField, fieldValue: string): Message => ({
  _tag: "FieldInput",
  field,
  value: fieldValue,
});

const triggerClassName = (initiallyOpen: boolean, isOpen: boolean): string => {
  if (initiallyOpen) {
    return "sr-only";
  }
  return isOpen
    ? "pointer-events-none opacity-0"
    : "rounded-lg bg-bg-brand-solid px-3 py-2 text-sm font-semibold text-text-primary-on-brand outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2";
};

const makeDefinition = (state: "inactive" | "partial", initiallyOpen = true) => ({
  Args,
  Model,
  init: (args: typeof Args.Type) => {
    const edited = state === "partial";
    return [
      {
        email: edited ? "maya@siglata.com" : "hi@siennahewitt.com",
        firstName: edited ? "Maya" : "Sienna",
        focusedCountryId: "AU",
        isCountryOpen: false,
        isOpen: initiallyOpen,
        lastName: edited ? "Chen" : "Hewitt",
        locale: args.locale,
        selectedCountryId: "AU",
        username: edited ? "mayachen" : "siennahewitt",
      } satisfies Model,
      initiallyOpen
        ? [
            ShowUserSettingsModal({
              returnFocusSelector: "#user-settings-modal-story-trigger",
              selector: "#user-settings-modal-story",
            }),
          ]
        : [],
    ] as const;
  },
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
    if (next._tag === "Open") {
      return [
        { ...model, isOpen: true },
        [
          ShowUserSettingsModal({
            returnFocusSelector: "#user-settings-modal-story-trigger",
            selector: "#user-settings-modal-story",
          }),
        ],
      ] as const;
    }
    if (next._tag === "Dismiss") {
      return [model, [CloseUserSettingsModal({ selector: "#user-settings-modal-story" })]] as const;
    }
    if (next._tag === "UserSettingsModalClosed") {
      return [{ ...model, isOpen: false }, []] as const;
    }
    if (
      next._tag === "UserSettingsModalShowFailed" ||
      next._tag === "UserSettingsModalCloseFailed"
    ) {
      return [{ ...model, isOpen: false }, []] as const;
    }
    return next._tag === "Publish" || next._tag === "SaveDraft"
      ? ([model, [CloseUserSettingsModal({ selector: "#user-settings-modal-story" })]] as const)
      : ([model, []] as const);
  },
  view: (model: Model, h: Parameters<typeof userSettingsModal<Message>>[1]) =>
    h.div(
      [],
      [
        h.button(
          [
            h.Class(triggerClassName(initiallyOpen, model.isOpen)),
            h.Id("user-settings-modal-story-trigger"),
            h.OnClick(action("Open")),
            h.Type("button"),
          ],
          ["Open user settings"],
        ),
        userSettingsModal(
          {
            avatarUrl: agentFace(`${model.firstName} ${model.lastName}`),
            countries,
            email: model.email,
            firstName: model.firstName,
            id: "user-settings-modal-story",
            isOpen: model.isOpen,
            lastName: model.lastName,
            locale: model.locale,
            onArchive: action("Archive"),
            onCountryFocus: countryFocus,
            onCountryOpenChanged: countryOpenChanged,
            onCountrySelect: countrySelect,
            onDismiss: action("Dismiss"),
            onEdit: action("Edit"),
            onFieldInput: fieldInput,
            onPublish: action("Publish"),
            onSaveDraft: action("SaveDraft"),
            selectedCountryId: model.selectedCountryId,
            username: model.username,
          },
          h,
        ),
      ],
    ),
});

const definition = makeDefinition("inactive");
const interactiveDefinition = makeDefinition("inactive", false);
const meta = componentMeta("user-settings-modal");
export default {
  ...meta,
  argTypes: { locale: { control: "inline-radio", options: ["en-US", "pt-BR"] } },
  title: "Untitled UI/Application/User Settings Modal",
};
export const AllVariants = { ...liveCommandStory(definition), args: { locale: "en-US" } };
export const States = {
  ...liveCommandStory(makeDefinition("partial")),
  args: { locale: "en-US" },
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
  args: { locale: "en-US" },
};
export const Responsive = { ...liveCommandStory(definition), args: { locale: "en-US" } };
export const Interactions = {
  ...liveCommandStory(interactiveDefinition),
  args: { locale: "en-US" },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = page.getByRole("button", { name: "Open user settings" });
    await userEvent.click(trigger);
    let dialog = await page.findByRole("dialog", { name: "User settings" });
    const close = within(dialog).getByRole("button", { name: "Close" });
    await expect(close).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect(within(dialog).getByRole("button", { name: "Publish changes" })).toHaveFocus();
    await userEvent.tab();
    await expect(close).toHaveFocus();
    await userEvent.click(close);
    await waitFor(
      () => expect(page.queryByRole("dialog", { name: "User settings" })).not.toBeInTheDocument(),
      { timeout: 5000 },
    );
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    dialog = await page.findByRole("dialog", { name: "User settings" });
    await expect(within(dialog).getByRole("button", { name: "Close" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(
      () => expect(page.queryByRole("dialog", { name: "User settings" })).not.toBeInTheDocument(),
      { timeout: 5000 },
    );
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    dialog = await page.findByRole("dialog", { name: "User settings" });
    await expect(within(dialog).getByRole("button", { name: "Close" })).toHaveFocus();
    const backdrop = canvasElement.ownerDocument.querySelector<HTMLElement>(
      '[data-modal-overlay="user-settings-modal-story"] > div[aria-hidden="true"]',
    );
    await expect(backdrop).not.toBeNull();
    if (backdrop !== null) {
      await userEvent.click(backdrop);
    }
    await waitFor(
      () => expect(page.queryByRole("dialog", { name: "User settings" })).not.toBeInTheDocument(),
      { timeout: 5000 },
    );
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    dialog = await page.findByRole("dialog", { name: "User settings" });
    await expect(within(dialog).getByRole("button", { name: "Close" })).toHaveFocus();
    const firstName = within(dialog).getByRole("textbox", { name: /^Name/u });
    const lastName = within(dialog).getByRole("textbox", { name: /^Last name/u });
    const email = within(dialog).getByRole("textbox", { name: /^Email/u });
    const username = within(dialog).getByRole("textbox", { name: /^Username/u });
    await userEvent.clear(firstName);
    await userEvent.type(firstName, "Maya");
    await userEvent.clear(lastName);
    await userEvent.type(lastName, "Chen");
    await userEvent.clear(email);
    await userEvent.type(email, "maya@siglata.com");
    await userEvent.clear(username);
    await userEvent.type(username, "mayachen");
    dialog = await page.findByRole("dialog", { name: "User settings" });
    await expect(dialog.querySelector("#input-firstname")).toHaveValue("Maya");
    await expect(dialog.querySelector("#input-email")).toHaveValue("maya@siglata.com");
    await expect(within(dialog).getByText("Maya Chen")).toBeVisible();
    await userEvent.click(within(dialog).getByRole("button", { name: /Country/u }));
    await userEvent.tab();
    await expect(await page.findByRole("option", { name: /Australia/u })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(await page.findByRole("option", { name: /Austria/u })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    dialog = await page.findByRole("dialog", { name: "User settings" });
    await expect(within(dialog).getByRole("button", { name: /Austria/u })).toBeVisible();
    await expect(within(dialog).getByRole("button", { name: "Archive" })).toBeVisible();
    await expect(within(dialog).getByRole("button", { name: "Edit" })).toBeVisible();
    await expect(within(dialog).getByText("@mayachen")).toBeVisible();
    await expect(dialog).toBeVisible();
  },
};
