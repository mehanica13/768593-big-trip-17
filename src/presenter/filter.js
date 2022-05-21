import { render, replace, remove } from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import {FilterType} from '../const.js';

export default class FilterPresenter {
  #filterComponent = null;
  #filterContainer = null;
  #filterModel = null;

  constructor(filterContainer, filterModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;

    this._onFilterChange = this._onFilterChange.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this.#filterModel.addObserver(this._onFilterChange);
  }

  init() {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(this._getFilter());
    this.#filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    if (prevFilterComponent === null) {
      render(this.#filterComponent,this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _onFilterChange() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._getFilter() === filterType) {
      return;
    }

    this.#filterModel.setFilter(FilterType.EVERYTHING, filterType);
  }

  _getFilter() {
    return this.#filterModel.getFilter();
  }
}
