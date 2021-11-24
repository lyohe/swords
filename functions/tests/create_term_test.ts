import { assertEquals } from "https://deno.land/std@0.99.0/testing/asserts.ts";
import { SlackAPIClient } from "slack-cloud-sdk/mod.ts";
import { CreateTerm } from "../index.ts";

const client = new SlackAPIClient("");

Deno.test("Fail to create by unknown error", async () => {
  const inputs = {
    termName: "",
    termDescription: "",
    termIndex: "",
    user: "",
    channel: "",
  };

  const { outputs } = await CreateTerm.run({
    inputs,
    client,
    env: { SLACK_API_URL: "https://slack.com/api/" },
  });

  assertEquals(
    outputs?.text,
    `Failed to create because of unknown error.`,
  );
});
