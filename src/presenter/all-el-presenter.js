import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import MainContentView from '../view/main-content-view.js';
import WaypointView from '../view/waypoint-view.js';
import {render} from '../render.js';
import WaypointEditView from '../view/waypoint-edit-view.js';

const siteTripFiltersElement = document.querySelector('.trip-controls__filters');
const siteTripEventsElement = document.querySelector('.trip-events');

export default class AllElPresenter {
  #waypointsModel = null;
  #mainContentComponent = new MainContentView();
  #allWaypoints = [];
  #offers = [];
  #allDestinations = [];

  init = (waypointsModel) => {
    this.#waypointsModel = waypointsModel;
    this.#allWaypoints = [...this.#waypointsModel.waypoints];
    this.#offers = [...this.#waypointsModel.offers];
    this.#allDestinations = [...this.#waypointsModel.destinations];

    render(new FilterView(), siteTripFiltersElement);
    render(new SortView(), siteTripEventsElement);
    render(this.#mainContentComponent, siteTripEventsElement);
    // render(new WaypointEditView(this.#allWaypoints[0], this.#offers, this.#allDestinations[0]), this.#mainContentComponent.element);

    for (let i = 0; i < this.#allWaypoints.length; i++) {
      this.#renderWayPoint(this.#allWaypoints[i], this.#offers, this.#allDestinations[i]);
    }
  };

  #renderWayPoint = (waypoint, offers, destination) => {
    const waypointComponent = new WaypointView(waypoint, offers, destination);
    const waypointEditComponent = new WaypointEditView(waypoint, offers, destination);

    const replaceWaypointToForm = () => {
      this.#mainContentComponent.element.replaceChild(waypointEditComponent.element, waypointComponent.element);
    };

    const replaceFormToWaypoint = () => {
      this.#mainContentComponent.element.replaceChild(waypointComponent.element, waypointEditComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToWaypoint();
        document.removeEventListener('keydown',onEscKeyDown);
      }
    };

    waypointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceWaypointToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    waypointEditComponent.element.querySelector('.event--edit').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToWaypoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    waypointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToWaypoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(waypointComponent, this.#mainContentComponent.element);
  };
}
