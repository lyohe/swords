import { DefineTrigger, TriggerTypes } from "slack-cloud-sdk/mod.ts";
import { ShowListOfIndexedTerms } from "../workflows/index.ts";

export const ShowListOfIndexedTermsShortcut = DefineTrigger(
  "list_indexed_terms_shortcut",
  {
    type: TriggerTypes.Shortcut,
    name: "Show indexed terms",
    description:
      "Shows a list of all terms that have particular index in the glossary and posts it in-channel",
  },
)
  .runs(ShowListOfIndexedTerms)
  .withInputs((ctx) => ({
    channel: ctx.data.channel_id,
    user: ctx.data.user_id,
  }));
