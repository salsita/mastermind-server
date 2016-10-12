import { RATING_BLACK } from './constants';

export default rating => rating.every(value => value === RATING_BLACK);
