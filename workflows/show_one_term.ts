import { DefineWorkflow, Schema } from "slack-cloud-sdk/mod.ts";
import { ShowTerm } from "../functions/index.ts";

export const ShowOneTerm = DefineWorkflow("show_term", {
  title: "Show",
  description: "Shows a term in glossary in this channel",
  input_parameters: {
    termName: {
      type: Schema.types.string,
      description: "Name of the term to show",
    },
    channel: {
      type: Schema.slack.types.channel_id,
      description:
        "Optional: Channel ID where to show this term and definition",
    },
  },
});

const showStep = ShowOneTerm.addStep(ShowTerm, {
  termName: ShowOneTerm.inputs.termName,
  channel: ShowOneTerm.inputs.channel,
});

ShowOneTerm.addStep(Schema.slack.functions.SendMessage, {
  channel_id: showStep.outputs.channel,
  message: showStep.outputs.text,
});
