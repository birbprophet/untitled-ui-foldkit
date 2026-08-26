/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noTernary -- The authenticated component contains a real email placeholder. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { badge } from "../base/badges.ts";
import type { BadgeColor } from "../base/badges.ts";

export interface BlogHeaderFeaturedPost03Tag {
  readonly color: BadgeColor;
  readonly href: string;
  readonly name: string;
}

export interface BlogHeaderFeaturedPost03Article {
  readonly authorName: string;
  readonly categoryHref: string;
  readonly categoryName: string;
  readonly href: string;
  readonly id: string;
  readonly publishedAt: string;
  readonly summary: string;
  readonly tags: readonly BlogHeaderFeaturedPost03Tag[];
  readonly thumbnailUrl: string;
  readonly title: string;
}

export interface BlogHeaderFeaturedPost03Props<Message> {
  readonly articles: readonly BlogHeaderFeaturedPost03Article[];
  readonly description: string;
  readonly email: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly onArticle: (id: string) => NoInfer<Message>;
  readonly onEmailInput: (email: string) => NoInfer<Message>;
  readonly onPage: (page: number) => NoInfer<Message>;
  readonly onSubscribe: NoInfer<Message>;
  readonly page: number;
  readonly privacyHref: string;
  readonly subscribeLabel: string;
  readonly totalPages: number;
}

const arrow = <Message>(direction: "left" | "right" | "up-right", h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class(direction === "up-right" ? "mt-0.5 size-5 shrink-0 text-fg-quaternary" : "size-5"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(
          {
            left: "m15 18-6-6 6-6",
            right: "m9 18 6-6-6-6",
            "up-right": "M7 17 17 7M7 7h10v10",
          }[direction],
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const articleCard = <Message>(
  article: BlogHeaderFeaturedPost03Article,
  featured: boolean,
  onArticle: (id: string) => Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.article(
    [h.Class("flex flex-col gap-4")],
    [
      h.a(
        [
          h.Attribute("tabindex", "-1"),
          h.Class(
            "relative overflow-hidden rounded-2xl before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[inherit] before:ring-[0.5px] before:ring-alpha-black/10 before:ring-inset",
          ),
          h.Href(article.href),
          h.OnClick(onArticle(article.id)),
        ],
        [
          h.img([
            h.Alt(article.title),
            h.Class(
              "aspect-[1.5] w-full object-cover transition duration-100 ease-linear hover:scale-105",
            ),
            h.Loading(featured ? "eager" : "lazy"),
            h.Src(article.thumbnailUrl),
          ]),
        ],
      ),
      h.div(
        [h.Class("flex flex-col gap-6")],
        [
          h.div(
            [h.Class("flex flex-col items-start gap-2")],
            [
              h.p(
                [h.Class("text-sm font-semibold text-brand-secondary")],
                [article.authorName, " • ", h.time([], [article.publishedAt])],
              ),
              h.div(
                [h.Class("flex w-full flex-col gap-1")],
                [
                  h.a(
                    [
                      h.Class(
                        `flex justify-between gap-x-4 rounded-md font-semibold text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2 ${featured ? "text-lg lg:text-display-xs lg:font-semibold" : "text-lg"}`,
                      ),
                      h.Href(article.categoryHref),
                      h.OnClick(onArticle(article.id)),
                    ],
                    [article.title, arrow("up-right", h)],
                  ),
                  h.p([h.Class("line-clamp-2 text-md text-tertiary")], [article.summary]),
                ],
              ),
            ],
          ),
          h.div(
            [h.Class("flex flex-wrap gap-2")],
            article.tags.map((tag) =>
              h.keyed("a")(
                tag.name,
                [
                  h.Class(
                    "rounded-xl outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.Href(tag.href),
                ],
                [badge({ color: tag.color, label: tag.name, size: "md" }, h)],
              ),
            ),
          ),
        ],
      ),
    ],
  );

const pageButton = <Message>(
  label: string,
  message: Message,
  content: readonly Html[],
  h: HtmlBuilder<Message>,
): Html =>
  h.button(
    [
      h.AriaLabel(label),
      h.Class(
        "inline-flex min-h-9 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-secondary outline-focus-ring hover:bg-primary_hover focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.OnClick(message),
      h.Type("button"),
    ],
    content,
  );

export const blogHeaderFeaturedPost03 = <Message>(
  props: BlogHeaderFeaturedPost03Props<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const [featuredArticle] = props.articles;
  return h.div(
    [h.Class("bg-primary"), h.Dir("ltr")],
    [
      h.section(
        [h.Class("bg-primary py-16 md:py-24")],
        [
          h.div(
            [h.Class("mx-auto max-w-container px-4 md:px-8")],
            [
              h.div(
                [h.Class("mx-auto flex w-full max-w-3xl flex-col items-center text-center")],
                [
                  h.span(
                    [h.Class("text-sm font-semibold text-brand-secondary md:text-md")],
                    [props.eyebrow],
                  ),
                  h.h2(
                    [h.Class("mt-3 text-display-md font-semibold text-primary md:text-display-lg")],
                    [props.heading],
                  ),
                  h.p(
                    [h.Class("mt-4 text-lg text-tertiary md:mt-6 md:text-xl")],
                    [props.description],
                  ),
                  h.form(
                    [
                      h.Class(
                        "mt-8 grid w-full grid-cols-1 items-start gap-4 sm:mt-12 sm:w-auto sm:grid-cols-[335px_max-content]",
                      ),
                      h.OnSubmit(props.onSubscribe),
                    ],
                    [
                      h.div(
                        [h.Class("flex flex-col gap-1.5")],
                        [
                          h.input([
                            h.AriaLabel(props.emailLabel),
                            h.Class(
                              "min-h-12 w-full rounded-lg bg-primary px-3.5 py-3 text-md text-primary shadow-xs ring-1 ring-border-primary outline-focus-ring placeholder:text-placeholder focus:outline-2 focus:outline-offset-2",
                            ),
                            h.Name("email"),
                            h.OnInput(props.onEmailInput),
                            h.Attribute("placeholder", props.emailPlaceholder),
                            h.Required(true),
                            h.Type("email"),
                            h.Value(props.email),
                          ]),
                          h.span(
                            [h.Class("self-start text-sm text-tertiary")],
                            [
                              "We care about your data in our ",
                              h.a(
                                [
                                  h.Class(
                                    "rounded-xs underline underline-offset-3 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                                  ),
                                  h.Href(props.privacyHref),
                                ],
                                ["privacy policy"],
                              ),
                              ".",
                            ],
                          ),
                        ],
                      ),
                      h.button(
                        [
                          h.Class(
                            "inline-flex min-h-12 items-center justify-center rounded-lg bg-brand-solid px-5 py-3 text-md font-semibold text-white shadow-xs outline-focus-ring hover:bg-brand-solid_hover focus-visible:outline-2 focus-visible:outline-offset-2",
                          ),
                          h.Type("submit"),
                        ],
                        [props.subscribeLabel],
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
      h.main(
        [
          h.Class(
            "mx-auto flex w-full max-w-container flex-col gap-y-12 px-4 pb-16 md:gap-y-16 md:px-8 md:pb-24",
          ),
        ],
        [
          featuredArticle === undefined
            ? h.div([])
            : articleCard(featuredArticle, true, props.onArticle, h),
          h.ul(
            [h.Class("grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3")],
            props.articles
              .slice(1, 7)
              .map((article, index) =>
                h.keyed("li")(
                  article.id,
                  [h.Class(index >= 5 ? "hidden lg:block" : "")],
                  [articleCard(article, false, props.onArticle, h)],
                ),
              ),
          ),
          h.nav(
            [
              h.AriaLabel("Pagination"),
              h.Class(
                "flex w-full items-center justify-between gap-3 border-t border-secondary pt-4 md:pt-5",
              ),
            ],
            [
              h.div(
                [h.Class("flex flex-1 justify-start")],
                [
                  pageButton(
                    "Go to previous page",
                    props.onPage(Math.max(1, props.page - 1)),
                    [arrow("left", h), h.span([h.Class("hidden md:inline")], ["Previous"])],
                    h,
                  ),
                ],
              ),
              h.div(
                [h.Class("flex justify-center text-sm whitespace-pre text-fg-secondary")],
                [
                  "Page ",
                  h.span([h.Class("font-medium")], [String(props.page)]),
                  " of ",
                  h.span([h.Class("font-medium")], [String(props.totalPages)]),
                ],
              ),
              h.div(
                [h.Class("flex flex-1 justify-end")],
                [
                  pageButton(
                    "Go to next page",
                    props.onPage(Math.min(props.totalPages, props.page + 1)),
                    [h.span([h.Class("hidden md:inline")], ["Next"]), arrow("right", h)],
                    h,
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
};
