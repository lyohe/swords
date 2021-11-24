import { DefineFunction, Schema } from "slack-cloud-sdk/mod.ts";
import { Glossary } from "../tables/index.ts";

export const CreateTerm = DefineFunction(
  "create",
  {
    title: "Create a term",
    description: "Create a term and definition",
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
        description: "Optional: Channel ID",
      },
    },
    output_parameters: {
      text: {
        type: Schema.types.string,
        description: "Message",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Channel",
      },
    },
  },
  async ({ inputs, client }) => {
    const primaryKey = crypto.randomUUID();
    const now = new Date();

    const tables = Glossary.api(client);

    const duplicatedEntry = await tables.query({
      expression: "#name = :term_name",
      expression_columns: { "#name": "name" },
      expression_values: { ":term_name": inputs.termName },
    });

    if (!duplicatedEntry.ok) {
      return {
        outputs: {
          text: `Failed to create because of unknown error.`,
          channel: inputs.channel,
        },
      };
    }

    if (duplicatedEntry.rows.length !== 0) {
      return {
        outputs: {
          text:
            `Failed to create "${inputs.termName}".\nBecause it already exists in the glossary as ${
              duplicatedEntry.rows[0].description
            }, indexed in ${duplicatedEntry.rows[0].index}`,
          channel: inputs.channel,
        },
      };
    }

    if (!inputs.termName || !inputs.termDescription) {
      return {
        outputs: {
          text:
            `Failed to create a term. Please add both name and description of term you try to create.`,
          channel: inputs.channel,
        },
      };
    }

    await tables.put({
      id: primaryKey,
      name: inputs.termName,
      description: inputs.termDescription,
      index: inputs.termIndex,
      last_update_user_id: inputs.user,
      created_at: now,
      updated_at: now,
    });

    let returnText =
      `Term "${inputs.termName}" has been created in the glossary.\n`;
    returnText += `It means "${inputs.termDescription}."\n`;
    if (inputs.termIndex) {
      returnText += ` indexed in "${inputs.termIndex}".`;
    }

    return {
      outputs: {
        text: returnText,
        channel: inputs.channel,
      },
    };
  },
);
