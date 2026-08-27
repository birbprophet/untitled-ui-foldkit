import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { StackedWithTeamModalProps } from "../src/application/stacked-with-team-modal.ts";

const teamAvatar = (fill: string): string =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%23${fill}'/%3E%3C/svg%3E`;

describe("stacked with team modal", () => {
  it("keeps dialog visibility and each exit action controlled", () => {
    const props: StackedWithTeamModalProps<string> = {
      id: "stacked-team",
      isOpen: true,
      onCancel: "cancel",
      onDismiss: "dismiss",
      onGetStarted: "get-started",
      teamMembers: [
        { avatarUrl: teamAvatar("7f56d9"), name: "Caitlyn King" },
        { avatarUrl: teamAvatar("9e77ed"), name: "Sienna Hewitt" },
        { avatarUrl: teamAvatar("b692f6"), name: "Olly Schroeder" },
      ],
    };

    expect(props.isOpen).toBe(true);
    expect(props.onCancel).toBe("cancel");
    expect(props.onDismiss).toBe("dismiss");
    expect(props.onGetStarted).toBe("get-started");
    expect(props.teamMembers).toHaveLength(3);
    expect(props.teamMembers[1]?.name).toBe("Sienna Hewitt");
  });
});
