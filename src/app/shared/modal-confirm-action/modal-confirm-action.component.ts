import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal-confirm-action',
  templateUrl: './modal-confirm-action.component.html',
  styleUrl: './modal-confirm-action.component.scss'
})
export class ModalConfirmActionComponent {
  @Input() isOpen: boolean = false; 
  @Input() modalMessage: string = "";
  @Input() player: any;
  @Output() closeModalEvent = new EventEmitter<void>(); 

  closeModal() {
    this.closeModalEvent.emit();
    this.isOpen = false;
  }

  openModal() {
    this.isOpen = true;
  }

  confirmAction() {
    console.log("Bestätigt")
  }
}
