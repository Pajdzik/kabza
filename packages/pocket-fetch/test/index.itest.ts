export {};

import {
  obtainRequestToken,
  constructRedirectUri,
  retrieveAccessToken,
} from "../src/index.js";

import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const response = await obtainRequestToken({
  consumerKey: "105214-7d4e09030d4f205480d5a90",
  redirectUri: "http://localhost",
});

const uri = constructRedirectUri(response.code, "http://localhost");

console.log(uri);

const rl = readline.createInterface({ input, output });
const answer = await rl.question("What do you think of Node.js? ");

const c = await retrieveAccessToken({
  code: response.code,
  consumerKey: "105214-7d4e09030d4f205480d5a90",
});

console.log(c);
