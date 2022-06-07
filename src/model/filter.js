import Observable from '../framework/observable.js';
import {FilterType} from '../const.js';

export default class Filter extends Observable {
  constructor() {
    super();

    this._activeFilter = FilterType.EVERYTHING;
  }

  get filter() {
    return this._activeFilter;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }
}
