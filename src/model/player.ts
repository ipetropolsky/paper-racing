import { AnyAction } from 'redux';

import { calculateTrack, FieldPoint, getVector, TrackPart } from '../utils';
import { log } from '../debug';
import { Goal } from '../constants';
import { goals, initialTrack } from '../setup';

const MOVE = 'MOVE';
const UNDO = 'UNDO';
const REDO = 'REDO';
const RESET = 'RESET';

interface MoveAction extends AnyAction {
    type: typeof MOVE;
    payload: { to: FieldPoint };
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

export interface PlayerStats {
    moves: number;
    speed: number;
    averageSpeed: number;
    totalDistance: number;
    collectedGoals: Goal[];
    finished: boolean;
}

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

export const moveAction = (to: FieldPoint): MoveAction => ({ type: MOVE, payload: { to } });
export const undoAction = (): UndoAction => ({ type: UNDO });
export const redoAction = (): RedoAction => ({ type: REDO });
export const resetAction = (): ResetAction => ({ type: RESET });

export const getCurrentTrack = (track: TrackPart[], goals: Goal[]): TrackPart => {
    if (track.length) {
        const lastMove = track[track.length - 1];
        return calculateTrack(lastMove.to, lastMove.vector, lastMove.angle, goals);
    }
    return initialTrack;
};

const makeMoveState = (state: State, action: MoveAction): State => {
    const { track, future } = state;
    const current = getCurrentTrack(track, goals);
    const [fromX, fromY] = current.from;
    const [toX, toY] = action.payload.to;
    if (fromX === toX && fromY === toY) {
        return state;
    }
    const vector = getVector(toX - fromX, toY - fromY);
    const lastMove = calculateTrack(current.from, vector, current.angle, goals);
    log('Move', lastMove);
    if (Math.abs(lastMove.vector[0] - current.vector[0]) > 1 || Math.abs(lastMove.vector[1] - current.vector[1]) > 1) {
        return { ...state, error: { ...lastMove.to } };
    }
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
