#!/usr/bin/env node

import { DateTime } from "luxon";
import minimist from "minimist";

function printCalender(year, month) {
  const firstDate = DateTime.local(year, month, 1);
  const lastDate = firstDate.endOf("month");
  const title = firstDate.toFormat("MMMM yyyy");
  const padding = Math.floor((20 - title.length) / 2);

  console.log(" ".repeat(padding) + title);
  console.log("Su Mo Tu We Th Fr Sa");
  process.stdout.write("   ".repeat(firstDate.weekday % 7));

  for (let date = firstDate; date <= lastDate; date = date.plus({ days: 1 })) {
    process.stdout.write(String(date.day).padStart(2, " "));
    process.stdout.write(date.weekday === 6 ? "\n" : " ");
  }

  console.log();
  console.log();
}

const argv = minimist(process.argv.slice(2));
const now = DateTime.now();
const year = argv.y ?? now.year;
const month = argv.m ?? now.month;

printCalender(year, month);
