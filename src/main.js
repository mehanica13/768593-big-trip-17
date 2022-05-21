import AllElPresenter from './presenter/all-el-presenter.js';
import FilterPresenter from './presenter/filter.js';
import WaypointsModel from './model/waypoint-model.js';
import FilterModel from './model/filter.js';

const filtersContainer = document.querySelector('.trip-controls__filters');

const waypointsModel = new WaypointsModel();
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(filtersContainer, filterModel);
filterPresenter.init();

const allElPresenter = new AllElPresenter(waypointsModel, filterModel);
allElPresenter.init();
