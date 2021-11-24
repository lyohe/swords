import { DefineWorkflow, Schema } from "slack-cloud-sdk/mod.ts";
import { CreateTerm } from "../functions/index.ts";

export const CreateTermEcho = DefineWorkflow("create_term_echo", {
  title: "Create, echo",
  description: "Creates a term in glossary, echos it out",
  input_parameters: {
    termName: {
      type: Schema.types.string,
      description: "Name of the term to be stored in the app",
    },
    termDescription: {
      type: Schema.types.string,
      description: "Definition of the term",
    },
    termIndex: {
      type: Schema.types.string,
      description: "Index of the term",
    },
    user: {
      type: Schema.slack.types.user_id,
      description: "User ID",
    },
    channel: {
      type: Schema.slack.types.channel_id,
      description: "Optional: Channel ID where inform this term is created",
    },
  },
});

const createStep = CreateTermEcho.addStep(CreateTerm, {
  termName: CreateTermEcho.inputs.termName,
  termDescription: CreateTermEcho.inputs.termDescription,
  termIndex: CreateTermEcho.inputs.termIndex,
  user: CreateTermEcho.inputs.user,
  channel: CreateTermEcho.inputs.channel,
});

CreateTermEcho.addStep(Schema.slack.functions.SendMessage, {
  channel_id: createStep.outputs.channel,
  message: createStep.outputs.text,
});
