import { Project } from "slack-cloud-sdk/mod.ts";
import {
  CreateTerm,
  ListAllIndexes,
  ListAllTerms,
  ListIndexedTerms,
  RemoveTerm,
  ShowTerm,
  UpdateTerm,
} from "./functions/index.ts";
import {
  CreateTermEcho,
  RemoveTermEcho,
  ShowListOfAllIndexes,
  ShowListOfAllTerms,
  ShowListOfIndexedTerms,
  ShowOneTerm,
  UpdateTermEcho,
} from "./workflows/index.ts";
import {
  CreateTermEchoShortcut,
  RemoveTermEchoShortcut,
  ShowListOfAllIndexesShortcut,
  ShowListOfAllTermsShortcut,
  ShowListOfIndexedTermsShortcut,
  ShowTermShortcut,
  UpdateTermEchoShortcut,
} from "./triggers/index.ts";
import { Glossary } from "./tables/index.ts";

Project({
  name: "swords",
  description:
    "Slack WORDS: Create and manage pairs of words, terms and definitions in the glossary data table hosted by Slack",
  icon: "assets/icon.png",
  runtime: "deno1.x",
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "tables:read",
    "tables:write",
  ],
  functions: [
    CreateTerm,
    UpdateTerm,
    RemoveTerm,
    ListAllTerms,
    ShowTerm,
    ListAllIndexes,
    ListIndexedTerms,
  ],
  workflows: [
    CreateTermEcho,
    UpdateTermEcho,
    RemoveTermEcho,
    ShowListOfAllTerms,
    ShowOneTerm,
    ShowListOfAllIndexes,
    ShowListOfIndexedTerms,
  ],
  triggers: [
    CreateTermEchoShortcut,
    UpdateTermEchoShortcut,
    RemoveTermEchoShortcut,
    ShowListOfAllTermsShortcut,
    ShowTermShortcut,
    ShowListOfAllIndexesShortcut,
    ShowListOfIndexedTermsShortcut,
  ],
  tables: [Glossary],
  outgoingDomains: [],
});
