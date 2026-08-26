/* oxlint-disable @rikalabs/no-low-signal-variable-names, effect/noReturnInArrow, effect/noTernary, effect/noSpread, mps/no-length-comparison, mps/prefer-arr-match -- Feed content is a closed optional-anatomy table from the upstream component. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { avatar } from "../base/avatar.ts";
import type { BadgeColor } from "../base/badges.ts";
import { badge } from "../base/badges.ts";

export interface ActivityFeedUser {
  readonly avatarUrl: string;
  readonly href: string;
  readonly name: string;
  readonly status?: "online" | "offline";
  readonly username?: string;
}

export interface ActivityFeedItem {
  readonly action?: Readonly<{ content: string; href?: string; target?: string }>;
  readonly attachment?: Readonly<{
    name: string;
    size: string;
    type: "jpg" | "txt" | "pdf" | "mp4";
  }>;
  readonly comment?: string;
  readonly date?: string;
  readonly id: string | number;
  readonly labels?: readonly Readonly<{ color: BadgeColor; name: string }>[];
  readonly message?: string;
  readonly unseen?: boolean;
  readonly user: ActivityFeedUser;
}

export interface ActivityFeedProps {
  readonly connector?: boolean;
  readonly item: ActivityFeedItem;
  readonly size?: "sm" | "md";
}

const unseenDot = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaLabel("Unseen"),
      h.Class("absolute top-0 right-0 size-2.5 text-fg-success-secondary"),
      h.Fill("currentColor"),
      h.ViewBox("0 0 10 10"),
    ],
    [h.circle([h.Cx("5"), h.Cy("5"), h.R("4"), h.Stroke("currentColor")])],
  );

const connector = <Message>(h: HtmlBuilder<Message>): Html =>
  h.div(
    [
      h.AriaHidden(true),
      h.Class("relative my-1 flex h-full w-full justify-center self-center overflow-hidden"),
    ],
    [
      h.svg(
        [h.Class("absolute"), h.Attribute("width", "2.4")],
        [
          h.line([
            h.Attribute("x1", "1.2"),
            h.Attribute("x2", "1.2"),
            h.Attribute("y1", "1.2"),
            h.Attribute("y2", "100%"),
            h.Class("stroke-border-primary"),
            h.Stroke("black"),
            h.StrokeDasharray("0,6"),
            h.StrokeLinecap("round"),
            h.StrokeWidth("2.4"),
          ]),
        ],
      ),
    ],
  );

const fileLabelPath = {
  jpg: "M7.651 22.727h1.52v5.071q0 .703-.316 1.222a2.1 2.1 0 0 1-.87.799q-.557.28-1.296.28-.657 0-1.193-.23a1.9 1.9 0 0 1-.845-.71q-.313-.48-.31-1.204h1.531q.007.287.118.493a.8.8 0 0 0 .308.313 1 1 0 0 0 .47.106q.283 0 .479-.12a.8.8 0 0 0 .301-.363q.104-.238.103-.586zM10.443 30v-7.273h2.869q.828 0 1.41.316.582.314.888.87.309.555.309 1.279t-.313 1.278-.905.863-1.428.309h-1.829V26.41h1.58q.444 0 .732-.153.29-.156.433-.43.146-.276.146-.635 0-.363-.146-.632a.97.97 0 0 0-.433-.423q-.29-.153-.739-.153H11.98V30zm11.297-4.922a1.6 1.6 0 0 0-.21-.458q-.135-.203-.33-.34a1.4 1.4 0 0 0-.44-.218 1.9 1.9 0 0 0-.544-.074q-.557 0-.98.277-.42.277-.653.806-.235.526-.235 1.285 0 .76.231 1.293t.654.813q.422.277.997.277.523 0 .892-.184.373-.188.568-.53.2-.34.199-.805l.312.046h-1.875v-1.158h3.044v.916q0 .96-.405 1.648-.405.686-1.115 1.058-.71.37-1.627.37-1.022 0-1.796-.452a3.13 3.13 0 0 1-1.208-1.289q-.43-.837-.43-1.988 0-.884.256-1.577.26-.696.724-1.179.465-.483 1.084-.735a3.5 3.5 0 0 1 1.338-.252q.618 0 1.151.18.532.179.945.505.415.327.678.778.263.447.337.987z",
  mp4: "M4.93 22.727h1.897l2.003 4.887h.085l2.003-4.887h1.897V30h-1.492v-4.734h-.06L9.38 29.965H8.365l-1.882-4.716h-.06V30H4.93zM14.082 30v-7.273h2.87q.827 0 1.41.316.582.314.887.87.31.555.31 1.279t-.313 1.278q-.313.555-.906.863-.59.309-1.427.309h-1.83V26.41h1.581q.444 0 .732-.153.29-.156.433-.43.145-.276.145-.635 0-.363-.145-.632a.97.97 0 0 0-.433-.423q-.291-.153-.74-.153H15.62V30zm6.322-1.278V27.51l3.037-4.784h1.043v1.676h-.617l-1.915 3.03v.056h4.315v1.233zM23.894 30v-1.648l.028-.536v-5.089h1.442V30z",
  pdf: "M4.832 30v-7.273h2.87q.826 0 1.41.316.582.314.887.87.31.555.31 1.279t-.313 1.278q-.313.555-.906.863-.59.309-1.427.309h-1.83V26.41h1.581q.444 0 .732-.153.29-.156.433-.43.145-.276.145-.635 0-.363-.145-.632a.97.97 0 0 0-.433-.423q-.291-.153-.74-.153H6.37V30zm9.053 0h-2.578v-7.273h2.6q1.095 0 1.889.437.791.433 1.218 1.246.43.814.43 1.947 0 1.136-.43 1.953a2.95 2.95 0 0 1-1.226 1.253q-.795.437-1.903.437m-1.04-1.317h.976q.682 0 1.147-.242.47-.244.703-.756.238-.516.238-1.328 0-.807-.238-1.318a1.54 1.54 0 0 0-.7-.753q-.465-.24-1.146-.241h-.98zM18.582 30v-7.273h4.816v1.268H20.12v1.733h2.958v1.268H20.12V30z",
  txt: "M4.601 23.995v-1.268h5.973v1.268H8.348V30h-1.52v-6.005zM13 22.727l1.466 2.479h.057l1.474-2.479h1.736l-2.22 3.637L17.784 30h-1.768l-1.492-2.482h-.057L12.975 30h-1.762l2.277-3.636-2.234-3.637zm5.43 1.268v-1.268h5.972v1.268h-2.226V30h-1.52v-6.005z",
} as const;

const fileBadge = {
  jpg: { color: "#0B7D74", width: "26" },
  mp4: { color: "#155EEF", width: "29" },
  pdf: { color: "#D92D20", width: "26" },
  txt: { color: "#475467", width: "27" },
} as const;

const fileSvg = <Message>(
  type: "jpg" | "txt" | "pdf" | "mp4",
  theme: "light" | "dark",
  h: HtmlBuilder<Message>,
): Html => {
  const fileBadgeStyle = fileBadge[type];
  return h.svg(
    [
      h.AriaHidden(true),
      h.Class(theme === "light" ? "size-10 dark:hidden" : "size-10 not-dark:hidden"),
      h.Fill("none"),
      h.ViewBox("0 0 40 40"),
    ],
    [
      h.path([
        h.D(
          "M7.75 4A3.25 3.25 0 0 1 11 .75h16c.121 0 .238.048.323.134l10.793 10.793a.46.46 0 0 1 .134.323v24A3.25 3.25 0 0 1 35 39.25H11A3.25 3.25 0 0 1 7.75 36z",
        ),
        h.Stroke(theme === "light" ? "#D5D7DA" : "#373A41"),
        h.StrokeWidth("1.5"),
      ]),
      h.path([
        h.D("M27 .5V8a4 4 0 0 0 4 4h7.5"),
        h.Stroke(theme === "light" ? "#D5D7DA" : "#373A41"),
        h.StrokeWidth("1.5"),
      ]),
      h.rect([
        h.X("1"),
        h.Y("18"),
        h.Width(fileBadgeStyle.width),
        h.Height("16"),
        h.Rx("2"),
        h.Fill(type === "pdf" && theme === "dark" ? "#F97066" : fileBadgeStyle.color),
      ]),
      h.path([h.D(fileLabelPath[type]), h.Fill("#fff")]),
    ],
  );
};

const fileIcon = <Message>(
  type: ActivityFeedItem["attachment"] extends infer _Attachment
    ? "jpg" | "txt" | "pdf" | "mp4"
    : never,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("relative flex size-10 shrink-0 items-center justify-center")],
    [fileSvg(type, "light", h), fileSvg(type, "dark", h)],
  );

const action = <Message>(feedItem: ActivityFeedItem, h: HtmlBuilder<Message>): readonly Html[] =>
  feedItem.action === undefined
    ? []
    : [
        h.p(
          [h.Class("text-sm text-text-tertiary")],
          [
            feedItem.action.content,
            ...(feedItem.action.target === undefined
              ? []
              : [
                  " ",
                  h.a(
                    [
                      h.Class(
                        "rounded text-sm font-medium text-text-brand-secondary outline-focus-ring hover:underline focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.Href(feedItem.action.href ?? "#"),
                    ],
                    [feedItem.action.target],
                  ),
                ]),
          ],
        ),
      ];

export const activityFeed = <Message>(props: ActivityFeedProps, h: HtmlBuilder<Message>): Html => {
  const feedItem = props.item;
  const connected = props.connector === true;
  const size = props.size ?? "md";
  return h.article(
    [h.Class("relative flex gap-3")],
    [
      ...(feedItem.unseen === true ? [unseenDot(h)] : []),
      h.div(
        [h.Class("flex shrink-0 flex-col")],
        [
          avatar(
            {
              alt: feedItem.user.name,
              size,
              src: feedItem.user.avatarUrl,
              status: feedItem.user.status,
            },
            h,
          ),
          ...(connected ? [connector(h)] : []),
        ],
      ),
      h.div(
        [h.Class(`flex flex-1 flex-col gap-3 ${connected ? "pb-8" : ""}`)],
        [
          h.header(
            [],
            [
              h.div(
                [h.Class("flex items-center gap-2")],
                [
                  h.a(
                    [
                      h.Class(
                        "rounded text-sm font-medium text-text-secondary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.Href(feedItem.user.href),
                    ],
                    [feedItem.user.name],
                  ),
                  ...(feedItem.date === undefined
                    ? []
                    : [
                        h.time(
                          [h.Class("text-xs text-text-tertiary"), h.Datetime(feedItem.date)],
                          [feedItem.date],
                        ),
                      ]),
                ],
              ),
              ...action(feedItem, h),
              ...(feedItem.user.username === undefined
                ? []
                : [h.p([h.Class("text-sm text-text-tertiary")], [feedItem.user.username])]),
            ],
          ),
          ...(feedItem.attachment === undefined
            ? []
            : [
                h.figure(
                  [h.Class("flex gap-3")],
                  [
                    fileIcon(feedItem.attachment.type, h),
                    h.figcaption(
                      [],
                      [
                        h.p(
                          [h.Class("text-sm font-medium text-text-secondary")],
                          [feedItem.attachment.name],
                        ),
                        h.p([h.Class("text-sm text-text-tertiary")], [feedItem.attachment.size]),
                      ],
                    ),
                  ],
                ),
              ]),
          ...(feedItem.labels === undefined || feedItem.labels.length === 0
            ? []
            : [
                h.aside(
                  [h.AriaLabel("Labels"), h.Class("flex gap-1")],
                  feedItem.labels.map((label) =>
                    badge({ color: label.color, label: label.name, size: "sm" }, h),
                  ),
                ),
              ]),
          ...(feedItem.comment === undefined
            ? []
            : [h.q([h.Class("text-sm text-text-tertiary")], [feedItem.comment])]),
          ...(feedItem.message === undefined
            ? []
            : [
                h.section(
                  [
                    h.Class(
                      `gap-2 rounded-lg rounded-tl-none p-3 text-sm text-text-secondary ring-1 ring-border-secondary ring-inset ${connected ? "py-2.5" : ""}`,
                    ),
                  ],
                  [feedItem.message],
                ),
              ]),
        ],
      ),
    ],
  );
};
