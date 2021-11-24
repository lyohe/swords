import { DefineTrigger, TriggerTypes } from "slack-cloud-sdk/mod.ts";
import { ShowListOfAllTerms } from "../workflows/index.ts";

export const ShowListOfAllTermsShortcut = DefineTrigger(
  "list_all_terms_shortcut",
  {
    type: TriggerTypes.Shortcut,
    name: "Show all terms",
    description:
      "Shows a list of all terms in the glossary and posts it in-channel",
  },
)
  .runs(ShowListOfAllTerms)
  .withInputs((ctx) => ({
    channel: ctx.data.channel_id,
    user: ctx.data.user_id,
  }));
