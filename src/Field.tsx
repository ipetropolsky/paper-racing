import { VFC, useCallback, useEffect, useRef, useState, MouseEventHandler } from 'react';

import {
    CELL_SIZE,
    FIELD_WIDTH_IN_CELLS,
    FIELD_HEIGHT_IN_CELLS,
    defaultRect,
    goals,
    BoundingClientRect,
} from './constants';
import Point, { PointType } from './Point';
import { FieldPoint, getBoundingClientRect, getPointByCoords } from './utils';

import './Field.css';
import usePlayer from './usePlayer';

const Z_KEY = 90;
const SPACE_KEY = 32;

const fieldStyle = {
    width: FIELD_WIDTH_IN_CELLS * CELL_SIZE - 1,
    height: FIELD_HEIGHT_IN_CELLS * CELL_SIZE - 1,
};

const Field: VFC = () => {
    const fieldRef = useRef<HTMLDivElement>(null);
    const [fieldMetrics, setFieldMetrics] = useState<BoundingClientRect>(defaultRect);
    const [cursor, setCursor] = useState<FieldPoint | null>(null);
    const [
        movePlayerOne,
        renderPlayerOne,
        undoPlayerOne,
        redoPlayerOne,
        resetPlayerOne,
        lastMovePlayerOne,
        goalsPlayerOne,
        error,
    ] = usePlayer('#4d4dff');

    useEffect(() => {
        const resizeHandler = () => {
            if (fieldRef.current) {
                setFieldMetrics(getBoundingClientRect(fieldRef.current));
            }
        };
        window.addEventListener('resize', resizeHandler);
        resizeHandler();
        return () => {
            window.removeEventListener('resize', resizeHandler);
        };
    }, []);

    useEffect(() => {
        const keyDownHandler = (event: KeyboardEvent) => {
            if (event.keyCode === Z_KEY && (event.ctrlKey || event.metaKey)) {
                if (event.shiftKey) {
                    redoPlayerOne();
                } else {
                    undoPlayerOne();
                }
            } else if (event.keyCode === SPACE_KEY) {
                resetPlayerOne();
                event.preventDefault();
            }
        };
        document.addEventListener('keydown', keyDownHandler);
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [redoPlayerOne, resetPlayerOne, undoPlayerOne]);

    const onClick = useCallback(
        ({ pageX, pageY }) => {
            const point = getPointByCoords(pageX - fieldMetrics.left, pageY - fieldMetrics.top);
            movePlayerOne(point);
        },
        [fieldMetrics, movePlayerOne]
    );

    const onMouseMove = useCallback<MouseEventHandler>(
        ({ pageX, pageY }) => {
            const point = getPointByCoords(pageX - fieldMetrics.left, pageY - fieldMetrics.top);
            setCursor(point);
        },
        [fieldMetrics]
    );

    const collectedGoalIds = goalsPlayerOne.map(({ id }) => id);
    return (
        <div style={{ position: 'relative', margin: 30 }}>
            <div className="field" ref={fieldRef} onMouseMove={onMouseMove} onClick={onClick} style={fieldStyle}>
                {cursor && <Point type={PointType.CURSOR} x={cursor[0]} y={cursor[1]} />}
                {goals.map(({ id, left, top, number }) => (
                    <Point
                        type={PointType.GOAL}
                        key={id}
                        x={left}
                        y={top}
                        inAction={lastMovePlayerOne?.goalId === id}
                        collected={collectedGoalIds.includes(id)}
                    >
                        {number}
                    </Point>
                ))}
                {error && (
                    <Point type={PointType.ERROR} x={error[0]} y={error[1]} inAction key={`${error[0]}${error[1]}`} />
                )}
                {renderPlayerOne()}
            </div>
        </div>
    );
};

export default Field;
