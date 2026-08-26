/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/complexity, eslint/no-nested-ternary -- The authenticated empty-state source exposes one closed composition with six header treatments. */
import { blobatarDataUri } from "avatar";
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import type { ButtonSize } from "../base/button.ts";
import { emptyStateCloudLg } from "../internal/empty-state-cloud.ts";
import { emptyStatePatternMd } from "../internal/empty-state-pattern.ts";

export type EmptyStateDecoration =
  | "avatar-grid"
  | "avatar-radius"
  | "avatar-row"
  | "featured-icon"
  | "file-type"
  | "illustration";
export type EmptyStateSize = "sm" | "md" | "lg";

export interface EmptyStateProps<Message> {
  readonly actionSize?: ButtonSize;
  readonly confirmLabel?: string;
  readonly confirmIcon?: Html;
  readonly confirmMessage?: NoInfer<Message>;
  readonly contentMargin?: "default" | "none";
  readonly decoration?: EmptyStateDecoration;
  readonly description: string;
  readonly descriptionLines?: readonly string[];
  readonly dismissLabel?: string;
  readonly dismissMessage?: NoInfer<Message>;
  readonly pattern?: "circle" | "none";
  readonly size?: EmptyStateSize;
  readonly title: string;
}

const searchIcon = <Message>(h: HtmlBuilder<Message>, className = "size-7"): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class(className), h.Fill("none"), h.ViewBox("0 0 24 24")],
    [
      h.path([
        h.D("m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const backgroundPattern = <Message>(h: HtmlBuilder<Message>): Html =>
  h.div([h.InnerHTML(emptyStatePatternMd)]);

const featuredIcon = <Message>(size: EmptyStateSize, h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      h.Class(
        `relative z-10 flex items-center justify-center rounded-xl bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset ${size === "lg" ? "size-14" : "size-12"}`,
      ),
    ],
    [searchIcon(h, size === "lg" ? "size-7" : "size-6")],
  );

const fileTypeIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      h.Class(
        "relative z-10 flex rounded-full bg-linear-to-b from-utility-neutral-50 to-utility-neutral-200 p-8",
      ),
    ],
    [
      h.svg(
        [h.AriaHidden(true), h.Class("size-10 drop-shadow-sm"), h.ViewBox("0 0 40 40")],
        [
          h.path([
            h.D("M4 10a4 4 0 0 1 4-4h8l4 4h12a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V10Z"),
            h.Fill("var(--color-bg-brand-solid)"),
          ]),
          h.path([
            h.D("M4.5 15.5h31v14A3.5 3.5 0 0 1 32 33H8a3.5 3.5 0 0 1-3.5-3.5v-14Z"),
            h.Fill("var(--color-bg-brand-solid-hover)"),
            h.Stroke("var(--color-border-brand-solid)"),
          ]),
        ],
      ),
    ],
  );

const illustration = <Message>(size: EmptyStateSize, h: HtmlBuilder<Message>): Html => {
  if (size === "lg") {
    return h.div([h.InnerHTML(emptyStateCloudLg)]);
  }
  const dimensions = size === "sm" ? "h-30 w-38" : size === "md" ? "h-32 w-43" : "h-40 w-55";
  const circle = size === "sm" ? "size-26" : size === "md" ? "size-32" : "size-40";
  const cloudScale = size === "sm" ? "scale-70" : size === "md" ? "scale-80" : "scale-100";
  return h.div(
    [
      h.Class(`relative z-10 flex items-center justify-center ${dimensions}`),
      h.Role("img"),
      h.AriaLabel("Search"),
    ],
    [
      h.div([h.Class(`absolute rounded-full bg-utility-neutral-100 ${circle}`)]),
      h.div(
        [h.Class(`absolute bottom-11 h-25 w-44 drop-shadow-lg ${cloudScale}`)],
        [
          h.span([
            h.Class(
              "absolute bottom-0 left-0 size-20 rounded-full bg-linear-to-br from-utility-neutral-200 to-utility-neutral-50 ring-1 ring-border-secondary-alt",
            ),
          ]),
          h.span([
            h.Class(
              "absolute bottom-0 left-11 size-25 rounded-full bg-linear-to-br from-utility-neutral-200 to-utility-neutral-50 ring-1 ring-border-secondary-alt",
            ),
          ]),
          h.span([
            h.Class(
              "absolute right-0 bottom-0 size-17.5 rounded-full bg-linear-to-br from-utility-neutral-200 to-utility-neutral-50 ring-1 ring-border-secondary-alt",
            ),
          ]),
        ],
      ),
      h.span(
        [
          h.Class(
            `absolute bottom-2 flex items-center justify-center rounded-full bg-alpha-black/20 text-fg-white backdrop-blur-xs ${size === "sm" ? "size-12" : "size-14"}`,
          ),
        ],
        [searchIcon(h)],
      ),
    ],
  );
};

const agentImage = <Message>(seed: string, size: string, h: HtmlBuilder<Message>): Html =>
  h.img([
    h.Alt(""),
    h.Class(
      `${size} shrink-0 rounded-lg object-cover outline-[0.5px] -outline-offset-[0.5px] outline-black/16`,
    ),
    h.Src(blobatarDataUri(seed, { background: "circle", kind: "agent", size: 128, title: seed })),
  ]);

const avatarRow = <Message>(size: EmptyStateSize, h: HtmlBuilder<Message>): Html => {
  const avatarSize = size === "sm" ? "size-9" : size === "md" ? "size-11" : "size-12";
  return h.div(
    [h.AriaHidden(true), h.Class("relative z-10 flex items-center justify-center gap-4")],
    ["one", "two", "three", "four", "five", "six"].map((seed) =>
      agentImage(`empty-row-${seed}`, avatarSize, h),
    ),
  );
};

const avatarGrid = <Message>(size: EmptyStateSize, h: HtmlBuilder<Message>): Html => {
  const avatarSize = size === "sm" ? "size-8" : size === "md" ? "size-10" : "size-12";
  return h.div(
    [
      h.AriaHidden(true),
      h.Class(
        "relative z-10 -m-1 grid grid-cols-6 gap-3 overflow-hidden p-1 [mask-image:radial-gradient(circle,black_10%,transparent_100%)]",
      ),
    ],
    Array.from({ length: 12 }, (_, index) =>
      agentImage(`empty-grid-${String(index)}`, avatarSize, h),
    ),
  );
};

const avatarRadius = <Message>(h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.AriaHidden(true), h.Class("relative z-10 size-24")],
    [
      ...[48, 80].map((radius) =>
        h.div([
          h.Class(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border-secondary",
          ),
          h.Style({ height: `${String(radius * 2)}px`, width: `${String(radius * 2)}px` }),
        ]),
      ),
      h.div(
        [h.Class("absolute -top-1 left-1/2 -translate-x-1/2")],
        [agentImage("empty-radius-one", "size-8 rounded-full", h)],
      ),
      h.div(
        [h.Class("absolute right-0 bottom-0")],
        [agentImage("empty-radius-two", "size-8 rounded-full", h)],
      ),
      h.div(
        [h.Class("absolute bottom-0 left-0")],
        [agentImage("empty-radius-three", "size-8 rounded-full", h)],
      ),
    ],
  );

const decoration = <Message>(
  kind: EmptyStateDecoration,
  size: EmptyStateSize,
  h: HtmlBuilder<Message>,
): Html =>
  kind === "featured-icon"
    ? featuredIcon(size, h)
    : kind === "file-type"
      ? fileTypeIcon(h)
      : kind === "illustration"
        ? illustration(size, h)
        : kind === "avatar-row"
          ? avatarRow(size, h)
          : kind === "avatar-grid"
            ? avatarGrid(size, h)
            : avatarRadius(h);

export const emptyState = <Message>(
  props: EmptyStateProps<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const size = props.size ?? "lg";
  const decorationType = props.decoration ?? "featured-icon";
  const hasActions = props.confirmMessage !== undefined || props.dismissMessage !== undefined;
  const icon = decoration(decorationType, size, h);
  return h.div(
    [h.Class("relative mx-auto flex w-full max-w-lg flex-col items-center justify-center")],
    [
      h.header(
        [
          h.Class(
            `relative ${decorationType === "illustration" && size === "lg" ? "mb-6" : size === "sm" ? "mb-4" : "mb-5"}`,
          ),
        ],
        [...(props.pattern === "none" ? [] : [backgroundPattern(h)]), icon],
      ),
      h.main(
        [
          h.Class(
            `z-10 flex w-full max-w-88 flex-col items-center justify-center ${props.contentMargin === "none" ? "mb-0" : size === "sm" ? "mb-6" : "mb-8"} ${size === "sm" ? "gap-1" : "gap-2"}`,
          ),
        ],
        [
          h.h2(
            [
              h.Class(
                `${size === "sm" ? "text-md" : size === "md" ? "text-lg" : "text-xl"} font-semibold text-text-primary`,
              ),
            ],
            [props.title],
          ),
          h.p(
            [h.Class(`text-center text-text-tertiary ${size === "lg" ? "text-md" : "text-sm"}`)],
            props.descriptionLines === undefined
              ? [props.description]
              : props.descriptionLines.flatMap((line, index) =>
                  index === 0 ? [line] : [h.br([]), line],
                ),
          ),
        ],
      ),
      ...(hasActions
        ? [
            h.footer(
              [h.Class("z-10 flex gap-3")],
              [
                ...(props.dismissMessage === undefined
                  ? []
                  : [
                      button(
                        {
                          color: "secondary",
                          label: props.dismissLabel ?? "Cancel",
                          onPress: props.dismissMessage,
                          size: props.actionSize ?? "sm",
                        },
                        h,
                      ),
                    ]),
                ...(props.confirmMessage === undefined
                  ? []
                  : [
                      button(
                        {
                          color: "primary",
                          iconLeadingElement: props.confirmIcon,
                          label: props.confirmLabel ?? "Create new",
                          onPress: props.confirmMessage,
                          size: props.actionSize ?? "sm",
                        },
                        h,
                      ),
                    ]),
              ],
            ),
          ]
        : []),
    ],
  );
};
