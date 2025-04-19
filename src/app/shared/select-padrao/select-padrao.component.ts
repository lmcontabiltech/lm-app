import { Component, OnInit, Input, HostListener, Output, EventEmitter, ElementRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select-padrao',
  templateUrl: './select-padrao.component.html',
  styleUrls: ['./select-padrao.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectPadraoComponent),
      multi: true,
    },
  ],
})
export class SelectPadraoComponent {
  @Input() label: string = '';
  @Input() options: { value: string, description: string }[] = [];
  @Input() selectedValue: string = '';
  @Output() selectedValueChange = new EventEmitter<string>();
  @Input() customStyles: { [key: string]: string } = {};

  isOpen: boolean = false;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef) {}

  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

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
