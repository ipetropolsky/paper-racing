export const IS_DEBUG_MODE = true;

export const FIELD_WIDTH_IN_CELLS = 30;
export const FIELD_HEIGHT_IN_CELLS = 30;
export const CELL_SIZE = 29;

export interface BoundingClientRect {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
    x: number;
    y: number;
}

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

export interface Goal {
    id: string;
    left: number;
    top: number;
    number: number | null;
}

export const goals: Goal[] = [];

const GOALS_COUNT = 5;
const index = Math.floor(Math.random() * GOALS_COUNT);
for (let i = 0; i < GOALS_COUNT; i++) {
    goals.push({
        id: String(i),
        left: Math.floor(Math.random() * FIELD_WIDTH_IN_CELLS),
        top: Math.floor(Math.random() * FIELD_HEIGHT_IN_CELLS),
        number: index === i ? i + 1 : null,
    });
}
