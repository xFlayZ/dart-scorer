import { Injectable } from '@angular/core';
import { GameSettings } from '../../interfaces/game-settings.interface';

@Injectable({
  providedIn: 'root'
})
export class GameSettingsService {

  gameSettings: GameSettings = {
    speakToTextEnabled: true,
    playSoundEnabled: true,
    animationEnabled: true,
    voiceToTextEnabled: false
  };

  constructor() { }

  loadSettings(): void {
    const storedSettingsString = localStorage.getItem('gameSettings');
    if (storedSettingsString) {
      this.gameSettings = JSON.parse(storedSettingsString);
    }
  }

  saveSettings(): void {
    localStorage.setItem('gameSettings', JSON.stringify(this.gameSettings));
  }
}
