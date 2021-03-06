import AbstractView from '../framework/view/abstract-view.js';
import {humanizeEventDate, humanizeDataSetEventDate, humanizeDataSetEventTime, humanizeDateTime, getTimeDifference} from '../utils/waypoint.js';

const createWaypointOfferItemTemplate = (offers, type, offersData) => {
  const index = offersData.findIndex((item) => item.type === type);
  const currentOffers = offersData[index].offers.filter((item) => offers.some((el) => el === item.id));
  return currentOffers.reduce((prev, curr) => `${prev}
      <li class="event__offer">
        <span class="event__offer-title">${curr.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${curr.price}</span>
      </li>`, '');
};

const createWaypointTemplate = (waypoint, offersData) => {
  const { type, offers, destination, dateFrom, dateTo, isFavorite, basePrice, } = waypoint;

  const dataSetEventDate = (dateFrom !== null) ? humanizeDataSetEventDate(dateFrom) : '';
  const eventDate = (dateFrom !== null) ? humanizeEventDate(dateFrom) : '';
  const startDataSetEventTime = (dateFrom !== null) ? humanizeDataSetEventTime(dateFrom) : '';
  const startDateTime = (dateFrom !== null) ? humanizeDateTime(dateFrom) : '';
  const endDDataSetEventTime = (dateTo !== null) ? humanizeDataSetEventTime(dateTo) : '';
  const endDateTime = (dateTo !== null) ? humanizeDateTime(dateTo) : '';
  const interval = (dateFrom !== null && dateTo !== null) ? getTimeDifference(dateFrom, dateTo) : '';

  const favoriteClassName = isFavorite
    ? 'event__favorite-btn  event__favorite-btn--active'
    : 'event__favorite-btn ';

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dataSetEventDate}">${eventDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startDataSetEventTime}">${startDateTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${endDDataSetEventTime}">${endDateTime}</time>
          </p>
          <p class="event__duration">${interval}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>

        ${(offers !== []) ? `<h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createWaypointOfferItemTemplate(offers, type, offersData)}
        </ul>` : ''}


        <button class="${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li> `
  );
};

export default class WaypointView extends AbstractView {
  #waypoint = null;
  #offersData = null;

  constructor(waypoint, offersData) {
    super();
    this.#waypoint = waypoint;
    this.#offersData = offersData;
  }

  get template() {
    return createWaypointTemplate(this.#waypoint, this.#offersData);
  }

  setRollupBtnClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click(evt);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
