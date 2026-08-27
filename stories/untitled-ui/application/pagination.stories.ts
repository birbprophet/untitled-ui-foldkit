/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/require-is-prefix-for-boolean-schema-field -- Storybook exposes the upstream rounded prop and its play function uses the browser promise API. */
import * as S from "effect/Schema";
import { pagination } from "../../../src/application.ts";
import type { PaginationProps, PaginationVariant } from "../../../src/application.ts";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";

const Variant = S.Union([
  S.Literal("page-default"),
  S.Literal("page-minimal-center"),
  S.Literal("card-default"),
  S.Literal("card-minimal"),
  S.Literal("button-group"),
  S.Literal("card-advanced"),
]);
const Align = S.Union([
  S.Literal("left"),
  S.Literal("center"),
  S.Literal("right"),
  S.Literal("space-between"),
]);
const Args = S.Struct({
  align: Align,
  page: S.Number,
  pageSize: S.Number,
  rounded: S.Boolean,
  total: S.Number,
  variant: Variant,
});
const Model = Args;
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "PageChanged"; page: number }>
  | Readonly<{ _tag: "PageSizeChanged"; pageSize: number }>;
const pageChanged = (page: number): Message => ({ _tag: "PageChanged", page });
const pageSizeChanged = (pageSize: number): Message => ({ _tag: "PageSizeChanged", pageSize });
const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => args,
  update: (model: Model, message: Message): Model =>
    message._tag === "PageChanged"
      ? { ...model, page: message.page }
      : { ...model, pageSize: message.pageSize },
  view: (model: Model, h: Parameters<typeof pagination<Message>>[1]) =>
    pagination({ ...model, messageForPage: pageChanged, messageForPageSize: pageSizeChanged }, h),
} as const;

const defaultArgs = {
  align: "left",
  page: 5,
  pageSize: 10,
  rounded: false,
  total: 20,
  variant: "page-default",
} as const;
const variants: readonly PaginationVariant[] = [
  "page-default",
  "page-minimal-center",
  "card-default",
  "card-minimal",
  "button-group",
  "card-advanced",
];
const specimen = (
  model: Model,
  h: Parameters<typeof pagination<Message>>[1],
  props: Partial<PaginationProps<Message>>,
) =>
  h.div(
    [h.Class("uui-pagination-specimen")],
    [
      pagination(
        {
          ...model,
          messageForPage: pageChanged,
          messageForPageSize: pageSizeChanged,
          ...props,
        },
        h,
      ),
    ],
  );

export default { ...componentMeta("pagination"), title: "Untitled UI/Application/Pagination" };

export const AllVariants = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix(
        variants.map((variant) => [variant, [specimen(model, h, { variant })]]),
        h,
      ),
  }),
  args: defaultArgs,
};

export const States = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      matrix(
        [
          ["First page", [specimen(model, h, { page: 1, variant: "page-default" })]],
          ["Last page", [specimen(model, h, { page: 20, variant: "page-default" })]],
          ["Rounded", [specimen(model, h, { rounded: true, variant: "page-default" })]],
          ["Centered", [specimen(model, h, { align: "center", variant: "card-minimal" })]],
        ],
        h,
      ),
  }),
  args: defaultArgs,
};

export const Dark = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) =>
      h.div(
        [
          h.Class("min-h-screen bg-bg-primary p-8 outline-[100vmax] outline-bg-primary"),
          h.DataAttribute("theme", "dark"),
        ],
        [specimen(model, h, { variant: "card-advanced" })],
      ),
  }),
  args: defaultArgs,
};

export const Responsive = {
  ...liveStory({
    ...definition,
    update: (model: Model, _message: Message) => model,
    view: (model, h) => specimen(model, h, { variant: "page-default" }),
  }),
  args: defaultArgs,
};

export const Interactions = {
  ...liveStory(definition),
  args: defaultArgs,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("button", { name: "Next" }));
    await expect(await canvas.findByRole("button", { name: "Page 6" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}{Enter}");
  },
};
