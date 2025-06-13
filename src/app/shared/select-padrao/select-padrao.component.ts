import {
  Component,
  OnInit,
  Input,
  HostListener,
  Output,
  EventEmitter,
  ElementRef,
  forwardRef,
} from '@angular/core';
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
  @Input() showDefaultOption: boolean = false;
  @Input() label: string = '';
  @Input() options: { value: string; description: string }[] = [];
  @Input() selectedValue: string = '';
  @Output() selectedValueChange = new EventEmitter<string>();
  @Input() customStyles: { [key: string]: string } = {};
  @Input() disabled: boolean = false;
  @Input() defaultLabel: string = 'Todos';
  @Input() defaultValue: any = '';

  isOpen: boolean = false;
  onChange = (value: string) => {};
  onTouched = () => {};
  value: string = '';
  filteredOptions: { value: string; description: string }[] = [];
  searchText: string = '';
  searchTimeout: any;
  highlightedValue: string = '';

  constructor(private elementRef: ElementRef) {}

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelect(option: { value: string; description: string }) {
    this.selectedValue = option.value;
    this.value = option.value;
    this.onChange(this.value);
    this.onTouched();
    this.selectedValueChange.emit(this.selectedValue);
    this.isOpen = false;
  }

  getSelectedDescription(): string {
    const selectedOption = this.options.find(
      (option) => option.value === this.selectedValue
    );
    return selectedOption ? selectedOption.description : '';
  }

  onSelectDefault() {
    this.selectedValue = this.defaultValue;
    this.selectedValueChange.emit(this.defaultValue);
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.isOpen) {
      clearTimeout(this.searchTimeout);

      this.searchText += event.key.toLowerCase();

      const matchingOptionIndex = this.options.findIndex((option) =>
        option.description.toLowerCase().startsWith(this.searchText)
      );

      if (matchingOptionIndex !== -1) {
        this.highlightedValue = this.options[matchingOptionIndex].value;

        const dropdownContainer =
          this.elementRef.nativeElement.querySelector('.options-container');

        const optionElement = dropdownContainer.querySelector(
          `.option[data-value="${this.highlightedValue}"]`
        );

        if (dropdownContainer && optionElement) {
          const optionOffsetTop = optionElement.offsetTop;
          const optionHeight = optionElement.offsetHeight;
          const containerHeight = dropdownContainer.offsetHeight;

          dropdownContainer.scrollTop =
            optionOffsetTop - containerHeight / 2 + optionHeight / 2;
        }
      }

      this.searchTimeout = setTimeout(() => {
        this.searchText = '';
      }, 1000);
    }
  }
}
