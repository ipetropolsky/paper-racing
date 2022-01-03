import { VFC } from 'react';

import { CELL_SIZE } from './constants';

import './NextMove.css';

interface NextMoveProps {
    x: number;
    y: number;
}

const NextMove: VFC<NextMoveProps> = ({ x, y }) => {
    const style = {
        left: x * CELL_SIZE,
        top: y * CELL_SIZE,
    };
    return <div className="next-move" style={style} />;
};

export default NextMove;
