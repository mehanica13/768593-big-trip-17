import { nanoid } from 'nanoid';
import { Destinations, DestinationDescriptions, MAX_PRICE, MIN_PRICE, Offers, OFFER_COUNT, WaypointTypes } from '../const.js';
import { generateRandomStartDate, generateRandomFutureDate } from '../utils/waypoint.js';
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

const generateDestinations = () => {
  const destinationList = [];

  Destinations.forEach((destination) => {
    destinationList.push({
      name: destination,
      description: getRandomArrayItem(DestinationDescriptions),
      pictures: getPhotos(),
    });
  });

  return destinationList;
};

const generateOffers = () => {
  const offersList = [];
  WaypointTypes.forEach((type) => {
    offersList.push({
      type: type,
      offers: shuffleArray(Offers).slice(0, getRandomInteger(0, OFFER_COUNT)),
    });
  });

  return offersList;
};

export const destinations = generateDestinations();
export const offers1 = generateOffers();

// export const generateDestination = () => ({
//   description: getRandomArrayItem(DestinationDescriptions),
//   name: getRandomArrayItem(Destinations),
//   pictures: getPhotos(),
// });

export const generateOffersList = () => ({
  type: getRandomArrayItem(WaypointTypes),
  offers: shuffleArray(Offers).slice(0, getRandomInteger(0, OFFER_COUNT)),
});

export const generateWaypoint = () => {
  const startDate = generateRandomStartDate();
  const type = getRandomArrayItem(WaypointTypes);

  return ({
    basePrice: getRandomInteger(MIN_PRICE, MAX_PRICE),
    dateFrom: startDate,
    dateTo: generateRandomFutureDate(startDate),
    destination: getRandomArrayItem(destinations),
    id: nanoid(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: offers1.find((offer) => offer.type === type).offers,
    type: type,
  });
};
