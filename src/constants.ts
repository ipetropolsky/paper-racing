import { BoundingClientRect } from './model/types';

export const IS_DEBUG_MODE = true;

export const FIELD_WIDTH_IN_CELLS = 30;
export const FIELD_HEIGHT_IN_CELLS = 30;
export const CELL_SIZE = 29;

export const Z_KEY = 90;
export const SPACE_KEY = 32;

export const defaultRect: BoundingClientRect = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
};
