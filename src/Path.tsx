import { VFC } from 'react';

import { CELL_SIZE } from './constants';

import './Path.css';

interface PathProps {
    position: {
        left: number;
        top: number;
    };
    angle: number;
    exactSpeed: number;
    color: string;
    last?: boolean;
}

const Path: VFC<PathProps> = ({ position: { left, top }, angle, exactSpeed, color, last = false }) => {
    const style = {
        left: left * CELL_SIZE,
        top: top * CELL_SIZE,
        width: exactSpeed * CELL_SIZE,
        transform: `rotate(${angle}rad`,
        borderColor: color,
    };
    return <div className={`path ${last ? 'path_last' : ''}`} style={style} />;
};

export default Path;
