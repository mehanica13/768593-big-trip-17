import WaypointEditView from '../view/waypoint-edit-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';
import dayjs from 'dayjs';

const generateBlankWaypoint = () => ({
  basePrice: Number(),
  dateFrom: dayjs(),
  dateTo: dayjs(),
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'taxi',
  newPoint: true
});

export default class WaypointNewPresenter {
  #waypointsContainer = null;
  #waypointEditComponent = null;
  #changeData = null;
  #checkWaypointsCountCallback = null;

  constructor(waypointsContainer, changeData) {
    this.#waypointsContainer = waypointsContainer;
    this.#changeData = changeData;
  }

  init = (callback, offers , destinations) => {
    this.#checkWaypointsCountCallback = callback;

    if (this.#waypointEditComponent !== null) {
      return;
    }

    this.#waypointEditComponent = new WaypointEditView(generateBlankWaypoint(), offers, destinations);

    this.#waypointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#waypointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#waypointEditComponent, this.#waypointsContainer.element, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  destroy = () => {
    if (this.#waypointEditComponent === null) {
      return;
    }
    this.#checkWaypointsCountCallback?.();
    remove(this.#waypointEditComponent);
    this.#waypointEditComponent = null;

    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  setSaving = () => {
    this.#waypointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#waypointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#waypointEditComponent.shake(resetFormState);
  };

  #handleFormSubmit = (waypoint) => {
    this.#changeData(
      UserAction.ADD_WAYPOINT,
      UpdateType.MINOR,
      waypoint,
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
