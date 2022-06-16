import ApiService from './framework/api-service';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class WaypointsApiService extends ApiService {
  get waypoints() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  updateWaypoint = (waypoint) => this.#sendRequest(
    `points/${waypoint.id}`,
    Method.PUT,
    JSON.stringify(this.#adaptToServer(waypoint)),
    new Headers({'Content-Type': 'application/json'}),
  );

  addWaypoint = (waypoint) => this.#sendRequest(
    'points',
    Method.POST,
    JSON.stringify(this.#adaptToServer(waypoint)),
    new Headers({'Content-Type': 'application/json'}),
  );

  deleteWaypoint = (waypoint) => this.#sendRequest(
    `points/${waypoint.id}`,
    Method.DELETE,
  );

  #sendRequest = async (url, method, body, headers) => {
    const response = await this._load({
      url: url,
      method: method,
      body: body,
      headers: headers,
    });

    return await ApiService.parseResponse(response).catch(() => 'OK');
  };

  #adaptToServer = (waypoint) => {
    const adaptedWaypoint = {...waypoint,
      'base_price': Number(waypoint.basePrice),
      'date_from': waypoint.dateFrom,
      'date_to': waypoint.dateTo,
      'is_favorite': waypoint.isFavorite
    };

    delete adaptedWaypoint.basePrice;
    delete adaptedWaypoint.dateFrom;
    delete adaptedWaypoint.dateTo;
    delete adaptedWaypoint.isFavorite;

    return adaptedWaypoint;
  };
}

