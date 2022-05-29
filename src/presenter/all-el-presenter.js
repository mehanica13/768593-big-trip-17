import { render } from '../framework/render.js';
import { SortType } from '../const.js';
import { sortByDate, sortByPrice, sortByTime, filter } from '../utils/waypoint.js';
import { updateItem } from '../utils/common.js';
import SortView from '../view/sort-view.js';
import MainContentView from '../view/main-content-view.js';
import NoWaypointView from '../view/no-waypoint-view.js';
import WaypointPresenter from './waypoint-presenter.js';

const siteTripEventsElement = document.querySelector('.trip-events');

export default class AllElPresenter {
  #waypointsModel = null;
  #filterModel = null;
  #sortingComponent = null;
  #currentSortType = null;
  #waypointsContainer = new MainContentView();
  #allWaypoints = [];
  #waypointPresenter = new Map ();

  constructor(waypointsModel, filterModel) {
    this.#waypointsModel = waypointsModel;
    this.#filterModel = filterModel;
    this.#currentSortType = SortType.DEFAULT;

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
  }

  init = () => {
    this.#allWaypoints = [...this.#waypointsModel.waypoints];

    this.#filterModel.addObserver(this._onFilterChange);

    this.#renderMainContent();
  };

  #getActualWaypoints() {
    const filterType = this.#filterModel.getFilter();
    const filteredWaypoints = filter[filterType](this.#allWaypoints);
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
    render(new NoWaypointView(), siteTripEventsElement);
  }

  #renderWaypoint = (waypoint) => {
    const waypointPresenter = new WaypointPresenter(this.#waypointsContainer.element, this.#handleWaypointChange, this.#handleModeChange);
    waypointPresenter.init( waypoint);
    this.#waypointPresenter[waypoint.id] = waypointPresenter;
  };

  #renderWaypointList() {
    for (let i = 0; i < this.#getActualWaypoints(this.#allWaypoints).length; i++) {
      this.#renderWaypoint(this.#getActualWaypoints(this.#allWaypoints)[i]);
    }
  }

  #clearWaypointList = () => {
    this.#waypointPresenter.forEach((presenter) => presenter.destroy());
    this.#waypointPresenter.clear();
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

  #renderMainContent = () => {
    const waypoints = this.#getActualWaypoints();
    const waypointsCount = waypoints.length;

    if (!waypointsCount) {
      this.#renderNoWaypoints();
    } else {
      this.#renderSortView();
      this.#renderWaypointsContainer();
      this.#allWaypoints.sort(sortByDate);
      this.#renderWaypointList();
    }
  };

  #handleModeChange = () => {
    this.#waypointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleWaypointChange = (updatedWaypoint) => {
    this.#allWaypoints = updateItem(this.#allWaypoints, updatedWaypoint);
    console.log('new1',this.#waypointPresenter[updatedWaypoint.id]);
    console.log(updatedWaypoint);
    this.#waypointPresenter[updatedWaypoint.id].init(updatedWaypoint);
    console.log('newest', this.#waypointPresenter[updatedWaypoint.id].init(updatedWaypoint));
  };

  _onSortTypeChange(sortType) {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;

    this.#clearWaypointList();
    this.#renderWaypointList();
  }

  _onFilterChange() {
    this.#clearWaypointList();
    this.#renderWaypointList();
  }
}
