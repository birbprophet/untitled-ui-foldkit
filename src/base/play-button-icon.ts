import type { Html, HtmlBuilder } from "foldkit/html";

export interface PlayButtonIconProps {
  readonly className?: string;
}

export const playButtonIcon = <Message>(
  props: PlayButtonIconProps,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.AriaHidden(true),
      h.Class(
        `flex size-20 items-center justify-center rounded-full bg-alpha-white/30 backdrop-blur transition duration-100 ease-linear group-hover:bg-alpha-white/50 hover:bg-alpha-white/50 ${props.className ?? ""}`,
      ),
    ],
    [
      h.svg(
        [h.Class("size-5 text-white"), h.Fill("none"), h.ViewBox("0 0 16 16")],
        [
          h.path([
            h.D(
              "M2.19995 2.86327C2.19995 1.61155 3.57248 0.844595 4.63851 1.50061L12.9856 6.63731C14.0009 7.26209 14.0009 8.73784 12.9856 9.36262L4.63851 14.4993C3.57247 15.1553 2.19995 14.3884 2.19995 13.1367V2.86327Z",
            ),
            h.Fill("currentColor"),
          ]),
        ],
      ),
    ],
  );
