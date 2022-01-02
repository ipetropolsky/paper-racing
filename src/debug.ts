import { IS_DEBUG_MODE } from './constants';

export const log = (...values: unknown[]): void => {
    // eslint-disable-next-line no-console
    IS_DEBUG_MODE && console.log(...values);
};
