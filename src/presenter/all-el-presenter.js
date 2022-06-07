import { render, remove } from '../framework/render.js';
import { SortType, FilterType, UpdateType, UserAction } from '../const.js';
import { sortByDate, sortByPrice, sortByTime, filter } from '../utils/waypoint.js';
import SortView from '../view/sort-view.js';
import MainContentView from '../view/main-content-view.js';
import NoWaypointView from '../view/no-waypoint-view.js';
import WaypointPresenter from './waypoint-presenter.js';
import WaypointNewPresenter from './new-waypoint-presenter.js';

const siteTripEventsElement = document.querySelector('.trip-events');

export default class AllElPresenter {
  #waypointsModel = null;
  #filterModel = null;
  #sortingComponent = null;
  #noWaypointsComponent = new NoWaypointView();
  #currentSortType = null;
  #waypointsContainer = new MainContentView();
  #waypointPresenter = new Map ();
  #waypointNewPresenter = null;

  constructor(waypointsModel, filterModel) {
    this.#waypointsModel = waypointsModel;
    this.#filterModel = filterModel;
    this.#currentSortType = SortType.DEFAULT;
    this.#waypointNewPresenter = new WaypointNewPresenter(this.#waypointsContainer, this.#handleViewAction);

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this.#waypointsModel.addObserver(this._handleModelEvent);
    this.#filterModel.addObserver(this._handleModelEvent);
  }

  init = () => {
    this.#renderTrip();

    this._onSortTypeChange(SortType.DEFAULT);
  };

  get actualWaypoints() {
    const filterType = this.#filterModel.filter;
    const waypoints = this.#waypointsModel.waypoints;
    const filteredWaypoints = filter[filterType](waypoints);
    switch (this.#currentSortType) {
      case SortType.DEFAULT:
        return filteredWaypoints.sort(sortByDate);

      case SortType.PRICE:
        return filteredWaypoints.sort(sortByPrice);

      case SortType.TIME:
        return filteredWaypoints.sort(sortByTime);
    }

    return filteredWaypoints;
  }

  #renderNoWaypoints() {
    render(this.#noWaypointsComponent, siteTripEventsElement);
  }

  #renderWaypoint = (waypoint) => {
    this.#currentSortType = SortType.DEFAULT;
    const waypointPresenter = new WaypointPresenter(this.#waypointsContainer.element, this.#handleViewAction, this.#handleModeChange);
    waypointPresenter.init(waypoint);
    this.#waypointPresenter.set(waypoint.id, waypointPresenter);
  };

  createWaypoint = () => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    if (this.#noWaypointsComponent !== null) {
      remove(this.#noWaypointsComponent);
      this.#noWaypointsComponent = null;
    }

    this.#waypointNewPresenter.init();
  };

  #renderWaypointList = (waypoints) => {
    waypoints.forEach((waypoint) => this.#renderWaypoint(waypoint));
  };

  #renderWaypointsContainer() {
    render(this.#waypointsContainer, siteTripEventsElement);
  }

  #renderSortView() {
    if (this.#sortingComponent !== null) {
      this.#sortingComponent = null;
    }

    this.#sortingComponent = new SortView(this.#currentSortType);
    this.#sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    render(this.#sortingComponent, siteTripEventsElement);
  }

  #renderTrip = () => {
    if (this.actualWaypoints.length < 1) {
      this.#renderNoWaypoints();
    } else {
      this.#renderSortView();
      this.#renderWaypointsContainer();
      this.#renderWaypointList(this.actualWaypoints);
    }
  };

  #clearTrip = ({resetSortType = false} = {}) => {
    this.#waypointNewPresenter.destroy();
    this.#waypointPresenter.forEach((presenter) => presenter.destroy());

    remove(this.#sortingComponent);
    remove(this.#noWaypointsComponent);
    remove(this.#waypointsContainer);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #handleModeChange = () => {
    this.#waypointNewPresenter.destroy();
    this.#waypointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_WAYPOINT:
        this.#waypointsModel.updateWaypoint(updateType, update);
        break;
      case UserAction.ADD_WAYPOINT:
        this.#waypointsModel.addWaypoint(updateType, update);
        break;
      case UserAction.DELETE_WAYPOINT:
        this.#waypointsModel.deleteWaypoint(updateType, update);
        break;
    }
  };

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#waypointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSortType: true});
        this.#renderTrip();
        break;
    }
  }

  _onSortTypeChange(sortType) {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTrip();
    this.#renderSortView();
    this.#renderWaypointsContainer();
    this.#renderWaypointList(this.actualWaypoints);
  }
}
