import { render, replace, remove } from '../framework/render.js';
import WaypointView from '../view/waypoint-view.js';
import WaypointEditView from '../view/waypoint-edit-view.js';
import { UserAction, UpdateType } from '../const.js';
import { checkEsc } from '../utils/waypoint.js';

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
  #mode = Mode.DEFAULT;

  constructor(waypointsContainer, changeData, changeMode) {
    this.#waypointsContainer = waypointsContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (waypoint, offers, destinations) => {
    this.#waypoint = waypoint;

    const prevWaypointComponent = this.#waypointComponent;
    const prevWaypointEditComponent = this.#waypointEditComponent;

    this.#waypointComponent  = new WaypointView(waypoint, offers);
    this.#waypointEditComponent = new WaypointEditView(waypoint, offers, destinations);

    this.#waypointComponent.setRollupBtnClickHandler(this.#replaceWaypointToForm);
    this.#waypointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#waypointEditComponent.setEditClickHandler(this.#handleEditClick);
    this.#waypointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#waypointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (prevWaypointComponent === null || prevWaypointEditComponent === null) {
      render(this.#waypointComponent, this.#waypointsContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#waypointComponent, prevWaypointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#waypointComponent, prevWaypointEditComponent);
      this.#mode = Mode.DEFAULT;
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
      this.#waypointEditComponent.reset(this.#waypoint);
      this.#replaceFormToWaypoint();
    }
  };

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#waypointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#waypointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#waypointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#waypointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#waypointEditComponent.shake(resetFormState);
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
    if (checkEsc(evt)) {
      evt.preventDefault();
      this.resetView();
    }
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_WAYPOINT,
      UpdateType.MINOR,
      Object.assign(
        {},
        this.#waypoint,
        {
          isFavorite: !this.#waypoint.isFavorite
        }
      )
    );
  };

  #handleFormSubmit = (waypoint) => {
    this.#changeData(UserAction.UPDATE_WAYPOINT, UpdateType.MINOR, waypoint);
    this.#replaceFormToWaypoint();
  };

  #handleDeleteClick = (waypoint) => {
    this.#changeData(UserAction.DELETE_WAYPOINT, UpdateType.MINOR, waypoint);
  };

  #handleEditClick = () => {
    this.resetView();
  };
}
