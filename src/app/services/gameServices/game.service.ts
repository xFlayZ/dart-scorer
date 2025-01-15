import { Injectable } from '@angular/core';
import { GameData } from '../../interfaces/game-data.interface';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  public gameData: GameData[] = [];

  constructor() {}

  getPointsFromDart(dart: string): number {
    if (dart.startsWith('T')) {
      return parseInt(dart.substring(1)) * 3;
    } else if (dart.startsWith('D')) {
      return parseInt(dart.substring(1)) * 2;
    } else {
      return parseInt(dart) || 0;
    }
  }

  calculateRoundAverage(gameData: GameData): number {
    const totalScore = gameData.roundHistory.reduce(
      (acc, dart) => acc + this.getPointsFromDart(dart),
      0
    );
    return gameData.roundHistory.length > 0 ? Math.ceil(totalScore / Math.ceil(gameData.roundHistory.length / 3)) : 0;
  }

  calculateLastThrownSum(gameData: GameData): number {
    const firstDart = this.getPointsFromDart(gameData.firstDart);
    const secondDart = this.getPointsFromDart(gameData.secondDart);
    const thirdDart = this.getPointsFromDart(gameData.thirdDart);
    return firstDart + secondDart + thirdDart;
  }

  generateWaitingPlayerList(gameData: GameData[], currentPlayer: number): GameData[] {
    // Erhalte den Index des aktuellen Spielers, adjustiere für 0-basierten Index.
    const currentPlayerIndex = currentPlayer;

    // Teilung der Spieler in die nach dem aktuellen Spieler und die vor dem aktuellen Spieler.
    const playersAfterCurrent = gameData['slice'](currentPlayerIndex + 1);
    const playersBeforeCurrent = gameData['slice'](0, currentPlayerIndex);

    // Zusammenführen der beiden Listen.
    return [...playersAfterCurrent, ...playersBeforeCurrent];
  }
}
