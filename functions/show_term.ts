import { DefineFunction, Schema } from "slack-cloud-sdk/mod.ts";
import { Glossary } from "../tables/index.ts";

export const ShowTerm = DefineFunction(
  "show",
  {
    title: "Show a term",
    description: "Show a term and definition",
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
    const tables = Glossary.api(client);

    const term = await tables.query({
      expression: "#name = :term_name",
      expression_columns: { "#name": "name" },
      expression_values: { ":term_name": inputs.termName },
    });

    if (!term.ok) {
      return {
        outputs: {
          text: `Fail to show because of unknown error.`,
          channel: inputs.channel,
        },
      };
    }

    if (term.rows.length === 0) {
      return {
        outputs: {
          text:
            `Failed to show "${inputs.termName}" because it is not found in the glossary.`,
          channel: inputs.channel,
        },
      };
    }

    const returnText = `\`${inputs.termName}\` -- ${term.rows[0].description}`;

    return {
      outputs: {
        text: returnText,
        channel: inputs.channel,
      },
    };
  },
);
