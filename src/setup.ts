import { getPoint, getVector, theSamePoint } from './utils';
import { FIELD_HEIGHT_IN_CELLS, FIELD_WIDTH_IN_CELLS } from './constants';
import { Goal } from './model/types';

const GOALS_COUNT = 5;
export const START_POINT = getPoint(0, 0);
export const FINISH_POINT = getPoint(FIELD_WIDTH_IN_CELLS - 1, FIELD_HEIGHT_IN_CELLS - 1);

const COLLECT_IN_ORDER = [Math.floor(Math.random() * GOALS_COUNT)];

export const goals: Goal[] = [];

for (let i = 0; i < GOALS_COUNT; i++) {
    let point = START_POINT;
    while (theSamePoint(point, START_POINT) || theSamePoint(point, FINISH_POINT)) {
        point = getPoint(
            Math.floor(Math.random() * FIELD_WIDTH_IN_CELLS),
            Math.floor(Math.random() * FIELD_HEIGHT_IN_CELLS)
        );
    }
    goals.push({ id: String(i), point, number: COLLECT_IN_ORDER.includes(i) ? i + 1 : null });
}

export const initialPosition = {
    point: getPoint(...START_POINT),
    vector: getVector(0, 0),
    angle: Math.PI / 4,
};
