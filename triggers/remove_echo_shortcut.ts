import { DefineTrigger, TriggerTypes } from "slack-cloud-sdk/mod.ts";
import { RemoveTermEcho } from "../workflows/index.ts";

export const RemoveTermEchoShortcut = DefineTrigger("remove_echo_shortcut", {
  type: TriggerTypes.Shortcut,
  name: "Remove a term",
  description: "Removes a term in the glossary and echoes it in-channel",
})
  .runs(RemoveTermEcho)
  .withInputs((ctx) => ({
    channel: ctx.data.channel_id,
  }));
