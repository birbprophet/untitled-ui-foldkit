/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-placeholder-implementation, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, mps/avoid-direct-tag-checks -- Storybook CSF uses the browser promise API and asserts native placeholder copy. */
import * as Match from "effect/Match";
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { contactFormAndMap } from "../../../src/marketing/contact-form-and-map.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const PhoneOption = S.Struct({ code: S.String, label: S.String, placeholder: S.String });
const Args = S.Struct({
  countryCodeLabel: S.String,
  description: S.String,
  email: S.String,
  emailLabel: S.String,
  emailPlaceholder: S.String,
  firstName: S.String,
  firstNameLabel: S.String,
  firstNamePlaceholder: S.String,
  heading: S.String,
  lastName: S.String,
  lastNameLabel: S.String,
  lastNamePlaceholder: S.String,
  mapSrc: S.String,
  mapTitle: S.String,
  message: S.String,
  messageLabel: S.String,
  messagePlaceholder: S.String,
  phone: S.String,
  phoneLabel: S.String,
  phoneOptions: S.Array(PhoneOption),
  privacyChecked: S.Boolean,
  privacyCopy: S.String,
  privacyHref: S.String,
  privacyLabel: S.String,
  selectedCountryCode: S.String,
  submitLabel: S.String,
});
type Model = typeof Args.Type;
const CountryChanged = m("ContactFormAndMapCountryChanged", { code: S.String });
const FieldChanged = m("ContactFormAndMapFieldChanged", {
  field: S.Literals(["email", "firstName", "lastName", "message", "phone"]),
  value: S.String,
});
const PrivacyOpened = m("ContactFormAndMapPrivacyOpened");
const PrivacyToggled = m("ContactFormAndMapPrivacyToggled");
const Submitted = m("ContactFormAndMapSubmitted");
type Message =
  | typeof CountryChanged.Type
  | typeof FieldChanged.Type
  | typeof PrivacyOpened.Type
  | typeof PrivacyToggled.Type
  | typeof Submitted.Type;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model =>
    Match.value(message).pipe(
      Match.when({ _tag: "ContactFormAndMapCountryChanged" }, ({ code }) => ({
        ...model,
        selectedCountryCode: code,
      })),
      Match.when({ _tag: "ContactFormAndMapFieldChanged" }, ({ field, value }) => ({
        ...model,
        [field]: value,
      })),
      Match.when({ _tag: "ContactFormAndMapPrivacyOpened" }, () => ({
        ...model,
        privacyHref: "#privacy-opened",
      })),
      Match.when({ _tag: "ContactFormAndMapPrivacyToggled" }, () => ({
        ...model,
        privacyChecked: !model.privacyChecked,
      })),
      Match.when({ _tag: "ContactFormAndMapSubmitted" }, () => ({
        ...model,
        submitLabel: "Message sent",
      })),
      Match.exhaustive,
    ),
  view: (model: Model, h: Parameters<typeof contactFormAndMap<Message>>[1]) =>
    contactFormAndMap(
      {
        ...model,
        onCountryCodeChange: (code) => CountryChanged({ code }),
        onEmailInput: (value) => FieldChanged({ field: "email", value }),
        onFirstNameInput: (value) => FieldChanged({ field: "firstName", value }),
        onLastNameInput: (value) => FieldChanged({ field: "lastName", value }),
        onMessageInput: (value) => FieldChanged({ field: "message", value }),
        onPhoneInput: (value) => FieldChanged({ field: "phone", value }),
        onPrivacyPolicy: PrivacyOpened(),
        onPrivacyToggle: PrivacyToggled(),
        onSubmit: Submitted(),
      },
      h,
    ),
} as const;

const args = {
  countryCodeLabel: "Country code",
  description: "Our friendly team would love to hear from you.",
  email: "",
  emailLabel: "Email",
  emailPlaceholder: "you@company.com",
  firstName: "",
  firstNameLabel: "First name",
  firstNamePlaceholder: "First name",
  heading: "Contact us",
  lastName: "",
  lastNameLabel: "Last name",
  lastNamePlaceholder: "Last name",
  mapSrc: "https://snazzymaps.com/embed/451871",
  mapTitle: "Our address",
  message: "",
  messageLabel: "Message",
  messagePlaceholder: "Leave us a message...",
  phone: "",
  phoneLabel: "Phone number",
  phoneOptions: [
    { code: "US", label: "US", placeholder: "+1 (000) 000-0000" },
    { code: "BR", label: "BR", placeholder: "+55 (00) 90000-0000" },
    { code: "AU", label: "AU", placeholder: "+61-0-0000-0000" },
  ],
  privacyChecked: false,
  privacyCopy: "You agree to our friendly",
  privacyHref: "#",
  privacyLabel: "privacy policy.",
  selectedCountryCode: "US",
  submitLabel: "Send message",
} as const;

export default {
  ...componentMeta("contact-form-and-map"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Form And Map",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory(definition),
  args: { ...args, email: "not-an-email", privacyChecked: true },
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [
          contactFormAndMap(
            {
              ...model,
              onCountryCodeChange: (code) => CountryChanged({ code }),
              onEmailInput: (value) => FieldChanged({ field: "email", value }),
              onFirstNameInput: (value) => FieldChanged({ field: "firstName", value }),
              onLastNameInput: (value) => FieldChanged({ field: "lastName", value }),
              onMessageInput: (value) => FieldChanged({ field: "message", value }),
              onPhoneInput: (value) => FieldChanged({ field: "phone", value }),
              onPrivacyPolicy: PrivacyOpened(),
              onPrivacyToggle: PrivacyToggled(),
              onSubmit: Submitted(),
            },
            h,
          ),
        ],
      ),
  }),
  args,
};
export const Responsive = { ...liveStory(definition), args };
export const Interactions = {
  ...liveStory(definition),
  args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    const firstName = await canvas.findByRole("textbox", { name: /First name/u });
    await userEvent.click(canvas.getByRole("button", { name: args.submitLabel }));
    await expect(firstName).toBeInvalid();

    await userEvent.type(firstName, "Olivia");
    await userEvent.type(canvas.getByRole("textbox", { name: /Last name/u }), "Rhye");
    await userEvent.type(canvas.getByRole("textbox", { name: /^Email/u }), "olivia@example.com");
    const country = canvas.getByRole("combobox", { name: args.countryCodeLabel });
    await userEvent.selectOptions(country, "BR");
    const phone = canvas.getByRole("textbox", { name: args.phoneLabel });
    await waitFor(() => expect(phone).toHaveAttribute("placeholder", "+55 (00) 90000-0000"));
    await userEvent.type(phone, "+55 11 99999-0000");
    await userEvent.type(
      canvas.getByRole("textbox", { name: args.messageLabel }),
      "Please tell me more about Siglata.",
    );
    const privacy = canvas.getByRole("checkbox", { name: /You agree to our friendly/u });
    await userEvent.click(privacy);
    await expect(privacy).toBeChecked();

    const privacyLink = canvas.getByRole("link", { name: args.privacyLabel });
    await userEvent.click(privacyLink);
    await waitFor(() => expect(privacyLink).toHaveAttribute("href", "#privacy-opened"));
    await userEvent.click(canvas.getByRole("button", { name: args.submitLabel }));
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Message sent" })).toBeInTheDocument(),
    );
    await expect(canvas.getByTitle(args.mapTitle)).toHaveAttribute("src", args.mapSrc);
  },
};
