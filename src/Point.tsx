import { VFC } from 'react';

import { CELL_SIZE } from './constants';

import './Point.css';

interface PointProps {
    x: number;
    y: number;
    color?: string;
}

const Point: VFC<PointProps> = ({ x, y, color = null }) => {
    const style = {
        left: x * CELL_SIZE,
        top: y * CELL_SIZE,
        ...(color ? { backgroundColor: color } : {}),
    };
    return <div className="point" style={style} />;
};

export default Point;
