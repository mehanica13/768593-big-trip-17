import AllElPresenter from './presenter/all-el-presenter.js';
import FilterPresenter from './presenter/filter.js';
import WaypointsModel from './model/waypoint-model.js';
import FilterModel from './model/filter.js';
import NewWaypointBtnView from './view/new-waypoint-btn-view.js';
import WaypointsApiService from './api.js';
import { render } from './framework/render.js';
import { AUTHORIZATION, END_POINT } from './const.js';

const tripHeaderContainer = document.querySelector('.trip-main');
const filtersContainer = document.querySelector('.trip-controls__filters');

const newWaypointBtnComponent = new NewWaypointBtnView();
const filterModel = new FilterModel();
const waypointsModel = new WaypointsModel(new WaypointsApiService(END_POINT, AUTHORIZATION));
const filterPresenter = new FilterPresenter(filtersContainer, filterModel, waypointsModel);
const allElPresenter = new AllElPresenter( tripHeaderContainer, waypointsModel, filterModel);

const handleWaypointCreateFormClose = () => {
  newWaypointBtnComponent.element.disabled = false;
};

const handleNewWaypointBtnClick = () => {
  allElPresenter.createWaypoint(handleWaypointCreateFormClose);
  newWaypointBtnComponent.element.disabled = true;
};

filterPresenter.init();
allElPresenter.init();
waypointsModel.init()
  .finally(() => {
    render(newWaypointBtnComponent, tripHeaderContainer);
    newWaypointBtnComponent.setNewWaypointBtnClickHandler(handleNewWaypointBtnClick);
  });


