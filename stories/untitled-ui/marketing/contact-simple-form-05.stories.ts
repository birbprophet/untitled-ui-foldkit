/* oxlint-disable @rikalabs/effect-no-async-await, @rikalabs/no-placeholder-implementation, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, mps/avoid-direct-tag-checks -- Storybook CSF exercises controlled FoldKit form interactions. */
import * as Match from "effect/Match";
import * as S from "effect/Schema";
import { taggedStruct as m } from "foldkit/schema";
import { expect, userEvent, within } from "storybook/test";

import { contactSimpleForm05 } from "../../../src/marketing/contact-simple-form-05.ts";
import { componentMeta, liveStory, waitForStoryReady } from "../story.ts";

const Values = S.Struct({
  email: S.String,
  firstName: S.String,
  lastName: S.String,
  message: S.String,
  phone: S.String,
  privacyAccepted: S.Boolean,
  selectedCountryPhone: S.String,
  selectedServices: S.Array(S.String),
});
const Errors = S.Struct({
  email: S.String,
  firstName: S.String,
  lastName: S.String,
  message: S.String,
  phone: S.String,
});
const Args = S.Struct({
  contactEmail: S.String,
  contacts: S.Array(
    S.Struct({
      cta: S.String,
      href: S.String,
      icon: S.Union([S.Literal("chat"), S.Literal("office"), S.Literal("phone")]),
      id: S.String,
      subtitle: S.String,
      title: S.String,
    }),
  ),
  countries: S.Array(S.Struct({ code: S.String, phoneMask: S.String })),
  errors: Errors,
  privacyHref: S.String,
  services: S.Array(S.Struct({ id: S.String, label: S.String })),
  socials: S.Array(
    S.Struct({
      href: S.String,
      icon: S.Union([
        S.Literal("dribbble"),
        S.Literal("facebook"),
        S.Literal("linkedin"),
        S.Literal("x"),
        S.Literal("youtube"),
      ]),
      id: S.String,
      label: S.String,
    }),
  ),
  submitDesktopLabel: S.String,
  submitMobileLabel: S.String,
  values: Values,
});
type Model = typeof Args.Type;

const ContactOpened = m("ContactSimpleForm05ContactOpened", { id: S.String });
const CountryChanged = m("ContactSimpleForm05CountryChanged", { code: S.String });
const FieldChanged = m("ContactSimpleForm05FieldChanged", {
  field: S.Literals(["email", "firstName", "lastName", "message", "phone"]),
  value: S.String,
});
const PrivacyToggled = m("ContactSimpleForm05PrivacyToggled");
const ServiceToggled = m("ContactSimpleForm05ServiceToggled", { id: S.String });
const SocialOpened = m("ContactSimpleForm05SocialOpened", { id: S.String });
const Submitted = m("ContactSimpleForm05Submitted");
type Message =
  | typeof ContactOpened.Type
  | typeof CountryChanged.Type
  | typeof FieldChanged.Type
  | typeof PrivacyToggled.Type
  | typeof ServiceToggled.Type
  | typeof SocialOpened.Type
  | typeof Submitted.Type;

const definition = {
  Args,
  Model: Args,
  init: (args: Model): Model => args,
  update: (model: Model, message: Message): Model =>
    Match.value(message).pipe(
      Match.when({ _tag: "ContactSimpleForm05ContactOpened" }, ({ id }) => ({
        ...model,
        contacts: model.contacts.map((c) => (c.id === id ? { ...c, href: `#${id}-opened` } : c)),
      })),
      Match.when({ _tag: "ContactSimpleForm05CountryChanged" }, ({ code }) => ({
        ...model,
        values: { ...model.values, selectedCountryPhone: code },
      })),
      Match.when({ _tag: "ContactSimpleForm05FieldChanged" }, ({ field, value }) => ({
        ...model,
        values: { ...model.values, [field]: value },
      })),
      Match.when({ _tag: "ContactSimpleForm05PrivacyToggled" }, () => ({
        ...model,
        values: { ...model.values, privacyAccepted: !model.values.privacyAccepted },
      })),
      Match.when({ _tag: "ContactSimpleForm05ServiceToggled" }, ({ id }) => ({
        ...model,
        values: {
          ...model.values,
          selectedServices: model.values.selectedServices.includes(id)
            ? model.values.selectedServices.filter((s) => s !== id)
            : [...model.values.selectedServices, id],
        },
      })),
      Match.when({ _tag: "ContactSimpleForm05SocialOpened" }, ({ id }) => ({
        ...model,
        socials: model.socials.map((s) => (s.id === id ? { ...s, href: `#${id}-opened` } : s)),
      })),
      Match.when({ _tag: "ContactSimpleForm05Submitted" }, () => ({
        ...model,
        submitDesktopLabel: "Message sent",
        submitMobileLabel: "Message sent",
      })),
      Match.orElse(() => model),
    ),
  view: (model: Model, h: Parameters<typeof contactSimpleForm05<Message>>[1]) =>
    contactSimpleForm05(
      {
        ...model,
        onContact: (id) => ContactOpened({ id }),
        onCountryChange: (code) => CountryChanged({ code }),
        onFieldInput: (field, value) => FieldChanged({ field, value }),
        onPrivacyToggle: PrivacyToggled(),
        onServiceToggle: (id) => ServiceToggled({ id }),
        onSocial: (id) => SocialOpened({ id }),
        onSubmit: Submitted(),
      },
      h,
    ),
} as const;

const args = {
  contactEmail: "hi@untitledui.com",
  contacts: [],
  countries: [{ code: "US", phoneMask: "+1 (###) ###-####" }],
  errors: { email: "", firstName: "", lastName: "", message: "", phone: "" },
  privacyHref: "#privacy",
  services: [{ id: "design", label: "Website design" }],
  socials: [],
  submitDesktopLabel: "Get started",
  submitMobileLabel: "Send message",
  values: {
    email: "",
    firstName: "",
    lastName: "",
    message: "",
    phone: "",
    privacyAccepted: false,
    selectedCountryPhone: "US",
    selectedServices: [],
  },
} as const;

export default {
  ...componentMeta("contact-simple-form-05"),
  parameters: { layout: "fullscreen" },
  title: "Untitled UI/Marketing/Contact/Contact Simple Form 05",
};
export const AllVariants = { ...liveStory(definition), args };
export const States = { ...liveStory(definition), args };
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary"), h.DataAttribute("theme", "dark")],
        [definition.view(model, h)],
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
    await userEvent.type(canvas.getByRole("textbox", { name: /First name/u }), "Olivia");
    const privacy = canvas.getByRole("checkbox");
    await userEvent.click(privacy);
    await expect(privacy).toBeChecked();
  },
};
