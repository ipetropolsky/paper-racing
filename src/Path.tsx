import { VFC } from 'react';

import { CELL_SIZE } from './constants';

import './Path.css';

interface PathProps {
    x: number;
    y: number;
    angle: number;
    distance: number;
    color: string;
    last?: boolean;
}

const Path: VFC<PathProps> = ({ x, y, angle, distance, color, last = false }) => {
    const style = {
        left: x * CELL_SIZE,
        top: y * CELL_SIZE,
        width: distance * CELL_SIZE,
        transform: `rotate(${angle}rad`,
        borderColor: color,
    };
    return <div className={`path ${last ? 'path_last' : ''}`} style={style} />;
};

export default Path;
