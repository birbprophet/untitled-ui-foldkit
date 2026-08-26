import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { NewProjectModalProps } from "../src/application/new-project-modal.ts";

describe("new project modal", () => {
  it("keeps form, selection, upload, and actions controlled", () => {
    const props: NewProjectModalProps<string> = {
      id: "new-project",
      isDraggingOver: false,
      isOpen: true,
      name: "About us",
      onCreate: "create",
      onDismiss: "dismiss",
      onDragState: (dragging) => `drag:${String(dragging)}`,
      onFilesSelected: (result) => `files:${String(result.accepted.length)}`,
      onNameInput: (value) => `name:${value}`,
      onSaveDraft: "draft",
      onSchedule: "schedule",
      onTagInput: (value) => `tags:${value}`,
      onTagSelect: (tag) => `tag:${tag}`,
      onTeamFocus: (id) => `focus:${id}`,
      onTeamOpenChanged: (open) => `open:${String(open)}`,
      onTeamSelect: (id) => `team:${id}`,
      selectedTeamId: "watchtower",
      tagInput: "",
    };
    expect(props.onNameInput("Website")).toBe("name:Website");
    expect(props.onTeamSelect("ephemeral")).toBe("team:ephemeral");
    expect(props.onTagSelect("Figma")).toBe("tag:Figma");
  });
});
