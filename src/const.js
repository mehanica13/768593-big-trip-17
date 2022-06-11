import dayjs from 'dayjs';

const NUMBER_OF_POINT = 14;
const MIN_PRICE = 20;
const MAX_PRICE = 200;
const TIME_NUMB = 10;
const OFFER_COUNT = 5;
const DEFAULT_TIME = 1;

const BLANK_WAYPOINT = {
  basePrice: Number(),
  dateFrom: dayjs(),
  dateTo: dayjs(),
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'taxi',
  newPoint: true
};

const TimeInMs = {
  MINS_IN_HOUR: 60,
  MINS_IN_DAY: 1440,
};

const UserAction = {
  UPDATE_WAYPOINT: 'UPDATE_WAYPOINT',
  ADD_WAYPOINT: 'ADD_WAYPOINT',
  DELETE_WAYPOINT: 'DELETE_WAYPOINT'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const SortType = {
  DEFAULT: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const WaypointTypes = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const Destinations = ['Amsterdam', 'Chamonix', 'Geneva', 'Reykjavik' ,'Singapore', 'Saint Petersburg', 'Tokyo'];
const DestinationDescriptions = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'In rutrum ac purus sit amet tempus.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Nunc fermentum tortor ac porta dapibus.',
  'Aliquam erat volutpat.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Aliquam id orci ut lectus varius viverra.',
  'Fusce tristique felis at fermentum pharetra.',
];

const Offers = [
  {
    id: 1,
    title: 'Order Uber',
    price: 20,
  }, {
    id: 2,
    title: 'Add luggage',
    price: 50,
  }, {
    id: 3,
    title: 'Upgrade to a business class',
    price: 120,
  }, {
    id: 4,
    title: 'Choose the radio station',
    price: 60,
  }, {
    id: 5,
    title: 'Switch to comfort',
    price: 80,
  }, {
    id: 6,
    title: 'Rent a car',
    price: 200,
  }, {
    id: 7,
    title: 'Add breakfast',
    price: 50,
  }, {
    id: 8,
    title: 'Book tickets',
    price: 40,
  }, {
    id: 9,
    title: 'Lunch in city',
    price: 30,
  }
];

export { NUMBER_OF_POINT, BLANK_WAYPOINT, WaypointTypes, TimeInMs, TIME_NUMB, DEFAULT_TIME, Destinations, MIN_PRICE, MAX_PRICE, DestinationDescriptions, Offers, OFFER_COUNT, FilterType, SortType, UpdateType, UserAction, };
