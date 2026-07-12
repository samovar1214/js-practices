#!/usr/bin/env node
import sqlite3 from "sqlite3";
import { run, get } from "./sqlitePromise.js";

async function normalFlow(db) {
  await run(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );

  const result = await run(db, "INSERT INTO books (title) VALUES (?)", [
    "異邦人",
  ]);
  console.log(`id: ${result.lastID}が追加されました`);

  const row = await get(db, "SELECT * FROM books WHERE id = ?", [
    result.lastID,
  ]);
  console.log(row);

  await run(db, "DROP TABLE books");
}

async function errorFlow(db) {
  await run(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );

  await run(db, "INSERT INTO books (title) VALUES (?)", ["異邦人"]);

  try {
    await run(db, "INSERT INTO books (title) VALUES (?)", ["異邦人"]);
  } catch (err) {
    if (err instanceof Error && err.code === "SQLITE_CONSTRAINT") {
      console.error(err.message);
    } else {
      throw err;
    }
  }

  try {
    await get(db, "SELECT hoge FROM books");
  } catch (err) {
    if (err instanceof Error && err.code === "SQLITE_ERROR") {
      console.error(err.message);
    } else {
      throw err;
    }
  }

  await run(db, "DROP TABLE books");
}

const db = new sqlite3.Database(":memory:");

console.log("エラーなしのプログラム");
await normalFlow(db);

console.log("エラーありのプログラム");
await errorFlow(db);
