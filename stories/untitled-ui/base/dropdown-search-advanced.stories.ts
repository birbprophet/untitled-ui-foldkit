/* oxlint-disable @rikalabs/effect-no-async-await, effect/noAsyncFunction, effect/noReturnInArrow, effect/noSpread, effect/noTernary, foldkit/prefer-callable-message-constructor, mps/avoid-direct-tag-checks -- Storybook interactions use the browser promise API directly. */
import * as S from "effect/Schema";
import { dropdownSearchAdvanced } from "../../../src/base.ts";
import { expect, userEvent, within } from "storybook/test";

import { componentMeta, waitForStoryReady, liveStory, matrix } from "../story.ts";
import { agentFace } from "../../fixtures/brand.ts";

const Args = S.Struct({});
const Model = S.Struct({
  createdTeams: S.Number,
  focusedId: S.String,
  isOpen: S.Boolean,
  isSiglataOpen: S.Boolean,
  query: S.String,
  selectedAgentIds: S.Array(S.String),
  selectedTeamIds: S.Array(S.String),
});
type Model = typeof Model.Type;
type Message =
  | Readonly<{ _tag: "Closed" | "CreatedTeam" | "SiglataToggled" | "Toggled" }>
  | Readonly<{ _tag: "AgentToggled" | "Focused" | "TeamToggled"; id: string }>
  | Readonly<{ _tag: "QueryChanged"; query: string }>;

const specimen = (model: Model, h: Parameters<typeof dropdownSearchAdvanced<Message>>[1]) =>
  dropdownSearchAdvanced(
    {
      avatars: {
        demi: agentFace("Demi Wilkinson"),
        lana: agentFace("Lana Steiner"),
        olivia: agentFace("Olivia Rhye"),
        phoenix: agentFace("Phoenix Baker"),
      },
      focusedId: model.focusedId,
      isOpen: model.isOpen,
      isSiglataOpen: model.isSiglataOpen,
      onAgentToggle: (id): Message => ({ _tag: "AgentToggled", id }),
      onClose: { _tag: "Closed" },
      onCreateTeam: { _tag: "CreatedTeam" },
      onFocus: (id): Message => ({ _tag: "Focused", id }),
      onQueryChange: (query): Message => ({ _tag: "QueryChanged", query }),
      onSiglataToggle: { _tag: "SiglataToggled" },
      onTeamToggle: (id): Message => ({ _tag: "TeamToggled", id }),
      onToggle: { _tag: "Toggled" },
      query: model.query,
      selectedAgentIds: model.selectedAgentIds,
      selectedTeamIds: model.selectedTeamIds,
    },
    h,
  );

const toggleId = (ids: readonly string[], id: string): readonly string[] =>
  ids.includes(id) ? ids.filter((candidate) => candidate !== id) : [...ids, id];

const definition = (initiallyOpen: boolean, initiallyNested = false) => ({
  Args,
  Model,
  init: (_args: typeof Args.Type): Model => ({
    createdTeams: 0,
    focusedId: "siglata",
    isOpen: initiallyOpen,
    isSiglataOpen: initiallyNested,
    query: "",
    selectedAgentIds: [],
    selectedTeamIds: ["siglata", "shutterframe"],
  }),
  update: (model: Model, message: Message): Model => {
    if (message._tag === "Toggled") {
      return { ...model, isOpen: !model.isOpen, isSiglataOpen: false };
    }
    if (message._tag === "Closed") {
      return { ...model, isOpen: false, isSiglataOpen: false };
    }
    if (message._tag === "Focused") {
      return { ...model, focusedId: message.id };
    }
    if (message._tag === "QueryChanged") {
      return { ...model, isSiglataOpen: false, query: message.query };
    }
    if (message._tag === "SiglataToggled") {
      return { ...model, isSiglataOpen: !model.isSiglataOpen };
    }
    if (message._tag === "TeamToggled") {
      return { ...model, selectedTeamIds: toggleId(model.selectedTeamIds, message.id) };
    }
    if (message._tag === "AgentToggled") {
      return { ...model, selectedAgentIds: toggleId(model.selectedAgentIds, message.id) };
    }
    return message._tag === "CreatedTeam"
      ? { ...model, createdTeams: model.createdTeams + 1 }
      : model;
  },
  view: (model: Model, h: Parameters<typeof dropdownSearchAdvanced<Message>>[1]) =>
    h.div([h.Class("min-h-[36rem]")], [specimen(model, h)]),
});

export default {
  ...componentMeta("dropdown-search-advanced"),
  title: "Untitled UI/Base/Dropdown Search Advanced",
};

export const AllVariants = {
  ...liveStory({
    ...definition(false),
    view: (model, h) => matrix([["Trigger", [specimen(model, h)]]], h),
  }),
  args: {},
};
export const States = {
  ...liveStory({
    ...definition(true),
    view: (model, h) => matrix([["Open", [specimen(model, h)]]], h),
  }),
  args: {},
};
export const Dark = {
  ...liveStory({
    ...definition(false),
    view: (model, h) =>
      h.div(
        [h.Class("min-h-screen bg-bg-primary p-8"), h.DataAttribute("theme", "dark")],
        [specimen(model, h)],
      ),
  }),
  args: {},
};
export const Interactions = {
  ...liveStory(definition(false)),
  args: {},
  play: async ({ canvasElement }: { readonly canvasElement: HTMLElement }) => {
    await waitForStoryReady(canvasElement);
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("button", { name: "Manage access" }));
    await userEvent.click(await canvas.findByRole("menuitemcheckbox", { name: "Siglata" }));
    await userEvent.click(await canvas.findByRole("menuitemcheckbox", { name: "Olivia Rhye" }));
    await expect(
      await canvas.findByRole("menuitemcheckbox", { checked: true, name: "Olivia Rhye" }),
    ).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
  },
};
