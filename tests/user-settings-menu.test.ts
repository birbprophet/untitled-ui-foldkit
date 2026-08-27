import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { agentFace } from "../stories/fixtures/brand.ts";
import type {
  UserSettingsMenuCountry,
  UserSettingsMenuField,
  UserSettingsMenuProps,
} from "../src/application/user-settings-menu.ts";

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
];

const fieldInput = (field: UserSettingsMenuField, value: string): string => `${field}:${value}`;

const propsFor = (locale: "en-US" | "pt-BR"): UserSettingsMenuProps<string> => ({
  avatarUrl: agentFace("Sienna Hewitt"),
  countries,
  email: "hi@siennahewitt.com",
  firstName: "Sienna",
  id: "user-settings-menu",
  isOpen: true,
  lastName: "Hewitt",
  locale,
  onArchive: "archive",
  onCancel: "cancel",
  onCountryFocus: (countryId) => `focus:${countryId}`,
  onCountryOpenChanged: (isOpen) => `open:${String(isOpen)}`,
  onCountrySelect: (countryId) => `select:${countryId}`,
  onDismiss: "dismiss",
  onEdit: "edit",
  onFieldInput: fieldInput,
  onSave: "save",
  onUnmount: "unmount",
  selectedCountryId: "AU",
  username: "siennahewitt",
});

describe("user settings menu", () => {
  it("keeps every form field, country interaction, and slideout action controlled", () => {
    const props = propsFor("en-US");

    expect(props.onFieldInput("firstName", "Maya")).toBe("firstName:Maya");
    expect(props.onFieldInput("lastName", "Chen")).toBe("lastName:Chen");
    expect(props.onFieldInput("email", "maya@example.com")).toBe("email:maya@example.com");
    expect(props.onFieldInput("username", "mayachen")).toBe("username:mayachen");
    expect(props.onCountryOpenChanged(true)).toBe("open:true");
    expect(props.onCountryFocus("AT")).toBe("focus:AT");
    expect(props.onCountrySelect("AT")).toBe("select:AT");
    expect([
      props.onArchive,
      props.onCancel,
      props.onDismiss,
      props.onEdit,
      props.onSave,
      props.onUnmount,
    ]).toEqual(["archive", "cancel", "dismiss", "edit", "save", "unmount"]);
  });

  it("supports en-US and pt-BR fixtures in left-to-right layout", () => {
    const english = propsFor("en-US");
    const portuguese = propsFor("pt-BR");

    expect([english.locale, portuguese.locale]).toEqual(["en-US", "pt-BR"]);
    expect(
      portuguese.countries.find((country) => country.id === portuguese.selectedCountryId)
        ?.labelPtBr,
    ).toBe("Austrália");
    expect(english.countries.find((country) => country.id === "AT")?.label).toBe("Austria");
    expect(portuguese.isOpen).toBe(true);
  });
});
