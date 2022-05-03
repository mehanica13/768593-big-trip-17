import dayjs from 'dayjs';
import mrFlatpickr from 'flatpickr';
import {TimeInMs, TIME_NUMB, MIN_GAP, MAX_GAP } from './const';
export { mrFlatpickr };

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayItem = (array) => array[getRandomInteger(0, array.length - 1)];

const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const toUpperCaseFirstLetter = ([initial, ...rest]) => [initial.toUpperCase(), ...rest].join('');

const generateRandomDateMin = () => {
  const gap = getRandomInteger(0, MIN_GAP);

  return dayjs().add(gap, 'minute').format('YYYY-MM-DDTHH:mm');
};

const generateRandomDateMax = () => {
  const gap = getRandomInteger(MIN_GAP, MAX_GAP);

  return dayjs().add(gap, 'minute').format('YYYY-MM-DDTHH:mm');
};

const humanizeEventDate = (date) => dayjs(date).format('MMM D');
const humanizeDataSetEventDate = (date) => dayjs(date).format('YYYY-MM-DD');
const humanizeDataSetEventTime = (date) => dayjs(date).format('YYYY-MM-DDTHH:mm');
const humanizeDateTime = (date) => dayjs(date).format('HH:mm');
const humanizeDateToCustomFormat = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const getFullTimeNumb = (numb) => numb < TIME_NUMB ? `0${numb}` : numb;

const getTimeDifference = (start, end) => {
  const dateFrom = dayjs(start).format('YYYY-MM-DDTHH:mm');
  const dateTo = dayjs(end);
  const interval = dateTo.diff(dateFrom, 'minutes');

  const days = Math.trunc(interval / TimeInMs.MINS_IN_DAY);
  const hours = Math.trunc((interval % TimeInMs.MINS_IN_DAY) / TimeInMs.MINS_IN_HOUR);
  const minutes = Math.round(interval % TimeInMs.MINS_IN_HOUR);

  if (interval < TimeInMs.MINS_IN_HOUR) {
    return `${getFullTimeNumb(interval)}M`;
  } else if (interval >= TimeInMs.MINS_IN_HOUR && interval < TimeInMs.MINS_IN_DAY) {
    return `${getFullTimeNumb(hours)}H ${getFullTimeNumb(minutes)}M`;
  } else if (interval >= TimeInMs.MINS_IN_DAY) {
    return `${getFullTimeNumb(days)}D ${getFullTimeNumb(hours)}H ${getFullTimeNumb(minutes)}M`;
  }
};

export { getRandomInteger, generateRandomDateMin, generateRandomDateMax, humanizeEventDate, humanizeDataSetEventDate, humanizeDataSetEventTime, humanizeDateTime, getTimeDifference, getRandomArrayItem, shuffleArray, toUpperCaseFirstLetter, humanizeDateToCustomFormat, };
