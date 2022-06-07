const reg = new RegExp('^\\d+$');

const isNumber = (value) => reg.test(value);

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

export { getRandomInteger, getRandomArrayItem, shuffleArray, toUpperCaseFirstLetter, isNumber};
