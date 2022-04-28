import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import MainContentView from '../view/main-content-view.js';
import {render} from '../render.js';

const siteTripFiltersElement = document.querySelector('.trip-controls__filters');
const siteTripEventsElement = document.querySelector('.trip-events');

export default class AllElPresenter {
  init = () => {
    render(new FilterView(), siteTripFiltersElement);
    render(new SortView(), siteTripEventsElement);
    render(new MainContentView(), siteTripEventsElement);
  };
}
