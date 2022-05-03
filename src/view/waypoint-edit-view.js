import {createElement} from '../render.js';
import { Destinations, WaypointTypes } from '../const.js';
import { humanizeDateToCustomFormat } from '../utils.js';

const createEventTypeTemplate = (types) => types.map((type) => `<div class="event__type-item">
  <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
  <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
</div>`).join('');

const createDestinationListTemplate = (cites) => cites.map((city) => `<option value="${city}"></option>`).join('');

const createOfferTemplate = (offersList, waypoint) => {
  const offerItem = offersList.find((item) => item.type === waypoint.type);

  return offerItem ? offerItem.offers.map((offer) => `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerItem.type}-1" type="checkbox" name="event-offer-${offerItem.type}" ${waypoint.offers.includes(offer.id) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offerItem.type}-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  ).join('') : '';
};
const createDestinationDesc = (description) => description ? `<p class="event__destination-description">${description}</p>` : '';

const createImageTemplate = (pictures) => pictures.map((img) => `<img class="event__photo" src="img/photos/${img.src}.jpg" alt="Event photo">`).join('');

const createWaypointEditTemplate = (waypoint, offersList, destination) => {
  const { type, dateFrom, dateTo, basePrice } = waypoint;
  const { description, name, pictures } = destination;
  const startTime = (dateFrom !== null) ? humanizeDateToCustomFormat(dateFrom) : '';
  const endTime = (dateTo !== null) ? humanizeDateToCustomFormat(dateTo) : '';

  return (

    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createEventTypeTemplate(WaypointTypes)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${createDestinationListTemplate(Destinations)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${offersList.type === offersList.type ?  `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${createOfferTemplate(offersList, waypoint)}
            </div>
          </section>` : ''}

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            ${createDestinationDesc(description)}

            <div class="event__photos-container">
              <div class="event__photos-tape">
              ${createImageTemplate(pictures)}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>`
  );
};

export default class WaypointEditView {
  constructor(waypoint, offersList, destination) {
    this.waypoint = waypoint || {
      basePrice: null,
      dateFrom: null,
      dateTo: null,
      destination: [],
      isFavorite: false,
      offers: [],
      type: [],
    };
    this.offersList = offersList || {
      type: 'taxi',
      offers: [],
    };
    this.destination = destination || {
      description: 'Lorem ipsum',
      name: 'Lorem',
      pictures: [],
    };
  }

  getTemplate() {
    return createWaypointEditTemplate(this.waypoint, this.offersList, this.destination);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

