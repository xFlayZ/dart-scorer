import { Component, Input } from '@angular/core';
import { GameData } from '../../interfaces/game-data.interface';
import { Subscription } from 'rxjs';
import { GameService } from '../../services/game-service/game.service';

@Component({
  selector: 'app-game-data-table',
  templateUrl: './game-data-table.component.html',
  styleUrl: './game-data-table.component.scss',
})
export class GameDataTableComponent {
  public isOneActivePlayer = true;

  @Input() public gameData: GameData[] = [];

  constructor(public gameService: GameService) {}

  get sortedGameData() {
    return this.gameData.slice().sort((a, b) => b.wins - a.wins);
  }

  togglePlayerStatus(player: any): void {
    const currentPlayer = this.gameData[this.gameService.currentPlayerCount];
    this.checkIfOneActivePlayer(player);

    if (!this.isOneActivePlayer && !this.gameService.legEnd) {
      // add confirm modal
      this.gameService.legEnd = true;
    } else if (currentPlayer.playerName == player.playerName) {
      // add confirm modal
      if (!this.gameService.legEnd) {
        this.gameService.nextPlayer();
      }
    }
  }

  checkIfOneActivePlayer(player: any) {
    player.isActive = !player.isActive;
    this.isOneActivePlayer = this.gameData.some((player) => player.isActive);
  }
}
