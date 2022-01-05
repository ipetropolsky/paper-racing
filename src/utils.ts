import { BoundingClientRect, CELL_SIZE, FIELD_HEIGHT_IN_CELLS, FIELD_WIDTH_IN_CELLS, Goal } from './constants';
import { PlayerStats } from './model/player';

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
export const theSamePoint = (a: FieldPoint, b: FieldPoint): boolean => a[0] === b[0] && a[1] === b[1];

export const getSafePoint = (x: number, y: number): FieldPoint =>
    getPoint(Math.max(0, Math.min(x, FIELD_WIDTH_IN_CELLS - 1)), Math.max(0, Math.min(y, FIELD_HEIGHT_IN_CELLS - 1)));

export const getPointByCoords = (left: number, top: number): FieldPoint => {
    return getSafePoint(Math.floor(left / CELL_SIZE), Math.floor(top / CELL_SIZE));
};

export const calculateTrack = (from: FieldPoint, vector: FieldVector, lastAngle = 0, goals: Goal[]): TrackPart => {
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
    return { from, to, vector, angle, speed, distance, goalId };
};

const initialPoint = getPoint(0, 0);
const initialVector = getVector(0, 0);
const initialAngle = Math.PI / 4;

export const getCurrentTrack = (track: TrackPart[], goals: Goal[]): TrackPart => {
    if (track.length) {
        const lastMove = track[track.length - 1];
        return calculateTrack(lastMove.to, lastMove.vector, lastMove.angle, goals);
    }
    const currentTrack = calculateTrack(initialPoint, initialVector, 0, goals);
    currentTrack.angle = initialAngle;
    return currentTrack;
};

export const calculateStats = (track: TrackPart[], goals: Goal[]): PlayerStats => {
    const moves = track.length;
    const [x, y] = moves ? track[track.length - 1].to : [0, 0];
    const totalDistance = moves ? track.reduce((result, { distance }) => result + distance, 0) : 0;
    const averageSpeed = moves ? totalDistance / moves : 0;
    const speed = moves ? track[track.length - 1].distance : 0;
    const collectedGoals = track.reduce((result: Goal[], { goalId }) => {
        if (goalId) {
            const goal = goals.find(({ id }) => id === goalId);
            goal && !result.includes(goal) && result.push(goal);
        }
        return result;
    }, []);
    const finished = collectedGoals.length === goals.length && x === 0 && y === 0;
    return { moves, speed, averageSpeed, totalDistance, collectedGoals, finished };
};
