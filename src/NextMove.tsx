import { VFC } from 'react';

import { CELL_SIZE } from './constants';

import './NextMove.css';

interface NextMoveProps {
    left: number;
    top: number;
}

const NextMove: VFC<NextMoveProps> = ({ left, top }) => {
    const style = {
        left: left * CELL_SIZE,
        top: top * CELL_SIZE,
    };
    return <div className="next-move" style={style} />;
};

export default NextMove;
