import { Component, Input, NgZone, OnInit } from '@angular/core';
import { GameData } from '../interfaces/game-data.interface';
import { shuffleArray } from '../helpers';
import { GameService } from '../services/gameServices/game.service';
import { CheckoutService } from '../services/checkout.service';

@Component({
  selector: 'app-dart-game-single-out',
  templateUrl: './dart-game-single-out.component.html',
  styleUrls: ['./dart-game-single-out.component.scss'],
})
export class DartGameSingleOutComponent implements OnInit {
  public currentPlayer: number = 0;
  public playerCount = 0;

  public players: string[] = [];
  public scoreValue = '';

  public winnerModalOpen = false;

  public waitingPlayerGameData: GameData[] = [];
  public gameData: GameData[] = [];

  public undoLastActionEnabled = false;
  public lastActivePlayer = false;

  public checkoutFirstDart = '';
  public checkoutSecondDart = '';
  public checkoutThirdDart = '';

  public savedSettings?: { [key: string]: boolean };
  public countButtonEnabled = false;

  constructor(
    public gameService: GameService,
    private checkoutService: CheckoutService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.setupGame();
    const savedSettings = localStorage.getItem('dartSettings');
    this.savedSettings = savedSettings ? JSON.parse(savedSettings) : undefined;

    if (this.savedSettings) {
      this.countButtonEnabled = this.savedSettings['countButtonsEnabled'];
     }
  }

  setupGame() {
    const savedData = localStorage.getItem('gameStartedData');
    if (savedData) {
      const { players, scoreValue } = JSON.parse(savedData);
      this.players = players;
      this.scoreValue = scoreValue;
    }

    const scoreValueNum = parseInt(this.scoreValue, 10);
    const shuffledPlayers = shuffleArray(this.players);

    this.gameData = shuffledPlayers.map((player) => ({
      player: player.name,
      isActive: true,
      winnerSong: player.winnerSong,
      gameHighscore: 0,
      gameAverage: 0,
      wins: 0,
      round: 0,
      score: scoreValueNum,
      firstDart: '-',
      secondDart: '-',
      thirdDart: '-',
      game: 0,
      roundHighscore: 0,
      roundHistory: [],
    }));

    this.playerCount = this.players.length - 1;
    localStorage.setItem('gameData', JSON.stringify(this.gameData));

    this.gameData[this.currentPlayer].round = 1;

    this.generateWaitingPlayerList();
  }

  nextPlayer() {
    this.ngZone.run(() => {
      // before change player

      let currentPlayer = this.gameData[this.currentPlayer];

      if (currentPlayer.score != 0) {
        if (
          currentPlayer.roundHighscore <
          this.gameService.calculateLastThrownSum(currentPlayer)
        ) {
          currentPlayer.roundHighscore =
            this.gameService.calculateLastThrownSum(currentPlayer);

          if (currentPlayer.gameHighscore < currentPlayer.roundHighscore) {
            currentPlayer.gameHighscore = currentPlayer.roundHighscore;
          }
        }

        if (currentPlayer.score < 0) {
          this.deleteLastDart();
          this.deleteLastDart();
          this.deleteLastDart();
        } else {
          if (currentPlayer.firstDart !== '-') {
            currentPlayer.roundHistory.push(currentPlayer.firstDart);
          }
          if (currentPlayer.secondDart !== '-') {
            currentPlayer.roundHistory.push(currentPlayer.secondDart);
          }
          if (currentPlayer.thirdDart !== '-') {
            currentPlayer.roundHistory.push(currentPlayer.thirdDart);
          }
        }

        // change player

        if (this.currentPlayer != this.gameData.length - 1) {
          this.currentPlayer += 1;
        } else {
          this.currentPlayer = 0;
        }

        // next player

        this.generateWaitingPlayerList();

        currentPlayer = this.gameData[this.currentPlayer];

        if (!currentPlayer.isActive) {
          this.nextPlayer();
        }

        currentPlayer.firstDart = '-';
        currentPlayer.secondDart = '-';
        currentPlayer.thirdDart = '-';
        currentPlayer.round += 1;

        this.calculateCheckoutCurrentPlayer();

        localStorage.setItem('gameData', JSON.stringify(this.gameData));
      }

      if (currentPlayer.score === 0) {
        if (currentPlayer.firstDart !== '-') {
          currentPlayer.roundHistory.push(currentPlayer.firstDart);
        }
        if (currentPlayer.secondDart !== '-') {
          currentPlayer.roundHistory.push(currentPlayer.secondDart);
        }
        if (currentPlayer.thirdDart !== '-') {
          currentPlayer.roundHistory.push(currentPlayer.thirdDart);
        }
        localStorage.setItem('gameData', JSON.stringify(this.gameData));
        this.winnerModalOpen = true;
        currentPlayer.wins += 1;
      }
    });
  }

  nextRound() {
    this.ngZone.run(() => {
      const scoreValueNum = parseInt(this.scoreValue, 10);

      if (this.gameData && this.gameData.length > 0) {
        const lastPlayer = this.gameData.shift();

        if (lastPlayer) {
          this.gameData.push(lastPlayer);
        }

        this.gameData.forEach((player) => {
          if (player) {
            player.firstDart = '-';
            player.secondDart = '-';
            player.thirdDart = '-';
            player.round = 1;
            player.roundHighscore = 0;
            player.roundHistory = [];
            player.score = scoreValueNum;
          }
        });

        if (this.gameData[0]) {
          this.gameData[0].game++;
        }

        this.playerCount = this.gameData.length - 1;
      }
      localStorage.setItem('gameData', JSON.stringify(this.gameData));

      const currentPlayer = this.gameData[this.currentPlayer];
      this.generateWaitingPlayerList();

      if (!currentPlayer.isActive) {
        this.nextPlayer();
      }
    });
  }

  deleteLastDart() {
    this.ngZone.run(() => {
      const currentPlayer = this.gameData[this.currentPlayer];

      const darts = ['thirdDart', 'secondDart', 'firstDart'];
      const filledDartIndex = darts.findIndex(
        (dart) =>
          typeof currentPlayer[dart] === 'string' && currentPlayer[dart] !== '-'
      );

      if (filledDartIndex !== -1) {
        const score = currentPlayer[darts[filledDartIndex]] as string;
        const multiplier = score.charAt(0);
        const number =
          multiplier === 'T' || multiplier === 'D' ? score.slice(1) : score;
        const multiplierFactor =
          multiplier === 'T' ? 3 : multiplier === 'D' ? 2 : 1;

        currentPlayer.score += parseInt(number) * multiplierFactor;
        currentPlayer[darts[filledDartIndex]] = '-';
        this.calculateCheckoutCurrentPlayer();
      }
      localStorage.setItem('gameData', JSON.stringify(this.gameData));
    });
  }

  onThrownNumberChange(thrownNumber: string) {
    const currentPlayer = this.gameData[this.currentPlayer];
    const darts = ['firstDart', 'secondDart', 'thirdDart'];
    const emptyDartIndex = darts.findIndex(
      (dart) => currentPlayer[dart] === '-'
    );

    if (emptyDartIndex !== -1) {
      this.calcScore(thrownNumber);
      currentPlayer[darts[emptyDartIndex]] = thrownNumber;
      this.calculateCheckoutCurrentPlayer();

      if (!this.undoLastActionEnabled) {
        this.undoLastActionEnabled = true;
      }

      if (emptyDartIndex === 2 || currentPlayer.score <= 0) {
        this.nextPlayer();
      }
    }
  }

  calcScore(thrownNumber: string) {
    const multiplier = thrownNumber.charAt(0);
    const number =
      multiplier === 'T' || multiplier === 'D'
        ? thrownNumber.slice(1)
        : thrownNumber;
    const multiplierFactor =
      multiplier === 'T' ? 3 : multiplier === 'D' ? 2 : 1;
    const score = parseInt(number) * multiplierFactor;

    this.gameData[this.currentPlayer].score -= score;
    localStorage.setItem('gameData', JSON.stringify(this.gameData));
  }

  generateWaitingPlayerList() {
    this.waitingPlayerGameData = this.gameService.generateWaitingPlayerList(
      this.gameData,
      this.currentPlayer
    );
  }

  undoLastAction() {
    // get currentPlayer
    let currentPlayer = this.gameData[this.currentPlayer];
    const lastPossiblePlayer = this.gameData.length - 1;

    if (currentPlayer.firstDart != '-') {
      this.deleteLastDart();
      if (currentPlayer.firstDart === '-') {
        if (this.currentPlayer === 0) {
          if (this.gameData[lastPossiblePlayer].round === 0) {
            this.undoLastActionEnabled = false;
          }
        }
      }
    } else if (currentPlayer.firstDart === '-') {
      if (this.currentPlayer === 0) {
        if (this.gameData[lastPossiblePlayer].round > 0) {
          if (currentPlayer.thirdDart === '-') {
            this.gameData[this.currentPlayer].thirdDart =
              currentPlayer.roundHistory[currentPlayer.roundHistory.length - 1];
            this.gameData[this.currentPlayer].secondDart =
              currentPlayer.roundHistory[currentPlayer.roundHistory.length - 2];
            this.gameData[this.currentPlayer].firstDart =
              currentPlayer.roundHistory[currentPlayer.roundHistory.length - 3];
            localStorage.setItem('gameData', JSON.stringify(this.gameData));
            this.currentPlayer = lastPossiblePlayer;
            currentPlayer = this.gameData[this.currentPlayer];
            this.generateWaitingPlayerList();
          } else {
            this.currentPlayer = lastPossiblePlayer;
            currentPlayer = this.gameData[this.currentPlayer];
            this.generateWaitingPlayerList();
            if (currentPlayer.thirdDart != '-') {
              currentPlayer.roundHistory.splice(-3);
            } else if (currentPlayer.secondDart != '-') {
              currentPlayer.roundHistory.splice(-2);
            } else if (currentPlayer.firstDart != '-') {
              currentPlayer.roundHistory.splice(-1);
            }
          }
          this.deleteLastDart();
        }
      } else {
        this.currentPlayer = this.currentPlayer - 1;
        currentPlayer = this.gameData[this.currentPlayer];
        this.generateWaitingPlayerList();
        if (currentPlayer.thirdDart != '-') {
          currentPlayer.roundHistory.splice(-3);
        } else if (currentPlayer.secondDart != '-') {
          currentPlayer.roundHistory.splice(-2);
        } else if (currentPlayer.firstDart != '-') {
          currentPlayer.roundHistory.splice(-1);
        }
        this.deleteLastDart();
      }
    }
    localStorage.setItem('gameData', JSON.stringify(this.gameData));
  }

  calculateCheckoutCurrentPlayer() {
    const currentPlayer = this.gameData[this.currentPlayer];
    const score = currentPlayer.score;
    let checkoutResultString = this.checkoutService.getCheckout(score);
    let checkoutResults = checkoutResultString
      .split(',')
      .map((result) => result.trim());

    // Initialisiere die checkout Variablen als leere Strings, um sicherzustellen, dass wir immer gültige Werte setzen.
    this.checkoutFirstDart = '';
    this.checkoutSecondDart = '';
    this.checkoutThirdDart = '';

    // Setze die Werte basierend darauf, ob die Darts bereits geworfen wurden oder nicht.
    if (currentPlayer.firstDart === '-') {
      this.checkoutFirstDart = checkoutResults[0] || '';
      this.checkoutSecondDart = checkoutResults[1] || '';
      this.checkoutThirdDart = checkoutResults[2] || '';
    } else if (currentPlayer.secondDart === '-') {
      checkoutResultString = this.checkoutService.getTwoDartsCheckout(score);
      checkoutResults = checkoutResultString
        .split(',')
        .map((result) => result.trim());
      this.checkoutSecondDart = checkoutResults[0] || '';
      this.checkoutThirdDart = checkoutResults[1] || '';
    } else if (currentPlayer.thirdDart === '-') {
      checkoutResultString = this.checkoutService.getOneDartCheckout(score);
      checkoutResults = checkoutResultString
        .split(',')
        .map((result) => result.trim());
      this.checkoutThirdDart = checkoutResults[0] || '';
    }

    // Speichere den aktualisierten Spielstand
    localStorage.setItem('gameData', JSON.stringify(this.gameData));
  }

  togglePlayerStatus(player: any): void {
    const currentPlayer = this.gameData[this.currentPlayer];
    this.checkLastActivePlayer(player);
    if (currentPlayer.player === player.player) {
      this.nextPlayer();
    }
  }

  checkLastActivePlayer(player: any) {
    player.isActive = !player.isActive;
    const activePlayersCount = this.gameData.filter(p => p.isActive).length;
    this.lastActivePlayer = (activePlayersCount === 1);
  }

  onResetGameChange(resetGame: boolean) {
    console.log('resetGame', resetGame);
  }

  onResetRoundChange(resetRound: boolean) {
    console.log('resetRound', resetRound);
  }

  closeWinnerModal() {
    this.winnerModalOpen = false;
    this.nextRound();
  }

  winnerModalUndoLastAction() {
    const currentPlayer = this.gameData[this.currentPlayer];
    currentPlayer.wins -= 1;
    this.winnerModalOpen = false;
    this.undoLastAction();
  }

  handleSettingsChange(newSettings: { [key: string]: boolean }) {
    this.savedSettings = newSettings;
    if (this.savedSettings) {
      this.countButtonEnabled = this.savedSettings['countButtonsEnabled'];
     }
  }
}
