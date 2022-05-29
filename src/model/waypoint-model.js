import { NUMBER_OF_POINT } from '../const';
import { generateWaypoint } from '../mock/waypoint';

export default class WaypointsModel {
  #waypoints = Array.from({length: NUMBER_OF_POINT}, generateWaypoint);

  get waypoints() {
    return this.#waypoints;
  }
}
