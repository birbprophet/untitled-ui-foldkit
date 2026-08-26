/* oxlint-disable effect/noReturnInArrow, effect/noSpread -- Direct FoldKit transcription of the authenticated Untitled UI careers section. */
import type { Html, HtmlBuilder } from "foldkit/html";

import { tabs } from "../application/tabs.ts";
import { badge } from "../base/badges.ts";
import type { BadgeColor } from "../base/badges.ts";

export interface CareersCard01Department {
  readonly id: string;
  readonly label: string;
}

export interface CareersCard01Job {
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

export interface CareersCard01Props<Message> {
  readonly departments: readonly CareersCard01Department[];
  readonly description: string;
  readonly heading: string;
  readonly jobs: readonly CareersCard01Job[];
  readonly onDepartmentSelect: (id: string) => NoInfer<Message>;
  readonly onJob: (id: string) => NoInfer<Message>;
  readonly selectedDepartmentId: string;
}

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

const arrowIcon = <Message>(h: HtmlBuilder<Message>): Html =>
  h.svg(
    [
      h.AriaHidden(true),
      h.Class("pointer-events-none size-5 shrink-0 text-fg-brand-secondary-alt"),
      h.DataAttribute("icon", "trailing"),
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

const nativeSelect = <Message>(props: CareersCard01Props<Message>, h: HtmlBuilder<Message>): Html =>
  h.div(
    [h.Class("w-full md:hidden")],
    [
      h.div(
        [h.Class("relative grid w-full items-center")],
        [
          h.select(
            [
              h.AriaLabel("Departments"),
              h.Class(
                "appearance-none rounded-lg bg-bg-primary py-2 pl-3 text-md font-medium text-text-primary shadow-xs ring-1 ring-border-primary outline-hidden transition duration-100 ease-linear ring-inset focus-visible:ring-2 focus-visible:ring-border-brand disabled:cursor-not-allowed disabled:opacity-50",
              ),
              h.Id("careers-card-01-departments-select"),
              h.Value(props.selectedDepartmentId),
              h.OnChange(props.onDepartmentSelect),
            ],
            props.departments.map((department) =>
              h.option([h.Value(department.id)], [department.label]),
            ),
          ),
          h.svg(
            [
              h.AriaHidden(true),
              h.Class("pointer-events-none absolute right-3 size-4 text-fg-quaternary"),
              h.Fill("none"),
              h.ViewBox("0 0 20 20"),
            ],
            [
              h.path([
                h.D("m5.5 7.5 4.5 4.5 4.5-4.5"),
                h.Stroke("currentColor"),
                h.StrokeLinecap("round"),
                h.StrokeLinejoin("round"),
                h.StrokeWidth("1.67"),
              ]),
            ],
          ),
        ],
      ),
    ],
  );

const jobCard = <Message>(
  job: CareersCard01Job,
  onJob: (id: string) => Message,
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
                "group relative hidden h-max cursor-pointer items-center justify-normal gap-1 rounded p-0! text-sm font-semibold whitespace-nowrap text-text-brand-secondary outline-focus-ring transition duration-100 ease-linear before:absolute hover:text-text-brand-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 md:flex",
              ),
            ],
            [
              h.span(
                [h.Class("transition-inherit-all"), h.DataAttribute("text", "")],
                ["View job"],
              ),
              arrowIcon(h),
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

export const careersCard01 = <Message>(
  props: CareersCard01Props<Message>,
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
            [h.Class("mt-12 w-full md:mx-auto md:mt-16 md:w-max")],
            [
              nativeSelect(props, h),
              h.div(
                [h.Class("max-md:hidden")],
                [
                  tabs(
                    {
                      ariaLabel: "Departments",
                      id: "careers-card-01-departments",
                      items: props.departments.map((department) => ({
                        focusMessage: props.onDepartmentSelect(department.id),
                        id: department.id,
                        label: department.label,
                        selectMessage: props.onDepartmentSelect(department.id),
                      })),
                      selectedId: props.selectedDepartmentId,
                      size: "md",
                      type: "button-border",
                    },
                    h,
                  ),
                ],
              ),
            ],
          ),
          h.div(
            [h.Class("mx-auto mt-8 max-w-3xl md:mt-16")],
            [
              h.ul(
                [h.Class("flex flex-col gap-4 md:gap-6")],
                props.jobs.map((job) => h.keyed("li")(job.id, [], [jobCard(job, props.onJob, h)])),
              ),
            ],
          ),
        ],
      ),
    ],
  );
