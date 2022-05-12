import AbstractView from '../framework/view/abstract-view.js';

const createMainContentTemplate = () => (
  '<ul class="trip-events__list"></ul>'
);

export default class MainContentView extends AbstractView {
  get template() {
    return createMainContentTemplate();
  }
}
