import AllElPresenter from './presenter/all-el-presenter.js';
import FilterPresenter from './presenter/filter.js';
import WaypointsModel from './model/waypoint-model.js';
import FilterModel from './model/filter.js';
import { NUMBER_OF_POINT } from './const.js';
import { generateWaypoint } from './mock/waypoint.js';
import { sortByDate } from './utils/waypoint.js';

const filtersContainer = document.querySelector('.trip-controls__filters');

const waypointsModel = new WaypointsModel();
const filterModel = new FilterModel();

const waypoints = new Array(NUMBER_OF_POINT).fill().map(generateWaypoint).sort(sortByDate);
waypointsModel.setWaypoints(waypoints);

const filterPresenter = new FilterPresenter(filtersContainer, filterModel, waypointsModel);
const allElPresenter = new AllElPresenter(waypointsModel, filterModel);

filterPresenter.init();
allElPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  allElPresenter.createWaypoint();
  document.querySelector('.trip-main__event-add-btn').disabled = true;
});
