import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';
import he from 'he';
import { humanizeDateToCustomFormat } from '../utils/waypoint.js';
import { DEFAULT_TIME } from '../const.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const createDestinationImageTemplate = (destination) => {
  const { pictures } = destination;
  const createImages = (images) => images.reduce((prev, curr) => `${prev}
      <img class="event__photo" src="${curr.src}" alt="${curr.description}"></img>`, '');

  return (pictures !== []) ? (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${createImages(pictures)}
      </div>
    </div>`
  ) : '';
};

const createDestinationTemplate = (name, destinationsDate) => {
  const destination = destinationsDate.find((item) => item.name === name);
  return (destination) ?
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>
      ${createDestinationImageTemplate (destination)}
    </section>` : '';
};

const createDestinationListTemplate = (names) => names.reduce((prev, curr) => `${prev}
<option value="${curr.name}"></option>`, '');

const createOfferBtnsTemplate = (type, offers, offersDate, newPoint, isDisabled) => {
  const index = offersDate.findIndex((item) => item.type === type);
  const targetOffers = offersDate[index].offers;

  return targetOffers.reduce((prev, curr) => {
    const { title, price, id } = curr;
    return `${prev}
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${id}"
          type="checkbox" data-id=${curr.id} name="event-offer-${type}"
          ${(offers.some((item) => item === id) && !newPoint) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
        <label class="event__offer-label" for="event-offer-${type}-${id}">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`;
  }, '');
};

const createOfferTemplate = (type, offers, offersData, newPoint, isDisabled) => (offers !== []) ? (
  `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${(createOfferBtnsTemplate(type, offers, offersData, newPoint, isDisabled))}
    </div>
  </section>`) : '';

const createEventTypeTemplate = (offers, isDisabled) => offers.map((offer) => `<div class="event__type-item">
    <input id="event-type-${offer.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}" ${isDisabled ? 'disabled' : ''}>
    <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-1">${offer.type}</label>
  </div>`).join('');

const createWaypointEditTemplate = (state, offersData, destinationsData) => {
  const { type, offers, destination ,dateFrom, dateTo, basePrice, newPoint, isDisabled, isSaving, isDeleting  } = state;
  const startTime = (dateFrom !== null) ? humanizeDateToCustomFormat(dateFrom) : '';
  const endTime = (dateTo !== null) ? humanizeDateToCustomFormat(dateTo) : '';
  const deleteCancelBtn = newPoint ? 'Cancel' : 'Delete';

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createEventTypeTemplate(offersData, isDisabled)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type !== null ? type : ''}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" ${(destination) ? `value=${he.encode(destination.name)}` : 'placeholder="choose target city"'} list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
            <datalist id="destination-list-1">
              ${createDestinationListTemplate(destinationsData)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}" ${isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}" required ${isDisabled ? 'disabled' : ''}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : deleteCancelBtn}</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${createOfferTemplate(type, offers, offersData, newPoint, isDisabled)}
          ${createDestinationTemplate(destination.name, destinationsData)}
        </section>
      </form>
    </li>`
  );
};

export default class WaypointEditView extends AbstractStatefulView {
  #destinationsData = null;
  #offersData = null;

  constructor(waypoint, offersData, destinationsData) {
    super();
    this._state = WaypointEditView.parseWaypointToState(waypoint);
    this.#offersData = offersData;
    this.#destinationsData = destinationsData;

    this.#setInnerHandlers();
    this.#setDatepicker();
  }

  get template() {
    return createWaypointEditTemplate(this._state, this.#offersData, this.#destinationsData);
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

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(WaypointEditView.parseStateToWaypoint(this._state));
  };

  setEditClickHandler = (callback) => {
    if(this._state.newPoint) {
      return;
    }

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
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  #typeListClickHandler = (evt) => {
    if(evt.target.tagName !== 'INPUT') {
      return;
    }

    const targetPoint = this.#offersData.find((item) => item.type === evt.target.value);
    const targetOffersId = targetPoint.offers.map((item) => item.id);
    this.updateElement({
      type: targetPoint.type,
      offers: targetOffersId
    });
  };

  #destinationChangeHandler = (evt) => {
    if(evt.target.tagName !== 'INPUT' || evt.target.value === '') {
      return;
    }

    const currentDestination = this.#destinationsData.find((destination) => destination.name === evt.target.value);
    this.updateElement({
      destination: currentDestination,
    });
  };

  #priceInputHandler = (evt) => {
    if(evt.target.tagName !== 'INPUT' || isNaN(Number(evt.target.value)) || Number(evt.target.value) <= 0) {
      return;
    }
    this._setState({
      basePrice: evt.target.value
    });
  };

  #checkOffer = (evt) => {
    if(evt.target.tagName !== 'INPUT') {
      return;
    }
    const id = evt.target.dataset.id;
    const offers = [...this._state.offers];
    if(offers.some((item) => item === Number(id))) {
      const offerIndex = offers.findIndex((item) => item === Number(id));
      offers.splice(offerIndex, 1);
    } else {
      offers.push(Number(id));
    }
    this._setState({
      offers: offers
    });
  };

  reset = (waypoint) => {
    this.updateElement(WaypointEditView.parseWaypointToState(waypoint));
  };

  #setDatepicker = () => {
    if (!this._state.dateFrom || !this._state.dateTo) {
      return;
    }

    this._dateFromPicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        maxDate: dayjs(this._state.dateTo).format('DD/MM/YY HH:mm'),
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
    const isFromAfterTo = userDate > dayjs(this._state.dateTo).toDate();

    this.updateElement({
      dateFrom: dayjs(userDate).format('YYYY-MM-DDTHH:mm'),
      dateTo: isFromAfterTo ? dayjs(userDate).add(DEFAULT_TIME, 'hour') : this._state.dateTo,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: this._state.dateFrom,
      dateTo: dayjs(userDate).format('YYYY-MM-DDTHH:mm'),
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('click', this.#typeListClickHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceInputHandler);
    if(this.element.querySelector('.event__section--offers') !== null) {
      this.element.querySelector('.event__available-offers').addEventListener('click', this.#checkOffer);
    }
  };

  static parseWaypointToState = (waypoint) => Object.assign({
    isDisabled: false,
    isSaving: false,
    isDeleting: false,},
  waypoint);

  static parseStateToWaypoint = (state) => {
    const waypoint = JSON.parse(JSON.stringify(state));
    PointerEvent.basePrice = Number(waypoint.basePrice);
    delete waypoint.isDisabled;
    delete waypoint.isSaving;
    delete waypoint.isDeleting;
    if(waypoint.newPoint) {
      delete waypoint.newPoint;
    }
    return waypoint;
  };
}

