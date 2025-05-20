import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-atividade',
  templateUrl: './modal-atividade.component.html',
  styleUrls: ['./modal-atividade.component.css'],
})
export class ModalAtividadeComponent {
  @Input() atividade: any;
  @Input() size: string = 'xl:max-w-7xl';

  @Output() closeModal = new EventEmitter<void>();

  onModalClose() {
    this.closeModal.emit();
  }
}
