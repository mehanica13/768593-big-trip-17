import SortView from '../view/sort-view.js';
import FilterView from '../view/filter-view.js';
import MainContentView from '../view/main-content-view.js';
import WaypointView from '../view/waypoint-view.js';
import {render} from '../render.js';
import WaypointEditView from '../view/waypoint-edit-view.js';

const siteTripFiltersElement = document.querySelector('.trip-controls__filters');
const siteTripEventsElement = document.querySelector('.trip-events');

export default class AllElPresenter {
  mainContentComponent = new MainContentView();

  init = (waypointsModel) => {
    this.waypointsModel = waypointsModel;
    this.allWaypoints = [...this.waypointsModel.getWaypoints()];
    this.offersList = [...this.waypointsModel.getOffers()];
    this.allDestinations = [...this.waypointsModel.getDestinations()];

    render(new FilterView(), siteTripFiltersElement);
    render(new SortView(), siteTripEventsElement);
    render(this.mainContentComponent, siteTripEventsElement);
    render(new WaypointEditView(this.allWaypoints[0], this.offersList, this.allDestinations[0]), this.mainContentComponent.getElement());

    for (let i = 1; i < this.allWaypoints.length; i++) {
      render(new WaypointView(this.allWaypoints[i], this.offersList, this.allDestinations[i]), this.mainContentComponent.getElement());
    }
  };
}
