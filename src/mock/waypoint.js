import { Destinations, DestinationDescriptions, MAX_PRICE, MIN_PRICE, Offers, OFFER_COUNT, WaypointTypes } from '../const.js';
import { generateRandomDateMin, generateRandomDateMax } from '../utils/waypoint.js';
import { getRandomInteger, getRandomArrayItem, shuffleArray } from '../utils/common.js';

const getPhotos = () => {
  const photosAmount = getRandomInteger(0, 4);
  const photos = [];

  for (let i = 0; i < photosAmount; i++) {
    photos.push({
      src: `${getRandomInteger(1, 5)}`,
      description: getRandomArrayItem(DestinationDescriptions),
    });
  }

  return photos;
};

export const generateDestination = () => ({
  description: getRandomArrayItem(DestinationDescriptions),
  name: getRandomArrayItem(Destinations),
  pictures: getPhotos(),
});

export const generateOffersList = () => ({
  type: getRandomArrayItem(WaypointTypes),
  offers: shuffleArray(Offers).slice(0, getRandomInteger(0, OFFER_COUNT)),
});

export const generateWaypoint = () => ({
  basePrice: getRandomInteger(MIN_PRICE, MAX_PRICE),
  dateFrom: generateRandomDateMin(),
  dateTo: generateRandomDateMax(),
  destination: [getRandomInteger(0, Destinations.length)],
  isFavorite: Boolean(getRandomInteger(0, 1)),
  offers: [getRandomInteger(0, Offers.length)],
  type: getRandomArrayItem(WaypointTypes),
  id: [1],
});
