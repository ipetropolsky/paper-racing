import { AnyAction } from 'redux';

import { getPoint, getTrackPart, getVector, theSamePoint } from '../utils';
import { FINISH_POINT, goals, initialPosition } from '../setup';
import { FieldPoint, FieldVector, Goal, PlayerStats, TrackPart } from './types';
import { log } from '../debug';

const MOVE = 'MOVE';
const UNDO = 'UNDO';
const REDO = 'REDO';
const RESET = 'RESET';

interface MoveAction extends AnyAction {
    type: typeof MOVE;
    payload: { target: FieldPoint };
    meta?: {
        doNotClearFuture?: boolean;
    };
}

interface UndoAction extends AnyAction {
    type: typeof UNDO;
}

interface RedoAction extends AnyAction {
    type: typeof REDO;
}

interface ResetAction extends AnyAction {
    type: typeof RESET;
}

type Actions = MoveAction | UndoAction | RedoAction | ResetAction;

const calculateTrack = (point: FieldPoint, vector: FieldVector, lastAngle = 0, goals: Goal[]): TrackPart => {
    const [x, y] = point;
    const [dx, dy] = vector;
    const target = getPoint(x + dx, y + dy);
    const speed = Math.max(Math.abs(dx), Math.abs(dy));
    const distance = Math.sqrt(dx * dx + dy * dy);
    let angle = Math.atan(dy / dx) + (dx < 0 ? Math.PI : 0);
    while (Math.abs(lastAngle - angle) > Math.PI) {
        angle += (lastAngle > angle ? 1 : -1) * 2 * Math.PI;
    }
    const goalId = goals.find(({ point }) => theSamePoint(point, target))?.id || null;
    return getTrackPart({ point, target, vector, angle, speed, distance, goalId });
};

const initialTrack = getTrackPart({
    point: initialPosition.point,
    target: initialPosition.point,
    vector: initialPosition.vector,
    angle: initialPosition.angle,
});

export const getCurrentTrack = (track: TrackPart[], goals: Goal[]): TrackPart => {
    if (track.length) {
        const lastMove = track[track.length - 1];
        return calculateTrack(lastMove.target, lastMove.vector, lastMove.angle, goals);
    }
    return initialTrack;
};

export const calculateStats = (track: TrackPart[], goals: Goal[]): PlayerStats => {
    const moves = track.length;
    const point = moves ? track[track.length - 1].target : initialPosition.point;
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
    const finished = collectedGoals.length === goals.length && theSamePoint(point, FINISH_POINT);
    return { moves, speed, averageSpeed, totalDistance, collectedGoals, finished };
};

interface State {
    error: FieldPoint | null;
    track: TrackPart[];
    future: TrackPart[];
}

const initialState: State = {
    error: null,
    track: [],
    future: [],
};

export const moveAction = (target: FieldPoint): MoveAction => ({ type: MOVE, payload: { target } });
export const undoAction = (): UndoAction => ({ type: UNDO });
export const redoAction = (): RedoAction => ({ type: REDO });
export const resetAction = (): ResetAction => ({ type: RESET });

const makeMoveState = (state: State, action: MoveAction): State => {
    const { track, future } = state;
    const current = getCurrentTrack(track, goals);
    const [fromX, fromY] = current.point;
    const [toX, toY] = action.payload.target;
    if (theSamePoint(current.point, action.payload.target)) {
        return state;
    }
    const vector = getVector(toX - fromX, toY - fromY);
    if (Math.abs(vector[0] - current.vector[0]) > 1 || Math.abs(vector[1] - current.vector[1]) > 1) {
        return { ...state, error: [...action.payload.target] };
    }
    const lastMove = calculateTrack(current.point, vector, current.angle, goals);
    log('Move', lastMove);
    return {
        ...state,
        error: null,
        track: track.concat({ ...lastMove }),
        future: action.meta?.doNotClearFuture ? future : [],
    };
};

const makeUndoState = (state: State) => {
    const { track, future } = state;
    if (track.length) {
        const lastMove = track[track.length - 1];
        log('Undo', lastMove);
        return {
            ...state,
            error: null,
            track: track.slice(0, track.length - 1),
            future: [{ ...lastMove }, ...future],
        };
    }
    return state;
};

const makeRedoState = (state: State) => {
    const { track, future } = state;
    if (future.length) {
        const lastMove = future[0];
        log('Redo', lastMove);
        return {
            ...state,
            error: null,
            track: track.concat({ ...lastMove }),
            future: future.slice(1),
        };
    }
    return state;
};

const makeResetState = () => {
    return { ...initialState };
};

const reducer = (state: State = initialState, action: Actions): State => {
    switch (action.type) {
        case MOVE:
            return makeMoveState(state, action);
        case UNDO:
            return makeUndoState(state);
        case REDO:
            return makeRedoState(state);
        case RESET:
            return makeResetState();
    }
    return state;
};

export default reducer;
