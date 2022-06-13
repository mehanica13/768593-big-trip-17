import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

function getPastWaypoints(waypoints) {
  return waypoints.some((waypoint) => waypoint.dateTo < dayjs()) ? '' : 'disabled';
}

function getFutureWaypoints (waypoints) {
  return waypoints.some((waypoint) => waypoint.dateFrom >= dayjs()) ? '' : 'disabled';
}

const createFilterTemplate = (waypoints, currentFilterType = FilterType.EVERYTHING) => {
  const isPastDisabled = getPastWaypoints(waypoints);
  const isFutureDisabled = getFutureWaypoints(waypoints);

  return (
    `<form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
        <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${currentFilterType === FilterType.EVERYTHING ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" ${currentFilterType === FilterType.FUTURE ? 'checked' : ''} ${isFutureDisabled}>
        <label class="trip-filters__filter-label" for="filter-future">Future</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" ${currentFilterType === FilterType.PAST ? 'checked' : ''} ${isPastDisabled}>
        <label class="trip-filters__filter-label" for="filter-past">Past</label>
      </div>

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FilterView extends AbstractView {
  #currentFilterType = null;
  #waypoints = null;

  constructor(waypoints, currentFilterType) {
    super();

    this.#currentFilterType = currentFilterType;
    this.#waypoints = waypoints;
  }

  get template() {
    return createFilterTemplate(this.#waypoints, this.#currentFilterType);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this._filterTypeChangeHandler);
  };

  _filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      evt.preventDefault();

      this._callback.filterTypeChange(evt.target.value);
    }
  };
}
