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

  updateWaypoint = async (waypoint) => {
    const response = await this._load({
      url: `points/${waypoint.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(waypoint)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  addWaypoint = async (waypoint) => {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(waypoint)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  deleteWaypoint = async (waypoint) => {
    const response = await this._load({
      url: `points/${waypoint.id}`,
      method: Method.DELETE,
    });

    return response;
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

  // #adaptToServer(waypoint) {
  //   const adaptedWaypoint = Object.assign(
  //     {},
  //     waypoint,
  //     {
  //       'base_price': Number(waypoint.basePrice),
  //       'date_from': waypoint.dateFrom instanceof Date ? waypoint.dateFrom.toISOString() : null,
  //       'date_to': waypoint.dateTo instanceof Date ? waypoint.dateTo.toISOString() : null,
  //       'is_favorite': waypoint.isFavorite
  //     }
  //   );

  //   delete adaptedWaypoint.price;
  //   delete adaptedWaypoint.dateStart;
  //   delete adaptedWaypoint.dateEnd;
  //   delete adaptedWaypoint.isFavorite;

  //   return adaptedWaypoint;
  // }
}

