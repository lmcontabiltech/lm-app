import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-modal-cadastro',
  templateUrl: './modal-cadastro.component.html',
  styleUrls: ['./modal-cadastro.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalCadastroComponent implements OnInit {
  @Input() title: string = 'Cadastro';
  @Input() description: string = '';
  @Input() size: string = 'xl:max-w-7xl';
  @Input() confirmTextoBotao: string = 'Salvar';
  @Input() cancelTextoBotao: string = 'Cancelar';
  @Input() contentTemplate?: TemplateRef<any>;

  @Output() closeModal = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  onModalClose() {
    this.closeModal.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
  }
}
