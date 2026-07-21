import pkg from "enquirer";
import fs from "fs";
import { spawnSync } from "child_process";
import path from "path";
import os from "os";

const { Select } = pkg;

export default class ConsoleView {
  readStandardInput() {
    return fs.readFileSync(0, "utf-8").trim();
  }

  showMessage(message) {
    console.log(message);
  }

  async promptSelect(memos, message) {
    if (memos.length === 0) {
      this.showMessage("メモがありません。");
      return null;
    }

    const choices = memos.map((memo) => ({
      name: memo.id.toString(),
      message: memo.firstLine,
    }));

    const selectedId = await new Select({
      name: "memo",
      message: message,
      choices: choices,
    }).run();

    const selectedMemo = memos.find(
      (memo) => memo.id.toString() === selectedId,
    );

    return selectedMemo;
  }

  editInExternalEditor(id, content) {
    const tmpDir = os.tmpdir();
    const tmpFilePath = path.join(tmpDir, `memo_${id}.txt`);

    fs.writeFileSync(tmpFilePath, content, "utf-8");
    const editor = process.env.EDITOR || "vi";

    try {
      spawnSync(editor, [tmpFilePath], { stdio: "inherit" });
      const updatedContent = fs.readFileSync(tmpFilePath, "utf-8");
      return updatedContent;
    } finally {
      fs.unlinkSync(tmpFilePath);
    }
  }
}
