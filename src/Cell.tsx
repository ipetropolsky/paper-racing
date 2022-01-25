import { VFC } from 'react';

import { CELL_SIZE } from './constants';
import { FieldPoint } from './model/types';

import './Cell.css';

export enum CellType {
    FINISH = 'finish',
}

interface CellProps {
    type: CellType;
    point: FieldPoint;
}

const CellMove: VFC<CellProps> = ({ type, point: [x, y] }) => (
    <div
        className={`cell cell_${type}`}
        style={{
            left: x * CELL_SIZE,
            top: y * CELL_SIZE,
        }}
    />
);

export default CellMove;
