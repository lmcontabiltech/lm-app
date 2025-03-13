import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-geral',
  templateUrl: './modal-geral.component.html',
  styleUrls: ['./modal-geral.component.css'],
})
export class ModalGeralComponent {
  @Input() show: boolean = false;
  @Input() title: string = 'Modal';
  @Input() size: string = 'xl:max-w-7xl';
  @Input() footer: boolean = true;

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveModal = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  handleSave(): void {
    this.saveModal.emit();
  }

  onModalClose(): void {
    this.closeModal.emit();
  }
}
