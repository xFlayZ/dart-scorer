export interface GameData {
    player: string;
    score: number;
    lastScore: number;
    wins: number;
    roundAverage: number;
    totalAverage: number;
    highestRound: number;
    firstDart: string;
    secondDart: string;
    thirdDart: string;
    roundTotal: number;
    round: number;
    game: number;
    isActive: boolean;
    winnerSong: string;
    [key: string]: any;
}