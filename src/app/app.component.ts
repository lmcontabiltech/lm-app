import {
  Component,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
} from '@angular/core';
import { ThemeService } from './services/modo-escuro/theme.service';
import { ModalService } from './services/modalDeletar.service';

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
    private modalService: ModalService
  ) {
    // O serviço será inicializado automaticamente pelo Angular
  }

  ngAfterViewInit(): void {
    this.modalService.registerOutlet(this.modalOutlet);
  }
}
