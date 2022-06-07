import WaypointEditView from '../view/waypoint-edit-view.js';
import { nanoid } from 'nanoid';
import { render, remove, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';


export default class WaypointNewPresenter {
  #waypointsContainer = null;
  #waypointEditComponent = null;
  #changeData = null;

  constructor(waypointsContainer, changeData) {
    this.#waypointsContainer = waypointsContainer;
    this.#changeData = changeData;
  }

  init = () => {
    if (this.#waypointEditComponent !== null) {
      return;
    }

    this.#waypointEditComponent = new WaypointEditView();

    this.#waypointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#waypointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);
    this.#waypointEditComponent.setEditClickHandler(this.#handleCloseEditClick);

    render(this.#waypointEditComponent, this.#waypointsContainer.element, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  destroy = () => {
    if (this.#waypointEditComponent === null) {
      return;
    }

    remove(this.#waypointEditComponent);
    this.#waypointEditComponent = null;

    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #handleFormSubmit = (waypoint) => {
    this.#changeData(
      UserAction.ADD_WAYPOINT,
      UpdateType.MINOR,
      Object.assign({id: nanoid()},waypoint)
    );
    this.destroy();
    document.querySelector('.trip-main__event-add-btn').disabled = false;
  };

  #handleCloseEditClick = () => {
    this.destroy();
    document.querySelector('.trip-main__event-add-btn').disabled = false;
  };

  #handleDeleteClick = () => {
    this.destroy();
    document.querySelector('.trip-main__event-add-btn').disabled = false;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
      document.querySelector('.trip-main__event-add-btn').disabled = false;
    }
  };
}
