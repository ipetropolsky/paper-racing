export type FieldPoint = [number, number];
export type FieldVector = [number, number];

export interface TrackPart {
    from: FieldPoint;
    to: FieldPoint;
    vector: FieldVector;
    angle: number;
    speed: number;
    distance: number;
    goalId: string | null;
}

export interface BoundingClientRect {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
    x: number;
    y: number;
}

export interface Goal {
    id: string;
    left: number;
    top: number;
    number: number | null;
}

export interface PlayerStats {
    moves: number;
    speed: number;
    averageSpeed: number;
    totalDistance: number;
    collectedGoals: Goal[];
    finished: boolean;
}
