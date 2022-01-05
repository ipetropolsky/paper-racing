import { VFC } from 'react';

import { CELL_SIZE, FIELD_WIDTH_IN_CELLS } from './constants';

import './Path.css';
import { PlayerStats } from './model/player';
import { PointStatic, PointType } from './Point';
import { goals } from './setup';

interface ScoreProps {
    stats: PlayerStats;
}

const Score: VFC<ScoreProps> = ({ stats }) => {
    const { moves, speed, averageSpeed, totalDistance, collectedGoals } = stats;
    return (
        <div className="score" style={{ left: FIELD_WIDTH_IN_CELLS * CELL_SIZE }}>
            <p>Ходы: {moves}</p>
            <p>Скорость: {Math.round(speed * 100) / 100}</p>
            <p>Средняя скорость: {Math.round(averageSpeed * 100) / 100}</p>
            <p>Дистанция: {Math.round(totalDistance * 100) / 100}</p>
            <p>
                Чек-поинты:
                {collectedGoals.map((goal, index) => (
                    <PointStatic key={goal.id} type={PointType.GOAL} collected={goal.number === index + 1}>
                        {goal.number === index + 1 && goal.number}
                    </PointStatic>
                ))}
                {goals.map((goal) =>
                    collectedGoals.includes(goal) ? null : <PointStatic key={goal.id} type={PointType.CURSOR} />
                )}
            </p>
        </div>
    );
};

export default Score;
