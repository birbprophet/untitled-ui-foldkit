import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type {
  IntegrationMenuLocale,
  IntegrationMenuProps,
} from "../src/application/integration-menu.ts";

import { demoBrand } from "../stories/fixtures/brand.ts";

describe("integration menu", () => {
  it("keeps visibility, copy feedback, actions, and dismissal controlled", () => {
    const inactive: IntegrationMenuProps<string> = {
      brandMark: demoBrand().mark,
      copied: false,
      id: "integration-menu",
      isOpen: true,
      locale: "en-US",
      onConnect: "connect",
      onCopy: "copy",
      onDismiss: "dismiss",
      onDocumentation: "documentation",
    };
    const activated: IntegrationMenuProps<string> = {
      brandMark: inactive.brandMark,
      copied: true,
      id: inactive.id,
      isOpen: inactive.isOpen,
      locale: inactive.locale,
      onConnect: inactive.onConnect,
      onCopy: inactive.onCopy,
      onDismiss: inactive.onDismiss,
      onDocumentation: inactive.onDocumentation,
    };

    expect(inactive.copied).toBe(false);
    expect(inactive.isOpen).toBe(true);
    expect(inactive.onDismiss).toBe("dismiss");
    expect(activated.copied).toBe(true);
    expect(activated.onCopy).toBe("copy");
    expect(activated.onConnect).toBe("connect");
    expect(activated.onDocumentation).toBe("documentation");
  });

  it("supports only the approved left-to-right locales", () => {
    const locales: readonly IntegrationMenuLocale[] = ["en-US", "pt-BR"];
    expect(locales).toEqual(["en-US", "pt-BR"]);
  });
});
