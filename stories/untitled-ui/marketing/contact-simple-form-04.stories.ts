/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-placeholder-implementation, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises native form validation and controlled FoldKit interactions. */
import * as Match from "effect/Match";
import * as S from "effect/Schema";
import { ts as m } from "foldkit/schema";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  contactSimpleForm04,
  contactSimpleForm04Contacts,
  contactSimpleForm04Countries,
  contactSimpleForm04Socials,
} from "../../../src/marketing/contact-simple-form-04.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const ContactIcon = S.Union([S.Literal("chat"), S.Literal("office"), S.Literal("phone")]);
const SocialIcon = S.Union([
  S.Literal("dribbble"),
  S.Literal("facebook"),
  S.Literal("linkedin"),
  S.Literal("x"),
  S.Literal("youtube"),
]);
const Contact = S.Struct({
  cta: S.String,
  href: S.String,
  icon: ContactIcon,
  id: S.String,
  subtitle: S.String,
  title: S.String,
});
const Country = S.Struct({ id: S.String, label: S.String, phoneMask: S.String });
const Social = S.Struct({
  href: S.String,
  icon: SocialIcon,
  id: S.String,
  title: S.String,
});
const Values = S.Struct({
  email: S.String,
  firstName: S.String,
  lastName: S.String,
  message: S.String,
  phone: S.String,
  privacyAccepted: S.Boolean,
  selectedCountryPhone: S.String,
});
const Args = S.Struct({
  contacts: S.Array(Contact),
  countries: S.Array(Country),
  countryCodeLabel: S.String,
  desktopDescription: S.String,
  emailLabel: S.String,
  emailPlaceholder: S.String,
  firstNameLabel: S.String,
  firstNamePlaceholder: S.String,
  heading: S.String,
  lastNameLabel: S.String,
  lastNamePlaceholder: S.String,
  messageLabel: S.String,
  messagePlaceholder: S.String,
  mobileDescription: S.String,
  phoneLabel: S.String,
  privacyHref: S.String,
  privacyLabel: S.String,
  privacyPrefix: S.String,
  socials: S.Array(Social),
  submitLabel: S.String,
  values: Values,
});
type Model = typeof Args.Type;

const ContactOpened = m("ContactSimpleForm04ContactOpened", { id: S.String });
const CountryChanged = m("ContactSimpleForm04CountryChanged", { id: S.String });
const FieldChanged = m("ContactSimpleForm04FieldChanged", {
  field: S.Literals(["email", "firstName", "lastName", "message", "phone"]),
  value: S.String,
});
const PrivacyOpened = m("ContactSimpleForm04PrivacyOpened");
const PrivacyToggled = m("ContactSimpleForm04PrivacyToggled");
const SocialOpened = m("ContactSimpleForm04SocialOpened", { id: S.String });
const Submitted = m("ContactSimpleForm04Submitted");
type Message =
  | typeof ContactOpened.Type
  | typeof CountryChanged.Type
  | typeof FieldChanged.Type
  | typeof PrivacyOpened.Type
  | typeof PrivacyToggled.Type
  | typeof SocialOpened.Type
  | typeof Submitted.Type;

const view = (model: Model, h: Parameters<typeof contactSimpleForm04<Message>>[1]) =>
  contactSimpleForm04(
    {
      ...model,
      onContact: (id) => ContactOpened({ id }),
      onCountryChange: (id) => CountryChanged({ id }),
      onFieldInput: (field, value) => FieldChanged({ field, value }),
      onPrivacyPolicy: PrivacyOpened(),
      onPrivacyToggle: PrivacyToggled(),
      onSocial: (id) => SocialOpened({ id }),
      onSubmit: Submitted(),
    },
    h,
  );

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model =>
    Match.value(message).pipe(
      Match.when({ _tag: "ContactSimpleForm04ContactOpened" }, ({ id }) => ({
        ...model,
        contacts: model.contacts.map((contact) =>
          contact.id === id ? { ...contact, href: "#contact-opened" } : contact,
        ),
      })),
      Match.when({ _tag: "ContactSimpleForm04CountryChanged" }, ({ id }) => ({
        ...model,
        values: { ...model.values, selectedCountryPhone: id },
      })),
      Match.when({ _tag: "ContactSimpleForm04FieldChanged" }, ({ field, value }) => ({
        ...model,
        values: { ...model.values, [field]: value },
      })),
      Match.when({ _tag: "ContactSimpleForm04PrivacyOpened" }, () => ({
        ...model,
        privacyHref: "#privacy-opened",
      })),
      Match.when({ _tag: "ContactSimpleForm04PrivacyToggled" }, () => ({
        ...model,
        values: { ...model.values, privacyAccepted: !model.values.privacyAccepted },
      })),
      Match.when({ _tag: "ContactSimpleForm04SocialOpened" }, ({ id }) => ({
        ...model,
        socials: model.socials.map((social) =>
          social.id === id ? { ...social, href: "#social-opened" } : social,
        ),
      })),
      Match.when({ _tag: "ContactSimpleForm04Submitted" }, () => ({
        ...model,
        submitLabel: "Message sent",
      })),
      Match.exhaustive,
    ),
  view,
} as const;

const args = {
  contacts: [...contactSimpleForm04Contacts],
  countries: [...contactSimpleForm04Countries],
  countryCodeLabel: "Country code",
  desktopDescription: "We' love to hear from you. Our friendly team is always here to chat.",
  emailLabel: "Email",
  emailPlaceholder: "you@company.com",
  firstNameLabel: "First name",
  firstNamePlaceholder: "First name",
  heading: "Get in touch",
  lastNameLabel: "Last name",
  lastNamePlaceholder: "Last name",
  messageLabel: "Message",
  messagePlaceholder: "Leave us a message...",
  mobileDescription: "We'd love to hear from you. Our friendly team is always here to chat.",
  phoneLabel: "Phone number",
  privacyHref: "#",
  privacyLabel: "privacy policy.",
  privacyPrefix: "You agree to our friendly",
  socials: [...contactSimpleForm04Socials],
  submitLabel: "Send message",
  values: {
    email: "",
    firstName: "",
    lastName: "",
    message: "",
    phone: "",
    privacyAccepted: false,
    selectedCountryPhone: "US",
  },
} satisfies Model;

export default {
  ...componentMeta("contact-simple-form-04"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Simple Form 04",
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
      message: "Please tell me more about Siglata.",
      phone: "+55 11 99999-0000",
      privacyAccepted: true,
      selectedCountryPhone: "BR",
    },
  },
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [view(model, h)],
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
  },
};
