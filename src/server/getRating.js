import { concat, range } from 'lodash';

import { RATING_BLACK, RATING_WHITE, RATING_NONE } from './constants';

export default (guess, cipherOriginal) => {
  const cipher = [...cipherOriginal];

  let directMatch = 0;
  let colorMatch = 0;

  for (let i = 0; i < cipher.length; i++) { // eslint-disable-line no-plusplus
    if (guess[i] === cipher[i]) {
      directMatch++; // eslint-disable-line no-plusplus
      delete cipher[i];
    } else {
      const found = cipher.indexOf(guess[i]);
      if (~found) { // eslint-disable-line no-bitwise
        colorMatch++; // eslint-disable-line no-plusplus
        delete cipher[found];
      }
    }
  }

  return concat(
    range(directMatch).map(() => RATING_BLACK),
    range(colorMatch).map(() => RATING_WHITE),
    range(guess.length - directMatch - colorMatch).map(() => RATING_NONE)
  );
};
