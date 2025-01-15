export interface GameData {
    player: string;
    isActive: boolean;
    winnerSong: string;
    gameHighscore: number;
    gameAverage: number;
    wins: number;
    round: number;
    score: number;
    firstDart: string;
    secondDart: string;
    thirdDart: string;
    game: number;
    roundHighscore: number;
    roundHistory: string[];
    [key: string]: any;
}