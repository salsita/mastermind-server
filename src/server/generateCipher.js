import { range } from 'lodash';

import {
  PEGS_COUNT,
  COLORS_COUNT
} from './constants';

export default () => range(PEGS_COUNT)
  .map(() => Math.round(Math.random() * (COLORS_COUNT - 1)));
