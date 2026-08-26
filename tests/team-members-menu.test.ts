import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { teamMembersMenuFixture } from "../src/application/team-members-menu.ts";
import type { TeamMembersMenuProps } from "../src/application/team-members-menu.ts";

describe("team members menu", () => {
  it("preserves the authenticated member order, groups, and controlled actions", () => {
    const members = teamMembersMenuFixture("en-US");
    const props: TeamMembersMenuProps<string> = {
      focusedMemberId: "drew-cano",
      id: "team-members",
      isOpen: true,
      isSearchOpen: true,
      locale: "en-US",
      members,
      onCancel: "cancel",
      onConfirm: "confirm",
      onDismiss: "dismiss",
      onEmailMember: (memberId) => `email:${memberId}`,
      onMemberFocus: (memberId) => `focus:${memberId}`,
      onMemberSelect: (memberId) => `select:${memberId}`,
      onSaveFilter: "save-filter",
      onSearchClose: "search-close",
      onSearchInput: (value) => `search:${value}`,
      onSearchOpen: "search-open",
      searchQuery: "Drew",
      selectedMemberId: "drew-cano",
    };

    expect(members).toHaveLength(11);
    expect(members.filter((member) => member.group === "design")).toHaveLength(4);
    expect(members.filter((member) => member.group === "product")).toHaveLength(6);
    expect(members.filter((member) => member.group === "marketing")).toHaveLength(1);
    expect(members.filter((member) => member.searchable)).toHaveLength(9);
    expect(members.find((member) => member.id === "kate-morrison")?.searchable).toBe(false);
    expect(members.map((member) => member.name)).toEqual([
      "Olivia Rhye",
      "Natali Craig",
      "Drew Cano",
      "Orlando Diggs",
      "Phoenix Baker",
      "Lana Steiner",
      "Demi Wilkinson",
      "Candice Wu",
      "Andi Lane",
      "Kate Morrison",
      "Kelly Wiliams",
    ]);
    expect(props.onMemberFocus("olivia-rhye")).toBe("focus:olivia-rhye");
    expect(props.onMemberSelect("drew-cano")).toBe("select:drew-cano");
    expect(props.onEmailMember("drew-cano")).toBe("email:drew-cano");
    expect(props.onSearchInput("Drew")).toBe("search:Drew");
    expect(props.onConfirm).toBe("confirm");
  });

  it("localizes customer copy while preserving deterministic Siglata identities", () => {
    const english = teamMembersMenuFixture("en-US");
    const portuguese = teamMembersMenuFixture("pt-BR");

    expect(portuguese[0]?.role).toBe("Design de produto");
    expect(portuguese[5]?.role).toBe("Desenvolvimento frontend");
    expect(portuguese[9]?.role).toBe("Engenharia de qualidade");
    expect(portuguese.map((member) => member.avatarSeed)).toEqual(
      english.map((member) => member.avatarSeed),
    );
    expect(new Set(english.map((member) => member.avatarKind))).toEqual(
      new Set(["agent", "robot"]),
    );
  });
});
