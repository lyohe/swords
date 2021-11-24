import { DefineFunction, Schema } from "slack-cloud-sdk/mod.ts";
import { Glossary } from "../tables/index.ts";

export const UpdateTerm = DefineFunction(
  "update",
  {
    title: "Update a term",
    description: "Update a term and definition",
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
    if (!inputs.termName) {
      return {
        outputs: {
          text:
            `Failed to update. Please enter a name of the term that you try to update.`,
          channel: inputs.channel,
        },
      };
    }

    if (!inputs.termDescription && !inputs.termIndex) {
      return {
        outputs: {
          text:
            `Failed to update. Please enter description or index of the term that you try to update.`,
          channel: inputs.channel,
        },
      };
    }

    const tables = Glossary.api(client);

    const term = await tables.query({
      expression: "#name = :term_name",
      expression_columns: { "#name": "name" },
      expression_values: { ":term_name": inputs.termName },
    });

    if (!term.ok) {
      return {
        outputs: {
          text: `Failed to update because of unknown error.`,
          channel: inputs.channel,
        },
      };
    }

    if (term.rows.length === 0) {
      return {
        outputs: {
          text:
            `Failed to update "${inputs.termName}".\nBecause it does not exist in the glossary.`,
          channel: inputs.channel,
        },
      };
    }

    await tables.put({
      id: term.rows[0].id,
      name: inputs.termName,
      description: inputs.termDescription,
      index: inputs.termIndex,
      last_update_user_id: inputs.user,
      updated_at: new Date(),
    });

    let returnText =
      `Term "${inputs.termName}" has been updated in the glossary.\n`;
    if (inputs.termDescription) {
      returnText += `It means "${inputs.termDescription}".\n`;
    }
    if (inputs.termIndex) {
      returnText += `Indexed in "${inputs.termIndex}".\n`;
    }
    returnText += `.`;

    return {
      outputs: {
        text: returnText,
        channel: inputs.channel,
      },
    };
  },
);
