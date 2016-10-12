import { MAX_TURNS } from './constants';
import hasFoundCipher from './hasFoundCipher';

export default (turn, rating) => turn >= MAX_TURNS || hasFoundCipher(rating);
