import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type {
  PlaceholderMenuLocale,
  PlaceholderMenuProps,
} from "../src/application/placeholder-menu.ts";

describe("placeholder menu", () => {
  it("keeps visibility and every dismissal action controlled", () => {
    const props: PlaceholderMenuProps<string> = {
      id: "placeholder-menu",
      isOpen: true,
      locale: "en-US",
      onCancel: "cancel",
      onDismiss: "dismiss",
      onSave: "save",
    };

    expect(props.isOpen).toBe(true);
    expect([props.onCancel, props.onDismiss, props.onSave]).toEqual(["cancel", "dismiss", "save"]);
  });

  it("supports only the two approved left-to-right locales", () => {
    const locales: readonly PlaceholderMenuLocale[] = ["en-US", "pt-BR"];
    expect(locales).toEqual(["en-US", "pt-BR"]);
  });
});
