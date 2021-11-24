# Swords

`Slack WORDS`: Create and manage pairs of words, terms and simple definitions in the glossary data hosted by Slack.

**IMPORTANT: Currently this repo is a sample glossary app built for [Next-gen Slack platform](https://api.slack.com/future/overview). It is in closed beta, and expected changes which may cause this app no longer available.**

## Prerequisites

- [Deno JavaScript runtime](https://deno.land/#installation)
- Join the next-gen Slack platform beta
- Approval for create Slack-hosted apps using new Platform APIs by workspace admin
  - Read and agree [the Slack Platform Beta Service Terms](https://slack.com/intl/en-us/terms-of-service/platform-beta)
- [Slack CLI](https://api.slack.com/future/tools/cli)

## Structure

This repo contains a sample app for Next-gen Slack platform. You can immediately use it locally if you meet prerequisites. Please see `Usage` section. 

The main file that brings it all together is the `project.ts` file.  So far only `functions` and `workflows` are supported and those should each be created in a file per, under each corresponding directory. After you create a new function or workflow make sure you add it to the `Project` object in `project.ts`. 

## Usage

You can use this app as Slack global shortcut ⚡️.

### Developing locally

```bash
slack run
```

See also: https://api.slack.com/future/development/run

### Deploying to Slack

```bash
slack deploy
```

See also: https://api.slack.com/future/development/deploy

#### Altering Schema

Altering a table schema in `tables/` may cause split into two tables.

> When altering a table schema, tread carefully! Changing the name of a table currently results in two tables (the old table and its data will continue to exist.) Adding new columns will result in missing data for rows that existed before the column was added.

See also: https://api.slack.com/future/tables#schema

### Features

This app has following Slack global shortcuts you can use ⚡️ ️menu.

- `Create a term`
  - Create a new term and its description in the glossary.
    - If success, the app sends a message that shows created term and its definition.
  - Optional: You can add an index to the term, and you will see list of terms organized by it.
- `Remove a term`
  - Remove a term stored in the glossary.
    - If success, the app sends a message that shows removed term and its definition.
  - Once deleted, you can not retrieve that ever.
- `Show a term`
  - Show a term stored in the glossary by it's name.
  - You can select a channel that the app sends message to.
- `Show all indexes`
  - List of all indexes stored in the glossary.
  - You receive results as ephemeral message no one but you can see it.
- `Show all terms`
  - List of all terms organized by indexes that you add when you create the terms.
  - You receive results as ephemeral message.
- `Show indexed terms`
  - List of terms that have particular index.
  - You receive results as ephemeral message.
- `Update a term`
  - Update a term stored in the glossary.
    - If success, the app sends a message that shows updated term and its definition.


## Testing

You can write tests for your function, see `functions/create_team_test.ts` for a sample. Test base filenames should be suffixed with `_test` then automatically detected as test files. To run tests just run:

```bash
slack deno test --allow-net
```

We have poor test now, and would like to add it using deno standard testing library and Slack API client. Please tell me if you have a good idea.
