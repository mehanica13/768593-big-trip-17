import Observable from '../framework/observable.js';
import { NUMBER_OF_POINT } from '../const';
import { generateWaypoint } from '../mock/waypoint';

export default class WaypointsModel extends Observable {
  #waypoints = Array.from({length: NUMBER_OF_POINT}, generateWaypoint);

  get waypoints() {
    return this.#waypoints;
  }
}
