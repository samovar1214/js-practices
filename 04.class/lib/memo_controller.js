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

    if (content.trim() === "") {
      return;
    }

    const memo = new MemoModel({ content });
    await this.#database.insert(memo);
  }

  async #list() {
    const memos = await this.#database.getAll();

    if (memos.length === 0) {
      this.#view.showMessage("メモがありません。");
      return;
    }

    memos.forEach((memo) => {
      this.#view.showMessage(memo.firstLine);
    });
  }

  async #read() {
    const memos = await this.#database.getAll();

    const selectedMemo = await this.#view.promptSelect(
      memos,
      "表示したいメモを選択してください：",
    );

    if (!selectedMemo) {
      return;
    }

    this.#view.showMessage(`\n${selectedMemo.content}`);
  }

  async #delete() {
    const memos = await this.#database.getAll();

    const selectedMemo = await this.#view.promptSelect(
      memos,
      "削除したいメモを選択してください：",
    );

    if (!selectedMemo) {
      return;
    }

    await this.#database.delete(selectedMemo);
  }

  async #edit() {
    const memos = await this.#database.getAll();

    const selectedMemo = await this.#view.promptSelect(
      memos,
      "編集したいメモを選択してください：",
    );

    if (!selectedMemo) {
      return;
    }

    const updatedContent = this.#view.editInExternalEditor(
      selectedMemo.id,
      selectedMemo.content,
    );

    selectedMemo.content = updatedContent;

    await this.#database.update(selectedMemo);
  }
}
