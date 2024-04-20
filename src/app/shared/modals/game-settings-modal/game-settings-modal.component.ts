import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { GameSettings } from '../../../interfaces/game-settings.interface';
import { GameSettingsService } from '../../../services/game-settings/game-settings.service';
import { VoiceToTextService } from '../../../services/voice-to-text/voice-to-text.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../../services/modal-service/modal.service';

@Component({
  selector: 'app-game-settings-modal',
  templateUrl: './game-settings-modal.component.html',
  styleUrl: './game-settings-modal.component.scss',
})
export class GameSettingsModalComponent implements OnInit {
  public modalName: string = 'gameSettingsModal';
  public gameSettings: GameSettings;
  public isSettingsModalOpen = false;
  private modalSubscription: Subscription;

  closeModalEvent = new EventEmitter<void>();

  constructor(
    private modalService: ModalService,
    private voiceToTextService: VoiceToTextService,
    private gameSettingsService: GameSettingsService
  ) {
    this.modalSubscription = this.modalService
      .isModalOpen(this.modalName)
      .subscribe((isOpen) => {
        this.isSettingsModalOpen = isOpen;
      });
    this.gameSettings = this.gameSettingsService.gameSettings;
  }

  ngOnInit(): void {
    this.gameSettings = this.gameSettingsService.gameSettings;
  }

  ngOnDestroy() {
    this.modalSubscription.unsubscribe();
  }

  closeSettingsModal() {
    if (!this.gameSettings.voiceToTextEnabled) {
      this.stopScoreToVoice();
    }

    this.modalService.closeModal(this.modalName);
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
    this.gameSettingsService.saveSettings();
  }

  stopScoreToVoice() {
    if (this.gameSettings.voiceToTextEnabled) {
      this.voiceToTextService.stopListening();
    }
  }
}
