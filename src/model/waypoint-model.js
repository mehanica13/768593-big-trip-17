import { NUMBER_OF_POINT, WaypointTypes } from '../const';
import { generateWaypoint, generateOffersList, generateDestination } from '../mock/waypoint';

export default class WaypointsModel {
  #waypoints = Array.from({length: NUMBER_OF_POINT}, generateWaypoint);
  #offers = Array.from({length: WaypointTypes.length}, generateOffersList);
  #destinations = Array.from({length: NUMBER_OF_POINT}, generateDestination);

  get waypoints() {
    return this.#waypoints;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }
}
