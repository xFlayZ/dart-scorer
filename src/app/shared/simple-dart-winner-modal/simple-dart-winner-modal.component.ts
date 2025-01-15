import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameData } from '../../interfaces/game-data.interface';
import { GameService } from '../../services/gameServices/game.service';

@Component({
  selector: 'app-simple-dart-winner-modal',
  templateUrl: './simple-dart-winner-modal.component.html',
  styleUrl: './simple-dart-winner-modal.component.scss'
})
export class SimpleDartWinnerModalComponent {
  @Input() isOpen: boolean = false; // Input property to control modal visibility
  @Input() winner: string = 'Spieler';
  @Output() undoLastActionEvent = new EventEmitter<void>(); 
  @Output() closeModalEvent = new EventEmitter<void>(); // Event emitter for closing the modal

  constructor(public gameService: GameService) {}

  closeModal() {
    this.closeModalEvent.emit(); // Emit event to close the modal
  }

  onUndoLastAction() {
    this.undoLastActionEvent.emit(); // Emit event to close the modal
  }
}
