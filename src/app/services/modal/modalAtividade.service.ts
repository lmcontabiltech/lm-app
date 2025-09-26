import { Injectable, ComponentRef, ViewContainerRef } from '@angular/core';
import { ModalAtividadeComponent } from '../../shared/modal/modal-atividade/modal-atividade.component';

@Injectable({ providedIn: 'root' })
export class ModalAtividadeService {
  private outlet!: ViewContainerRef;
  private modalRef!: ComponentRef<ModalAtividadeComponent>;

  registerOutlet(outlet: ViewContainerRef): void {
    this.outlet = outlet;
  }

  openModal(
    config?: Partial<ModalAtividadeComponent>,
    editarAtividade?: (id: string) => void,
    deletarAtividade?: (id: string) => void,
    copiarAtividade?: (atividade: any) => void
  ): void {
    if (!this.outlet) throw new Error('Outlet não registrado!');
    this.outlet.clear();

    this.modalRef = this.outlet.createComponent(ModalAtividadeComponent);

    if (config) {
      Object.assign(this.modalRef.instance, config);
    }

    if (editarAtividade) {
      this.modalRef.instance.editarAtividade.subscribe(editarAtividade);
    }

    if (deletarAtividade) {
      this.modalRef.instance.deletarAtividade.subscribe(deletarAtividade);
    }

    if (copiarAtividade) {
      this.modalRef.instance.copiarAtividade.subscribe(copiarAtividade);
    }

    this.modalRef.instance.closeModal.subscribe(() => {
      this.closeModal();
    });
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.destroy();
    }
  }
}
