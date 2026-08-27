/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-placeholder-implementation, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, mps/avoid-direct-tag-checks, unicorn/no-nested-ternary -- Storybook CSF and browser interactions use promise APIs, and the play asserts the native placeholder of the authenticated phone field. */
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, within } from "storybook/test";

import {
  contactSimpleForm,
  contactSimpleFormCountries,
} from "../../../src/marketing/contact-simple-form.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Country = S.Struct({ id: S.String, label: S.String, phoneMask: S.String });
const Values = S.Struct({
  email: S.String,
  firstName: S.String,
  lastName: S.String,
  message: S.String,
  phone: S.String,
  privacyAccepted: S.Boolean,
  selectedCountryId: S.String,
});
const Args = S.Struct({
  countries: S.Array(Country),
  countryCodeLabel: S.String,
  description: S.String,
  emailLabel: S.String,
  emailPlaceholder: S.String,
  eyebrow: S.String,
  firstNameLabel: S.String,
  firstNamePlaceholder: S.String,
  heading: S.String,
  lastNameLabel: S.String,
  lastNamePlaceholder: S.String,
  messageLabel: S.String,
  messagePlaceholder: S.String,
  phoneLabel: S.String,
  privacyHref: S.String,
  privacyLabel: S.String,
  privacyPrefix: S.String,
  submitLabel: S.String,
  values: Values,
});
const Model = S.Struct({ ...Args.fields, isSubmitted: S.Boolean });
type Model = typeof Model.Type;
const FieldChanged = m("ContactSimpleFormFieldChanged", {
  field: S.Union([
    S.Literal("email"),
    S.Literal("firstName"),
    S.Literal("lastName"),
    S.Literal("message"),
    S.Literal("phone"),
  ]),
  value: S.String,
});
const CountryChanged = m("ContactSimpleFormCountryChanged", { id: S.String });
const PrivacyToggled = m("ContactSimpleFormPrivacyToggled", {});
const PrivacyOpened = m("ContactSimpleFormPrivacyOpened", {});
const Submitted = m("ContactSimpleFormSubmitted", {});
type Message =
  | typeof CountryChanged.Type
  | typeof FieldChanged.Type
  | typeof PrivacyOpened.Type
  | typeof PrivacyToggled.Type
  | typeof Submitted.Type;

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, isSubmitted: false }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "ContactSimpleFormFieldChanged") {
      return { ...model, values: { ...model.values, [message.field]: message.value } };
    }
    if (message._tag === "ContactSimpleFormCountryChanged") {
      return { ...model, values: { ...model.values, selectedCountryId: message.id } };
    }
    if (message._tag === "ContactSimpleFormPrivacyToggled") {
      return {
        ...model,
        values: { ...model.values, privacyAccepted: !model.values.privacyAccepted },
      };
    }
    if (message._tag === "ContactSimpleFormSubmitted") {
      return { ...model, isSubmitted: true };
    }
    return { ...model, privacyHref: "#privacy-opened" };
  },
  view: (model: Model, h: Parameters<typeof contactSimpleForm<Message>>[1]) =>
    contactSimpleForm(
      {
        ...model,
        onCountryChange: (id) => CountryChanged({ id }),
        onFieldInput: (field, value) => FieldChanged({ field, value }),
        onPrivacy: PrivacyOpened(),
        onPrivacyToggle: PrivacyToggled(),
        onSubmit: Submitted(),
        submitLabel: model.isSubmitted ? "Message sent" : model.submitLabel,
      },
      h,
    ),
} as const;

const emptyValues = {
  email: "",
  firstName: "",
  lastName: "",
  message: "",
  phone: "",
  privacyAccepted: false,
  selectedCountryId: "US",
} as const;

const args = {
  countries: [...contactSimpleFormCountries],
  countryCodeLabel: "Country code",
  description: "We'd love to hear from you. Please fill out this form.",
  emailLabel: "Email",
  emailPlaceholder: "you@company.com",
  eyebrow: "Contact us",
  firstNameLabel: "First name",
  firstNamePlaceholder: "First name",
  heading: "Get in touch",
  lastNameLabel: "Last name",
  lastNamePlaceholder: "Last name",
  messageLabel: "Message",
  messagePlaceholder: "Leave us a message...",
  phoneLabel: "Phone number",
  privacyHref: "#",
  privacyLabel: "privacy policy.",
  privacyPrefix: "You agree to our friendly",
  submitLabel: "Send message",
  values: emptyValues,
} as const;

export default {
  ...componentMeta("contact-simple-form"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Simple Form",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory(definition),
  args: {
    ...args,
    values: {
      email: "olivia@example.com",
      firstName: "Olivia",
      lastName: "Rhye",
      message: "I'd like to learn more about Siglata.",
      phone: "+55 (11) 91234-5678",
      privacyAccepted: true,
      selectedCountryId: "BR",
    },
  },
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) => h.div([h.DataAttribute("theme", "dark")], [definition.view(model, h)]),
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
    await userEvent.type(canvas.getByRole("textbox", { name: "First name" }), "Olivia");
    await userEvent.type(canvas.getByRole("textbox", { name: "Last name" }), "Rhye");
    await userEvent.type(canvas.getByRole("textbox", { name: "Email" }), "olivia@example.com");
    const country = canvas.getByRole("combobox", { name: "Country code" });
    await userEvent.selectOptions(country, "BR");
    const phone = canvas.getByRole("textbox", { name: "Phone number" });
    await expect(phone).toHaveAttribute("placeholder", "+55 (00) 90000-0000");
    await userEvent.type(phone, "+55 (11) 91234-5678");
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Message" }),
      "I'd like to learn more.",
    );
    await userEvent.click(
      canvas.getByRole("checkbox", { name: /You agree to our friendly privacy policy/u }),
    );
    await expect(
      canvas.getByRole("checkbox", { name: /You agree to our friendly privacy policy/u }),
    ).toBeChecked();
    await userEvent.click(canvas.getByRole("button", { name: "Send message" }));
    await expect(await canvas.findByRole("button", { name: "Message sent" })).toBeInTheDocument();
  },
};
