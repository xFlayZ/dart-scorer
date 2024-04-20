import { Component, Input, OnInit } from '@angular/core';
import { GameData } from '../../interfaces/game-data.interface';
import { GameSettingsService } from '../../services/game-settings/game-settings.service';

@Component({
  selector: 'app-game-player-card',
  templateUrl: './game-player-card.component.html',
  styleUrl: './game-player-card.component.scss',
})
export class GamePlayerCardComponent implements OnInit {
  public currentPlayerCount = 0;
  public previousPlayerCount = 0;
  public possibleCheckout = '-';

  @Input() public gameData: GameData[] = [];
  @Input() public legEnd: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  updateDartValue(dartType: string) {
    console.log('updateDartValue', dartType);

    /*
    const currentPlayer = this.gameData[this.currentPlayerCount];
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
    */
  }

  backToLastPlayer() {
    console.log('backToLastPlayer');

    /*
    // delete last darts currentPlayer
    this.deleteLastDart();
    this.deleteLastDart();
    this.deleteLastDart();

    // go back to last player
    this.currentPlayerCount = this.previousPlayerCount;

    // get currentPlayer
    const currentPlayer = this.gameData[this.currentPlayerCount];

    // remove round
    currentPlayer.round -= 1;

    // set inRound false
    this.inRound = false;*/
  }
}
