/* oxlint-disable effect/noReturnInArrow, effect/noTernary -- This dedicated renderer directly mirrors the authenticated responsive blog carousel. */
import * as Option from "effect/Option";
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export interface BlogSectionCarouselLayout01Article {
  readonly author: { readonly href: string; readonly name: string };
  readonly category: { readonly href: string; readonly name: string };
  readonly href: string;
  readonly id: string;
  readonly publishedAt: string;
  readonly readingTime: string;
  readonly summary: string;
  readonly thumbnailUrl: string;
  readonly title: string;
}

export interface BlogSectionCarouselLayout01Props<Message> {
  readonly activeIndex: number;
  readonly articles: readonly BlogSectionCarouselLayout01Article[];
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly nextLabel: string;
  readonly onArticle: (id: string) => NoInfer<Message>;
  readonly onAuthor: (id: string) => NoInfer<Message>;
  readonly onCategory: (id: string) => NoInfer<Message>;
  readonly onNext: NoInfer<Message>;
  readonly onPrevious: NoInfer<Message>;
  readonly onViewAll: NoInfer<Message>;
  readonly previousLabel: string;
  readonly viewAllHref: string;
  readonly viewAllLabel: string;
}

const arrowPaths = {
  left: "M20 12H4m0 0 6 6m-6-6 6-6",
  right: "M4 12h16m0 0-6-6m6 6-6 6",
  "up-right": "M7 17 17 7M7 7h10v10",
} as const;

const arrow = <Message>(direction: "left" | "right" | "up-right", h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0"),
      h.DataAttribute("icon", direction),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(arrowPaths[direction]),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const roundButton = <Message>(
  label: string,
  direction: "left" | "right",
  disabled: boolean,
  message: Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.button(
    [
      h.AriaLabel(label),
      h.Class(
        "inline-flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-bg-primary text-fg-secondary shadow-xs-skeuomorphic ring-1 ring-border-primary ring-inset outline-focus-ring transition duration-100 ease-linear hover:bg-bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:text-fg-disabled_subtle",
      ),
      h.Disabled(disabled),
      h.OnClick(message),
      h.Type("button"),
    ],
    [arrow(direction, h)],
  );

const card = <Message>(
  article: BlogSectionCarouselLayout01Article,
  props: BlogSectionCarouselLayout01Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [h.Class("flex flex-col gap-4")],
    [
      h.div(
        [h.Class("relative overflow-hidden")],
        [
          h.a(
            [
              h.Class(
                "relative block w-full overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:z-10 before:ring-[0.5px] before:ring-alpha-black/10 before:ring-inset",
              ),
              h.Href(article.href),
              h.OnClick(props.onArticle(article.id)),
              h.Tabindex(-1),
            ],
            [
              h.img([
                h.Alt(article.title),
                h.Class(
                  "aspect-[1.5] w-full object-cover transition duration-100 ease-linear hover:scale-105",
                ),
                h.Src(article.thumbnailUrl),
              ]),
            ],
          ),
          h.div(
            [
              h.Class(
                "absolute inset-x-0 bottom-0 overflow-hidden bg-linear-to-b from-transparent to-black/40",
              ),
            ],
            [
              h.div(
                [
                  h.Class(
                    "relative flex items-start justify-between bg-alpha-white/30 p-4 backdrop-blur-md before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-alpha-white/30 md:p-5",
                  ),
                ],
                [
                  h.div(
                    [],
                    [
                      h.a(
                        [
                          h.Class(
                            "block rounded-xs text-sm font-semibold text-white outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                          ),
                          h.Href(article.author.href),
                          h.OnClick(props.onAuthor(article.id)),
                        ],
                        [article.author.name],
                      ),
                      h.time([h.Class("block text-sm text-white")], [article.publishedAt]),
                    ],
                  ),
                  h.a(
                    [
                      h.Class(
                        "rounded-xs text-sm font-semibold text-white outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.Href(article.category.href),
                      h.OnClick(props.onCategory(article.id)),
                    ],
                    [article.category.name],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
      h.div(
        [h.Class("flex flex-col items-start gap-5")],
        [
          h.div(
            [h.Class("flex flex-col gap-1")],
            [
              h.a(
                [
                  h.Class(
                    "flex justify-between gap-x-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.Href(article.category.href),
                  h.OnClick(props.onCategory(article.id)),
                ],
                [article.title],
              ),
              h.p([h.Class("line-clamp-2 text-md text-text-tertiary")], [article.summary]),
            ],
          ),
          h.a(
            [
              h.Class(
                "group relative inline-flex h-max cursor-pointer items-center justify-normal gap-1.5 whitespace-nowrap rounded p-0 text-md font-semibold text-text-brand-secondary outline-focus-ring transition duration-100 ease-linear hover:text-text-brand-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
              ),
              h.Href(article.href),
              h.OnClick(props.onArticle(article.id)),
            ],
            [
              h.span(
                [
                  h.Class(
                    "px-0.5 underline decoration-transparent underline-offset-4 hover:decoration-fg-brand-secondary-alt",
                  ),
                ],
                ["Read post"],
              ),
              arrow("up-right", h),
            ],
          ),
        ],
      ),
    ],
  );

const keyboardMessage = <Message>(
  props: BlogSectionCarouselLayout01Props<Message>,
  key: string,
): Option.Option<Message> => {
  if (key === "ArrowLeft" && props.activeIndex > 0) {
    return Option.some(props.onPrevious);
  }
  if (key === "ArrowRight" && props.activeIndex < props.articles.length - 1) {
    return Option.some(props.onNext);
  }
  return Option.none();
};

export const blogSectionCarouselLayout01 = <Message>(
  props: BlogSectionCarouselLayout01Props<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const activeIndex = Math.max(0, Math.min(props.activeIndex, props.articles.length - 1));
  return h.section(
    [h.Class("overflow-hidden bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("flex flex-col items-start justify-between lg:flex-row")],
            [
              h.div(
                [h.Class("max-w-3xl")],
                [
                  h.p(
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
                [h.Class("hidden gap-3 lg:flex")],
                [
                  button(
                    {
                      color: "primary",
                      href: props.viewAllHref,
                      label: props.viewAllLabel,
                      onPress: props.onViewAll,
                      size: "xl",
                    },
                    h,
                  ),
                ],
              ),
            ],
          ),
          h.div(
            [
              h.AriaLabel("Latest posts"),
              h.Attribute("aria-roledescription", "carousel"),
              h.Class("mt-12 outline-none md:mt-16"),
              h.OnKeyDownPreventDefault((key) => keyboardMessage(props, key)),
              h.Role("region"),
              h.Tabindex(0),
            ],
            [
              h.div(
                [h.Class("overflow-visible")],
                [
                  h.ul(
                    [
                      h.Class(
                        "flex gap-6 pr-4 transition-transform duration-300 ease-out motion-reduce:transition-none [--slide-step:21.5rem] md:gap-8 md:pr-8 md:[--slide-step:26rem]",
                      ),
                      h.Style({
                        transform: `translateX(calc(-1 * var(--slide-step) * ${String(activeIndex)}))`,
                      }),
                    ],
                    props.articles.map((article, index) =>
                      h.keyed("li")(
                        article.id,
                        [
                          h.Attribute("aria-roledescription", "slide"),
                          h.AriaLabel(article.title),
                          h.Class("w-full max-w-xs shrink-0 md:max-w-96"),
                          h.DataAttribute("active", index === activeIndex ? "true" : "false"),
                          h.Role("group"),
                        ],
                        [card(article, props, h)],
                      ),
                    ),
                  ),
                ],
              ),
              h.div(
                [h.Class("mt-8 flex gap-4 md:gap-8")],
                [
                  roundButton(props.previousLabel, "left", activeIndex === 0, props.onPrevious, h),
                  roundButton(
                    props.nextLabel,
                    "right",
                    activeIndex === props.articles.length - 1,
                    props.onNext,
                    h,
                  ),
                ],
              ),
            ],
          ),
          h.div(
            [h.Class("mt-12 flex flex-col gap-3 lg:hidden")],
            [
              button(
                {
                  color: "primary",
                  href: props.viewAllHref,
                  label: props.viewAllLabel,
                  onPress: props.onViewAll,
                  size: "xl",
                },
                h,
              ),
            ],
          ),
        ],
      ),
    ],
  );
};
