#!/usr/bin/env node

import MemoController from "./lib/memo_controller.js";
import MemoDatabase from "./lib/memo_database.js";
import ConsoleView from "./lib/console_view.js";

const database = new MemoDatabase("./memo.db");
const view = new ConsoleView();

const controller = new MemoController({
  database,
  view,
});

const option = process.argv.slice(2)[0];
controller.run(option);
