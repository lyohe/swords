import { DefineFunction, Schema } from "slack-cloud-sdk/mod.ts";
import { Glossary } from "../tables/index.ts";

export const ListIndexedTerms = DefineFunction(
  "list_indexed_terms",
  {
    title: "List indexed terms",
    description: "List terms that have particular index stored in the glossary",
    input_parameters: {
      index: {
        type: Schema.types.string,
        description: "Index",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Channel",
      },
      user: {
        type: Schema.slack.types.user_id,
        description: "User",
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
      user: {
        type: Schema.slack.types.user_id,
        description: "User",
      },
    },
  },
  async ({ inputs, client, env }) => {
    console.log(client);
    console.log(env);
    const tables = Glossary.api(client);

    const terms = await tables.query({
      expression: "#tables_index = :input_index",
      expression_columns: { "#tables_index": "index" },
      expression_values: { ":input_index": inputs.index },
    });

    if (!terms.ok) {
      return {
        outputs: {
          text: `Fail to show indexed terms because of unknown error.`,
          channel: inputs.channel,
          user: inputs.user,
        },
      };
    }

    if (terms.rows.length === 0) {
      return {
        outputs: {
          text: `There is no term that has index ${inputs.index}.`,
          channel: inputs.channel,
          user: inputs.user,
        },
      };
    }

    const sortedTerms = terms.rows.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });

    const termsString = sortedTerms.map((t) => {
      return `\`${t.name}\` -- ${t.description}`;
    })
      .reduce((acc, cur) => acc + "\n" + cur);

    const textToReturn = `\`---${inputs.index}---\`\n` + termsString;

    return {
      outputs: {
        text: textToReturn,
        channel: inputs.channel,
        user: inputs.user,
      },
    };
  },
);
