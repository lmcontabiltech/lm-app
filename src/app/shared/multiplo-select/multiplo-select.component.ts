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
  selector: 'app-multiplo-select',
  templateUrl: './multiplo-select.component.html',
  styleUrls: ['./multiplo-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiploSelectComponent),
      multi: true,
    },
  ],
})
export class MultiploSelectComponent {
  @Input() label: string = '';
  @Input() options: { value: string; description: string }[] = [];
  @Input() selectedValue: any[] | any;
  @Output() selectedValueChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() customStyles: { [key: string]: string } = {};
  @Input() multiple: boolean = false;
  @Input() disabled: boolean = false;

  isOpen: boolean = false;
  value: string = '';
  filteredOptions: { value: string; description: string }[] = [];
  searchText: string = '';
  searchTimeout: any;
  highlightedValue: string = '';

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    if (this.multiple && !Array.isArray(this.selectedValue)) {
      this.selectedValue = [];
    } else if (!this.multiple) {
      this.selectedValue = null;
    }

    this.filteredOptions = [...this.options];
  }

  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onSelect(value: any) {
    if (this.multiple) {
      if (!Array.isArray(this.selectedValue)) {
        this.selectedValue = [];
      }
      const idx = this.selectedValue.findIndex(
        (item: any) => item.value === value.value
      );
      if (idx > -1) {
        this.selectedValue.splice(idx, 1);
      } else {
        this.selectedValue.push(value);
      }
      this.selectedValueChange.emit([...this.selectedValue]);
    } else {
      this.selectedValue = value;
      this.selectedValueChange.emit(value);
      this.isOpen = false;
    }
    this.isOpen = false;
    this.highlightedValue = value.value;
  }

  removeValue(value: any) {
    if (this.multiple && Array.isArray(this.selectedValue)) {
      this.selectedValue = this.selectedValue.filter(
        (item: any) => item.value !== value.value
      );
      this.selectedValueChange.emit([...this.selectedValue]);
      this.highlightedValue = '';
      this.filteredOptions = [...this.options];
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
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

      // Adiciona a tecla digitada ao texto de busca
      this.searchText += event.key.toLowerCase();

      // Encontra a primeira opção que corresponde ao texto digitado
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

      // Limpa o texto de busca após 1 segundo
      this.searchTimeout = setTimeout(() => {
        this.searchText = '';
      }, 1000);
    }
  }
}
