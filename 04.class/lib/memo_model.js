export default class MemoModel {
  #id;
  #content;

  constructor({ content, id = null }) {
    this.#id = id;
    this.#content = content;
  }

  get id() {
    return this.#id;
  }

  get content() {
    return this.#content;
  }

  set content(newContent) {
    this.#content = newContent;
  }

  get firstLine() {
    return this.#content.split("\n")[0];
  }
}
