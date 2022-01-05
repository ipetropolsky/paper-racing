import { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Path from './Path';
import Car from './Car';
import { calculateStats, FieldPoint, getCurrentTrack, TrackPart } from './utils';
import NextMove from './NextMove';
import { moveAction, undoAction, redoAction, resetAction, PlayerStats } from './model/player';
import { goals } from './setup';

type MoveTo = (nextPosition: FieldPoint) => void;
type Undo = () => void;
type Redo = () => void;
type Reset = () => void;
type Render = () => ReactNode;

const usePlayer = (color: string): [MoveTo, Render, Undo, Redo, Reset, TrackPart, PlayerStats, FieldPoint | null] => {
    const dispatch = useDispatch();
    const { error, track } = useSelector((state) => state.player);
    const current = getCurrentTrack(track, goals);
    const lastMove = track[track.length - 1];
    const [fromX, fromY] = current.from;
    const [toX, toY] = current.to;

    const moveTo: MoveTo = (nextPosition: FieldPoint): void => {
        dispatch(moveAction(nextPosition));
    };

    const undo: Undo = () => {
        dispatch(undoAction());
    };

    const redo: Redo = () => {
        dispatch(redoAction());
    };

    const reset: Reset = () => {
        dispatch(resetAction());
    };

    const stats = calculateStats(track, goals);

    const render: Render = () => (
        <>
            {current.from && <Car left={fromX} top={fromY} angle={current.angle} color={color} />}
            {track.map(({ from: [x, y], angle, distance }, index) => {
                return <Path key={index} x={x} y={y} angle={angle} distance={distance} color={color} />;
            })}
            <Path x={fromX} y={fromY} angle={current.angle} distance={current.distance} color="#ddd" last />
            <NextMove x={toX} y={toY} />
        </>
    );
    return [moveTo, render, undo, redo, reset, lastMove, stats, error];
};

export default usePlayer;
