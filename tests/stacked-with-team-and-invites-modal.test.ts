import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type {
  StackedWithTeamAndInvitesFeaturedMember,
  StackedWithTeamAndInvitesMember,
  StackedWithTeamAndInvitesModalProps,
} from "../src/application/stacked-with-team-and-invites-modal.ts";

const memberAvatar = (fill: string): string =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%23${fill}'/%3E%3C/svg%3E`;

describe("stacked with team and invites modal", () => {
  it("keeps membership selection and dialog actions controlled", () => {
    const featuredMembers: readonly StackedWithTeamAndInvitesFeaturedMember[] = [
      { avatarUrl: memberAvatar("7f56d9"), name: "Phoenix Baker" },
      { avatarUrl: memberAvatar("9e77ed"), name: "Olivia Rhye" },
      { avatarUrl: memberAvatar("b692f6"), name: "Lana Steiner" },
    ];
    const members: readonly StackedWithTeamAndInvitesMember[] = [
      {
        avatarUrl: memberAvatar("d6bbfb"),
        id: "candice",
        name: "Candice Wu",
        role: "Admin",
        username: "@candice",
      },
      {
        avatarUrl: memberAvatar("444ce0"),
        id: "drew",
        name: "Drew Cano",
        role: "Editor",
        username: "@drew",
      },
    ];
    const props: StackedWithTeamAndInvitesModalProps<string> = {
      featuredMembers,
      id: "team-invites",
      isOpen: true,
      members,
      onAddToProject: "add",
      onCancel: "cancel",
      onDismiss: "dismiss",
      onMemberToggle: (memberId) => `toggle:${memberId}`,
      selectedMemberIds: ["candice"],
    };
    expect(props.featuredMembers).toHaveLength(3);
    expect(props.members).toHaveLength(2);
    expect(props.selectedMemberIds).toEqual(["candice"]);
    expect(props.onMemberToggle("drew")).toBe("toggle:drew");
    expect(props.onAddToProject).toBe("add");
    expect(props.onDismiss).toBe("dismiss");
  });
});
