#!/usr/bin/env node
import sqlite3 from "sqlite3";
import timers from "timers/promises";

function normalFlow(db) {
  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    () => {
      db.run("INSERT INTO books (title) VALUES (?)", ["異邦人"], function () {
        console.log(`id: ${this.lastID}が追加されました`);

        db.get(
          "SELECT * FROM books WHERE id = ?",
          [this.lastID],
          (_err, row) => {
            console.log(row);

            db.run("DROP TABLE books");
          },
        );
      });
    },
  );
}

function errorFlow(db) {
  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    () => {
      db.run("INSERT INTO books (title) VALUES (?)", ["異邦人"], () => {
        db.run(
          "INSERT INTO books (title) VALUES (?)",
          ["異邦人"],
          function (err) {
            if (err) console.error(err.message);

            db.get("SELECT hoge FROM books", (err) => {
              if (err) console.error(err.message);

              db.run("DROP TABLE books");
            });
          },
        );
      });
    },
  );
}

const db = new sqlite3.Database(":memory:");

console.log("エラーなしのプログラム");
normalFlow(db);

await timers.setTimeout(100);

console.log("エラーありのプログラム");
errorFlow(db);
