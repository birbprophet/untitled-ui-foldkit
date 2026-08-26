import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type {
  FileUploadMenuFile,
  FileUploadMenuProps,
  FileUploadMenuStatus,
} from "../src/application/file-upload-menu.ts";

const files: readonly FileUploadMenuFile<string>[] = [
  {
    id: "tech-design",
    name: "Tech design requirements.pdf",
    onDelete: "delete:tech-design",
    onRetry: "retry:tech-design",
    progress: 100,
    size: 204_800,
    status: "complete",
    type: "pdf",
  },
  {
    id: "dashboard-recording",
    name: "Dashboard recording.mp4",
    onDelete: "delete:dashboard-recording",
    onRetry: "retry:dashboard-recording",
    progress: 40,
    size: 16_777_216,
    status: "uploading",
    type: "mp4",
  },
  {
    id: "failed-upload",
    name: "Failed upload.fig",
    onDelete: "delete:failed-upload",
    onRetry: "retry:failed-upload",
    progress: 32,
    size: 4_404_019,
    status: "failed",
    type: "fig",
  },
];
const ptBrLocale: FileUploadMenuProps<string>["locale"] = "pt-BR";

describe("file upload menu", () => {
  it("keeps upload, drag, progress, success, failure, retry, and actions controlled", () => {
    const props: FileUploadMenuProps<string> = {
      files,
      id: "file-upload-menu",
      isDraggingOver: false,
      isInvalid: false,
      isOpen: true,
      locale: "en-US",
      onAttach: "attach",
      onCancel: "cancel",
      onDismiss: "dismiss",
      onDragState: (isDraggingOver) => `drag:${String(isDraggingOver)}`,
      onFilesSelected: (selected) => `files:${String(selected.length)}`,
    };
    const statuses: readonly FileUploadMenuStatus[] = props.files.map((file) => file.status);

    expect(statuses).toEqual(["complete", "uploading", "failed"]);
    expect(props.files.map(({ progress }) => progress)).toEqual([100, 40, 32]);
    expect(props.onDragState(true)).toBe("drag:true");
    expect(props.onDragState(false)).toBe("drag:false");
    expect(props.onFilesSelected([new File(["report"], "report.png")])).toBe("files:1");
    expect(props.files[2]?.onRetry).toBe("retry:failed-upload");
    expect(ptBrLocale).toBe("pt-BR");
  });
});
