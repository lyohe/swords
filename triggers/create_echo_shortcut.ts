import { DefineTrigger, TriggerTypes } from "slack-cloud-sdk/mod.ts";
import { CreateTermEcho } from "../workflows/index.ts";

export const CreateTermEchoShortcut = DefineTrigger("create_echo_shortcut", {
  type: TriggerTypes.Shortcut,
  name: "Create a term",
  description: "Creates a term in the glossary and echoes it in-channel",
})
  .runs(CreateTermEcho)
  .withInputs((ctx) => ({
    user: ctx.data.user_id,
    channel: ctx.data.channel_id,
  }));
