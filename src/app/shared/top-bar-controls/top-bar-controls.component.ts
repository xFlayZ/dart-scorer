import { Component, EventEmitter } from '@angular/core';
import { VoiceToTextService } from '../../services/voice-to-text.service';
import { GameSettingsService } from '../../services/game-settings/game-settings.service';
import { GameSettings } from '../../interfaces/game-settings.interface';

@Component({
  selector: 'app-top-bar-controls',
  templateUrl: './top-bar-controls.component.html',
  styleUrl: './top-bar-controls.component.scss',
})
export class TopBarControlsComponent {
  public isSettingsModalOpen = false;
  public gameSettings: GameSettings;

  closeModalEvent = new EventEmitter<void>();

  constructor(
    private voiceToTextService: VoiceToTextService,
    private gameSettingsService: GameSettingsService
  ) {
    this.gameSettings = this.gameSettingsService.gameSettings;
  }

  openSettingsModal() {
    this.isSettingsModalOpen = true;
  }

  closeSettingsModal() {
    this.closeModalEvent.emit();
    this.gameSettingsService.loadSettings();
    this.gameSettings = this.gameSettingsService.gameSettings;
    this.isSettingsModalOpen = false;
  }

  toggleSpeakToTextEnabled(): void {
    this.gameSettings.speakToTextEnabled =
      !this.gameSettings.speakToTextEnabled;
    this.gameSettingsService.saveSettings();
  }

  togglePlaySoundEnabled(): void {
    this.gameSettings.playSoundEnabled = !this.gameSettings.playSoundEnabled;
    this.gameSettingsService.saveSettings();
  }

  toggleAnimationEnabled(): void {
    this.gameSettings.animationEnabled = !this.gameSettings.animationEnabled;
    this.gameSettingsService.saveSettings();
  }

  toggleVoiceToTextEnabled(): void {
    this.gameSettings.voiceToTextEnabled =
      !this.gameSettings.voiceToTextEnabled;
    if (!this.gameSettings.voiceToTextEnabled) {
      this.stopScoreToVoice();
    }
    this.gameSettingsService.saveSettings();
  }

  stopScoreToVoice() {
    if (this.gameSettings.voiceToTextEnabled) {
      this.voiceToTextService.stopListening();
    }
  }
}
