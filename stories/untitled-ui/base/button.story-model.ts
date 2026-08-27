/* oxlint-disable effect/noReturnInArrow -- The interaction label has one explicit state boundary. */
import * as S from "effect/Schema";

export const ButtonStoryArgs = S.Struct({ label: S.String });
export type ButtonStoryArgs = typeof ButtonStoryArgs.Type;

export const ButtonStoryModel = S.Struct({ label: S.String, presses: S.Finite });
export type ButtonStoryModel = typeof ButtonStoryModel.Type;

export type ButtonStoryMessage = Readonly<{ _tag: "Pressed" }>;

export const initButtonStory = (args: ButtonStoryArgs): ButtonStoryModel => ({
  label: args.label,
  presses: 0,
});

export const updateButtonStory = (
  model: ButtonStoryModel,
  _message: ButtonStoryMessage,
): ButtonStoryModel => ({ label: model.label, presses: model.presses + 1 });

export const buttonInteractionLabel = (model: ButtonStoryModel): string => {
  if (model.presses > 1) {
    return "Run report once more";
  }
  if (model.presses === 1) {
    return "Run report again";
  }
  return model.label;
};
