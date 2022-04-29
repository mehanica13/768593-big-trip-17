import {createElement} from '../render.js';

const createMainContentTemplate = () => (
  '<ul class="trip-events__list"></ul>'
);

export default class MainContentView {
  getTemplate() {
    return createMainContentTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
