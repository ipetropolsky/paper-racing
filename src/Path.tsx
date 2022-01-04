import { VFC } from 'react';

import { CELL_SIZE } from './constants';
import { lightenDarkenColor } from './color';

import './Path.css';

interface PathProps {
    x: number;
    y: number;
    angle: number;
    distance: number;
    color: string;
    last?: boolean;
    actuality: number;
}

const Path: VFC<PathProps> = ({ x, y, angle, distance, color, last = false, actuality }) => {
    const finalColor = lightenDarkenColor(color, (1 - actuality) * 100);
    const style = {
        left: x * CELL_SIZE,
        top: y * CELL_SIZE,
        width: distance * CELL_SIZE,
        transform: `rotate(${angle}rad`,
        borderColor: finalColor,
    };
    return <div className={`path ${last ? 'path_last' : ''}`} style={style} />;
};

export default Path;
