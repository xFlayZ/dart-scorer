import { Injectable } from '@angular/core';
import { GameSettingsService } from '../game-settings/game-settings.service';
import confetti from 'canvas-confetti';

@Injectable({
  providedIn: 'root',
})
export class CelebrateService {
  constructor(private gameSettingsService: GameSettingsService) {}

  public celebrate(particleCount: number) {
    if (this.gameSettingsService.gameSettings.animationEnabled) {
      const duration = 5000; // in milliseconds

      confetti({
        particleCount: particleCount,
        spread: 320,
        origin: { y: 0.4 },
      });

      // Clear confetti after a certain duration
      setTimeout(() => confetti.reset(), duration);
    }
  }
}
