import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { SortType, FilterType, UpdateType, UserAction, TimeLimit } from '../const.js';
import { sortByDate, sortByPrice, sortByTime, filter } from '../utils/waypoint.js';
import SortView from '../view/sort-view.js';
import MainContentView from '../view/main-content-view.js';
import NoWaypointView from '../view/no-waypoint-view.js';
import WaypointPresenter from './waypoint-presenter.js';
import NewWaypointPresenter from './new-waypoint-presenter.js';
import LoadingView from '../view/loading-view.js';
import TripInfoView from '../view/trip-info-view.js';

const siteTripEventsElement = document.querySelector('.trip-events');

export default class AllElPresenter {
  #tripHeaderContainer = null;
  #waypointsModel = null;
  #filterModel = null;
  #addNewWaypointBtn = null;
  #sortingComponent = null;
  #noWaypointsComponent = null;
  #tripInfoComponent = null;
  #loadingComponent = new LoadingView();
  #currentSortType = null;
  #waypointsContainer = new MainContentView();
  #waypointPresenter = new Map ();
  #NewWaypointPresenter = null;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor( tripHeaderContainer, waypointsModel, filterModel) {
    this.#tripHeaderContainer = tripHeaderContainer;
    this.#waypointsModel = waypointsModel;
    this.#filterModel = filterModel;
    this.#currentSortType = SortType.DEFAULT;
    this.#NewWaypointPresenter = new NewWaypointPresenter(this.#waypointsContainer, this.#handleViewAction, this.#addNewWaypointBtn);

    this.#waypointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    this.#renderTrip();
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

  createWaypoint = (callback) => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    if (this.#noWaypointsComponent !== null) {
      remove(this.#noWaypointsComponent);
      this.#noWaypointsComponent = null;
    }

    this.#NewWaypointPresenter.init(callback, this.#waypointsModel.offers, this.#waypointsModel.destinations);
  };

  #renderWaypoint = (waypoint) => {
    this.#currentSortType = SortType.DEFAULT;

    const waypointPresenter = new WaypointPresenter(this.#waypointsContainer.element, this.#handleViewAction, this.#handleModeChange);

    waypointPresenter.init(waypoint, this.#waypointsModel.offers, this.#waypointsModel.destinations);
    this.#waypointPresenter.set(waypoint.id, waypointPresenter);
  };

  #renderNoWaypoints = () => {
    if (this.#noWaypointsComponent === null) {
      this.#noWaypointsComponent = new NoWaypointView();
    }

    render(this.#noWaypointsComponent, siteTripEventsElement);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, siteTripEventsElement);
  };

  #renderWaypointList = (waypoints) => {
    waypoints.forEach((waypoint) => this.#renderWaypoint(waypoint));
  };

  #renderWaypointsContainer = () => {
    render(this.#waypointsContainer, siteTripEventsElement);
  };

  #renderSortView = () => {
    if (this.#sortingComponent !== null) {
      this.#sortingComponent = null;
    }

    this.#sortingComponent = new SortView(this.#currentSortType);

    render(this.#sortingComponent, siteTripEventsElement);
    this.#sortingComponent.setSortTypeChangeHandler(this.#onSortTypeChange);
  };

  #renderTrip = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.actualWaypoints.length === 0) {
      this.#renderNoWaypoints();
    } else {
      this.#renderSortView();
      this.#renderWaypointsContainer();
      this.#renderWaypointList(this.actualWaypoints);
      this.#renderTripInfo();
    }
  };

  #clearTrip = ({resetSortType = false} = {}) => {
    this.#NewWaypointPresenter.destroy();
    this.#waypointPresenter.forEach((presenter) => presenter.destroy());
    this.#waypointPresenter.clear();

    remove(this.#tripInfoComponent);
    remove(this.#sortingComponent);
    remove(this.#noWaypointsComponent);
    remove(this.#loadingComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderTripInfo = () => {
    this.#tripInfoComponent = new TripInfoView(this.#waypointsModel.waypoints, this.#waypointsModel.offers);
    render(this.#tripInfoComponent, this.#tripHeaderContainer, RenderPosition.AFTERBEGIN);
  };

  #handleModeChange = () => {
    this.#NewWaypointPresenter.destroy();
    this.#waypointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_WAYPOINT:
        this.#waypointPresenter.get(update.id).setSaving();
        try {
          await this.#waypointsModel.updateWaypoint(updateType, update);
        } catch(err) {
          this.#waypointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_WAYPOINT:
        this.#NewWaypointPresenter.setSaving();
        try {
          await this.#waypointsModel.addWaypoint(updateType, update);
        } catch(err) {
          this.#NewWaypointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_WAYPOINT:
        this.#waypointPresenter.get(update.id).setDeleting();
        try {
          await this.#waypointsModel.deleteWaypoint(updateType, update);
        } catch(err) {
          this.waypointPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderTrip();
        break;
    }
  };

  #onSortTypeChange = (sortType) => {
    this.#currentSortType = sortType;

    this.#clearTrip();
    this.#renderSortView();
    this.#renderWaypointsContainer();
    this.#renderWaypointList(this.actualWaypoints);
    this.#renderTripInfo();
  };
}
