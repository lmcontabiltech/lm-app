import {
  Injectable,
  ComponentRef,
  ViewContainerRef,
  TemplateRef,
} from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { ModalCadastroComponent } from 'src/app/shared/modal/modal-cadastro/modal-cadastro.component';

@Injectable({ providedIn: 'root' })
export class ModalCadastroService {
  private outlet!: ViewContainerRef;
  private modalRef!: ComponentRef<ModalCadastroComponent>;

  registerOutlet(outlet: ViewContainerRef): void {
    this.outlet = outlet;
  }

  openModal(
    config?: Partial<ModalCadastroComponent>,
    onConfirm?: () => void,
    contentTemplate?: TemplateRef<any>
  ): void {
    if (!this.outlet) throw new Error('Outlet não registrado!');
    this.outlet.clear();

    this.modalRef = this.outlet.createComponent(ModalCadastroComponent);

    if (config) {
      Object.assign(this.modalRef.instance, config);
    }

    if (contentTemplate) {
      this.modalRef.instance.contentTemplate = contentTemplate;
    }

    this.modalRef.instance.closeModal.subscribe(() => {
      this.closeModal();
    });

    this.modalRef.instance.confirm.subscribe(() => {
      if (onConfirm) onConfirm();
      this.closeModal();
    });
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.destroy();
    }
  }
}
