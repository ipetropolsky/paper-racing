import { VFC } from 'react';

import { CELL_SIZE } from './constants';

import './Cell.css';
import { FieldPoint } from './utils';

export enum CellType {
    FINISH = 'finish',
}

interface CellProps {
    type: CellType;
    point: FieldPoint;
}

const CellMove: VFC<CellProps> = ({ type, point }) => {
    const [x, y] = point;
    return (
        <div
            className={`cell cell_${type}`}
            style={{
                left: x * CELL_SIZE,
                top: y * CELL_SIZE,
            }}
        />
    );
};

export default CellMove;
