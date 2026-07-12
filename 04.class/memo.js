#!/usr/bin/env node

import MemoController from "./lib/memo_controller.js";
import MemoDatabase from "./lib/memo_database.js";
import ConsoleView from "./lib/console_view.js";

const option = process.argv.slice(2)[0];
const database = new MemoDatabase("./memo.db");
const view = new ConsoleView();

const app = new MemoController({
  database,
  view,
});

app.run(option);
