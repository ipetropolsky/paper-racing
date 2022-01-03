import { ReactNode } from 'react';
import { Dispatch } from 'redux';
import { useDispatch, useSelector } from 'react-redux';

import { CELL_SIZE, FIELD_WIDTH_IN_CELLS } from './constants';
import Path from './Path';
import Car from './Car';
import { FieldPoint } from './utils';
import NextMove from './NextMove';
import { moveAction, undoAction, redoAction, resetAction } from './model/player';

type MoveTo = (nextPosition: FieldPoint) => void;
type Undo = () => void;
type Redo = () => void;
type Reset = () => void;
type Render = () => ReactNode;

const usePlayer = (color: string): [MoveTo, Render, Undo, Redo, Reset, FieldPoint | null] => {
    const dispatch = useDispatch();
    const { error, current, track } = useSelector((state) => state.player);

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
            <NextMove left={current.position.left + current.vector.dx} top={current.position.top + current.vector.dy} />
            <div className="score" style={{ left: FIELD_WIDTH_IN_CELLS * CELL_SIZE }}>
                <p>Ходы: {track.length}</p>
                <p>Скорость: {Math.round(current.exactSpeed * 100) / 100}</p>
                <p>Средняя скорость: {Math.round(averageSpeed * 100) / 100}</p>
                <p>Дистанция: {Math.round(distance * 100) / 100}</p>
            </div>
        </>
    );
    return [moveTo, render, undo, redo, reset, error];
};

export default usePlayer;
