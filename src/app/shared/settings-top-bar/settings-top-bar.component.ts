import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-settings-top-bar',
  templateUrl: './settings-top-bar.component.html',
  styleUrls: ['./settings-top-bar.component.scss'],
})
export class SettingsTopBarComponent {
  isModalOpen: boolean = false;

  @Input() resetRoundButtonEnabled: boolean = false;
  @Input() resetGameButtonEnabled: boolean = false;
  @Input() gameModeTitle: string = 'PeiDu Scorer';

  @Output() resetRound = new EventEmitter<boolean>();
  @Output() resetGame = new EventEmitter<boolean>();
  @Output() countButtonsEnabled = new EventEmitter<boolean>();
  @Output() settingsChanged = new EventEmitter<{ [key: string]: boolean }>();

  settingsOptions = [
    { label: 'Sprachansagen', key: 'speakToTextEnabled' },
    { label: 'Spielsounds', key: 'playSoundEnabled' },
    { label: 'Effekte', key: 'animationEnabled' },
    { label: 'Sprachsteuerung', key: 'voiceToTextEnabled' },
    { label: 'Buttonzähler', key: 'countButtonsEnabled' },
  ];

  settings: { [key: string]: boolean } = {};

  constructor() {
    this.loadSettings();
  }

  toggleModal(): void {
    this.isModalOpen = !this.isModalOpen;
  }

  updateSettings(): void {
    localStorage.setItem('dartSettings', JSON.stringify(this.settings));
    this.settingsChanged.emit(this.settings);
  }

  loadSettings(): void {
    const savedSettings = localStorage.getItem('dartSettings');
    if (savedSettings) {
      this.settings = JSON.parse(savedSettings);
    }
  }

  // buttons

  onResetRound() {
    this.resetRound.emit(true);
  }

  onResetGame() {
    this.resetGame.emit(true);
  }

}
