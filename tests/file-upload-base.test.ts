/* oxlint-disable effect/noGlobals -- Browser-native File fixtures prove the component's deterministic selection contract. */
import { it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import { classifyUploadFiles, getReadableFileSize } from "../src/application/file-upload-base.ts";

it("classifies accepted, unaccepted, and oversized files before emitting one typed message", () => {
  const image = new File(["image"], "report.png", { type: "image/png" });
  const text = new File(["text"], "report.txt", { type: "text/plain" });
  const large = new File(["too large"], "large.png", { type: "image/png" });
  const selection = classifyUploadFiles([image, text, large], {
    accept: "image/*",
    maxSize: 6,
  });
  expect(selection.accepted.map((file) => file.name)).toEqual(["report.png"]);
  expect(selection.unaccepted.map((file) => file.name)).toEqual(["report.txt"]);
  expect(selection.oversized.map((file) => file.name)).toEqual(["large.png"]);
});

it("honors single-file mode and formats the upstream file-size labels", () => {
  const first = new File(["first"], "first.pdf", { type: "application/pdf" });
  const second = new File(["second"], "second.pdf", { type: "application/pdf" });
  expect(classifyUploadFiles([first, second], { allowsMultiple: false }).accepted).toEqual([first]);
  expect(getReadableFileSize(0)).toBe("0 KB");
  expect(getReadableFileSize(200_000)).toBe("195 KB");
});
