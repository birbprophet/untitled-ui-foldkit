/* oxlint-disable effect/noReturnInArrow -- Type-level controlled component proof. */
import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { FileUploadModalProps } from "../src/application/file-upload-modal.ts";

describe("file upload modal", () => {
  it("keeps uploaded files and actions controlled", () => {
    const props: FileUploadModalProps<string> = {
      files: [{ name: "Tech design requirements.pdf", progress: 100, size: 210_000, type: "pdf" }],
      id: "upload-files",
      isOpen: true,
      onAttach: "attach",
      onCancel: "cancel",
      onDismiss: "dismiss",
      onFilesSelected: (result) => result.accepted.at(0)?.name ?? "none",
    };
    expect(props.files.at(0)?.progress).toBe(100);
    expect(
      props.onFilesSelected({
        accepted: [new File(["report"], "report.pdf", { type: "application/pdf" })],
        oversized: [],
        unaccepted: [],
      }),
    ).toBe("report.pdf");
  });
});
