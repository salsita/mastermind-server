import { MAX_TURNS } from './constants';
import hasFoundCipher from './hasFoundCipher';

export default game => game.turn >= MAX_TURNS || hasFoundCipher(game);
