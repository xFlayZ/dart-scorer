import { Component, Input, NgZone } from '@angular/core';
import { GameData } from '../../interfaces/game-data.interface';
import { GameSettingsService } from '../../services/game-settings/game-settings.service';
import { GameService } from '../../services/game-service/game.service';
import { CelebrateService } from '../../services/celebrate/celebrate.service';
import { SoundService } from '../../services/sound/sound.service';
import { CheckoutService } from '../../services/checkout/checkout.service';

@Component({
  selector: 'app-game-controls',
  templateUrl: './game-controls.component.html',
  styleUrl: './game-controls.component.scss',
})
export class GameControlsComponent {
  public currentPlayerCount = 0;
  public previousPlayerCount = 0;
  public playerCount = 0;
  public lastRoundScore = 0;

  public possibleCheckout = '-';

  public isLegEnd: boolean = false;
  public inRound = true;
  public winnerModalOpen = false;
  public isOneActivePlayer = true;

  @Input() scoreValue = '';

  @Input() public gameData: GameData[] = [];

  constructor(
    private ngZone: NgZone,
    private gameSettingsService: GameSettingsService,
    private gameService: GameService,
    private soundService: SoundService,
    private checkoutService: CheckoutService
  ) {}

  nextPlayer() {
    this.gameService.nextPlayer();
    this.isLegEnd = this.gameService.legEnd;
    this.winnerModalOpen = this.gameService.winnerModalOpen;
  }

  nextRound() {
    this.gameService.nextRound();
    this.isLegEnd = this.gameService.legEnd;
  }

  calculateCheckoutCurrentPlayer() {
    const currentPlayer = this.gameData[this.currentPlayerCount];
    const score = currentPlayer.score;
    let checkout = this.checkoutService.getCheckout(score);

    if (currentPlayer.thirdDart !== '-') {
      checkout = '';
    } else if (currentPlayer.secondDart !== '-') {
      checkout = this.checkoutService.getOneDartCheckout(score);
    } else if (currentPlayer.firstDart !== '-') {
      checkout = this.checkoutService.getTwoDartsCheckout(score);
    }

    this.possibleCheckout = checkout !== '' ? checkout : '-';
    localStorage.setItem('gameData', JSON.stringify(this.gameData));
  }

  playSound(path: string, sound: string): void {
    this.ngZone.run(() => {
      if (this.gameSettingsService.gameSettings.playSoundEnabled) {
        this.soundService.stopSound();
        this.soundService.playSound(`assets/sounds/${path}/${sound}.mp3`);
      }
    });
  }

  deleteLastDart() {
    this.gameService.deleteLastDart();
  }

  closeWinnerModal() {
    const currentPlayer = this.gameData[this.currentPlayerCount];
    currentPlayer.wins += 1;
    this.isLegEnd = true;
    this.winnerModalOpen = false;
    localStorage.setItem('gameData', JSON.stringify(this.gameData));
  }
}
