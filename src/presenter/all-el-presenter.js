import { render, replace } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import MainContentView from '../view/main-content-view.js';
import WaypointView from '../view/waypoint-view.js';
import WaypointEditView from '../view/waypoint-edit-view.js';
import NoWaypointView from '../view/no-waypoint-view.js';

const siteTripFiltersElement = document.querySelector('.trip-controls__filters');
const siteTripEventsElement = document.querySelector('.trip-events');

export default class AllElPresenter {
  #waypointsModel = null;
  #mainContentComponent = new MainContentView();
  #allWaypoints = [];
  #offers = [];
  #allDestinations = [];

  constructor(waypointsModel) {
    this.#waypointsModel = waypointsModel;
  }

  init = () => {
    this.#allWaypoints = [...this.#waypointsModel.waypoints];
    this.#offers = [...this.#waypointsModel.offers];
    this.#allDestinations = [...this.#waypointsModel.destinations];

    this.#renderMainContent();
  };

  #renderMainContent = () => {
    render(new FilterView(), siteTripFiltersElement);

    if (this.#allWaypoints.every((waypoint) => waypoint.isArchive)) {
      render(new NoWaypointView(), siteTripEventsElement);
    } else {
      render(new SortView(), siteTripEventsElement);
      render(this.#mainContentComponent, siteTripEventsElement);

      for (let i = 0; i < this.#allWaypoints.length; i++) {
        this.#renderWayPoint(this.#allWaypoints[i], this.#offers, this.#allDestinations[i]);
      }
    }
  };

  #renderWayPoint = (waypoint, offers, destination) => {
    const waypointComponent = new WaypointView(waypoint, offers, destination);
    const waypointEditComponent = new WaypointEditView(waypoint, offers, destination);

    const replaceWaypointToForm = () => {
      replace(waypointEditComponent, waypointComponent);
    };

    const replaceFormToWaypoint = () => {
      replace(waypointComponent, waypointEditComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToWaypoint();
        document.removeEventListener('keydown',onEscKeyDown);
      }
    };

    waypointComponent.setClickHandler(() => {
      replaceWaypointToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    waypointEditComponent.setFormSubmitHandler(() => {
      replaceFormToWaypoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    waypointEditComponent.setEditClickHandler(() => {
      replaceFormToWaypoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(waypointComponent, this.#mainContentComponent.element);
  };
}
