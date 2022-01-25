import { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Path from './Path';
import Car from './Car';
import NextMove from './NextMove';
import { moveAction, undoAction, redoAction, resetAction, getCurrentTrack, calculateStats } from './model/player';
import { goals } from './setup';
import { FieldPoint, PlayerStats, TrackPart } from './model/types';

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
            {current.point && <Car point={current.point} angle={current.angle} color={color} />}
            {track.map(({ point, angle, distance }, index) => {
                return <Path key={index} point={point} angle={angle} distance={distance} color={color} />;
            })}
            <Path point={current.point} angle={current.angle} distance={current.distance} color="#ddd" last />
            <NextMove point={current.target} />
        </>
    );
    return [moveTo, render, undo, redo, reset, lastMove, stats, error];
};

export default usePlayer;
