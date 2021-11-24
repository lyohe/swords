import { DefineFunction, Schema } from "slack-cloud-sdk/mod.ts";
import { Glossary } from "../tables/index.ts";

export const RemoveTerm = DefineFunction(
  "remove",
  {
    title: "Remove a term",
    description: "Remove a term and definition",
    input_parameters: {
      termName: {
        type: Schema.types.string,
        description: "Name of the term to be stored in the app",
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
            `Failed to remove. Please enter a name of the term you try to delete.`,
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
          text: `Failed to remove because of unknown error.`,
          channel: inputs.channel,
        },
      };
    }

    if (term.rows.length !== 0) {
      await tables.delete(term.rows[0].id);
    } else {
      return {
        outputs: {
          text:
            `Failed to remove "${inputs.termName}" because it is not found in the glossary.`,
          channel: inputs.channel,
        },
      };
    }

    let returnText =
      `Term "${inputs.termName}" has been removed in the glossary.\n`;
    returnText += `It means "${term.rows[0].description}".\n`;
    if (term.rows[0].index) {
      returnText += `Indexed as "${term.rows[0].index}."`;
    }

    return {
      outputs: {
        text: returnText,
        channel: inputs.channel,
      },
    };
  },
);
