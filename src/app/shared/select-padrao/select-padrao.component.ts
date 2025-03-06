import { Component, OnInit, Input, HostListener, Output, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'app-select-padrao',
  templateUrl: './select-padrao.component.html',
  styleUrls: ['./select-padrao.component.css'],
})
export class SelectPadraoComponent {
  @Input() label: string = '';
  @Input() options: { value: string, description: string }[] = [];
  @Input() selectedValue: string = '';
  @Output() selectedValueChange = new EventEmitter<string>();
  @Input() customStyles: { [key: string]: string } = {};

  isOpen: boolean = false;

  constructor(private elementRef: ElementRef) {}

  onSelect(option: { value: string, description: string }) {
    this.selectedValue = option.value;
    this.selectedValueChange.emit(this.selectedValue);
    this.isOpen = false;
  }

  getSelectedDescription(): string {
    const selectedOption = this.options.find(option => option.value === this.selectedValue);
    return selectedOption ? selectedOption.description : '';
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
