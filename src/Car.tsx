import { VFC } from 'react';

import { CELL_SIZE } from './constants';
import { FieldPoint } from './model/types';

import styles from './Car.module.css';

interface CarProps {
    point: FieldPoint;
    angle: number;
    color: string;
}

const Car: VFC<CarProps> = ({ point: [x, y], angle, color }) => {
    return (
        <div
            className={styles.car}
            style={{
                left: x * CELL_SIZE,
                top: y * CELL_SIZE,
                transform: `rotate(${angle}rad)`,
            }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 47 47">
                <rect x="36" y="16" fill="#546E7A" width="2" height="16" />
                <rect x="5" y="14" fill="#546E7A" width="17" height="20" />
                <path
                    fill="#37474F"
                    d="M13,16H5c-0.55,0-1-0.45-1-1v-5c0-0.55,0.45-1,1-1h8c0.55,0,1,0.45,1,1v5C14,15.55,13.55,16,13,16z M14,38  v-5c0-0.55-0.45-1-1-1H5c-0.55,0-1,0.45-1,1v5c0,0.55,0.45,1,1,1h8C13.55,39,14,38.55,14,38z M42,16v-5c0-0.55-0.45-1-1-1h-8  c-0.55,0-1,0.45-1,1v5c0,0.55,0.45,1,1,1h8C41.55,17,42,16.55,42,16z M42,37v-5c0-0.55-0.45-1-1-1h-8c-0.55,0-1,0.45-1,1v5  c0,0.55,0.45,1,1,1h8C41.55,38,42,37.55,42,37z"
                />
                <rect x="43" y="13" fill="#DD2C00" width="4" height="22" />
                <rect x="8" y="16" fill="#263238" width="2" height="16" />
                <path
                    fill={color}
                    d="M46,22l-20.173-2.882C25.345,18.176,25,17.118,25,16l-0.063-0.042C24.69,14.839,23.694,14,22.5,14  c-0.149,0-0.293,0.019-0.434,0.044L22,14l-0.297,0.142c-0.215,0.073-0.422,0.164-0.607,0.29L7,20.328V13H0v22h7v-7.328l14.097,5.897  c0.185,0.125,0.391,0.217,0.607,0.29L22,34l0.066-0.044C22.207,33.981,22.351,34,22.5,34c1.194,0,2.19-0.839,2.438-1.958L25,32  c0-1.118,0.345-2.176,0.827-3.118L46,26c1.105,0,2-0.896,2-2S47.105,22,46,22z"
                />
                <path
                    fill="#3E2723"
                    d="M18,27h-1c-0.55,0-1-0.45-1-1v-4c0-0.55,0.45-1,1-1h1V27z M26,21h-5v6h5c1.65,0,3-1.35,3-3  C29,22.35,27.65,21,26,21z"
                />
                <polygon fill="#DD2C00" points="7,27.672 10,28.927 10,19.073 7,20.328 " />
            </svg>
        </div>
    );
};

export default Car;
