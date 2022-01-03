import { AnyAction, Dispatch } from 'redux';

import { defaultPosition } from '../constants';
import { calculateTrack, FieldPoint, PathPart } from '../utils';
import { log } from '../debug';

const MOVE = 'MOVE';
const UNDO = 'UNDO';
const REDO = 'REDO';
const RESET = 'RESET';

interface MoveAction extends AnyAction {
    type: typeof MOVE;
    payload: FieldPoint;
    doNotClearFuture?: boolean;
}

interface UndoAction extends AnyAction {
    type: typeof UNDO;
}

interface RedoAction extends AnyAction {
    type: typeof REDO;
    payload: { dispatch: Dispatch };
}

interface ResetAction extends AnyAction {
    type: typeof RESET;
}

type Actions = MoveAction | UndoAction | RedoAction | ResetAction;

interface TrackPart {
    from: PathPart;
    to: PathPart;
}

interface State {
    current: PathPart;
    error: FieldPoint | null;
    history: Actions[];
    future: Actions[];
    track: TrackPart[];
}

const initialState: State = {
    current: {
        position: defaultPosition,
        vector: { dx: 0, dy: 0 },
        angle: Math.PI / 4,
        speed: 0,
        exactSpeed: 0,
    },
    error: null,
    history: [],
    future: [],
    track: [],
};

export const moveAction = ({ left, top }: FieldPoint): MoveAction => ({ type: MOVE, payload: { left, top } });
export const undoAction = (): UndoAction => ({ type: UNDO });
export const redoAction = (dispatch: Dispatch): RedoAction => ({ type: REDO, payload: { dispatch } });
export const resetAction = (): ResetAction => ({ type: RESET });

const makeMoveState = (state: State, action: MoveAction): State => {
    const { left, top } = action.payload;
    const { current } = state;
    const next = calculateTrack(current.position, { left, top });
    log('Move', next, 'from', current);
    if (Math.abs(next.vector.dx - current.vector.dx) > 1 || Math.abs(next.vector.dy - current.vector.dy) > 1) {
        return { ...state, error: { ...next.position } };
    }
    return {
        ...state,
        error: null,
        current: next,
        history: state.history.concat(action),
        future: action.doNotClearFuture ? state.future : [],
        track: state.track.concat({
            from: current,
            to: next,
        }),
    };
};

const makeUndoState = (state: State) => {
    if (state.history.length) {
        const lastAction = state.history[state.history.length - 1];
        log('Undo', lastAction);
        if (lastAction.type === MOVE) {
            const { from } = state.track[state.track.length - 1];
            return {
                ...state,
                error: null,
                current: { ...from },
                history: state.history.slice(0, state.history.length - 1),
                future: [lastAction, ...state.future],
                track: state.track.slice(0, state.track.length - 1),
            };
        }
    }
    return state;
};

const makeRedoState = (state: State, action: RedoAction) => {
    if (state.future.length) {
        const { dispatch } = action.payload;
        const nextAction = state.future[0];
        log('Redo', nextAction);
        dispatch({ ...nextAction, doNotClearFuture: true });
        return {
            ...state,
            future: state.future.slice(1),
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
            return makeRedoState(state, action);
        case RESET:
            return makeResetState();
    }
    return state;
};

export default reducer;
