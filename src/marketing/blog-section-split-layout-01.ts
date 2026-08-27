/* oxlint-disable effect/noReturnInArrow -- This renderer is a direct FoldKit transcription of the authenticated Untitled UI split-layout blog section. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";

export interface BlogSectionSplitLayout01Article {
  readonly authorAvatarSrc: string;
  readonly authorHref: string;
  readonly authorName: string;
  readonly categoryHref: string;
  readonly categoryName: string;
  readonly href: string;
  readonly id: string;
  readonly publishedAt: string;
  readonly readingTime: string;
  readonly summary: string;
  readonly thumbnailUrl: string;
  readonly title: string;
}

export interface BlogSectionSplitLayout01Props<Message> {
  readonly articles: readonly BlogSectionSplitLayout01Article[];
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly onArticle: (id: string) => NoInfer<Message>;
  readonly onAuthor: (id: string) => NoInfer<Message>;
  readonly onViewAll: NoInfer<Message>;
  readonly viewAllLabel: string;
}

const arrowUpRight = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("mt-0.5 size-6 shrink-0 text-fg-quaternary"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D("M7 17 17 7m0 0H7m10 0v10"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const badgeGroup = <Message>(
  article: BlogSectionSplitLayout01Article,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [
      h.Class(
        "inline-flex rounded-full bg-utility-brand-50 p-1 pr-3 text-sm font-medium text-utility-brand-700 ring-1 ring-inset ring-utility-brand-200",
      ),
    ],
    [
      h.span(
        [
          h.Class(
            "rounded-full bg-bg-primary px-2 py-0.5 shadow-xs ring-1 ring-inset ring-utility-brand-200",
          ),
        ],
        [article.readingTime],
      ),
      h.span([h.Class("px-1 py-0.5")], [article.categoryName]),
    ],
  );

const articleCard = <Message>(
  article: BlogSectionSplitLayout01Article,
  props: BlogSectionSplitLayout01Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [h.Class("flex flex-col gap-4")],
    [
      h.a(
        [
          h.Class(
            "relative overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:z-10 before:ring-[0.5px] before:ring-alpha-black/10 before:ring-inset",
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
        [h.Class("flex flex-col gap-5")],
        [
          h.div(
            [h.Class("flex flex-col items-start gap-3")],
            [
              badgeGroup(article, h),
              h.div(
                [h.Class("flex flex-col gap-1")],
                [
                  h.a(
                    [
                      h.Class(
                        "flex justify-between gap-x-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.Href(article.categoryHref),
                      h.OnClick(props.onArticle(article.id)),
                    ],
                    [article.title, arrowUpRight(h)],
                  ),
                  h.p(
                    [h.Class("line-clamp-2 text-md text-text-tertiary md:line-clamp-none")],
                    [article.summary],
                  ),
                ],
              ),
            ],
          ),
          h.div(
            [h.Class("flex gap-2")],
            [
              h.a(
                [
                  h.Class("flex"),
                  h.Href(article.authorHref),
                  h.OnClick(props.onAuthor(article.id)),
                  h.Tabindex(-1),
                ],
                [
                  h.img([
                    h.Alt(article.authorName),
                    h.Class("size-10 rounded-full object-cover ring-1 ring-border-secondary_alt"),
                    h.Src(article.authorAvatarSrc),
                  ]),
                ],
              ),
              h.div(
                [],
                [
                  h.a(
                    [
                      h.Class(
                        "block rounded-xs text-sm font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.Href(article.authorHref),
                      h.OnClick(props.onAuthor(article.id)),
                    ],
                    [article.authorName],
                  ),
                  h.time([h.Class("block text-sm text-text-tertiary")], [article.publishedAt]),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );

const viewAllButton = <Message>(
  props: BlogSectionSplitLayout01Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  button(
    {
      label: props.viewAllLabel,
      onPress: props.onViewAll,
      size: "xl",
    },
    h,
  );

export const blogSectionSplitLayout01 = <Message>(
  props: BlogSectionSplitLayout01Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [
          h.Class(
            "mx-auto flex max-w-container flex-col gap-x-16 gap-y-12 px-4 md:px-8 lg:flex-row",
          ),
        ],
        [
          h.div(
            [h.Class("w-full max-w-100")],
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
              h.p([h.Class("mt-4 text-lg text-text-tertiary md:mt-5")], [props.description]),
              h.div(
                [h.Class("mt-12 hidden flex-col gap-3 md:mt-8 md:flex md:flex-row")],
                [viewAllButton(props, h)],
              ),
            ],
          ),
          h.ul(
            [h.Class("grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:col-span-3")],
            props.articles
              .slice(0, 2)
              .map((article) =>
                h.keyed("li")(
                  article.id,
                  [h.Class("flex flex-col gap-5")],
                  [articleCard(article, props, h)],
                ),
              ),
          ),
          h.div([h.Class("flex flex-col gap-3 md:hidden")], [viewAllButton(props, h)]),
        ],
      ),
    ],
  );
