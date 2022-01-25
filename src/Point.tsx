import { VFC, useEffect, useState, ReactNode } from 'react';
import classnames from 'classnames';

import { CELL_SIZE } from './constants';
import { FieldPoint } from './model/types';

import styles from './Point.module.css';

export enum PointType {
    CURSOR = 'cursor',
    GOAL = 'goal',
    ERROR = 'error',
}

interface PointStaticProps {
    type: PointType;
    children?: ReactNode;
    collected?: boolean;
}

interface PointProps extends PointStaticProps {
    point: FieldPoint;
    inAction?: boolean;
}

const classByType = {
    [PointType.CURSOR]: styles.pointCursor,
    [PointType.GOAL]: styles.pointGoal,
    [PointType.ERROR]: styles.pointError,
};

const Point: VFC<PointProps> = ({ type, point: [x, y], inAction = false, collected = false, children }) => {
    const [inActionClass, setInActionClass] = useState(false);
    useEffect(() => {
        setInActionClass(inAction);
    }, [inAction]);

    return (
        <span
            className={classnames(`${styles.point} ${classByType[type]}`, {
                [styles.pointInAction]: inActionClass,
                [styles.pointCollected]: collected,
            })}
            style={{
                left: x * CELL_SIZE,
                top: y * CELL_SIZE,
            }}
        >
            {children}
        </span>
    );
};

export const PointStatic: VFC<PointStaticProps> = ({ type, collected = false, children }) => {
    const [inActionClass, setInActionClass] = useState(false);
    useEffect(() => {
        setInActionClass(type === PointType.GOAL);
    }, [type]);

    return (
        <span
            className={classnames(`${styles.point} ${styles.pointStatic} ${classByType[type]}`, {
                [styles.pointInAction]: inActionClass,
                [styles.pointCollected]: collected,
            })}
        >
            {children}
        </span>
    );
};

export default Point;
