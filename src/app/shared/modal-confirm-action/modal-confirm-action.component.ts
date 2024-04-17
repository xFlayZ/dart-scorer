import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal-confirm-action',
  templateUrl: './modal-confirm-action.component.html',
  styleUrl: './modal-confirm-action.component.scss'
})
export class ModalConfirmActionComponent {
  @Input() public actionMessage: string = "";
}
