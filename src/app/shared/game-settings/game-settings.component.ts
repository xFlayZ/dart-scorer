import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.scss'],
})
export class GameSettingsComponent {
  @Input() title: string = '';
  @Input() options: { backgroundImage: any; value: string; label: string }[] = [];
  @Input() selectedOption: string = ''; // Eingabe für die Bindung
  @Output() selectedOptionChange = new EventEmitter<string>(); // Ausgabe für die Bindung

  selectOption(option: string) {
    this.selectedOption = option;
    this.selectedOptionChange.emit(this.selectedOption); // Event auslösen
  }
}