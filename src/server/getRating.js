import { concat, range } from 'lodash';

import { RATING_BLACK, RATING_WHITE, RATING_NONE } from './constants';

export default (originalGuess, cipherOriginal) => {
  const cipher = [...cipherOriginal];
  const guess = [...originalGuess];

  let directMatch = 0;
  let colorMatch = 0;

  for (let i = 0; i < cipher.length; i += 1) {
    if (guess[i] === cipher[i]) {
      directMatch += 1;
      delete cipher[i];
      delete guess[i];
    }
  }

  for (let i = 0; i < cipher.length; i += 1) {
    const found = cipher.indexOf(guess[i]);

    if (~found) { // eslint-disable-line no-bitwise
      colorMatch += 1;
      delete cipher[found];
    }
  }

  return concat(
    range(directMatch).map(() => RATING_BLACK),
    range(colorMatch).map(() => RATING_WHITE),
    range(guess.length - directMatch - colorMatch).map(() => RATING_NONE)
  );
};
