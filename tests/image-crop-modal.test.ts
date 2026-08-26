import { describe, it } from "@effect/vitest";
import { expect } from "./assertions.ts";

import type { ImageCropModalProps } from "../src/application/image-crop-modal.ts";

describe("image crop modal", () => {
  it("keeps selection, crop, upload, and actions controlled", () => {
    const props: ImageCropModalProps<string> = {
      cropHeightPercent: 51.0208333333,
      cropTopPercent: 24.484375,
      id: "crop",
      images: [{ alt: "Option 1", src: "/option.webp" }],
      isOpen: true,
      onCancel: "cancel",
      onCropKeyboardMove: (deltaPercent) => `keyboard:${String(deltaPercent)}`,
      onCropPointerDown: (screenY) => `start:${String(screenY)}`,
      onCropPointerMove: (screenY) => `move:${String(screenY)}`,
      onCropPointerUp: "end",
      onDismiss: "dismiss",
      onImageSelected: (src) => `select:${src}`,
      onSave: "save",
      onUpload: (result) => String(result.accepted.length),
      selectedSrc: "/option.webp",
    };
    expect(props.onCropPointerMove(40)).toBe("move:40");
    expect(props.onCropKeyboardMove(-1)).toBe("keyboard:-1");
    expect(props.onImageSelected("/next.webp")).toBe("select:/next.webp");
  });
});
