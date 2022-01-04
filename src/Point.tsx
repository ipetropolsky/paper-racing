import { VFC, useEffect, useState, ReactNode } from 'react';

import { CELL_SIZE } from './constants';

import './Point.css';

interface PointProps {
    x: number;
    y: number;
    color?: string;
    collected?: boolean;
    children?: ReactNode;
}

const Point: VFC<PointProps> = ({ x, y, color = null, collected = false, children }) => {
    const [collectedClass, setCollectedClass] = useState(false);
    useEffect(() => {
        setCollectedClass(collected);
    }, [collected]);
    const style = {
        left: x * CELL_SIZE,
        top: y * CELL_SIZE,
        ...(color ? { backgroundColor: color, borderColor: color } : {}),
    };
    return (
        <div className={`point ${collectedClass ? 'point_collected' : ''}`} style={style}>
            {children}
        </div>
    );
};

export default Point;