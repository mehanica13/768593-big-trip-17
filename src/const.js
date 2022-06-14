const TIME_NUMB = 10;
const DEFAULT_TIME = 1;

const AUTHORIZATION = 'Basic alyona22a04wihoj';
const END_POINT = 'https://17.ecmascript.pages.academy/big-trip/';

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

const DataFormat = {
  DAY_MONTH: 'DD MMM',
  MONTH_DAY: 'MMM D',
  HOUR_MIN: 'HH:mm',
  YEAR_MONTH_DAY: 'YYYY-MM-DD',
  DAY_MONTH_YEAR_HOUR_MIN: 'DD/MM/YY HH:mm',
  YEAR_MONTH_DAY_HOUR_MIN: 'YYYY-MM-DDTHH:mm',
};

export { TimeInMs, TIME_NUMB, DEFAULT_TIME, FilterType, SortType, UpdateType, UserAction, TimeLimit, DataFormat, AUTHORIZATION, END_POINT };
