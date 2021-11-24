import { DefineTable, Schema } from "slack-cloud-sdk/mod.ts";

export const Glossary = DefineTable("glossary", {
  primary_key: "id",
  columns: {
    id: {
      type: Schema.types.string,
    },
    name: {
      type: Schema.types.string,
    },
    description: {
      type: Schema.types.string,
    },
    index: {
      type: Schema.types.string,
    },
    last_update_user_id: {
      type: Schema.slack.types.user_id,
    },
    created_at: {
      type: Schema.types.string,
    },
    updated_at: {
      type: Schema.types.string,
    },
  },
});
