import { ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CELL_SIZE, FIELD_WIDTH_IN_CELLS, Goal, goals } from './constants';
import Path from './Path';
import Car from './Car';
import { FieldPoint, TrackPart } from './utils';
import NextMove from './NextMove';
import { moveAction, undoAction, redoAction, resetAction } from './model/player';
import { PointStatic, PointType } from './Point';

type MoveTo = (nextPosition: FieldPoint) => void;
type Undo = () => void;
type Redo = () => void;
type Reset = () => void;
type Render = () => ReactNode;

const usePlayer = (color: string): [MoveTo, Render, Undo, Redo, Reset, TrackPart, Goal[], FieldPoint | null] => {
    const dispatch = useDispatch();
    const { error, track, current } = useSelector((state) => state.player);
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

    const collectedGoals = track.reduce((result: Goal[], { goalId }) => {
        if (goalId) {
            const goal = goals.find(({ id }) => id === goalId);
            goal && !result.includes(goal) && result.push(goal);
        }
        return result;
    }, []);
    const totalDistance = track.length ? track.reduce((result, { distance }) => result + distance, 0) : 0;
    const averageSpeed = track.length ? totalDistance / track.length : 0;
    const speed = track.length ? track[track.length - 1].distance : 0;

    const render: Render = () => (
        <>
            {current.from && <Car left={fromX} top={fromY} angle={current.angle} color={color} />}
            {track.map(({ from: [x, y], angle, distance }, index) => {
                return <Path key={index} x={x} y={y} angle={angle} distance={distance} color={color} />;
            })}
            <Path x={fromX} y={fromY} angle={current.angle} distance={current.distance} color="#ddd" last />
            <NextMove x={toX} y={toY} />
            <div className="score" style={{ left: FIELD_WIDTH_IN_CELLS * CELL_SIZE }}>
                <p>Ходы: {track.length}</p>
                <p>Скорость: {Math.round(speed * 100) / 100}</p>
                <p>Средняя скорость: {Math.round(averageSpeed * 100) / 100}</p>
                <p>Дистанция: {Math.round(totalDistance * 100) / 100}</p>
                <p>
                    Чек-поинты:
                    {collectedGoals.map((goal, index) => (
                        <PointStatic key={goal.id} type={PointType.GOAL} collected={goal.number === index + 1}>
                            {goal.number === index + 1 && goal.number}
                        </PointStatic>
                    ))}
                    {goals.map((goal) =>
                        collectedGoals.includes(goal) ? null : <PointStatic key={goal.id} type={PointType.CURSOR} />
                    )}
                </p>
            </div>
        </>
    );
    return [moveTo, render, undo, redo, reset, lastMove, collectedGoals, error];
};

export default usePlayer;
