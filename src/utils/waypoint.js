import dayjs from 'dayjs';
import { getRandomInteger } from './common';
import {TimeInMs, TIME_NUMB, timeMaxGap, FilterType } from '../const';
import mrFlatpickr from 'flatpickr';
export { mrFlatpickr };

function generateRandomStartDate() {
  return dayjs('2022-05-04')
    .add(getRandomInteger(0, timeMaxGap.days), 'day')
    .add(getRandomInteger(0, timeMaxGap.hours), 'hour')
    .add(getRandomInteger(0, timeMaxGap.minutes), 'minute')
    .add(getRandomInteger(0, timeMaxGap.seconds), 'second').format('YYYY-MM-DDTHH:mm');
}

function generateRandomFutureDate(dateFrom) {
  return dayjs(dateFrom)
    .add(getRandomInteger(0, timeMaxGap.days), 'day')
    .add(getRandomInteger(0, timeMaxGap.hours), 'hour')
    .add(getRandomInteger(0, timeMaxGap.minutes), 'minute')
    .add(getRandomInteger(0, timeMaxGap.seconds), 'second').format('YYYY-MM-DDTHH:mm');
}

const humanizeEventDate = (date) => dayjs(date).format('MMM D');
const humanizeDataSetEventDate = (date) => dayjs(date).format('YYYY-MM-DD');
const humanizeDataSetEventTime = (date) => dayjs(date).format('YYYY-MM-DDTHH:mm');
const humanizeDateTime = (date) => dayjs(date).format('HH:mm');
const humanizeDateToCustomFormat = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const getFullTimeNumb = (numb) => numb < TIME_NUMB ? `0${numb}` : numb;

const getTimeDifferenceInMins = (start, end) => {
  const dateFrom = dayjs(start).format('YYYY-MM-DDTHH:mm');
  const dateTo = dayjs(end);
  return dateTo.diff(dateFrom, 'minutes');
};

const getTimeDifference = (start, end) => {
  const days = Math.trunc(getTimeDifferenceInMins(start, end) / TimeInMs.MINS_IN_DAY);
  const hours = Math.trunc((getTimeDifferenceInMins(start, end) % TimeInMs.MINS_IN_DAY) / TimeInMs.MINS_IN_HOUR);
  const minutes = Math.round(getTimeDifferenceInMins(start, end) % TimeInMs.MINS_IN_HOUR);

  if (getTimeDifferenceInMins(start, end) < TimeInMs.MINS_IN_HOUR) {
    return `${getFullTimeNumb(getTimeDifferenceInMins(start, end))}M`;
  } else if (getTimeDifferenceInMins(start, end) >= TimeInMs.MINS_IN_HOUR && getTimeDifferenceInMins(start, end) < TimeInMs.MINS_IN_DAY) {
    return `${getFullTimeNumb(hours)}H ${getFullTimeNumb(minutes)}M`;
  } else if (getTimeDifferenceInMins(start, end) >= TimeInMs.MINS_IN_DAY) {
    return `${getFullTimeNumb(days)}D ${getFullTimeNumb(hours)}H ${getFullTimeNumb(minutes)}M`;
  }
};

const sortByDate = (waypoint1, waypoint2) => {
  if (waypoint1.dateFrom < waypoint2.dateFrom) {
    return -1;
  }
  return 1;
};

const sortByPrice = (waypoint1, waypoint2) => {
  if (waypoint2.basePrice < waypoint1.basePrice) {
    return -1;
  }
  return 1;
};

const sortByTime = (waypoint1, waypoint2) => {
  if (getTimeDifferenceInMins(waypoint2.dateFrom, waypoint2.dateTo) < getTimeDifferenceInMins(waypoint1.dateFrom, waypoint1.dateTo)) {
    return -1;
  }
  return 1;
};

const filter = {
  [FilterType.EVERYTHING]: (waypoints) => waypoints,
  [FilterType.FUTURE]: (waypoints) => waypoints.filter((waypoint) => waypoint.dateFrom > dayjs().format('YYYY-MM-DDTHH:mm')),
  [FilterType.PAST]: (waypoints) => waypoints.filter((waypoint) => waypoint.dateTo < dayjs().format('YYYY-MM-DDTHH:mm'))
};

export { generateRandomStartDate, generateRandomFutureDate, humanizeEventDate, humanizeDataSetEventDate, humanizeDataSetEventTime, humanizeDateTime, getTimeDifference, humanizeDateToCustomFormat, sortByDate, sortByPrice, sortByTime, getTimeDifferenceInMins, filter };
