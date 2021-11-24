import { DefineWorkflow, Schema } from "slack-cloud-sdk/mod.ts";
import { ListIndexedTerms } from "../functions/index.ts";

export const ShowListOfIndexedTerms = DefineWorkflow(
  "show_list_of_indexed_terms",
  {
    title: "Show indexed terms",
    description: "Shows all terms that have particular index",
    input_parameters: {
      index: {
        type: Schema.types.string,
        description: "Index to show",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description:
          "Optional: Channel ID where to show indexed terms and definitions",
      },
      user: {
        type: Schema.slack.types.user_id,
        description:
          "User ID who show indexed terms.\nMessages by this shortcut are ephemeral, so only this user can see them",
      },
    },
  },
);

const showListIndexedStep = ShowListOfIndexedTerms.addStep(ListIndexedTerms, {
  index: ShowListOfIndexedTerms.inputs.index,
  channel: ShowListOfIndexedTerms.inputs.channel,
  user: ShowListOfIndexedTerms.inputs.user,
});

ShowListOfIndexedTerms.addStep(Schema.slack.functions.SendEphemeralMessage, {
  user_id: showListIndexedStep.outputs.user,
  channel_id: showListIndexedStep.outputs.channel,
  message: showListIndexedStep.outputs.text,
});
