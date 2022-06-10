import AbstractView from '../framework/view/abstract-view.js';

const createNewWaypointBtnTemplate = () => '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';

export default class NewWaypointBtnView extends AbstractView {
  get template() {
    return createNewWaypointBtnTemplate();
  }

  setNewWaypointBtnClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#newWaypointBtnClickHandler);
  };

  #newWaypointBtnClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
