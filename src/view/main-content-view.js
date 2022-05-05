import {createElement} from '../render.js';

const createMainContentTemplate = () => (
  '<ul class="trip-events__list"></ul>'
);

export default class MainContentView {
  #element = null;

  get template() {
    return createMainContentTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
