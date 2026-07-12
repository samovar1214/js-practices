import sqlite3 from "sqlite3";
import MemoModel from "./memo_model.js";
import { run, all, close } from "./sqlite_helper.js";

export default class MemoDatabase {
  #db;

  constructor(dbPath) {
    this.#db = new sqlite3.Database(dbPath);
  }

  async setup() {
    await run(
      this.#db,
      `
        CREATE TABLE IF NOT EXISTS memos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          content TEXT NOT NULL
        )
      `,
    );
  }

  async insert(memo) {
    await run(this.#db, "INSERT INTO memos (content) VALUES (?)", [
      memo.content,
    ]);
  }

  async getAll() {
    const memos = await all(this.#db, "SELECT id, content FROM memos");

    return memos.map(
      (memo) =>
        new MemoModel({
          id: memo.id,
          content: memo.content,
        }),
    );
  }

  async delete(memo) {
    await run(this.#db, "DELETE FROM memos WHERE id = ?", [memo.id]);
  }

  async update(memo) {
    await run(this.#db, "UPDATE memos SET content = ? WHERE id = ?", [
      memo.content,
      memo.id,
    ]);
  }

  async close() {
    await close(this.#db);
  }
}
