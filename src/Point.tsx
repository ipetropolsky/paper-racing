import { VFC, useEffect, useState, ReactNode } from 'react';
import classnames from 'classnames';

import { CELL_SIZE } from './constants';
import { FieldPoint } from './model/types';

import './Point.css';

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

const colorByType = {
    [PointType.CURSOR]: '#dddddd',
    [PointType.GOAL]: '#ffca28',
    [PointType.ERROR]: '#bf360c',
};

const Point: VFC<PointProps> = ({ type, point: [x, y], inAction = false, collected = false, children }) => {
    const [inActionClass, setInActionClass] = useState(false);
    useEffect(() => {
        setInActionClass(inAction);
    }, [inAction]);

    return (
        <span
            className={classnames(`point point_${type}`, {
                'point_in-action': inActionClass,
                [`point_collected`]: collected,
            })}
            style={{
                left: x * CELL_SIZE,
                top: y * CELL_SIZE,
                backgroundColor: colorByType[type],
                borderColor: colorByType[type],
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
            className={classnames(`point point_static point_${type}`, {
                'point_in-action': inActionClass,
                [`point_collected`]: collected,
            })}
            style={{
                backgroundColor: colorByType[type],
                borderColor: colorByType[type],
            }}
        >
            {children}
        </span>
    );
};

export default Point;
