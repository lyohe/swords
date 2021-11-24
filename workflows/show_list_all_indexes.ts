import { DefineWorkflow, Schema } from "slack-cloud-sdk/mod.ts";
import { ListAllIndexes } from "../functions/index.ts";

export const ShowListOfAllIndexes = DefineWorkflow("show_list_of_all_indexs", {
  title: "Show all indexes",
  description: "Shows all indexes used in the app",
  input_parameters: {
    channel: {
      type: Schema.slack.types.channel_id,
      description: "Channel ID where to show indexes",
    },
    user: {
      type: Schema.slack.types.user_id,
      description:
        "User ID who show the indexes.\nMessages by this shortcut are ephemeral, so only this user can see them",
    },
  },
});

const showListOfAllIndexesStep = ShowListOfAllIndexes.addStep(ListAllIndexes, {
  channel: ShowListOfAllIndexes.inputs.channel,
  user: ShowListOfAllIndexes.inputs.user,
});

ShowListOfAllIndexes.addStep(Schema.slack.functions.SendEphemeralMessage, {
  user_id: showListOfAllIndexesStep.outputs.user,
  channel_id: showListOfAllIndexesStep.outputs.channel,
  message: showListOfAllIndexesStep.outputs.text,
});
