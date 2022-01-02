import { BoundingClientRect, CELL_SIZE, FIELD_HEIGHT_IN_CELLS, FIELD_WIDTH_IN_CELLS } from './constants';

export interface FieldPoint {
    left: number;
    top: number;
}

export interface FieldVector {
    dx: number;
    dy: number;
}

export interface PathPart {
    position: FieldPoint;
    vector: FieldVector;
    angle: number;
    speed: number;
    exactSpeed: number;
}

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

export const getSafeCell = (left: number, top: number): FieldPoint => ({
    left: Math.max(0, Math.min(left, FIELD_WIDTH_IN_CELLS - 1)),
    top: Math.max(0, Math.min(top, FIELD_HEIGHT_IN_CELLS - 1)),
});

export const getCellByCoords = (x: number, y: number): FieldPoint => {
    return getSafeCell(Math.floor(x / CELL_SIZE), Math.floor(y / CELL_SIZE));
};

export const calculateTrack = (current: FieldPoint, next: FieldPoint): PathPart => {
    const dx = next.left - current.left;
    const dy = next.top - current.top;
    const speed = Math.max(Math.abs(dx), Math.abs(dy));
    const exactSpeed = Math.sqrt(dx * dx + dy * dy);
    const vector = { dx, dy };
    const angle = Math.atan(dy / dx) + (dx < 0 ? Math.PI : 0);
    return {
        position: next,
        vector,
        angle,
        speed,
        exactSpeed,
    };
};
