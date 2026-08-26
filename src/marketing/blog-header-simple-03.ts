/* oxlint-disable @rikalabs/no-placeholder-implementation, effect/noReturnInArrow, effect/noSpread, effect/noTernary -- The authenticated component contains a real email placeholder and pagination arrays. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { badge } from "../base/badges.ts";
import type { BadgeColor } from "../base/badges.ts";

export interface BlogHeaderSimple03Tag {
  readonly color: BadgeColor;
  readonly href: string;
  readonly name: string;
}

export interface BlogHeaderSimple03Article {
  readonly authorName: string;
  readonly categoryHref: string;
  readonly href: string;
  readonly id: string;
  readonly publishedAt: string;
  readonly summary: string;
  readonly tags: readonly BlogHeaderSimple03Tag[];
  readonly thumbnailUrl: string;
  readonly title: string;
}

export interface BlogHeaderSimple03Props<Message> {
  readonly articles: readonly BlogHeaderSimple03Article[];
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

export const blogHeaderSimple03Articles: readonly BlogHeaderSimple03Article[] = [
  {
    authorName: "Olivia Rhye",
    categoryHref: "#",
    href: "#",
    id: "article-1",
    publishedAt: "20 Jan 2027",
    summary:
      "How do you create compelling presentations that wow your colleagues and impress your managers?",
    tags: [
      { color: "brand", href: "#", name: "Design" },
      { color: "indigo", href: "#", name: "Research" },
      { color: "pink", href: "#", name: "Presentation" },
    ],
    thumbnailUrl: "https://www.untitledui.com/marketing/spirals.webp",
    title: "UX review presentations",
  },
  {
    authorName: "Phoenix Baker",
    categoryHref: "#",
    href: "#",
    id: "article-2",
    publishedAt: "19 Jan 2027",
    summary:
      "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.",
    tags: [
      { color: "sky", href: "#", name: "Product" },
      { color: "pink", href: "#", name: "Tools" },
      { color: "pink", href: "#", name: "SaaS" },
    ],
    thumbnailUrl: "https://www.untitledui.com/marketing/conversation.webp",
    title: "Migrating to Linear 101",
  },
  {
    authorName: "Lana Steiner",
    categoryHref: "#",
    href: "#",
    id: "article-3",
    publishedAt: "18 Jan 2027",
    summary:
      "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.",
    tags: [
      { color: "success", href: "#", name: "Software Development" },
      { color: "pink", href: "#", name: "Tools" },
    ],
    thumbnailUrl: "https://www.untitledui.com/blog/two-mobile-shapes-pattern.webp",
    title: "Building your API stack",
  },
  {
    authorName: "Alec Whitten",
    categoryHref: "#",
    href: "#",
    id: "article-3.5",
    publishedAt: "17 Jan 2027",
    summary:
      "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
    tags: [
      { color: "brand", href: "#", name: "Leadership" },
      { color: "slate", href: "#", name: "Management" },
    ],
    thumbnailUrl: "https://www.untitledui.com/blog/two-people.webp",
    title: "Bill Walsh leadership lessons",
  },
  {
    authorName: "Demi Wilkinson",
    categoryHref: "#",
    href: "#",
    id: "article-4",
    publishedAt: "16 Jan 2027",
    summary: "Mental models are simple expressions of complex processes or relationships.",
    tags: [
      { color: "sky", href: "#", name: "Product" },
      { color: "indigo", href: "#", name: "Research" },
      { color: "orange", href: "#", name: "Frameworks" },
    ],
    thumbnailUrl: "https://www.untitledui.com/marketing/smiling-girl-6.webp",
    title: "PM mental models",
  },
  {
    authorName: "Candice Wu",
    categoryHref: "#",
    href: "#",
    id: "article-5",
    publishedAt: "15 Jan 2027",
    summary: "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
    tags: [
      { color: "brand", href: "#", name: "Design" },
      { color: "indigo", href: "#", name: "Research" },
    ],
    thumbnailUrl: "https://www.untitledui.com/marketing/wireframing-layout.webp",
    title: "What is wireframing?",
  },
  {
    authorName: "Natali Craig",
    categoryHref: "#",
    href: "#",
    id: "article-6",
    publishedAt: "14 Jan 2027",
    summary: "Collaboration can make our teams stronger, and our individual designs better.",
    tags: [
      { color: "brand", href: "#", name: "Design" },
      { color: "indigo", href: "#", name: "Research" },
    ],
    thumbnailUrl: "https://www.untitledui.com/marketing/two-people.webp",
    title: "How collaboration makes us better designers",
  },
  {
    authorName: "Drew Cano",
    categoryHref: "#",
    href: "#",
    id: "article-7",
    publishedAt: "13 Jan 2027",
    summary:
      "JavaScript frameworks make development easy with extensive features and functionalities.",
    tags: [
      { color: "success", href: "#", name: "Software Development" },
      { color: "pink", href: "#", name: "Tools" },
      { color: "pink", href: "#", name: "SaaS" },
    ],
    thumbnailUrl: "https://www.untitledui.com/marketing/workspace-5.webp",
    title: "Our top 10 Javascript frameworks to use",
  },
  {
    authorName: "Orlando Diggs",
    categoryHref: "#",
    href: "#",
    id: "article-8",
    publishedAt: "12 Jan 2027",
    summary: "Starting a community doesn't need to be complicated, but how do you get started?",
    tags: [
      { color: "brand", href: "#", name: "Podcasts" },
      { color: "slate", href: "#", name: "Customer Success" },
    ],
    thumbnailUrl: "https://www.untitledui.com/marketing/sythesize.webp",
    title: "Podcast: Creating a better CX Community",
  },
];

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
  article: BlogHeaderSimple03Article,
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
            h.Loading("lazy"),
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
                        "flex justify-between gap-x-4 rounded-md text-lg font-semibold text-primary outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
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

const pageNumbers = <Message>(
  props: BlogHeaderSimple03Props<Message>,
  h: HtmlBuilder<Message>,
): Html => {
  const visiblePages = props.totalPages <= 4 ? [1, 2, 3, 4].slice(0, props.totalPages) : [1, 2, 3];
  return h.div(
    [h.Class("hidden justify-center gap-0.5 md:flex")],
    [
      ...visiblePages.map((page) =>
        h.keyed("button")(
          String(page),
          [
            h.AriaCurrent(page === props.page ? "page" : "false"),
            h.AriaLabel(`Page ${page}`),
            h.Class(
              `flex size-9 cursor-pointer items-center justify-center rounded-full p-3 text-sm font-medium text-quaternary outline-focus-ring transition hover:bg-primary_hover hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 ${page === props.page ? "bg-primary_hover text-secondary" : ""}`,
            ),
            h.OnClick(props.onPage(page)),
            h.Type("button"),
          ],
          [String(page)],
        ),
      ),
      ...(props.totalPages <= 4
        ? []
        : [
            h.span([h.Class("flex size-9 items-center justify-center text-tertiary")], ["…"]),
            h.button(
              [
                h.AriaCurrent(props.page === props.totalPages ? "page" : "false"),
                h.AriaLabel(`Page ${props.totalPages}`),
                h.Class(
                  "flex size-9 cursor-pointer items-center justify-center rounded-full p-3 text-sm font-medium text-quaternary outline-focus-ring transition hover:bg-primary_hover hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2",
                ),
                h.OnClick(props.onPage(props.totalPages)),
                h.Type("button"),
              ],
              [String(props.totalPages)],
            ),
          ]),
    ],
  );
};

export const blogHeaderSimple03 = <Message>(
  props: BlogHeaderSimple03Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("bg-primary"), h.Dir("ltr")],
    [
      h.section(
        [h.Class("bg-brand-section pt-32 pb-32 md:pt-24 md:pb-40")],
        [
          h.div(
            [h.Class("mx-auto max-w-container px-4 md:px-8")],
            [
              h.div(
                [h.Class("mx-auto flex w-full max-w-3xl flex-col items-center text-center")],
                [
                  h.span(
                    [h.Class("text-sm font-semibold text-secondary_on-brand md:text-md")],
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
                      h.div(
                        [h.Class("flex flex-col gap-1.5 text-start")],
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
            "mx-auto -mt-16 flex w-full max-w-container flex-col gap-12 px-4 pb-16 md:-mt-24 md:px-8 md:pb-24 lg:gap-16",
          ),
        ],
        [
          h.ul(
            [h.Class("grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3")],
            props.articles.map((article, index) =>
              h.keyed("li")(
                article.id,
                [h.Class(index >= 6 ? "hidden lg:block" : "")],
                [articleCard(article, props.onArticle, h)],
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
              pageNumbers(props, h),
              h.div(
                [h.Class("flex justify-center text-sm whitespace-pre text-fg-secondary md:hidden")],
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
