import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { Destinations, WaypointTypes } from '../const.js';
import { humanizeDateToCustomFormat } from '../utils/waypoint.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

// в дальнешем эти данные будем получать с сервера
import { destinations } from '../mock/waypoint.js';
import { getRandomInteger } from '../utils/common.js';

const BLANK_WAYPOINT = {
  basePrice: null,
  dateFrom: null,
  dateTo: null,
  destination: {
    description: 'Lorem ipsum',
    name: 'Lorem',
    pictures: [],
  },
  isFavorite: false,
  offers: {
    type: 'taxi',
    offers: {},
  },
  type: [],
};

const createEventTypeTemplate = (chosenType) => WaypointTypes.map((type) => `<div class="event__type-item">
  <input id="event-type-${type}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === chosenType ? 'checked' : ''}>
  <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
</div>`).join('');

const createDestinationListTemplate = (cites) => cites.map((city) => `<option value="${city}"></option>`).join('');

const createOfferTemplate = (offers) => {
  if (!offers.length) {
    return '';
  }
  const isChecked  = getRandomInteger(0, 1) ? 'checked' : '';

  return offers.map((offer) => `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offers.type}-1" type="checkbox" name="event-offer-${offers.type}" ${isChecked}>
      <label class="event__offer-label" for="event-offer-${offers.type}-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  ).join('');
};
const createDestinationDesc = (description) => description ? `<p class="event__destination-description">${description}</p>` : '';

const createImageTemplate = (pictures) => pictures.map((img) => `<img class="event__photo" src="img/photos/${img.src}.jpg" alt="Event photo">`).join('');

const createWaypointEditTemplate = (state) => {
  // console.log(state);
  const { type, offers, destination ,dateFrom, dateTo, basePrice } = state;
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
                ${createEventTypeTemplate(type)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
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
          ${offers.type === offers.type ?  `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${createOfferTemplate(offers)}
            </div>
          </section>` : ''}

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            ${createDestinationDesc(destination.description)}

            <div class="event__photos-container">
              <div class="event__photos-tape">
              ${createImageTemplate(destination.pictures)}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>`
  );
};

export default class WaypointEditView extends AbstractStatefulView {
  constructor(waypoint = BLANK_WAYPOINT) {
    super();
    this._dateFromPicker = null;
    this._dateToPicker = null;
    this._state = WaypointEditView.parseWaypointToState(waypoint);

    this.#setInnerHandlers();
    this.#setDatepicker();
  }

  get template() {
    return createWaypointEditTemplate(this._state);
  }

  removeElement = () => {
    super.removeElement();

    if (this._dateFromPicker) {
      this._dateFromPicker.destroy();
      this._dateFromPicker = null;
    }

    if (this._dateToPicker) {
      this._dateToPicker.destroy();
      this._dateToPicker = null;
    }
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(WaypointEditView.parseStateToWaypoint(this._state));
  };

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };

  _restoreHandlers = () => {
    this.#setDatepicker();
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setEditClickHandler(this._callback.editClick);
  };

  #typeListClickHandler = (evt) => {
    if (evt.target.tagName === 'LABEL') {
      const newType = evt.target.parentElement.querySelector('input').value;
      this.updateElement({
        type: newType,
      });
    }
  };

  #destinationChangeHandler = (evt) => {
    const currentDestination = destinations.find((destination) => destination.name === evt.currentTarget.value);
    if (currentDestination) {
      this.updateElement({
        destination: currentDestination,
      });
    }
  };

  reset = (waypoint) => {
    this.updateElement(WaypointEditView.parseWaypointToState(waypoint));
  };

  #setDatepicker = () => {
    this._dateFromPicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: dayjs(this._state.dateFrom).format('DD/MM/YY HH:mm'),
        onChange: this.#dateFromChangeHandler
      }
    );

    this._dateToPicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        minDate: dayjs(this._state.dateFrom).format('DD/MM/YY HH:mm'),
        defaultDate: dayjs(this._state.dateTo).format('DD/MM/YY HH:mm'),
        onChange: this.#dateToChangeHandler
      }
    );
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: dayjs(userDate).format('YYYY-MM-DDTHH:mm'),
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: dayjs(userDate).format('YYYY-MM-DDTHH:mm')
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('click', this.#typeListClickHandler);
    this.element.querySelector('#event-destination-1').addEventListener('change', this.#destinationChangeHandler);
  };

  static parseWaypointToState = (waypoint) => {
    const state = Object.assign({}, waypoint);
    return state;
  };

  static parseStateToWaypoint = (state) => {
    const waypoint = {...state};
    return waypoint;
  };
}

