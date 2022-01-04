import { VFC, useEffect, useState, ReactNode } from 'react';

import { CELL_SIZE } from './constants';

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
    x: number;
    y: number;
    inAction?: boolean;
}

const colorByType = {
    [PointType.CURSOR]: '#dddddd',
    [PointType.GOAL]: '#FFCA28',
    [PointType.ERROR]: '#BF360C',
};

const Point: VFC<PointProps> = ({ type, x, y, inAction = false, collected = false, children }) => {
    const [inActionClass, setInActionClass] = useState(false);
    useEffect(() => {
        setInActionClass(inAction);
    }, [inAction]);

    const style = {
        left: x * CELL_SIZE,
        top: y * CELL_SIZE,
        backgroundColor: colorByType[type],
        borderColor: colorByType[type],
    };
    return (
        <span
            className={`point point_${type} ${inActionClass ? 'point_in-action' : ''} ${
                collected ? 'point_collected' : ''
            }`}
            style={style}
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

    const style = {
        backgroundColor: colorByType[type],
        borderColor: colorByType[type],
    };
    return (
        <span
            className={`point point_${type} point_static ${inActionClass ? 'point_in-action' : ''} ${
                collected ? 'point_collected' : ''
            }`}
            style={style}
        >
            {children}
        </span>
    );
};

export default Point;
