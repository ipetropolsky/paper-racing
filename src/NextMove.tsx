import { VFC } from 'react';

import { CELL_SIZE } from './constants';
import { FieldPoint } from './model/types';

import styles from './NextMove.module.css';

interface NextMoveProps {
    point: FieldPoint;
}

const NextMove: VFC<NextMoveProps> = ({ point: [x, y] }) => (
    <div
        className={styles.nextMove}
        style={{
            left: x * CELL_SIZE,
            top: y * CELL_SIZE,
        }}
    />
);

export default NextMove;
