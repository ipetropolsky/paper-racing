import { VFC, useCallback, useEffect, useRef, useState, MouseEventHandler } from 'react';

import { CELL_SIZE, FIELD_WIDTH_IN_CELLS, FIELD_HEIGHT_IN_CELLS, defaultRect, Z_KEY, SPACE_KEY } from './constants';
import Point, { PointType } from './Point';
import { getBoundingClientRect, getPointByCoords } from './utils';
import usePlayer from './usePlayer';
import Score from './Score';
import Cell, { CellType } from './Cell';
import { FINISH_POINT, goals } from './setup';
import { BoundingClientRect, FieldPoint } from './model/types';

import styles from './Field.module.css';

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
        statsPlayerOne,
        error,
    ] = usePlayer('#4d4dff');

    useEffect(() => {
        const handler = () => {
            if (fieldRef.current) {
                setFieldMetrics(getBoundingClientRect(fieldRef.current));
            }
        };
        window.addEventListener('resize', handler);
        window.addEventListener('scroll', handler);
        handler();
        return () => {
            window.removeEventListener('resize', handler);
            window.removeEventListener('scroll', handler);
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
    }, [redoPlayerOne, resetPlayerOne, statsPlayerOne, undoPlayerOne]);

    const onClick = useCallback(
        ({ pageX, pageY }) => {
            const point = getPointByCoords(
                pageX - fieldMetrics.left - document.documentElement.scrollLeft,
                pageY - fieldMetrics.top - document.documentElement.scrollTop
            );
            movePlayerOne(point);
        },
        [fieldMetrics, movePlayerOne]
    );

    const onMouseMove = useCallback<MouseEventHandler>(
        ({ pageX, pageY }) => {
            const point = getPointByCoords(
                pageX - fieldMetrics.left - document.documentElement.scrollLeft,
                pageY - fieldMetrics.top - document.documentElement.scrollTop
            );
            setCursor(point);
        },
        [fieldMetrics]
    );

    const collectedGoalIds = statsPlayerOne.collectedGoals.map(({ id }) => id);
    return (
        <div style={{ position: 'relative', margin: 30 }}>
            <div className={styles.field} ref={fieldRef} onMouseMove={onMouseMove} onClick={onClick} style={fieldStyle}>
                {cursor && <Point point={cursor} type={PointType.CURSOR} />}
                {goals.map(({ id, point, number }) => (
                    <Point
                        key={id}
                        point={point}
                        type={PointType.GOAL}
                        inAction={lastMovePlayerOne?.goalId === id}
                        collected={collectedGoalIds.includes(id)}
                    >
                        {number}
                    </Point>
                ))}
                {error && <Point point={error} type={PointType.ERROR} inAction key={`${error.join(' ')}`} />}
                {renderPlayerOne()}
                <Cell point={FINISH_POINT} type={CellType.FINISH} />
            </div>
            <Score stats={statsPlayerOne} />
        </div>
    );
};

export default Field;
