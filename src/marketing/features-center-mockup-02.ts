/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI features section. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface FeaturesCenterMockup02Item {
  readonly icon:
    | "chat"
    | "zap"
    | "chart"
    | "command"
    | "heart"
    | "smile"
    | "layers"
    | "users"
    | "shield";
  readonly id: string;
  readonly subtitle: string;
  readonly title: string;
}

export interface FeaturesCenterMockup02Props<Message> {
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly items: readonly FeaturesCenterMockup02Item[];
  readonly onItem?: (id: string) => NoInfer<Message>;
  readonly imageAlt?: string;
  readonly imageSrc?: string;
  readonly mockupDarkSrc?: string;
  readonly mockupLightSrc?: string;
}

const iconPaths: Record<FeaturesCenterMockup02Item["icon"], readonly string[]> = {
  chart: [
    "M11 3H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 5.28 3 6.12 3 7.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 21 6.12 21 7.8 21h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 18.72 21 17.88 21 16.2V13m-9-5h4v4m-.5-8.5V2m3.94 2.56L20.5 3.5m.01 5h1.5M3 13.347c.652.1 1.32.153 2 .153 4.386 0 8.265-2.172 10.62-5.5",
  ],
  chat: [
    "M6.094 11.229A8.01 8.01 0 0 1 6 10c0-4.418 3.605-8 8.053-8 4.447 0 8.052 3.582 8.052 8a7.94 7.94 0 0 1-.52 2.835c-.07.182-.105.274-.12.345a.897.897 0 0 0-.024.194c-.002.073.008.153.028.314l.403 3.27c.043.355.065.532.006.66a.5.5 0 0 1-.257.252c-.13.055-.306.03-.66-.022l-3.184-.467c-.167-.024-.25-.037-.326-.036a.898.898 0 0 0-.2.021 2.989 2.989 0 0 0-.358.122 8.174 8.174 0 0 1-4.07.42M7.632 22C10.597 22 13 19.538 13 16.5S10.597 11 7.632 11c-2.965 0-5.369 2.462-5.369 5.5 0 .61.097 1.198.277 1.747.075.232.113.348.126.427.013.083.015.13.01.213-.005.08-.025.17-.065.351L2 22l2.995-.409c.163-.022.245-.034.316-.033.076 0 .115.005.19.02.07.013.173.05.381.123a5.246 5.246 0 0 0 1.75.299Z",
  ],
  command: ["M9 7h6m-3-3v6m7 1v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"],
  heart: ["M19.5 12.572l-7.5 7.428-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572"],
  layers: ["M12 2 2 7l10 5 10-5-10-5Zm0 9L2 7v10l10 5 10-5V7l-10 5Z"],
  shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"],
  smile: [
    "M9 14s1.312 1.5 3.5 1.5c2.187 0 3.5-1.5 3.5-1.5m-.75-5h.01M9.75 9h.01m2.74 11a8.5 8.5 0 1 0-8.057-5.783c.108.32.162.481.172.604a.899.899 0 0 1-.028.326c-.03.12-.098.245-.232.494l-1.636 3.027c-.233.432-.35.648-.324.815a.5.5 0 0 0 .234.35c.144.087.388.062.876.011l5.121-.529c.155-.016.233-.024.303-.021.07.002.12.009.187.024.069.016.155.05.329.116A8.478 8.478 0 0 0 12.5 20Zm3.25-11a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm-5.5 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z",
  ],
  users: [
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm10 0a3 3 0 1 0 0-6",
  ],
  zap: [
    "M9 17.5H3.5m3-5.5H2m7-5.5H4M17 3l-6.596 9.235c-.292.409-.438.613-.432.784a.5.5 0 0 0 .194.377c.135.104.386.104.889.104H16L15 21l6.596-9.235c.292-.409.438-.613.432-.784a.5.5 0 0 0-.194-.377c-.135-.104-.386-.104-.889-.104H16L17 3Z",
  ],
};

const featuredIcon = <Message>(
  kind: FeaturesCenterMockup02Item["icon"],
  size: "md" | "lg",
  theme: "light" | "dark",
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        `${
          size === "lg" ? "size-12" : "size-10"
        } flex shrink-0 items-center justify-center rounded-full ${
          theme === "dark"
            ? "bg-bg-brand-solid text-fg-white shadow-xs-skeuomorphic"
            : "bg-bg-brand-primary text-fg-brand-secondary"
        }`,
      ),
    ],
    [
      h.svg(
        [
          h.AriaHidden(true),
          h.Class(size === "lg" ? "size-6" : "size-5"),
          h.Fill("none"),
          h.Stroke("currentColor"),
          h.StrokeLinecap("round"),
          h.StrokeLinejoin("round"),
          h.StrokeWidth("2"),
          h.ViewBox("0 0 24 24"),
        ],
        iconPaths[kind].map((path) => h.path([h.D(path)])),
      ),
    ],
  );

const featureItem = <Message>(
  item: FeaturesCenterMockup02Item,
  onItem: ((id: string) => NoInfer<Message>) | undefined,
  h: HtmlBuilder<Message>,
): Html =>
  h.li(
    [h.Class("flex max-w-sm flex-col items-center text-center")],
    [
      featuredIcon(item.icon, "lg", "light", h),
      featuredIcon(item.icon, "md", "light", h),
      h.h3([h.Class("mt-4 text-lg font-semibold text-text-primary md:mt-5")], [item.title]),
      h.p([h.Class("mt-1 text-md text-text-tertiary")], [item.subtitle]),
      ...(onItem === undefined
        ? []
        : [
            h.button(
              [
                h.Class(
                  "mt-4 rounded-xs text-md font-semibold text-text-brand-secondary outline-focus-ring hover:text-text-brand-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 md:mt-5",
                ),
                h.OnClick(onItem(item.id)),
                h.Type("button"),
              ],
              ["Learn more"],
            ),
          ]),
    ],
  );

const mockupImage = <Message>(
  props: FeaturesCenterMockup02Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("relative w-full flex-1")],
    [
      h.img([
        h.Alt(props.imageAlt ?? "Product mockup"),
        h.Class("size-full object-contain dark:hidden"),
        h.Src(
          props.mockupLightSrc ??
            "https://www.untitledui.com/marketing/screen-mockups/dashboard-desktop-mockup-light-01.webp",
        ),
      ]),
      h.img([
        h.Alt(props.imageAlt ?? "Product mockup"),
        h.Class("size-full object-contain not-dark:hidden"),
        h.Src(
          props.mockupDarkSrc ??
            "https://www.untitledui.com/marketing/screen-mockups/dashboard-desktop-mockup-dark-01.webp",
        ),
      ]),
    ],
  );

export const featuresCenterMockup02 = <Message>(
  props: FeaturesCenterMockup02Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("mx-auto flex w-full max-w-3xl flex-col items-center text-center")],
            [
              h.span(
                [h.Class("text-sm font-semibold text-text-brand-secondary md:text-md")],
                [props.eyebrow],
              ),
              h.h2(
                [
                  h.Class(
                    "mt-3 text-display-sm font-semibold text-text-primary md:text-display-md",
                  ),
                ],
                [props.heading],
              ),
              h.p(
                [h.Class("mt-4 text-lg text-text-tertiary md:mt-5 md:text-xl")],
                [props.description],
              ),
            ],
          ),
          h.div(
            [h.Class("mt-12 md:mt-16")],
            [
              h.ul(
                [
                  h.Class(
                    "grid w-full grid-cols-1 justify-items-center gap-x-8 gap-y-10 sm:grid-cols-2 md:gap-y-16",
                  ),
                ],
                props.items.map((item) =>
                  h.keyed("li")(item.id, [], [featureItem(item, props.onItem, h)]),
                ),
              ),
              ...(false && props.imageSrc !== undefined
                ? [
                    h.div(
                      [h.Class("h-60 md:h-140")],
                      [
                        h.img([
                          h.Alt(props.imageAlt ?? "Feature image"),
                          h.Class("size-full object-cover"),
                          h.Src(props.imageSrc),
                        ]),
                      ],
                    ),
                  ]
                : true
                  ? [mockupImage(props, h)]
                  : []),
            ],
          ),
        ],
      ),
    ],
  );
