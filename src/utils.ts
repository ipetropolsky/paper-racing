import { BoundingClientRect, CELL_SIZE, FIELD_HEIGHT_IN_CELLS, FIELD_WIDTH_IN_CELLS, goals } from './constants';

export type FieldPoint = [number, number];
export type FieldVector = [number, number];

export interface TrackPart {
    from: FieldPoint;
    to: FieldPoint;
    vector: FieldVector;
    angle: number;
    speed: number;
    distance: number;
    goalId: string | null;
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

export const getPoint = (x: number, y: number): FieldPoint => [x, y];
export const getVector = (dx: number, dy: number): FieldVector => [dx, dy];

export const getSafePoint = (x: number, y: number): FieldPoint =>
    getPoint(Math.max(0, Math.min(x, FIELD_WIDTH_IN_CELLS - 1)), Math.max(0, Math.min(y, FIELD_HEIGHT_IN_CELLS - 1)));

export const getPointByCoords = (left: number, top: number): FieldPoint => {
    return getSafePoint(Math.floor(left / CELL_SIZE), Math.floor(top / CELL_SIZE));
};

export const calculateTrack = (from: FieldPoint, vector: FieldVector, lastAngle = 0): TrackPart => {
    const [x, y] = from;
    const [dx, dy] = vector;
    const to = getPoint(x + dx, y + dy);
    const speed = Math.max(Math.abs(dx), Math.abs(dy));
    const distance = Math.sqrt(dx * dx + dy * dy);
    let angle = Math.atan(dy / dx) + (dx < 0 ? Math.PI : 0);
    while (Math.abs(lastAngle - angle) > Math.PI) {
        angle += (lastAngle > angle ? 1 : -1) * 2 * Math.PI;
    }
    const goalId = goals.find(({ left, top }) => left === to[0] && top === to[1])?.id || null;
    return {
        from,
        to,
        vector,
        angle,
        speed,
        distance,
        goalId,
    };
};
