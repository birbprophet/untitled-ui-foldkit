import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type {
  UserSettingsCountry,
  UserSettingsField,
  UserSettingsModalProps,
} from "../src/application/user-settings-modal.ts";

const countries: readonly UserSettingsCountry[] = [
  {
    flagUrl: "https://www.untitledui.com/images/flags/AU.svg",
    id: "AU",
    label: "Australia",
    labelPtBr: "Austrália",
  },
  {
    flagUrl: "https://www.untitledui.com/images/flags/NZ.svg",
    id: "NZ",
    label: "New Zealand",
    labelPtBr: "Nova Zelândia",
  },
];
const fieldInput = (field: UserSettingsField, fieldValue: string): string =>
  `${field}:${fieldValue}`;

describe("user settings modal", () => {
  it("keeps profile fields, country selection, and modal actions controlled", () => {
    const props: UserSettingsModalProps<string> = {
      countries,
      email: "hi@siennahewitt.com",
      firstName: "Sienna",
      id: "user-settings",
      isOpen: true,
      lastName: "Hewitt",
      locale: "en-US",
      onArchive: "archive",
      onCountryFocus: (countryId) => `focus:${countryId}`,
      onCountryOpenChanged: (isOpen) => `open:${String(isOpen)}`,
      onCountrySelect: (countryId) => `select:${countryId}`,
      onDismiss: "dismiss",
      onEdit: "edit",
      onFieldInput: fieldInput,
      onPublish: "publish",
      onSaveDraft: "save-draft",
      selectedCountryId: "AU",
      username: "siennahewitt",
    };

    expect(props.onFieldInput("firstName", "Maya")).toBe("firstName:Maya");
    expect(props.onFieldInput("email", "maya@example.com")).toBe("email:maya@example.com");
    expect(props.onCountryOpenChanged(true)).toBe("open:true");
    expect(props.onCountryFocus("NZ")).toBe("focus:NZ");
    expect(props.onCountrySelect("NZ")).toBe("select:NZ");
    expect([
      props.onArchive,
      props.onDismiss,
      props.onEdit,
      props.onPublish,
      props.onSaveDraft,
    ]).toEqual(["archive", "dismiss", "edit", "publish", "save-draft"]);
    expect(props.countries.find((country) => country.id === props.selectedCountryId)?.label).toBe(
      "Australia",
    );
    expect(countries[0]?.labelPtBr).toBe("Austrália");
    expect(countries[0]?.flagUrl).toBe("https://www.untitledui.com/images/flags/AU.svg");
  });

  it("supports inactive, partial, and activated left-to-right fixtures", () => {
    const fixtures = [
      {
        email: "hi@siennahewitt.com",
        firstName: "Sienna",
        isOpen: false,
        lastName: "Hewitt",
        locale: "en-US",
        selectedCountryId: "AU",
        username: "siennahewitt",
      },
      {
        email: "maya.chen@example.com",
        firstName: "Maya",
        isOpen: true,
        lastName: "Chen",
        locale: "pt-BR",
        selectedCountryId: "NZ",
        username: "mayachen",
      },
      {
        email: "maya.chen@example.com",
        firstName: "Maya",
        isOpen: true,
        lastName: "Chen",
        locale: "en-US",
        selectedCountryId: "AT",
        username: "mayachen",
      },
    ] as const;

    expect(fixtures.map(({ isOpen }) => isOpen)).toEqual([false, true, true]);
    expect(fixtures.map(({ locale }) => locale)).toEqual(["en-US", "pt-BR", "en-US"]);
    expect(fixtures[2]).toMatchObject({ selectedCountryId: "AT", username: "mayachen" });
  });
});
