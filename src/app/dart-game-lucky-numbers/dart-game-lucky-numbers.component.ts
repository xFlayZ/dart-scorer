import { Component, Input } from '@angular/core';
import { shuffleArray } from '../helpers';
import { GameDataLuckyNumber } from '../interfaces/game-data-lucky-number';

@Component({
  selector: 'app-dart-game-lucky-numbers',
  templateUrl: './dart-game-lucky-numbers.component.html',
  styleUrl: './dart-game-lucky-numbers.component.scss',
})
export class DartGameLuckyNumbersComponent {
  public gameData: GameDataLuckyNumber[] = [];
  public playerCount = 0;
  public currentPlayerCount = 0;
  public randomNumber = 0;
  public inRound = true;
  public isOneActivePlayer = true;

  @Input() players: string[] = [];

  ngOnInit(): void {
    this.setupGame();
  }

  setupGame() {
    const savedData = localStorage.getItem('gameStartedData');
    if (savedData) {
      const { players } = JSON.parse(savedData);
      this.players = players;
    }

    const shuffledPlayers = shuffleArray(this.players);

    this.gameData = shuffledPlayers.map((player) => ({
      player: player.name,
      thrownNumbers: 0,
      trys: 1,
      isActive: true,
    }));

    this.playerCount = this.players.length - 1;

    this.generateNewRandomNumber();

    localStorage.setItem('gameData', JSON.stringify(this.gameData));
  }

  nextNumber() {
    if (this.gameData && this.gameData.length > 0) {
      const lastPlayer = this.gameData.shift();

      if (lastPlayer) {
        this.gameData.push(lastPlayer);
      }

      this.gameData.forEach((player) => {
        if (player) {
          player.trys = 1;
        }
      });

      this.playerCount = this.gameData.length - 1;
    }

    const currentPlayer = this.gameData[this.currentPlayerCount];
    currentPlayer.thrownNumbers += 1;

    this.generateNewRandomNumber();

    localStorage.setItem('gameData', JSON.stringify(this.gameData));

    if (!currentPlayer.isActive) {
      this.nextPlayer();
    }
  }

  nextPlayer() {
    let currentPlayer = this.gameData[this.currentPlayerCount];

    currentPlayer.trys += 1;

    this.currentPlayerCount =
      this.playerCount > this.currentPlayerCount
        ? this.currentPlayerCount + 1
        : 0;

    localStorage.setItem('gameData', JSON.stringify(this.gameData));

    currentPlayer = this.gameData[this.currentPlayerCount];

    if (!currentPlayer.isActive) {
      this.nextPlayer();
    }
  }

  get sortedGameData() {
    return this.gameData
      .slice()
      .sort((a, b) => b.thrownNumbers - a.thrownNumbers);
  }

  checkIfOneActivePlayer(player: any) {
    player.isActive = !player.isActive;
    this.isOneActivePlayer = this.gameData.some((player) => player.isActive);
  }
  togglePlayerStatus(player: any): void {
    const currentPlayer = this.gameData[this.currentPlayerCount];
    this.checkIfOneActivePlayer(player);

    if (!this.isOneActivePlayer) {
    }

    if (currentPlayer.player == player.player) {
      this.nextPlayer();
    }
  }

  generateNewRandomNumber() {
    let newNumber;
    do {
        newNumber = Math.floor(Math.random() * 20) + 1;
    } while (newNumber === this.randomNumber);

    this.randomNumber = newNumber;
}
}
