import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dart-count-buttons',
  templateUrl: './dart-count-buttons.component.html',
  styleUrl: './dart-count-buttons.component.scss'
})
export class DartCountButtonsComponent {
  numbers: number[] = Array.from({ length: 20 }, (_, i) => i + 1);

  @Output() thrownNumber = new EventEmitter<string>();
  
    count(number: string) {
        this.thrownNumber.emit(number);
    }
}
