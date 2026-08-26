/* oxlint-disable effect/noReturnInArrow, effect/noSpread, effect/noTernary, eslint/no-nested-ternary, eslint/sort-keys -- Direct FoldKit transcription preserves authenticated fixture order. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { badge } from "../base/badges.ts";
import type { BadgeColor } from "../base/badges.ts";
import { select } from "../base/select.ts";

export interface CareersCard04Location {
  readonly city: string;
  readonly country: string;
  readonly countryCode: string;
}

export interface CareersCard04Job {
  readonly badgeColor: BadgeColor;
  readonly badgeText: string;
  readonly description: string;
  readonly href: string;
  readonly id: string;
  readonly location: CareersCard04Location;
  readonly salary: string;
  readonly title: string;
  readonly type: string;
}

export interface CareersCard04Category {
  readonly description: string;
  readonly id: string;
  readonly jobs: readonly CareersCard04Job[];
  readonly label: string;
}

export interface CareersCard04LocationOption<Message> {
  readonly id: string;
  readonly label: string;
  readonly onFocus: NoInfer<Message>;
  readonly onSelect: NoInfer<Message>;
}

export interface CareersCard04Props<Message> {
  readonly categories: readonly CareersCard04Category[];
  readonly description: string;
  readonly heading: string;
  readonly imageAlt: string;
  readonly imageSrc: string;
  readonly locationLabel: string;
  readonly locations: readonly CareersCard04LocationOption<Message>[];
  readonly onJob: (id: string) => NoInfer<Message>;
  readonly onLocationOpenChanged: (isOpen: boolean) => NoInfer<Message>;
  readonly selectedLocationId: string;
}

const melbourne = { city: "Melbourne", country: "Australia", countryCode: "AU" } as const;

export const careersCard04Categories: readonly CareersCard04Category[] = [
  {
    label: "Design",
    description: "Open positions in our design team.",
    id: "design",
    jobs: [
      {
        title: "Product Designer",
        description: "We're looking for a mid-level product designer to join our team.",
        href: "#",
        id: "product-designer",
        badgeColor: "blue",
        badgeText: "Design",
        salary: "80k - 100k",
        type: "Full-time",
        location: melbourne,
      },
      {
        title: "UX Designer",
        description: "We're looking for a mid-level UX designer to join our team.",
        href: "#",
        id: "ux-designer",
        badgeColor: "blue",
        badgeText: "Design",
        salary: "80k - 100k",
        type: "Full-time",
        location: melbourne,
      },
    ],
  },
  {
    label: "Software Development",
    description: "Open positions in our software team.",
    id: "software-development",
    jobs: [
      {
        title: "Engineering Manager",
        description: "We're looking for an experienced engineering manager to join our team.",
        href: "#",
        id: "engineering-manager",
        badgeColor: "pink",
        badgeText: "Software",
        salary: "80k - 100k",
        type: "Full-time",
        location: melbourne,
      },
      {
        title: "Frontend Developer",
        description: "We're looking for an experienced frontend developer to join our team.",
        href: "#",
        id: "frontend-developer",
        badgeColor: "pink",
        badgeText: "Software",
        salary: "80k - 100k",
        type: "Full-time",
        location: melbourne,
      },
      {
        title: "Backend Developer",
        description: "We're looking for an experienced backend developer to join our team.",
        href: "#",
        id: "backend-developer",
        badgeColor: "pink",
        badgeText: "Software",
        salary: "80k - 100k",
        type: "Full-time",
        location: melbourne,
      },
    ],
  },
  {
    label: "Customer Success",
    description: "Open positions in our CX team.",
    id: "customer-success",
    jobs: [
      {
        title: "Customer Success Manager",
        description: "We're looking for a mid-level product designer to join our team.",
        href: "#",
        id: "customer-success-manager",
        badgeColor: "success",
        badgeText: "Customer Success",
        salary: "80k - 100k",
        type: "Full-time",
        location: melbourne,
      },
    ],
  },
];

export const careersCard04LocationValues = [
  { id: "worldwide", label: "Worldwide" },
  { id: "europe", label: "Europe" },
  { id: "north-america", label: "North America" },
  { id: "asia", label: "Asia" },
  { id: "oceania", label: "Oceania" },
] as const;

const lineIcon = <Message>(kind: "clock" | "currency" | "pin", h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0 text-fg-quaternary"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D(
          kind === "clock"
            ? "M12 6v6l4 2m6-2c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"
            : kind === "currency"
              ? "M16 8.5c0-1.38-1.79-2.5-4-2.5s-4 1.12-4 2.5 1.79 2.5 4 2.5 4 1.12 4 2.5-1.79 2.5-4 2.5s-4-1.12-4-2.5M12 3v3m0 12v3m10-9c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"
              : "M12 12.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12 22c2-4 8-6.582 8-12a8 8 0 1 0-16 0c0 5.418 6 8 8 12Z",
        ),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const flagUrl = new URL("careers-card-03-assets/AU.svg", import.meta.url).href;

const locationBadge = <Message>(location: CareersCard04Location, h: HtmlBuilder<Message>): Html =>
  h.span(
    [
      h.Class(
        "flex size-max items-center gap-1.5 whitespace-nowrap rounded-md bg-bg-primary px-2 py-0.5 text-sm font-medium text-text-secondary shadow-xs ring-1 ring-border-primary ring-inset",
      ),
    ],
    [
      h.img([h.Alt(""), h.Class("size-4 max-w-none rounded-full"), h.Src(flagUrl)]),
      h.span(
        [],
        [
          `${location.city}, `,
          h.span([h.Class("hidden md:inline-flex")], [location.country]),
          h.span([h.Class("inline-flex md:hidden")], [location.countryCode]),
        ],
      ),
    ],
  );

const jobCard = <Message>(
  job: CareersCard04Job,
  onJob: (id: string) => Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.a(
    [
      h.Class(
        "flex flex-col rounded-2xl bg-bg-primary p-6 ring-1 ring-border-secondary outline-focus-ring ring-inset focus-visible:outline-2 focus-visible:outline-offset-2",
      ),
      h.Href(job.href),
      h.OnClick(onJob(job.id)),
    ],
    [
      h.div(
        [h.Class("flex flex-col items-start gap-2 md:flex-row")],
        [
          h.h3([h.Class("text-md font-semibold text-text-primary")], [job.title]),
          h.div(
            [h.Class("flex flex-1 gap-2 md:flex-row-reverse md:justify-between")],
            [
              locationBadge(job.location, h),
              badge(
                {
                  adornment: "dot",
                  color: job.badgeColor,
                  label: job.badgeText,
                  size: "md",
                  type: "modern",
                },
                h,
              ),
            ],
          ),
        ],
      ),
      h.p([h.Class("mt-2 text-md text-text-tertiary")], [job.description]),
      h.div(
        [h.Class("mt-5 flex gap-4")],
        [
          h.div(
            [h.Class("flex items-center gap-1.5")],
            [
              lineIcon("clock", h),
              h.span([h.Class("text-sm font-medium text-text-tertiary")], [job.type]),
            ],
          ),
          h.div(
            [h.Class("flex items-center gap-1.5")],
            [
              lineIcon("currency", h),
              h.span([h.Class("text-sm font-medium text-text-tertiary")], [job.salary]),
            ],
          ),
        ],
      ),
    ],
  );

export const careersCard04 = <Message>(
  props: CareersCard04Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("flex flex-col justify-between gap-12 lg:flex-row lg:items-start lg:gap-8")],
            [
              h.div(
                [h.Class("flex w-full max-w-3xl flex-col")],
                [
                  h.h2(
                    [h.Class("text-display-sm font-semibold text-text-primary md:text-display-md")],
                    [props.heading],
                  ),
                  h.p(
                    [h.Class("mt-4 text-lg text-text-tertiary md:mt-5 md:text-xl")],
                    [props.description],
                  ),
                ],
              ),
              h.div(
                [],
                [
                  h.div(
                    [h.Class("grid grid-cols-1 items-center gap-4 lg:grid-cols-[1fr_240px]")],
                    [
                      h.p(
                        [
                          h.Class(
                            "hidden text-right text-md font-medium whitespace-nowrap text-text-tertiary md:block",
                          ),
                        ],
                        [props.locationLabel],
                      ),
                      select(
                        {
                          items: props.locations.map((location) => ({
                            iconElement: lineIcon("pin", h),
                            id: location.id,
                            label: location.label,
                            onFocus: location.onFocus,
                            onSelect: location.onSelect,
                          })),
                          name: props.locationLabel.replace(/:$/u, ""),
                          onOpenChanged: props.onLocationOpenChanged,
                          selectedId: props.selectedLocationId,
                          size: "md",
                        },
                        h,
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
          h.div(
            [h.Class("mt-8 md:mt-16")],
            [
              h.ul(
                [h.Class("flex flex-col gap-8 md:gap-16")],
                props.categories.map((category) =>
                  h.keyed("li")(
                    category.id,
                    [
                      h.Class(
                        "flex flex-col justify-between gap-5 border-border-secondary md:gap-8 lg:flex-row lg:items-start lg:gap-8 lg:border-t lg:pt-12",
                      ),
                    ],
                    [
                      h.div(
                        [],
                        [
                          h.h2(
                            [h.Class("text-lg font-semibold text-text-primary lg:text-xl")],
                            [category.label],
                          ),
                          h.p(
                            [h.Class("mt-1 text-md text-text-tertiary lg:mt-2")],
                            [category.description],
                          ),
                        ],
                      ),
                      h.ul(
                        [h.Class("flex flex-1 flex-col gap-4 md:gap-6 lg:max-w-3xl")],
                        category.jobs.map((job) =>
                          h.keyed("li")(
                            job.id,
                            [h.DataAttribute("job-id", job.id)],
                            [jobCard(job, props.onJob, h)],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          h.div(
            [h.Class("mt-12 h-60 w-full md:mt-16 md:h-120 lg:h-180")],
            [
              h.img([
                h.Alt(props.imageAlt),
                h.Class("size-full object-cover"),
                h.Src(props.imageSrc),
              ]),
            ],
          ),
        ],
      ),
    ],
  );
