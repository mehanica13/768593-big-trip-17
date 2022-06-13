const TIME_NUMB = 10;
const DEFAULT_TIME = 1;

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

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

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

export { TimeInMs, TIME_NUMB, DEFAULT_TIME, Offers, FilterType, SortType, UpdateType, UserAction, TimeLimit};
