import AllElPresenter from './presenter/all-el-presenter.js';
import WaypointsModel from './model/waypoint-model.js';

const waypointsModel = new WaypointsModel();
const allElPresenter = new AllElPresenter(waypointsModel);

allElPresenter.init();
