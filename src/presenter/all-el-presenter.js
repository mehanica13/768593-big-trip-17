import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import MainContentView from '../view/main-content-view.js';
import WaypointView from '../view/waypoint-view.js';
import {render} from '../render.js';
import EditFormView from '../view/edit-form.js';

const NUMB_OF_WAYPOINT = 3;

const siteTripFiltersElement = document.querySelector('.trip-controls__filters');
const siteTripEventsElement = document.querySelector('.trip-events');

export default class AllElPresenter {
  mainContentComponent = new MainContentView();

  init = () => {

    render(new FilterView(), siteTripFiltersElement);
    render(new SortView(), siteTripEventsElement);
    render(this.mainContentComponent, siteTripEventsElement);
    render(new EditFormView(), this.mainContentComponent.getElement());

    for (let i = 0; i < NUMB_OF_WAYPOINT; i++) {
      render(new WaypointView(), this.mainContentComponent.getElement());
    }
  };
}
