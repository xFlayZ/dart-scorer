import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { GameData } from '../../interfaces/game-data.interface';
import { GameService } from '../../services/game-service/game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-player-card',
  templateUrl: './game-player-card.component.html',
  styleUrl: './game-player-card.component.scss',
})
export class GamePlayerCardComponent implements OnInit, OnDestroy {
  public currentPlayerCount = 0;
  public previousPlayerCount = 0;

  currentPlayerCountSubscription!: Subscription;
  previousPlayerCountSubscription!: Subscription;

  public possibleCheckout = '-';
  public lastThrownNumber = '-';

  @Input() public gameData: GameData[] = [];
  @Input() public legEnd: boolean = false;

  constructor(public gameService: GameService) {}

  ngOnInit(): void {
    this.currentPlayerCountSubscription =
      this.gameService.currentPlayerCount$.subscribe((count) => {
        this.currentPlayerCount = count;
      });

    this.previousPlayerCountSubscription =
      this.gameService.previousPlayerCount$.subscribe((count) => {
        this.previousPlayerCount = count;
      });
  }

  ngOnDestroy(): void {
    if (this.currentPlayerCountSubscription) {
      this.currentPlayerCountSubscription.unsubscribe();
    }
  }

  updateDartValue(dartType: string) {
    const currentPlayer = this.gameData[this.gameService.playerCount];
    if (currentPlayer[dartType] != '-') {
      let updateDartValue = '-';

      if (dartType == 'firstDart') {
        updateDartValue = currentPlayer.firstDart;
      } else if (dartType == 'secondDart') {
        updateDartValue = currentPlayer.secondDart;
      } else if (dartType == 'thirdDart') {
        updateDartValue = currentPlayer.thirdDart;
      }

      let multiplier = updateDartValue.charAt(0);
      let number =
        multiplier === 'T' || multiplier === 'D'
          ? updateDartValue.slice(1)
          : updateDartValue;
      let multiplierFactor =
        multiplier === 'T' ? 3 : multiplier === 'D' ? 2 : 1;
      let score = parseInt(number) * multiplierFactor;

      currentPlayer.roundTotal -= score;
      currentPlayer.score += score;

      multiplier = this.lastThrownNumber.charAt(0);
      number =
        multiplier === 'T' || multiplier === 'D'
          ? this.lastThrownNumber.slice(1)
          : this.lastThrownNumber;
      multiplierFactor = multiplier === 'T' ? 3 : multiplier === 'D' ? 2 : 1;
      score = parseInt(number) * multiplierFactor;

      currentPlayer.roundTotal += score;
      currentPlayer.score -= score;

      currentPlayer[dartType] = this.lastThrownNumber;
      localStorage.setItem('gameData', JSON.stringify(this.gameData));
    }
  }

  backToLastPlayer() {
    // delete last darts currentPlayer
    this.gameService.deleteLastDart();
    this.gameService.deleteLastDart();
    this.gameService.deleteLastDart();

    // go back to last player
    this.currentPlayerCount = this.previousPlayerCount;

    // get currentPlayer
    const currentPlayer = this.gameData[this.currentPlayerCount];

    // remove round
    currentPlayer.round -= 1;

    // set inRound false
    this.gameService.inRound = false;
  }
}
