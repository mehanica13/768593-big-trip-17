import Observable from '../framework/observable.js';
import { UpdateType } from '../const';

export default class WaypointsModel extends Observable {
  #waypointsApiService = null;
  #waypoints = [];
  #offers = [];
  #destinations = [];

  constructor (waypointsApiService) {
    super();
    this.#waypointsApiService = waypointsApiService;
  }

  get waypoints() {
    return this.#waypoints;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  init = async () => {
    try {
      const waypoints = await this.#waypointsApiService.waypoints;
      const offers = await this.#waypointsApiService.offers;
      const destinations = await this.#waypointsApiService.destinations;
      this.#waypoints = waypoints.map(this.#adaptToClient);
      this.#offers = offers.slice();
      this.#destinations = destinations.slice();
    } catch(err) {
      this.#waypoints = [];
      this.#offers = [];
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  };

  updateWaypoint = (updateType, update) => {
    const index = this.#waypoints.findIndex((waypoint) => waypoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting waypoint');
    }

    this.#waypoints = [
      ...this.#waypoints.slice(0, index),
      update,
      ...this.#waypoints.slice(index + 1)
    ];

    this._notify(updateType, update);
  };

  addWaypoint = (updateType, update) => {
    this.#waypoints = [
      update,
      ...this.#waypoints,
    ];

    this._notify(updateType, update);
  };

  deleteWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex((waypoint) => waypoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting waypoint');
    }

    this.#waypoints = [
      ...this.#waypoints.slice(0, index),
      ...this.#waypoints.slice(index + 1)
    ];

    this._notify(updateType);
  }

  #adaptToClient = (waypoint) => {
    const adaptedWaypoint = Object.assign(
      {},
      waypoint,
      {
        basePrice: waypoint.base_price,
        dateFrom: waypoint.date_from !== null ? new Date(waypoint.date_from) : waypoint.date_from,
        dateTo: waypoint.date_to !== null ? new Date(waypoint.date_to) : waypoint.date_to,
        isFavorite: waypoint.is_favorite,
      }
    );

    delete adaptedWaypoint.base_price;
    delete adaptedWaypoint.date_from;
    delete adaptedWaypoint.date_to;
    delete adaptedWaypoint.is_favorite;

    return adaptedWaypoint;
  };

  _adaptToServer(waypoint) {
    const adaptedWaypoint = Object.assign(
      {},
      waypoint,
      {
        'base_price': Number(waypoint.basePrice),
        'date_from': waypoint.dateFrom instanceof Date ? waypoint.dateFrom.toISOString() : null,
        'date_to': waypoint.dateTo instanceof Date ? waypoint.dateTo.toISOString() : null,
        'is_favorite': waypoint.isFavorite
      }
    );

    delete adaptedWaypoint.price;
    delete adaptedWaypoint.dateStart;
    delete adaptedWaypoint.dateEnd;
    delete adaptedWaypoint.isFavorite;

    return adaptedWaypoint;
  }
}
