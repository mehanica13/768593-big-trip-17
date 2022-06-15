import dayjs from 'dayjs';
import {TimeInMs, TIME_NUMB, FilterType, DataFormat } from '../const';

const humanizeEventDate = (date) => dayjs(date).format(DataFormat.MONTH_DAY);
const humanizeDataSetEventDate = (date) => dayjs(date).format(DataFormat.YEAR_MONTH_DAY);
const humanizeDataSetEventTime = (date) => dayjs(date).format(DataFormat.YEAR_MONTH_DAY_HOUR_MIN);
const humanizeDateTime = (date) => dayjs(date).format(DataFormat.HOUR_MIN);
const humanizeDateToCustomFormat = (date) => dayjs(date).format(DataFormat.DAY_MONTH_YEAR_HOUR_MIN);

const getFullTimeNumb = (numb) => numb < TIME_NUMB ? `0${numb}` : numb;

const getTimeDifferenceInMins = (start, end) => {
  const dateFrom = dayjs(start).format(DataFormat.YEAR_MONTH_DAY_HOUR_MIN);
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
  [FilterType.FUTURE]: (waypoints) => waypoints.filter((waypoint) => waypoint.dateFrom >= dayjs()),
  [FilterType.PAST]: (waypoints) => waypoints.filter((waypoint) => waypoint.dateTo < dayjs())
};

const checkEsc = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export { humanizeEventDate, humanizeDataSetEventDate, humanizeDataSetEventTime, humanizeDateTime, getTimeDifference, humanizeDateToCustomFormat, sortByDate, sortByPrice, sortByTime, getTimeDifferenceInMins, filter, checkEsc };
