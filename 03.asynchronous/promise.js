#!/usr/bin/env node
import sqlite3 from "sqlite3";
import timers from "timers/promises";
import { run, get } from "./sqlitePromise.js";

function normalFlow(db) {
  run(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  )
    .then(() => run(db, "INSERT INTO books (title) VALUES (?)", ["異邦人"]))
    .then((result) => {
      console.log(`id: ${result.lastID}が追加されました`);
      return get(db, "SELECT * FROM books WHERE id = ?", [result.lastID]);
    })
    .then((row) => {
      console.log(row);
      return run(db, "DROP TABLE books");
    });
}

function errorFlow(db) {
  run(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  )
    .then(() => run(db, "INSERT INTO books (title) VALUES (?)", ["異邦人"]))
    .then(() => run(db, "INSERT INTO books (title) VALUES (?)", ["異邦人"]))
    .catch((err) => {
      console.error(err.message);
      return get(db, "SELECT hoge FROM books");
    })
    .catch((err) => {
      console.error(err.message);
      return run(db, "DROP TABLE books");
    });
}

const db = new sqlite3.Database(":memory:");

console.log("エラーなしのプログラム");
normalFlow(db);

await timers.setTimeout(100);

console.log("エラーありのプログラム");
errorFlow(db);
