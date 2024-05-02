import { Component, EventEmitter, Input, NgZone, OnInit } from '@angular/core';
import { GameData } from '../interfaces/game-data.interface';
import { GameSettingsService } from '../services/game-settings/game-settings.service';
import { GameService } from '../services/game-service/game.service';

@Component({
  selector: 'app-dart-game-single-out',
  templateUrl: './dart-game-single-out.component.html',
  styleUrls: ['./dart-game-single-out.component.scss'],
})
export class DartGameSingleOutComponent implements OnInit {
  public gameData: GameData[] = [];

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
