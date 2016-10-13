import { sortBy, head } from 'lodash';
import { RATING_BLACK } from './constants';

export default (game) => {
  const lastTurnRating = head(sortBy(game.ratings, rating => rating.turn).reverse());
  return lastTurnRating && lastTurnRating.rating.every(value => value === RATING_BLACK);
};
