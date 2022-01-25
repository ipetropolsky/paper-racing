import { VFC } from 'react';
import classnames from 'classnames';

import { CELL_SIZE } from './constants';
import { FieldPoint } from './model/types';

import './Path.css';

interface PathProps {
    point: FieldPoint;
    angle: number;
    distance: number;
    color: string;
    last?: boolean;
}

const Path: VFC<PathProps> = ({ point: [x, y], angle, distance, color, last = false }) => (
    <div
        className={classnames('path', { [`path_last`]: last })}
        style={{
            left: x * CELL_SIZE,
            top: y * CELL_SIZE,
            width: distance * CELL_SIZE,
            transform: `rotate(${angle}rad`,
            borderColor: color,
        }}
    />
);

export default Path;
