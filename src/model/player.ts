import { AnyAction } from 'redux';

import { calculateTrack, FieldPoint, getPoint, getVector, TrackPart } from '../utils';
import { log } from '../debug';

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

interface State {
    error: FieldPoint | null;
    current: TrackPart;
    track: TrackPart[];
    future: TrackPart[];
}

const initialPosition = getPoint(0, 0);
const initialVector = getVector(0, 0);

const initialState: State = {
    error: null,
    current: { ...calculateTrack(initialPosition, initialVector), angle: Math.PI / 4 },
    track: [],
    future: [],
};

export const moveAction = (to: FieldPoint): MoveAction => ({ type: MOVE, payload: { to } });
export const undoAction = (): UndoAction => ({ type: UNDO });
export const redoAction = (): RedoAction => ({ type: REDO });
export const resetAction = (): ResetAction => ({ type: RESET });

const makeMoveState = (state: State, action: MoveAction): State => {
    const { track, current, future } = state;
    const [fromX, fromY] = current.from;
    const [toX, toY] = action.payload.to;
    if (fromX === toX && fromY === toY) {
        return state;
    }
    const vector = getVector(toX - fromX, toY - fromY);
    const move = calculateTrack(current.from, vector, current.angle);
    const nextMove = calculateTrack(action.payload.to, vector, move.angle);
    log('Move', move);
    if (Math.abs(move.vector[0] - current.vector[0]) > 1 || Math.abs(move.vector[1] - current.vector[1]) > 1) {
        return { ...state, error: { ...move.to } };
    }
    return {
        ...state,
        error: null,
        track: track.concat({ ...move }),
        current: nextMove,
        future: action.meta?.doNotClearFuture ? future : [],
    };
};

const makeUndoState = (state: State) => {
    const { track, current, future } = state;
    if (track.length) {
        log('Undo', current);
        const lastMove = track[track.length - 1];
        return {
            ...state,
            error: null,
            track: track.slice(0, track.length - 1),
            current: { ...lastMove },
            future: [{ ...current }, ...future],
        };
    }
    return state;
};

const makeRedoState = (state: State) => {
    const { track, current, future } = state;
    if (future.length) {
        const nextMove = future[0];
        log('Redo', nextMove);
        return {
            ...state,
            error: null,
            track: track.concat({ ...current }),
            current: { ...nextMove },
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
