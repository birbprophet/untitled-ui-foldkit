/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noGlobals, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks, mps/use-clock-service -- Calendar navigation, view, and selection remain in the FoldKit Model; explicit civil dates never read the clock. */
import * as S from "effect/Schema";
import { calendar } from "../../../src/application.ts";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory } from "../story.ts";

const Args = S.Struct({ locale: S.Literals(["en-US", "pt-BR"]) });
const Model = S.Struct({
  ...Args.fields,
  anchorDate: S.String,
  selectedDate: S.optional(S.String),
  view: S.Literals(["month", "week", "day"]),
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Added" }>
  | Readonly<{ _tag: "Navigated"; direction: "previous" | "next" | "today" }>
  | Readonly<{ _tag: "InitialScrollCompleted" }>
  | Readonly<{ _tag: "Searched" }>
  | Readonly<{ _tag: "Selected"; date: string }>
  | Readonly<{ _tag: "ViewChanged"; view: "month" | "week" | "day" }>;

const added: Message = { _tag: "Added" };
const searched: Message = { _tag: "Searched" };
const initialScrollCompleted: Message = { _tag: "InitialScrollCompleted" };
const navigated = (direction: "previous" | "next" | "today"): Message => ({
  _tag: "Navigated",
  direction,
});
const selected = (date: string): Message => ({ _tag: "Selected", date });
const viewChanged = (view: "month" | "week" | "day"): Message => ({ _tag: "ViewChanged", view });
const events = [
  {
    color: "blue",
    end: "2026-08-05T10:00:00-03:00",
    id: "design",
    start: "2026-08-05T09:00:00-03:00",
    title: "Design sync",
  },
  {
    color: "brand",
    dot: true,
    end: "2026-08-11T12:00:00-03:00",
    id: "planning",
    start: "2026-08-11T10:30:00-03:00",
    title: "Quarterly planning",
  },
  {
    color: "green",
    end: "2026-08-24T11:00:00-03:00",
    id: "demo",
    start: "2026-08-24T09:30:00-03:00",
    title: "Product demo",
  },
  {
    color: "orange",
    end: "2026-08-24T15:00:00-03:00",
    id: "interview",
    start: "2026-08-24T14:00:00-03:00",
    title: "Customer interview",
  },
  {
    color: "pink",
    end: "2026-08-28T17:00:00-03:00",
    id: "review",
    start: "2026-08-28T16:00:00-03:00",
    title: "Weekly review",
  },
] as const;

const shift = (model: Model, direction: "previous" | "next" | "today"): Model => {
  if (direction === "today") {
    return { ...model, anchorDate: "2026-08-24", selectedDate: "2026-08-24" };
  }
  const date = new Date(`${model.anchorDate}T12:00:00`);
  const amount = direction === "previous" ? -1 : 1;
  if (model.view === "month") {
    date.setMonth(date.getMonth() + amount);
  } else {
    date.setDate(date.getDate() + amount * (model.view === "week" ? 7 : 1));
  }
  const next = `${String(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return { ...model, anchorDate: next, selectedDate: model.view === "day" ? next : undefined };
};

const update = (model: Model, message: Message): Model => {
  if (message._tag === "Navigated") {
    return shift(model, message.direction);
  }
  if (message._tag === "Selected") {
    return { ...model, anchorDate: message.date, selectedDate: message.date };
  }
  if (message._tag === "ViewChanged") {
    return { ...model, view: message.view };
  }
  return model;
};

const render = (model: Model, h: Parameters<typeof calendar<Message>>[1]) =>
  h.div(
    [h.Class("fixed inset-0 overflow-auto bg-bg-secondary p-4 md:p-8")],
    [
      h.div(
        [h.Class("min-h-full")],
        [
          calendar(
            {
              anchorDate: model.anchorDate,
              events,
              locale: model.locale,
              onAddEvent: added,
              onInitialScroll: initialScrollCompleted,
              onNavigate: navigated,
              onSearch: searched,
              onSelectDate: selected,
              onViewChange: viewChanged,
              selectedDate: model.selectedDate,
              view: model.view,
            },
            h,
          ),
        ],
      ),
    ],
  );

const definition = {
  Args,
  Model,
  init: (args: typeof Args.Type): Model => ({ ...args, anchorDate: "2026-08-24", view: "month" }),
  update,
  view: render,
} as const;
const args: typeof Args.Type = { locale: "en-US" };

export default {
  ...componentMeta("calendar"),
  argTypes: { locale: { control: "select", options: ["en-US", "pt-BR"] } },
  title: "Untitled UI/Application/Calendar",
};

export const AllVariants = { ...liveStory(definition), args };
export const States = {
  ...liveStory({
    ...definition,
    init: (storyArgs: typeof Args.Type): Model => ({
      ...storyArgs,
      anchorDate: "2026-08-24",
      selectedDate: "2026-08-24",
      view: "week",
    }),
  }),
  args,
};
export const Dark = {
  ...liveStory({
    ...definition,
    view: (model, h) => h.div([h.DataAttribute("theme", "dark")], [render(model, h)]),
  }),
  args,
};
export const Responsive = {
  ...liveStory({
    ...definition,
    init: (storyArgs: typeof Args.Type): Model => ({
      ...storyArgs,
      anchorDate: "2026-08-24",
      selectedDate: "2026-08-24",
      view: "month",
    }),
  }),
  args: { locale: "pt-BR" },
};
export const Interactions = {
  ...liveStory(definition),
  args,
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.selectOptions(
      await canvas.findByRole("combobox", { name: "Calendar view" }),
      "week",
    );
    await expect(await canvas.findByText("Mon")).toBeVisible();
    const tuesday = await canvas.findByRole("button", { name: "Tue 25" });
    tuesday.focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.selectOptions(
      await canvas.findByRole("combobox", { name: "Calendar view" }),
      "day",
    );
    await expect(await canvas.findByText("Tuesday")).toBeVisible();
    await expect(await canvas.findByText("9 AM")).toBeVisible();
  },
};
