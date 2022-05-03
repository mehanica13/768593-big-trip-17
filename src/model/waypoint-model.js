import { NUMBER_OF_POINT, WaypointTypes } from '../const';
import { generateWaypoint, generateOffersList, generateDestination } from '../mock/waypoint';

export default class WaypointsModel {
  waypoints = Array.from({length: NUMBER_OF_POINT}, generateWaypoint);
  offersList = Array.from({length: WaypointTypes.length}, generateOffersList);
  destinations = Array.from({length: NUMBER_OF_POINT}, generateDestination);

  getWaypoints = () => this.waypoints;
  getOffers = () => this.offersList;
  getDestinations = () => this.destinations;
}
