import { CELL_SIZE, FIELD_HEIGHT_IN_CELLS, FIELD_WIDTH_IN_CELLS } from './constants';
import { BoundingClientRect, FieldPoint, FieldVector, TrackPart } from './model/types';

export const getBoundingClientRect = (element: Element): BoundingClientRect => {
    const rect = element.getBoundingClientRect();
    return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
        x: rect.x,
        y: rect.y,
    };
};

export const getPoint = (x: number, y: number): FieldPoint => [x, y];
export const getVector = (dx: number, dy: number): FieldVector => [dx, dy];
export const theSamePoint = (a: FieldPoint, b: FieldPoint): boolean => a[0] === b[0] && a[1] === b[1];

export const getSafePoint = (x: number, y: number): FieldPoint =>
    getPoint(Math.max(0, Math.min(x, FIELD_WIDTH_IN_CELLS - 1)), Math.max(0, Math.min(y, FIELD_HEIGHT_IN_CELLS - 1)));

export const getPointByCoords = (x: number, y: number): FieldPoint => {
    return getSafePoint(Math.floor(x / CELL_SIZE), Math.floor(y / CELL_SIZE));
};

export const getTrackPart = ({
    from = getPoint(0, 0),
    to = getPoint(0, 0),
    vector = getVector(0, 0),
    angle = Math.PI / 4,
    speed = 0,
    distance = 0,
    goalId = null,
}: Partial<TrackPart>): TrackPart => {
    return { from, to, vector, angle, speed, distance, goalId };
};
