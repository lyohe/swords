import { DefineTrigger, TriggerTypes } from "slack-cloud-sdk/mod.ts";
import { ShowListOfAllIndexes } from "../workflows/index.ts";

export const ShowListOfAllIndexesShortcut = DefineTrigger(
  "list_all_indexes_shortcut",
  {
    type: TriggerTypes.Shortcut,
    name: "Show all indexes",
    description:
      "Shows a list of all indexes used in the glossary and posts it in-channel",
  },
)
  .runs(ShowListOfAllIndexes)
  .withInputs((ctx) => ({
    channel: ctx.data.channel_id,
    user: ctx.data.user_id,
  }));
