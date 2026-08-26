/* oxlint-disable effect/noReturnInArrow, effect/noSpread -- Direct FoldKit transcription preserves the authenticated source anatomy. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { badge } from "../base/badges.ts";
import type { BadgeColor } from "../base/badges.ts";
import { select } from "../base/select.ts";

export interface CareersCard02Job {
  readonly badgeColor: BadgeColor;
  readonly badgeText: string;
  readonly department: string;
  readonly description: string;
  readonly href: string;
  readonly id: string;
  readonly location: string;
  readonly title: string;
  readonly type: string;
}

export interface CareersCard02Location {
  readonly id: string;
  readonly isDisabled?: boolean;
  readonly label: string;
}

export interface CareersCard02Props<Message> {
  readonly description: string;
  readonly eyebrow: string;
  readonly filterLabel: string;
  readonly heading: string;
  readonly jobs: readonly CareersCard02Job[];
  readonly locations: readonly CareersCard02Location[];
  readonly onJob: (jobId: string) => NoInfer<Message>;
  readonly onLocationFocus: (locationId: string) => NoInfer<Message>;
  readonly onLocationOpenChanged: (open: boolean) => NoInfer<Message>;
  readonly onLocationSelect: (locationId: string) => NoInfer<Message>;
  readonly selectedLocationId: string;
}

export const careersCard02Jobs: readonly CareersCard02Job[] = [
  {
    badgeColor: "blue",
    badgeText: "Design",
    department: "Design",
    description: "We're looking for a mid-level product designer to join our team.",
    href: "#",
    id: "product-designer",
    location: "Remote",
    title: "Product Designer",
    type: "Full-time",
  },
  {
    badgeColor: "pink",
    badgeText: "Software",
    department: "Software Development",
    description: "We're looking for a mid-level product designer to join our team.",
    href: "#",
    id: "engineering-manager",
    location: "Remote",
    title: "Engineering Manager",
    type: "Full-time",
  },
  {
    badgeColor: "success",
    badgeText: "CX",
    department: "Customer Success",
    description: "We're looking for a mid-level product designer to join our team.",
    href: "#",
    id: "customer-success-manager",
    location: "Remote",
    title: "Customer Success Manager",
    type: "Full-time",
  },
  {
    badgeColor: "indigo",
    badgeText: "Sales",
    department: "Sales",
    description: "We're looking for a mid-level product designer to join our team.",
    href: "#",
    id: "account-executive",
    location: "Remote",
    title: "Account Executive",
    type: "Full-time",
  },
  {
    badgeColor: "orange",
    badgeText: "Marketing",
    department: "Marketing",
    description: "We're looking for a mid-level product designer to join our team.",
    href: "#",
    id: "seo-marketing-manager",
    location: "Remote",
    title: "SEO Marketing Manager",
    type: "Full-time",
  },
];

export const careersCard02Locations: readonly CareersCard02Location[] = [
  { id: "worldwide", label: "Worldwide" },
  { id: "europe", label: "Europe" },
  { id: "north-america", label: "North America" },
  { id: "asia", label: "Asia" },
  { id: "oceania", isDisabled: true, label: "Oceania" },
];

const pinIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0 text-fg-quaternary"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D("M12 12.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"),
        h.Stroke("currentColor"),
        h.StrokeWidth("2"),
      ]),
      h.path([
        h.D("M12 22c2-4 8-6.582 8-12a8 8 0 1 0-16 0c0 5.418 6 8 8 12Z"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const clockIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0 text-fg-quaternary"),
      h.Fill("none"),
      h.ViewBox("0 0 24 24"),
    ],
    [
      h.path([
        h.D("M12 6v6l4 2m6-2c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"),
        h.Stroke("currentColor"),
        h.StrokeLinecap("round"),
        h.StrokeLinejoin("round"),
        h.StrokeWidth("2"),
      ]),
    ],
  );

const arrowUpRightIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("size-5 shrink-0 text-fg-brand-secondary-alt"),
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

const jobCard = <Message>(
  job: CareersCard02Job,
  onJob: (jobId: string) => Message,
  h: HtmlBuilder<Message>,
): Html =>
  h.a(
    [
      h.Class(
        "flex flex-col rounded-2xl bg-bg-primary p-6 pb-6 ring-1 ring-border-secondary outline-focus-ring ring-inset focus-visible:outline-2 focus-visible:outline-offset-2 md:pb-7",
      ),
      h.Href(job.href),
      h.OnClick(onJob(job.id)),
    ],
    [
      h.div(
        [h.Class("flex items-center justify-between py-0.5 md:py-0")],
        [
          h.span([h.Class("text-sm font-semibold text-text-brand-secondary")], [job.department]),
          h.span(
            [
              h.Class(
                "group relative hidden h-max cursor-pointer items-center justify-normal gap-1 whitespace-nowrap rounded p-0! text-sm font-semibold text-text-brand-secondary outline-focus-ring transition duration-100 ease-linear before:absolute hover:text-text-brand-secondary-hover md:flex",
              ),
            ],
            [
              h.span(
                [
                  h.Class(
                    "underline decoration-transparent transition-inherit-all hover:decoration-fg-brand-secondary-alt",
                  ),
                  h.DataAttribute("text", ""),
                ],
                ["View job"],
              ),
              arrowUpRightIcon(h),
            ],
          ),
          h.div(
            [h.Class("flex md:hidden")],
            [
              badge(
                {
                  adornment: "dot",
                  color: job.badgeColor,
                  label: job.badgeText,
                  size: "md",
                  type: "pill-color",
                },
                h,
              ),
            ],
          ),
        ],
      ),
      h.div(
        [h.Class("flex items-center gap-2 md:mt-0.5")],
        [
          h.h3([h.Class("text-md font-semibold text-text-primary")], [job.title]),
          h.div(
            [h.Class("hidden md:flex")],
            [
              badge(
                {
                  adornment: "dot",
                  color: job.badgeColor,
                  label: job.badgeText,
                  size: "md",
                  type: "pill-color",
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
              pinIcon(h),
              h.span([h.Class("text-sm font-medium text-text-tertiary")], [job.location]),
            ],
          ),
          h.div(
            [h.Class("flex items-center gap-1.5")],
            [clockIcon(h), h.span([h.Class("text-sm font-medium text-text-tertiary")], [job.type])],
          ),
        ],
      ),
    ],
  );

export const careersCard02 = <Message>(
  props: CareersCard02Props<Message>,
  h: HtmlBuilder<Message>,
): Html =>
  h.section(
    [h.Class("bg-bg-primary py-16 md:py-24"), h.Dir("ltr")],
    [
      h.div(
        [h.Class("mx-auto max-w-container px-4 md:px-8")],
        [
          h.div(
            [h.Class("grid grid-cols-1 gap-12 md:gap-16 lg:grid-cols-2")],
            [
              h.div(
                [h.Class("flex max-w-3xl flex-col")],
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
                [h.Class("flex flex-col gap-8 md:gap-6")],
                [
                  h.div(
                    [],
                    [
                      h.div(
                        [
                          h.Class(
                            "grid grid-cols-1 items-center gap-4 md:grid-cols-[1fr_240px] md:self-end",
                          ),
                        ],
                        [
                          h.p(
                            [
                              h.Class(
                                "hidden text-right text-md font-medium whitespace-nowrap text-text-tertiary md:block",
                              ),
                            ],
                            [props.filterLabel],
                          ),
                          select(
                            {
                              items: props.locations.map((location) => ({
                                iconElement: pinIcon(h),
                                id: location.id,
                                isDisabled: location.isDisabled,
                                label: location.label,
                                onFocus: props.onLocationFocus(location.id),
                                onSelect: props.onLocationSelect(location.id),
                              })),
                              name: props.filterLabel,
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
                  h.ul(
                    [h.Class("flex flex-col gap-4 md:gap-6")],
                    props.jobs.map((job) =>
                      h.keyed("li")(
                        job.id,
                        [h.DataAttribute("job-id", job.id)],
                        [jobCard(job, props.onJob, h)],
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
