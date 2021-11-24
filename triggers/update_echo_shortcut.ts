import { DefineTrigger, TriggerTypes } from "slack-cloud-sdk/mod.ts";
import { UpdateTermEcho } from "../workflows/index.ts";

export const UpdateTermEchoShortcut = DefineTrigger("update_echo_shortcut", {
  type: TriggerTypes.Shortcut,
  name: "Update a term",
  description: "Updates a term in the glossary and echoes it in-channel",
})
  .runs(UpdateTermEcho)
  .withInputs((ctx) => ({
    user: ctx.data.user_id,
    channel: ctx.data.channel_id,
  }));
