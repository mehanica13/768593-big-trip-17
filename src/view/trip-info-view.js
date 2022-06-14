import dayjs from 'dayjs';
import { DataFormat } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const getTripTitle = (waypoints) => {
  switch (waypoints.length) {
    case 1:
      return [waypoints[0].destination.name];
    case 2:
      return [`${waypoints[0].destination.name} &mdash; ${waypoints[1].destination.name}`];
    case 3:
      return [`${waypoints[0].destination.name} &mdash; ${waypoints[1].destination.name} &mdash; ${waypoints[2].destination.name}`];
    default:
      return [`${waypoints[0].destination.name} &mdash; ... &mdash; ${waypoints[waypoints.length - 1].destination.name}`];
  }
};

const getTripDates = (waypoints) => `${dayjs(waypoints[0].dateFrom).format(DataFormat.DAY_MONTH)}&nbsp;&mdash;&nbsp${dayjs(waypoints[waypoints.length - 1].dateTo).format(DataFormat.DAY_MONTH)}`;

const getOffersCost = (waypoints, offersData) => {
  const waypointsOffersPrice = [];

  for(const waypoint of waypoints) {
    const offerIndex = offersData.findIndex((item) => item.type === waypoint.type);
    const waypointOffers = offersData[offerIndex].offers;
    const targetOffers = waypointOffers.filter((item) => waypoint.offers.some((el) => item.id === el));
    targetOffers.forEach((item) => waypointsOffersPrice.push(item.price));
  }

  const offersCost = waypointsOffersPrice.reduce((acc, price) => acc + price, 0);
  return offersCost;
};

const getTripCost = (waypoints, offers) => {
  const basePriceCosts = waypoints.reduce((sum, waypoint) => sum + Number(waypoint.basePrice), 0);
  const offersCost = getOffersCost(waypoints, offers);

  return basePriceCosts + offersCost;
};

const createTripInfoTemplate = (waypoints, offers) => (
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getTripTitle(waypoints)}</h1>
      <p class="trip-info__dates">${getTripDates(waypoints)}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTripCost(waypoints, offers)}</span>
    </p>
  </section>`
);

export default class TripInfoView extends AbstractView {
  #waypoints = null;
  #offers = null;

  constructor(waypoints, offers) {
    super();
    this.#waypoints = waypoints;
    this.#offers = offers;
  }

  get template() {
    return createTripInfoTemplate(this.#waypoints, this.#offers);
  }
}
