import { VFC } from 'react';

import { CELL_SIZE } from './constants';

import './Point.css';

interface PointProps {
    left: number;
    top: number;
    color?: string;
}

const Point: VFC<PointProps> = ({ left, top, color = null }) => {
    const style = {
        left: left * CELL_SIZE,
        top: top * CELL_SIZE,
        ...(color ? { backgroundColor: color } : {}),
    };
    return <div className="point" style={style} />;
};

export default Point;
