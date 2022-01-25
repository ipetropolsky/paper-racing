import { VFC } from 'react';

import { CELL_SIZE } from './constants';
import { FieldPoint } from './model/types';

import './NextMove.css';

interface NextMoveProps {
    point: FieldPoint;
}

const NextMove: VFC<NextMoveProps> = ({ point: [x, y] }) => (
    <div
        className="next-move"
        style={{
            left: x * CELL_SIZE,
            top: y * CELL_SIZE,
        }}
    />
);

export default NextMove;
