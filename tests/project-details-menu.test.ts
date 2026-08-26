import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type {
  ProjectDetailsMenuLocale,
  ProjectDetailsMenuProps,
  ProjectDetailsStatus,
} from "../src/application/project-details-menu.ts";
import { projectDetailsMembers } from "../src/application/project-details-menu.ts";

const propsFor = (locale: ProjectDetailsMenuLocale): ProjectDetailsMenuProps<string> => ({
  copied: false,
  description: "A little about the company and the team that you'll be working with.",
  heading: "Marketing site redesign",
  id: "project-details-menu",
  isOpen: true,
  locale,
  members: projectDetailsMembers,
  name: "Marketing site redesign",
  onAddTeamMember: "add-member",
  onApply: "apply",
  onCancel: "cancel",
  onCopy: "copy",
  onDescriptionInput: (value) => `description:${value}`,
  onDismiss: "dismiss",
  onNameInput: (value) => `name:${value}`,
  onRemoveMember: (id) => `remove:${id}`,
  onSaveFilter: "save-filter",
  onStatusFocus: (status) => `focus:${status}`,
  onStatusOpenChanged: (open) => `open:${String(open)}`,
  onStatusSelect: (status) => `select:${status}`,
  selectedStatus: "in-progress",
  shareUrl: "siglata.com/project/marketing-site",
  subtitle: "Redesign of siglata.com",
});

describe("project details menu", () => {
  it("keeps fields, status, membership, actions, copy feedback, and dismissal controlled", () => {
    const props = propsFor("en-US");
    expect(props.onNameInput("Website redesign")).toBe("name:Website redesign");
    expect(props.onDescriptionInput("Public description")).toBe("description:Public description");
    expect(props.onStatusSelect("completed")).toBe("select:completed");
    expect(props.onStatusFocus("draft")).toBe("focus:draft");
    expect(props.onStatusOpenChanged(true)).toBe("open:true");
    expect(props.onRemoveMember("candice-wu")).toBe("remove:candice-wu");
    expect(props.onCopy).toBe("copy");
    expect(props.onApply).toBe("apply");
    expect(props.onDismiss).toBe("dismiss");
  });

  it("preserves the authenticated members and all four project statuses", () => {
    const statuses: readonly ProjectDetailsStatus[] = [
      "draft",
      "in-progress",
      "completed",
      "cancelled",
    ];
    expect(projectDetailsMembers.map(({ email, name }) => ({ email, name }))).toEqual([
      { email: "candice@siglata.com", name: "Candice Wu" },
      { email: "demi@siglata.com", name: "Demi Wilkinson" },
      { email: "drew@siglata.com", name: "Drew Cano" },
    ]);
    expect(statuses).toEqual(["draft", "in-progress", "completed", "cancelled"]);
    expect(propsFor("pt-BR").locale).toBe("pt-BR");
  });
});
