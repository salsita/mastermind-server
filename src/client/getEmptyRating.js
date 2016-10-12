import { range } from 'lodash';

import { PEGS_COUNT, RATING_NONE } from '../server/constants';

export default () => range(PEGS_COUNT).map(() => RATING_NONE);
