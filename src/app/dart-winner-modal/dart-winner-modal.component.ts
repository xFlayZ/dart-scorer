import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dart-winner-modal',
  templateUrl: './dart-winner-modal.component.html',
  styleUrl: './dart-winner-modal.component.scss'
})
export class DartWinnerModalComponent {
  @Input() isOpen: boolean = false; // Input property to control modal visibility
  @Input() winner: string = 'Spieler';
  @Input() gameData: any[] = []; 
  @Output() closeModalEvent = new EventEmitter<void>(); // Event emitter for closing the modal

  closeModal() {
    this.closeModalEvent.emit(); // Emit event to close the modal
  }

  get sortedGameData() {
    return this.gameData.slice().sort((a, b) => b.wins - a.wins);
  }
}
