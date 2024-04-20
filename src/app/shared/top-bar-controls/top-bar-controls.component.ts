import { Component, EventEmitter } from '@angular/core';
import { VoiceToTextService } from '../../services/voice-to-text.service';

@Component({
  selector: 'app-top-bar-controls',
  templateUrl: './top-bar-controls.component.html',
  styleUrl: './top-bar-controls.component.scss'
})
export class TopBarControlsComponent {
  public isSettingsModalOpen = false;
  public speakToTextEnabled = true;
  public playSoundEnabled = true;
  public animationEnabled = true;
  public voiceToTextEnabled = false;

  closeModalEvent = new EventEmitter<void>();

  constructor(private voiceToTextService: VoiceToTextService) {}

  openSettingsModal() {
    this.loadSettingsFromLocalStorage();
    this.isSettingsModalOpen = true;
  }

  closeSettingsModal() {
    this.closeModalEvent.emit();
    this.isSettingsModalOpen = false;
  }

  toggleSpeakToTextEnabled(): void {
    this.speakToTextEnabled = !this.speakToTextEnabled;
    localStorage.setItem('speakToTextEnabled', String(this.speakToTextEnabled));
  }

  
  togglePlaySoundEnabled(): void {
    this.playSoundEnabled = !this.playSoundEnabled;
    localStorage.setItem('playSoundEnabled', String(this.playSoundEnabled));
  }
  

  toggleAnimationEnabled(): void {
    this.animationEnabled = !this.animationEnabled;
    localStorage.setItem('animationEnabled', String(this.animationEnabled));
  }

  toggleVoiceToTextEnabled(): void {
    this.voiceToTextEnabled = !this.voiceToTextEnabled;
    if (this.voiceToTextEnabled) {
      // add startVoice later
    } else {
      this.stopScoreToVoice();
    }
    localStorage.setItem('voiceToTextEnabled', String(this.voiceToTextEnabled));
  }

  stopScoreToVoice() {
    if (this.voiceToTextEnabled) {
      this.voiceToTextService.stopListening();
    }
  }
  

  loadSettingsFromLocalStorage(): void {
    const speakToTextEnabled = localStorage.getItem('speakToTextEnabled');
    if (speakToTextEnabled !== null) {
      this.speakToTextEnabled = speakToTextEnabled === 'true';
    }
  
    const playSoundEnabled = localStorage.getItem('playSoundEnabled');
    if (playSoundEnabled !== null) {
      this.playSoundEnabled = playSoundEnabled === 'true';
    }
  
    const animationEnabled = localStorage.getItem('animationEnabled');
    if (animationEnabled !== null) {
      this.animationEnabled = animationEnabled === 'true';
    }

    const voiceToTextEnabled = localStorage.getItem('voiceToTextEnabled');
    if (voiceToTextEnabled !== null) {
      this.voiceToTextEnabled = voiceToTextEnabled === 'true';
    }
  }

}
