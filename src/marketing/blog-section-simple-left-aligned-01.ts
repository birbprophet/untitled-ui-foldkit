/* oxlint-disable effect/noReturnInArrow -- Direct FoldKit transcription of the authenticated Untitled UI blog section. */
import type { Html, HtmlBuilder } from "foldkit/html";

export interface BlogSectionSimpleLeftAligned01Article {
  readonly authorHref: string;
  readonly authorName: string;
  readonly avatarUrl: string;
  readonly category: string;
  readonly href: string;
  readonly id: string;
  readonly publishedAt: string;
  readonly summary: string;
  readonly thumbnailUrl: string;
  readonly title: string;
}

export interface BlogSectionSimpleLeftAligned01Props<Message> {
  readonly articles: readonly BlogSectionSimpleLeftAligned01Article[];
  readonly description: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly onArticle: (id: string) => NoInfer<Message>;
  readonly onAuthor: (id: string) => NoInfer<Message>;
  readonly onViewAll: NoInfer<Message>;
  readonly viewAllLabel: string;
}

const arrow = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(
        "mt-0.5 size-6 shrink-0 text-fg-quaternary transition duration-100 ease-linear group-hover/title:text-fg-quaternary-hover",
      ),
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

const articleCard = <Message>(
  article: BlogSectionSimpleLeftAligned01Article,
  props: BlogSectionSimpleLeftAligned01Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [h.Class("flex flex-col gap-4")],
    [
      h.a(
        [
          h.Class(
            "relative overflow-hidden rounded-2xl before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[inherit] before:ring-[0.5px] before:ring-alpha-black/10 before:ring-inset",
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
            [h.Class("flex flex-col gap-2")],
            [
              h.span(
                [h.Class("text-sm font-semibold text-text-brand-secondary")],
                [article.category],
              ),
              h.div(
                [h.Class("flex flex-col gap-1")],
                [
                  h.a(
                    [
                      h.Class(
                        "group/title flex justify-between gap-x-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                      ),
                      h.Href(article.href),
                      h.OnClick(props.onArticle(article.id)),
                    ],
                    [article.title, arrow(h)],
                  ),
                  h.p([h.Class("line-clamp-2 text-md text-text-tertiary")], [article.summary]),
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
                    h.Class("size-10 rounded-full object-cover ring-1 ring-border-secondary-alt"),
                    h.Src(article.avatarUrl),
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
  props: BlogSectionSimpleLeftAligned01Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.button(
    [
      h.Class(
        "inline-flex h-12 items-center justify-center rounded-lg bg-bg-brand-solid px-5 py-3 text-md font-semibold text-white shadow-xs outline-focus-ring hover:bg-bg-brand-solid-hover focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.OnClick(props.onViewAll),
      h.Type("button"),
    ],
    [props.viewAllLabel],
  );

export const blogSectionSimpleLeftAligned01 = <Message>(
  props: BlogSectionSimpleLeftAligned01Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
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
              h.div([h.Class("hidden gap-3 lg:flex")], [viewAllButton(props, h)]),
            ],
          ),
          h.ul(
            [
              h.Class(
                "mt-12 grid grid-cols-1 gap-x-8 gap-y-12 md:mt-16 md:grid-cols-2 md:gap-y-16 lg:grid-cols-3",
              ),
            ],
            props.articles
              .slice(0, 3)
              .map((article) => h.keyed("li")(article.id, [], [articleCard(article, props, h)])),
          ),
          h.div([h.Class("mt-12 flex flex-col gap-3 lg:hidden")], [viewAllButton(props, h)]),
        ],
      ),
    ],
  );
