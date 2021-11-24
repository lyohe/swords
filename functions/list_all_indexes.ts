import { DefineFunction, Schema } from "slack-cloud-sdk/mod.ts";
import { Glossary } from "../tables/index.ts";

export const ListAllIndexes = DefineFunction(
  "list_all_indexes",
  {
    title: "List all indexes",
    description: "List all indexes used in the glossary",
    input_parameters: {
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
  async ({ inputs, client }) => {
    const tables = Glossary.api(client);

    const terms = await tables.query();

    if (!terms.ok) {
      return {
        outputs: {
          text: `Failed to list all indexes because of unknown error.`,
          channel: inputs.channel,
          user: inputs.user,
        },
      };
    }

    if (terms.rows.length === 0) {
      return {
        outputs: {
          text: `There is no index in the glossary.`,
          channel: inputs.channel,
          user: inputs.user,
        },
      };
    }

    const indexes = [...new Set(terms.rows.map((t) => t.index))];

    const sortedIndexes = indexes.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });

    const indexesWithTerms = sortedIndexes.map((i) => {
      return {
        index: i ? i : "No index",
        terms: terms.rows.filter((t) => t.index === i)
          .map((t) => t.name)
          .reduce((pre, cur) => pre + ", " + cur),
      };
    });

    const sortedIndexesWithTerms = indexesWithTerms.sort();

    const returnText = sortedIndexesWithTerms.map((i) =>
      `\`${i.index}\` -- ${i.terms}`
    )
      .reduce((pre, cur) => pre + "\n" + cur);

    return {
      outputs: {
        text: returnText,
        channel: inputs.channel,
        user: inputs.user,
      },
    };
  },
);
