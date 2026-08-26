import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type {
  StackedWithTeamAndInvitesFeaturedMember,
  StackedWithTeamAndInvitesMember,
  StackedWithTeamAndInvitesModalProps,
} from "../src/application/stacked-with-team-and-invites-modal.ts";

describe("stacked with team and invites modal", () => {
  it("keeps membership selection and dialog actions controlled", () => {
    const featuredMembers: readonly StackedWithTeamAndInvitesFeaturedMember[] = [
      { avatarSeed: "phoenix-baker", name: "Phoenix Baker" },
      { avatarSeed: "olivia-rhye", name: "Olivia Rhye" },
      { avatarSeed: "lana-steiner", name: "Lana Steiner" },
    ];
    const members: readonly StackedWithTeamAndInvitesMember[] = [
      {
        avatarSeed: "candice-wu",
        id: "candice",
        name: "Candice Wu",
        role: "Admin",
        username: "@candice",
      },
      {
        avatarSeed: "drew-cano",
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
