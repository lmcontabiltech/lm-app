import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-padrao',
  templateUrl: './modal-padrao.component.html',
  styleUrls: ['./modal-padrao.component.css'],
})
export class ModalPadraoComponent {
  @Input() title: string = 'Concluir ação';
  @Input() description: string = 'Tem certeza que deseja efetuar a ação?';
  @Input() item: any;
  @Input() confirmTextoBotao: string = 'Confirmar';
  @Input() size: string = 'xl:max-w-7xl';

  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmAcao = new EventEmitter<void>();

  onModalClose() {
    this.closeModal.emit();
  }

  confirmarAcao(): void {
    this.confirmAcao.emit();
  }
}
