import { DefineWorkflow, Schema } from "slack-cloud-sdk/mod.ts";
import { UpdateTerm } from "../functions/index.ts";

export const UpdateTermEcho = DefineWorkflow("update_term_echo", {
  title: "Update, echo",
  description: "Updates a term in glossary, echos it out",
  input_parameters: {
    termName: {
      type: Schema.types.string,
      description: "Name of the term to be updated in the app",
    },
    termDescription: {
      type: Schema.types.string,
      description: "Updated definition of the term",
    },
    termIndex: {
      type: Schema.types.string,
      description: "Updated index of the term",
    },
    user: {
      type: Schema.slack.types.user_id,
      description: "User ID",
    },
    channel: {
      type: Schema.slack.types.channel_id,
      description: "Optional: Channel ID where inform this term is updated",
    },
  },
});

const updateStep = UpdateTermEcho.addStep(UpdateTerm, {
  termName: UpdateTermEcho.inputs.termName,
  termDescription: UpdateTermEcho.inputs.termDescription,
  termIndex: UpdateTermEcho.inputs.termIndex,
  user: UpdateTermEcho.inputs.user,
  channel: UpdateTermEcho.inputs.channel,
});

UpdateTermEcho.addStep(Schema.slack.functions.SendMessage, {
  channel_id: updateStep.outputs.channel,
  message: updateStep.outputs.text,
});
