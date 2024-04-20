import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalStatuses: { [modalName: string]: BehaviorSubject<boolean> } = {};

  constructor() {}

  openModal(modalName: string) {
    if (!this.modalStatuses[modalName]) {
      this.modalStatuses[modalName] = new BehaviorSubject<boolean>(false);
    }
    this.modalStatuses[modalName].next(true);
  }

  closeModal(modalName: string) {
    if (this.modalStatuses[modalName]) {
      this.modalStatuses[modalName].next(false);
    }
  }

  isModalOpen(modalName: string): Observable<boolean> {
    if (!this.modalStatuses[modalName]) {
      this.modalStatuses[modalName] = new BehaviorSubject<boolean>(false);
    }
    return this.modalStatuses[modalName].asObservable();
  }
}
