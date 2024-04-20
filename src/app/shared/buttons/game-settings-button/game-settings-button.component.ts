import { Component } from '@angular/core';
import { ModalService } from '../../../services/modal-service/modal.service';

@Component({
  selector: 'app-game-settings-button',
  templateUrl: './game-settings-button.component.html',
  styleUrl: './game-settings-button.component.scss',
})
export class GameSettingsButtonComponent {
  constructor(private modalService: ModalService) {}

  openSettingsModal() {
    this.modalService.openModal('gameSettingsModal');
  }
}
