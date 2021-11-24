import { DefineTrigger, TriggerTypes } from "slack-cloud-sdk/mod.ts";
import { ShowOneTerm } from "../workflows/index.ts";

export const ShowTermShortcut = DefineTrigger("show_term_shortcut", {
  type: TriggerTypes.Shortcut,
  name: "Show a term",
  description: "Shows a term in the glossary in-channel",
})
  .runs(ShowOneTerm)
  .withInputs((ctx) => ({
    channel: ctx.data.channel_id,
  }));
