import { render, replace, remove } from '../framework/render.js';
import { SortType } from '../const.js';
import { sortByDate, sortByPrice, sortByTime, filter } from '../utils/waypoint.js';
import SortView from '../view/sort-view.js';
import MainContentView from '../view/main-content-view.js';
import WaypointView from '../view/waypoint-view.js';
import WaypointEditView from '../view/waypoint-edit-view.js';
import NoWaypointView from '../view/no-waypoint-view.js';

const siteTripEventsElement = document.querySelector('.trip-events');

export default class AllElPresenter {
  #waypointsModel = null;
  #filterModel = null;
  #sortingComponent = null;
  #currentSortType = null;
  #mainContentComponent = new MainContentView();
  #allWaypoints = [];
  #offers = [];
  #allDestinations = [];

  constructor(waypointsModel, filterModel) {
    this.#waypointsModel = waypointsModel;
    this.#filterModel = filterModel;
    this.#currentSortType = SortType.DEFAULT;

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
  }

  init = () => {
    this.#allWaypoints = [...this.#waypointsModel.waypoints];
    this.#offers = [...this.#waypointsModel.offers];
    this.#allDestinations = [...this.#waypointsModel.destinations];

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

  #renderWaypoint = (waypoint, offers, destination) => {
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

    waypointComponent.setOnRollupBtnClickHandler(() => {
      replaceWaypointToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    waypointComponent.setOnFavoriteBtnClickHandler();

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

  #renderWaypointList() {
    for (let i = 0; i < this.#getActualWaypoints(this.#allWaypoints).length; i++) {
      this.#renderWaypoint(this.#getActualWaypoints(this.#allWaypoints)[i], this.#offers, this.#allDestinations[i]);
    }
  }

  #renderWaypointsContainer() {
    render(this.#mainContentComponent, siteTripEventsElement);
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

  _onSortTypeChange(sortType) {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;

    remove(this.#mainContentComponent);
    this.#renderWaypointsContainer();
    this.#renderWaypointList();
  }

  _onFilterChange() {
    remove(this.#sortingComponent);
    remove(this.#mainContentComponent);
    this.#renderSortView();
    this.#renderWaypointsContainer();
    this.#renderWaypointList();
  }
}
