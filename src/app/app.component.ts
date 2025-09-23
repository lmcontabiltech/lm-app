import {
  Component,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
} from '@angular/core';
import { ThemeService } from './services/modo-escuro/theme.service';
import { ModalDeleteService } from './services/modal/modalDeletar.service';
import { ModalAtividadeService } from './services/modal/modalAtividade.service';
import { ModalPadraoService } from './services/modal/modalConfirmacao.service';
import { ModalCadastroService } from './services/modal/modal-cadastro.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'lm-app';

  @ViewChild('modalOutlet', { read: ViewContainerRef, static: true })
  modalOutlet!: ViewContainerRef;

  constructor(
    private themeService: ThemeService,
    private modalDeleteService: ModalDeleteService,
    private modalAtividadeService: ModalAtividadeService,
    private modalPadraoService: ModalPadraoService,
    private modalCadastroService: ModalCadastroService
  ) {
    // O serviço será inicializado automaticamente pelo Angular
  }

  ngAfterViewInit(): void {
    this.modalDeleteService.registerOutlet(this.modalOutlet);
    this.modalAtividadeService.registerOutlet(this.modalOutlet);
    this.modalPadraoService.registerOutlet(this.modalOutlet);
    this.modalCadastroService.registerOutlet(this.modalOutlet);
  }
}
