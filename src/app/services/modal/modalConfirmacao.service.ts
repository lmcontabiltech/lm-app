import { Injectable, ComponentRef, ViewContainerRef } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { ModalPadraoComponent } from '../../shared/modal-padrao/modal-padrao.component';

@Injectable({ providedIn: 'root' })
export class ModalPadraoService {
  private outlet!: ViewContainerRef;
  private modalRef!: ComponentRef<ModalPadraoComponent>;

  registerOutlet(outlet: ViewContainerRef): void {
    this.outlet = outlet;
  }

  openModal(
    config?: Partial<ModalPadraoComponent>,
    onConfirmAcao?: () => void
  ): void {
    if (!this.outlet) throw new Error('Outlet não registrado!');
    this.outlet.clear();

    this.modalRef = this.outlet.createComponent(ModalPadraoComponent);

    if (config) {
      Object.assign(this.modalRef.instance, config);
    }

    this.modalRef.instance.closeModal.subscribe(() => {
      this.closeModal();
    });

    this.modalRef.instance.confirmAcao.subscribe(() => {
      if (onConfirmAcao) onConfirmAcao();
      this.closeModal();
    });
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.destroy();
    }
  }
}
