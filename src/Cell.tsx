import { VFC } from 'react';

import { CELL_SIZE } from './constants';
import { FieldPoint } from './model/types';

import styles from './Cell.module.css';

export enum CellType {
    FINISH = 'finish',
}

interface CellProps {
    type: CellType;
    point: FieldPoint;
}

const typeToClass = {
    [CellType.FINISH]: styles.cell_finish,
};

const CellMove: VFC<CellProps> = ({ type, point: [x, y] }) => (
    <div
        className={`${styles.cell} ${typeToClass[type]}`}
        style={{
            left: x * CELL_SIZE,
            top: y * CELL_SIZE,
        }}
    />
);

export default CellMove;
