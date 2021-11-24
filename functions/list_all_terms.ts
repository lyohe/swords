import { DefineFunction, Schema } from "slack-cloud-sdk/mod.ts";
import { Glossary } from "../tables/index.ts";

export const ListAllTerms = DefineFunction(
  "list_all_terms",
  {
    title: "List all terms",
    description: "List all terms stored in the glossary",
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
    const glossary = Glossary.api(client);

    const terms = await glossary.query();

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
          text: `There is no term in the glossary.`,
          channel: inputs.channel,
          user: inputs.user,
        },
      };
    }

    const sortedTerms = terms.rows.sort((a, b) => {
      if (!a.index) {
        return 1;
      }
      if (!b.index) {
        return -1;
      }
      if (a.index < b.index) {
        return -1;
      } else if (a.index === b.index) {
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      }
      return 1;
    });

    let beforeIndex: string;
    let returnString: string;

    const returnText = sortedTerms.map((t, i) => {
      returnString = "";

      if (i === 0 || (beforeIndex && beforeIndex !== t.index)) {
        const index = t.index ? t.index : `No index`;
        returnString += `\n\n\`-----${index}-----\`\n`;
      }
      returnString += `\`${t.name}\` -- ${t.description}`;

      beforeIndex = t.index;
      return returnString;
    })
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
