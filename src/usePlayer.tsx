import { ReactNode, useReducer } from 'react';
import { AnyAction, Dispatch } from 'redux';

import { CELL_SIZE, defaultPosition, FIELD_WIDTH_IN_CELLS } from './constants';
import { log } from './debug';
import Path from './Path';
import Car from './Car';
import { calculateTrack, PathPart, FieldPoint } from './utils';
import Point from './Point';
import NextMove from './NextMove';

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

type MoveTo = (nextPosition: FieldPoint) => void;
type Undo = () => void;
type Redo = () => void;
type Reset = () => void;
type Render = () => ReactNode;

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

const moveAction = ({ left, top }: FieldPoint): MoveAction => ({ type: MOVE, payload: { left, top } });
const undoAction = (): UndoAction => ({ type: UNDO });
const redoAction = (dispatch: Dispatch): RedoAction => ({ type: REDO, payload: { dispatch } });
const resetAction = (): ResetAction => ({ type: RESET });

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

function reducer(state: State, action: Actions) {
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
}

const usePlayer = (color: string): [MoveTo, Render, Undo, Redo, Reset] => {
    const [{ error, current, track }, dispatch] = useReducer(reducer, initialState);

    const moveTo: MoveTo = (nextPosition: FieldPoint): void => {
        dispatch(moveAction(nextPosition));
    };

    const undo: Undo = () => {
        dispatch(undoAction());
    };

    const redo: Redo = () => {
        dispatch(redoAction(dispatch as Dispatch));
    };

    const reset: Reset = () => {
        dispatch(resetAction());
    };

    const distance = track.length ? track.reduce((result, { to: { exactSpeed } }) => result + exactSpeed, 0) : 0;
    const averageSpeed = track.length ? distance / track.length : 0;

    const render: Render = () => (
        <>
            {current.position && (
                <Car left={current.position.left} top={current.position.top} angle={current.angle} color={color} />
            )}
            {track.map(({ from, to }, index) => {
                return (
                    <Path
                        key={index}
                        position={from.position}
                        angle={to.angle}
                        exactSpeed={to.exactSpeed}
                        color={color}
                    />
                );
            })}
            <Path position={current.position} angle={current.angle} exactSpeed={current.exactSpeed} color="#eee" last />
            {error && <Point left={error.left} top={error.top} color="red" />}
            <NextMove left={current.position.left + current.vector.dx} top={current.position.top + current.vector.dy} />
            <div className="score" style={{ left: FIELD_WIDTH_IN_CELLS * CELL_SIZE }}>
                <p>Ходы: {track.length}</p>
                <p>Скорость: {Math.round(current.exactSpeed * 100) / 100}</p>
                <p>Средняя скорость: {Math.round(averageSpeed * 100) / 100}</p>
                <p>Дистанция: {Math.round(distance * 100) / 100}</p>
            </div>
        </>
    );
    return [moveTo, render, undo, redo, reset];
};

export default usePlayer;
