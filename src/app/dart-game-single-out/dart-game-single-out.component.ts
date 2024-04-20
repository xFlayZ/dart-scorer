import { Component, EventEmitter, Input, NgZone, OnInit } from '@angular/core';
import { CheckoutService } from '../services/checkout/checkout.service';
import { GameData } from '../interfaces/game-data.interface';
import { TextToSpeechService } from '../services/text-to-speech/text-to-speech.service';
import { SoundService } from '../services/sound/sound.service';
import confetti from 'canvas-confetti';
import { VoiceToTextService } from '../services/voice-to-text/voice-to-text.service';
import { GameSettingsService } from '../services/game-settings/game-settings.service';
import { GameService } from '../services/game-service/game.service';

@Component({
  selector: 'app-dart-game-single-out',
  templateUrl: './dart-game-single-out.component.html',
  styleUrls: ['./dart-game-single-out.component.scss'],
})
export class DartGameSingleOutComponent implements OnInit {
  public gameData: GameData[] = [];
  public playerCount = 0;
  public currentPlayerCount = 0;
  public previousPlayerCount = 0;
  public lastRoundScore = 0;
  public lastThrownNumber = '-';
  public possibleCheckout = '-';
  public inRound = true;
  public legEnd = false;
  public isOneActivePlayer = true;

  @Input() players: string[] = [];
  @Input() scoreValue = '';

  constructor(
    private gameSettingsService: GameSettingsService,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.gameSettingsService.loadSettings();
    this.gameService.setupGame();
    this.gameData = this.gameService.gameData;
  }

  onThrownNumberChange(thrownNumber: string) {
    this.gameService.onThrownNumberChange(thrownNumber);
  }
}
