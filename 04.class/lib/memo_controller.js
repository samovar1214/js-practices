import MemoModel from "./memo_model.js";

export default class MemoController {
  #database;
  #view;

  constructor({ database, view }) {
    this.#database = database;
    this.#view = view;
  }

  async run(option) {
    try {
      await this.#database.setup();

      if (!option) {
        await this.#create();
      } else if (option === "-l") {
        await this.#list();
      } else if (option === "-r") {
        await this.#read();
      } else if (option === "-d") {
        await this.#delete();
      } else if (option === "-e") {
        await this.#edit();
      } else {
        this.#view.showMessage(
          "不明なオプションです。-l, -r, -d, -e のいずれかを指定してください。",
        );
      }
    } finally {
      await this.#database.close();
    }
  }

  async #create() {
    const content = this.#view.readStandardInput();

    if (content === "") {
      return;
    }

    const memo = new MemoModel({ content });
    await this.#database.insert(memo);
  }

  async #fetchMemos() {
    const memos = await this.#database.getAll();

    if (memos.length === 0) {
      this.#view.showMessage("メモがありません。");
      return null;
    }

    return memos;
  }

  async #list() {
    const memos = await this.#fetchMemos();
    if (!memos) return;

    memos.forEach((memo) => {
      this.#view.showMessage(memo.firstLine);
    });
  }

  async #executeWithSelectedMemo(message, actionCallback) {
    const memos = await this.#fetchMemos();
    if (!memos) return;

    const selectedMemo = await this.#view.promptSelect(memos, message);

    if (!selectedMemo) {
      return;
    }

    await actionCallback(selectedMemo);
  }

  async #read() {
    await this.#executeWithSelectedMemo(
      "表示したいメモを選択してください：",
      (memo) => {
        this.#view.showMessage(`\n${memo.content}`);
      },
    );
  }

  async #delete() {
    await this.#executeWithSelectedMemo(
      "削除したいメモを選択してください：",
      async (memo) => await this.#database.delete(memo),
    );
  }

  async #edit() {
    await this.#executeWithSelectedMemo(
      "編集したいメモを選択してください：",
      async (memo) => {
        const updatedContent = this.#view.editInExternalEditor(
          memo.id,
          memo.content,
        );
        memo.content = updatedContent;
        await this.#database.update(memo);
      },
    );
  }
}
