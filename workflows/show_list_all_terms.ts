import { DefineWorkflow, Schema } from "slack-cloud-sdk/mod.ts";
import { ListAllTerms } from "../functions/index.ts";

export const ShowListOfAllTerms = DefineWorkflow("show_list_of_all_terms", {
  title: "Show all terms",
  description: "Shows all terms stored in the app",
  input_parameters: {
    channel: {
      type: Schema.slack.types.channel_id,
      description: "Channel ID where to show terms and definitions",
    },
    user: {
      type: Schema.slack.types.user_id,
      description:
        "User ID who show the terms.\nMessages by this shortcut are ephemeral, so only this user can see them",
    },
  },
});

const showListAllStep = ShowListOfAllTerms.addStep(ListAllTerms, {
  channel: ShowListOfAllTerms.inputs.channel,
  user: ShowListOfAllTerms.inputs.user,
});

ShowListOfAllTerms.addStep(Schema.slack.functions.SendEphemeralMessage, {
  user_id: showListAllStep.outputs.user,
  channel_id: showListAllStep.outputs.channel,
  message: showListAllStep.outputs.text,
});
