import { DefineWorkflow, Schema } from "slack-cloud-sdk/mod.ts";
import { RemoveTerm } from "../functions/index.ts";

export const RemoveTermEcho = DefineWorkflow("remove_term_echo", {
  title: "Remove, echo",
  description: "Removes a term in glossary, echos it out",
  input_parameters: {
    termName: {
      type: Schema.types.string,
      description: "Name of the term to be removed from the app",
    },
    channel: {
      type: Schema.slack.types.channel_id,
      description: "Optional: Channel ID where inform this term is removed",
    },
  },
});

const removeStep = RemoveTermEcho.addStep(RemoveTerm, {
  termName: RemoveTermEcho.inputs.termName,
  channel: RemoveTermEcho.inputs.channel,
});

RemoveTermEcho.addStep(Schema.slack.functions.SendMessage, {
  channel_id: removeStep.outputs.channel,
  message: removeStep.outputs.text,
});
