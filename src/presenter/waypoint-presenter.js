import { render, replace, remove } from '../framework/render.js';
import WaypointView from '../view/waypoint-view.js';
import WaypointEditView from '../view/waypoint-edit-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class WaypointPresenter {
  #waypointsContainer = null;
  #waypointComponent = null;
  #waypointEditComponent = null;
  #changeData = null;
  #changeMode = null;

  #waypoint = null;
  #offers = [];
  #destination = null;
  #mode = Mode.DEFAULT;

  constructor(waypointsContainer, changeData, changeMode) {
    this.#waypointsContainer = waypointsContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (waypoint, offers, destination) => {
    this.#waypoint = waypoint;
    this.#offers = offers;
    this.#destination = destination;

    const prevWaypointComponent = this.#waypointComponent;
    const prevWaypointEditComponent = this.#waypointEditComponent;

    this.#waypointComponent  = new WaypointView(waypoint, offers, destination);
    this.#waypointEditComponent = new WaypointEditView(waypoint, offers, destination);

    this.#waypointComponent.setRollupBtnClickHandler(this.#handleRollupBtnClick);
    this.#waypointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#waypointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#waypointEditComponent.setEditClickHandler(this.#handleEditClick);

    if (prevWaypointComponent === null || prevWaypointEditComponent === null) {
      render(this.#waypointComponent, this.#waypointsContainer);
      // eslint-disable-next-line no-useless-return
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#waypointComponent, prevWaypointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#waypointComponent, prevWaypointEditComponent);
    }

    remove(prevWaypointComponent);
    remove(prevWaypointEditComponent);
  };

  destroy = () => {
    remove(this.#waypointComponent);
    remove(this.#waypointEditComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToWaypoint();
    }
  };

  #replaceWaypointToForm = () => {
    replace(this.#waypointEditComponent, this.#waypointComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToWaypoint = () => {
    replace(this.#waypointComponent, this.#waypointEditComponent);
    document.removeEventListener('keydown',this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToWaypoint();
    }
  };

  #handleRollupBtnClick = () => {
    this.#replaceWaypointToForm();
  };

  #handleFavoriteClick = () => {
    this.#changeData({...this.#waypoint, isFavorite: !this.#waypoint.isFavorite}, this.#offers, this.#destination);
  };

  #handleFormSubmit = (waypoint, offers, destination) => {
    this.#changeData(waypoint, offers, destination);
    this.#replaceFormToWaypoint();
  };

  #handleEditClick = () => {
    this.#replaceFormToWaypoint();
  };
}
