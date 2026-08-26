/* oxlint-disable effect/noReturnInArrow, effect/noTernary, foldkit/keyed-required-for-mapped-rows -- This renderer directly transcribes the authenticated Untitled UI section and its Simple04Vertical card. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { button } from "../base/button.ts";
import { input } from "../base/fields.ts";

export type BlogHeaderSimple04TagColor =
  | "brand"
  | "indigo"
  | "orange"
  | "pink"
  | "sky"
  | "slate"
  | "success";

export interface BlogHeaderSimple04Article {
  readonly author: { readonly href: string; readonly name: string; readonly seed: string };
  readonly category: { readonly href: string; readonly name: string };
  readonly href: string;
  readonly id: string;
  readonly isFeatured?: boolean;
  readonly publishedAt: string;
  readonly readingTime: string;
  readonly summary: string;
  readonly tags: readonly {
    readonly color: BlogHeaderSimple04TagColor;
    readonly href: string;
    readonly name: string;
  }[];
  readonly thumbnailUrl: string;
  readonly title: string;
}

export type BlogHeaderSimple04Action = Readonly<{
  articleId: string;
  target: "article" | "author" | "category";
}>;

export interface BlogHeaderSimple04Props<Message> {
  readonly articles: readonly BlogHeaderSimple04Article[];
  readonly description: string;
  readonly email: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly onArticleActivate: (action: BlogHeaderSimple04Action) => NoInfer<Message>;
  readonly onEmailInput: (email: string) => NoInfer<Message>;
  readonly onLoadMore: NoInfer<Message>;
  readonly onSubscribe: NoInfer<Message>;
}

export const blogHeaderSimple04Articles = [
  {
    author: { href: "#", name: "Olivia Rhye", seed: "blog-simple-04-olivia-rhye" },
    category: { href: "#", name: "Design" },
    href: "#",
    id: "article-1",
    isFeatured: true,
    publishedAt: "20 Jan 2027",
    readingTime: "8 min read",
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
    author: { href: "#", name: "Phoenix Baker", seed: "blog-simple-04-phoenix-baker" },
    category: { href: "#", name: "Product" },
    href: "#",
    id: "article-2",
    publishedAt: "19 Jan 2027",
    readingTime: "8 min read",
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
    author: { href: "#", name: "Lana Steiner", seed: "blog-simple-04-lana-steiner" },
    category: { href: "#", name: "Software Engineering" },
    href: "#",
    id: "article-3",
    publishedAt: "18 Jan 2027",
    readingTime: "8 min read",
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
    author: { href: "#", name: "Alec Whitten", seed: "blog-simple-04-alec-whitten" },
    category: { href: "#", name: "Product" },
    href: "#",
    id: "article-3.5",
    publishedAt: "17 Jan 2027",
    readingTime: "8 min read",
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
    author: { href: "#", name: "Demi Wilkinson", seed: "blog-simple-04-demi-wilkinson" },
    category: { href: "#", name: "Product" },
    href: "#",
    id: "article-4",
    publishedAt: "16 Jan 2027",
    readingTime: "8 min read",
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
    author: { href: "#", name: "Candice Wu", seed: "blog-simple-04-candice-wu" },
    category: { href: "#", name: "Design" },
    href: "#",
    id: "article-5",
    publishedAt: "15 Jan 2027",
    readingTime: "8 min read",
    summary: "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
    tags: [
      { color: "brand", href: "#", name: "Design" },
      { color: "indigo", href: "#", name: "Research" },
    ],
    thumbnailUrl: "https://www.untitledui.com/marketing/wireframing-layout.webp",
    title: "What is wireframing?",
  },
  {
    author: { href: "#", name: "Natali Craig", seed: "blog-simple-04-natali-craig" },
    category: { href: "#", name: "Design" },
    href: "#",
    id: "article-6",
    publishedAt: "14 Jan 2027",
    readingTime: "8 min read",
    summary: "Collaboration can make our teams stronger, and our individual designs better.",
    tags: [
      { color: "brand", href: "#", name: "Design" },
      { color: "indigo", href: "#", name: "Research" },
    ],
    thumbnailUrl: "https://www.untitledui.com/marketing/two-people.webp",
    title: "How collaboration makes us better designers",
  },
  {
    author: { href: "#", name: "Drew Cano", seed: "blog-simple-04-drew-cano" },
    category: { href: "#", name: "Product" },
    href: "#",
    id: "article-7",
    publishedAt: "13 Jan 2027",
    readingTime: "8 min read",
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
    author: { href: "#", name: "Orlando Diggs", seed: "blog-simple-04-orlando-diggs" },
    category: { href: "#", name: "Customer Success" },
    href: "#",
    id: "article-8",
    publishedAt: "12 Jan 2027",
    readingTime: "8 min read",
    summary: "Starting a community doesn't need to be complicated, but how do you get started?",
    tags: [
      { color: "brand", href: "#", name: "Podcasts" },
      { color: "slate", href: "#", name: "Customer Success" },
    ],
    thumbnailUrl: "https://www.untitledui.com/marketing/sythesize.webp",
    title: "Podcast: Creating a better CX Community",
  },
] as const satisfies readonly BlogHeaderSimple04Article[];

const arrowUpRight = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5 shrink-0"), h.Fill("none"), h.ViewBox("0 0 20 20")],
    [
      h.path([
        h.D("M5.833 14.167 14.167 5.833m0 0H5.833m8.334 0v8.334"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.67"),
      ]),
    ],
  );

const arrowDown = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [h.AriaHidden(true), h.Class("size-5 shrink-0"), h.Fill("none"), h.ViewBox("0 0 20 20")],
    [
      h.path([
        h.D("M10 4.167v11.666m0 0L15.833 10M10 15.833 4.167 10"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("1.67"),
      ]),
    ],
  );

const articleCard = <Message>(
  article: BlogHeaderSimple04Article,
  props: BlogHeaderSimple04Props<Message>,
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
                "relative w-full overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:z-10 before:ring-[0.5px] before:ring-alpha-black/10 before:ring-inset",
              ),
              h.Href(article.href),
              h.OnClick(props.onArticleActivate({ articleId: article.id, target: "article" })),
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
                          h.OnClick(
                            props.onArticleActivate({ articleId: article.id, target: "author" }),
                          ),
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
                      h.OnClick(
                        props.onArticleActivate({ articleId: article.id, target: "category" }),
                      ),
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
                  h.OnClick(props.onArticleActivate({ articleId: article.id, target: "category" })),
                ],
                [article.title],
              ),
              h.p([h.Class("line-clamp-2 text-md text-text-tertiary")], [article.summary]),
            ],
          ),
          h.a(
            [
              h.Class(
                "inline-flex items-center gap-1.5 rounded text-md font-semibold text-text-brand-secondary outline-focus-ring hover:text-text-brand-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2",
              ),
              h.Href(article.href),
              h.OnClick(props.onArticleActivate({ articleId: article.id, target: "article" })),
            ],
            ["Read post", arrowUpRight(h)],
          ),
        ],
      ),
    ],
  );

export const blogHeaderSimple04 = <Message>(
  props: BlogHeaderSimple04Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.div(
    [h.Class("w-full bg-bg-primary")],
    [
      h.section(
        [h.Class("bg-brand-800 py-16 md:py-24")],
        [
          h.div(
            [h.Class("mx-auto max-w-container px-4 md:px-8")],
            [
              h.div(
                [h.Class("mx-auto flex w-full max-w-3xl flex-col items-center text-center")],
                [
                  h.span(
                    [h.Class("text-sm font-semibold text-brand-200 md:text-md")],
                    [props.eyebrow],
                  ),
                  h.h2(
                    [h.Class("mt-3 text-display-md font-semibold text-white md:text-display-lg")],
                    [props.heading],
                  ),
                  h.p(
                    [h.Class("mt-4 text-lg text-brand-200 md:mt-6 md:text-xl")],
                    [props.description],
                  ),
                  h.form(
                    [
                      h.Class(
                        "mt-8 grid w-full grid-cols-1 items-start gap-4 sm:mt-12 sm:w-auto sm:grid-cols-[345px_max-content]",
                      ),
                      h.OnSubmit(props.onSubscribe),
                    ],
                    [
                      h.div(
                        [h.Class("flex flex-col gap-1.5")],
                        [
                          input(
                            {
                              inputClassName: "py-0.5",
                              isRequired: true,
                              name: "blog-simple-04-email",
                              onInput: props.onEmailInput,
                              placeholder: "Enter your email",
                              size: "lg",
                              type: "email",
                              value: props.email,
                            },
                            h,
                          ),
                          h.span(
                            [h.Class("self-start text-sm text-brand-200")],
                            [
                              "We care about your data in our ",
                              h.a(
                                [
                                  h.Class(
                                    "rounded-xs underline underline-offset-3 outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
                                  ),
                                  h.Href("#"),
                                ],
                                ["privacy policy"],
                              ),
                              ".",
                            ],
                          ),
                        ],
                      ),
                      button(
                        {
                          color: "primary",
                          label: "Subscribe",
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
            "mx-auto flex w-full max-w-container flex-col gap-12 px-4 py-16 md:px-8 md:py-24 lg:gap-16",
          ),
        ],
        [
          h.ul(
            [h.Class("grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3")],
            props.articles.map((article, index) =>
              h.li([h.Class(index >= 6 ? "max-lg:hidden" : "")], [articleCard(article, props, h)]),
            ),
          ),
          h.div(
            [h.Class("flex w-full flex-col md:w-auto md:flex-row md:justify-center")],
            [
              button(
                {
                  color: "secondary",
                  iconLeadingElement: arrowDown(h),
                  label: "Load more",
                  onPress: props.onLoadMore,
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
