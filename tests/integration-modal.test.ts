import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { IntegrationModalProps } from "../src/application/integration-modal.ts";

describe("integration modal", () => {
  it("keeps copy, connect, documentation, and dismissal controlled", () => {
    const props: IntegrationModalProps<string> = {
      copied: false,
      description: "Description",
      id: "integration",
      integrationIconUrl: "/linear.png",
      integrationName: "Linear",
      isOpen: true,
      linkUrl: "siglata.com/integrations/linear",
      onConnect: "connect",
      onCopy: "copy",
      onDismiss: "dismiss",
      onDocumentation: "documentation",
      permissions: [{ long: "Long permission", short: "Short permission" }],
    };
    expect(props.onCopy).toBe("copy");
    expect(props.permissions[0]?.short).toBe("Short permission");
  });
});
