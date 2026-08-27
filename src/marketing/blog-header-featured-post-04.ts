/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- Direct FoldKit transcription retains the upstream input placeholder CSS modifier. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { pagination } from "../application/pagination.ts";
import { badge } from "../base/badges.ts";
import type { BadgeColor } from "../base/badges.ts";
import { button } from "../base/button.ts";

export interface BlogHeaderFeaturedPost04Tag {
  readonly color: BadgeColor;
  readonly href: string;
  readonly name: string;
}

export interface BlogHeaderFeaturedPost04Article {
  readonly author: {
    readonly avatarUrl: string;
    readonly href: string;
    readonly name: string;
  };
  readonly category: {
    readonly href: string;
    readonly name: string;
  };
  readonly href: string;
  readonly id: string;
  readonly isFeatured?: boolean;
  readonly publishedAt: string;
  readonly readingTime: string;
  readonly summary: string;
  readonly tags: readonly BlogHeaderFeaturedPost04Tag[];
  readonly thumbnailUrl: string;
  readonly title: string;
}

export interface BlogHeaderFeaturedPost04Props<Message> {
  readonly articles: readonly BlogHeaderFeaturedPost04Article[];
  readonly description: string;
  readonly email: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly eyebrow: string;
  readonly featuredArticle: BlogHeaderFeaturedPost04Article;
  readonly heading: string;
  readonly onArticle: (id: string) => NoInfer<Message>;
  readonly onEmailInput: (email: string) => NoInfer<Message>;
  readonly onPage: (page: number) => NoInfer<Message>;
  readonly onSubscribe: NoInfer<Message>;
  readonly onTag: (articleId: string, tagName: string) => NoInfer<Message>;
  readonly page: number;
  readonly privacyHref: string;
  readonly subscribeLabel: string;
  readonly totalPages: number;
}

const arrowUpRight = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("mt-0.5 size-5 shrink-0 text-fg-quaternary"),
      h.Fill("none"),
      h.Stroke("currentColor"),
      h.StrokeLinecap("round"),
      h.StrokeLinejoin("round"),
      h.StrokeWidth("2"),
      h.ViewBox("0 0 24 24"),
    ],
    [h.path([h.D("M7 17 17 7M7 7h10v10")])],
  );

const articleCard = <Message>(
  blogArticle: BlogHeaderFeaturedPost04Article,
  featured: boolean,
  props: BlogHeaderFeaturedPost04Props<Message>,
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
          h.Href(blogArticle.href),
          h.OnClick(props.onArticle(blogArticle.id)),
          h.Tabindex(-1),
        ],
        [
          h.img([
            h.Alt(blogArticle.title),
            h.Class(
              "aspect-[1.5] w-full object-cover transition duration-100 ease-linear hover:scale-105",
            ),
            h.Src(blogArticle.thumbnailUrl),
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
                [h.Class("text-sm font-semibold text-text-brand-secondary")],
                [blogArticle.author.name, " • ", h.time([], [blogArticle.publishedAt])],
              ),
              h.div(
                [h.Class("flex w-full flex-col gap-1")],
                [
                  h.a(
                    [
                      h.Class(
                        `flex justify-between gap-x-4 rounded-md text-lg font-semibold text-text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2 ${featured ? "lg:text-display-xs lg:font-semibold" : ""}`,
                      ),
                      h.Href(blogArticle.category.href),
                      h.OnClick(props.onArticle(blogArticle.id)),
                    ],
                    [blogArticle.title, arrowUpRight(h)],
                  ),
                  h.p([h.Class("line-clamp-2 text-md text-text-tertiary")], [blogArticle.summary]),
                ],
              ),
            ],
          ),
          h.div(
            [h.Class("flex gap-2")],
            blogArticle.tags.map((tag) =>
              h.keyed("a")(
                tag.name,
                [
                  h.Class(
                    "rounded-xl outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                  ),
                  h.Href(tag.href),
                  h.OnClick(props.onTag(blogArticle.id, tag.name)),
                ],
                [badge({ color: tag.color, label: tag.name, size: "md", type: "pill-color" }, h)],
              ),
            ),
          ),
        ],
      ),
    ],
  );

const emailField = <Message>(
  props: BlogHeaderFeaturedPost04Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("flex flex-col gap-1.5 text-start")],
    [
      h.div(
        [
          h.Class(
            "group/input relative flex w-full flex-row place-content-center place-items-center rounded-lg bg-bg-primary py-0.5 shadow-xs ring-1 ring-border-primary transition-shadow duration-100 ease-linear ring-inset focus-within:ring-2 focus-within:ring-border-brand",
          ),
        ],
        [
          h.input([
            h.AriaLabel(props.emailLabel),
            h.Class(
              "m-0 w-full bg-transparent px-3.5 py-2.5 text-md text-text-primary ring-0 outline-hidden placeholder:text-text-placeholder autofill:rounded-lg autofill:text-text-primary disabled:cursor-not-allowed",
            ),
            h.Name("email"),
            h.OnInput(props.onEmailInput),
            h.Placeholder(props.emailPlaceholder),
            h.Required(true),
            h.Type("email"),
            h.Value(props.email),
          ]),
        ],
      ),
      h.span(
        [h.Class("flex w-full text-sm text-tertiary_on-brand")],
        [
          "We care about your data in our ",
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
  );

export const blogHeaderFeaturedPost04 = <Message>(
  props: BlogHeaderFeaturedPost04Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("bg-bg-primary"), h.Dir("ltr")],
    [
      h.section(
        [
          h.Class(
            "bg-brand-800 pt-32 pb-32 in-data-[theme=dark]:bg-bg-secondary md:pt-24 md:pb-40",
          ),
        ],
        [
          h.div(
            [h.Class("mx-auto max-w-container px-4 md:px-8")],
            [
              h.div(
                [h.Class("mx-auto flex w-full max-w-3xl flex-col items-center text-center")],
                [
                  h.span(
                    [
                      h.Class(
                        "text-sm font-semibold text-brand-200 in-data-[theme=dark]:text-neutral-300 md:text-md",
                      ),
                    ],
                    [props.eyebrow],
                  ),
                  h.h2(
                    [
                      h.Class(
                        "mt-3 text-display-md font-semibold text-primary_on-brand md:text-display-lg",
                      ),
                    ],
                    [props.heading],
                  ),
                  h.p(
                    [h.Class("mt-4 text-lg text-tertiary_on-brand md:mt-6 md:text-xl")],
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
                      emailField(props, h),
                      button(
                        {
                          label: props.subscribeLabel,
                          size: "xl",
                          type: "submit",
                        },
                        h,
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
            "mx-auto -mt-16 flex w-full max-w-container flex-col gap-y-12 px-4 pb-16 md:-mt-24 md:gap-y-16 md:px-8 md:pb-24",
          ),
        ],
        [
          articleCard(props.featuredArticle, true, props, h),
          h.ul(
            [h.Class("grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3")],
            props.articles
              .slice(0, 6)
              .map((regularArticle) =>
                h.keyed("li")(
                  regularArticle.id,
                  [],
                  [articleCard(regularArticle, false, props, h)],
                ),
              ),
          ),
          pagination(
            {
              messageForPage: props.onPage,
              page: props.page,
              rounded: true,
              total: props.totalPages,
              variant: "page-default",
            },
            h,
          ),
        ],
      ),
    ],
  );
