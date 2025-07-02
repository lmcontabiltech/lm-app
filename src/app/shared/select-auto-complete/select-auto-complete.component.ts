import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  HostListener,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface AutoCompleteOption {
  value: string;
  description: string;
}

@Component({
  selector: 'app-select-auto-complete',
  templateUrl: './select-auto-complete.component.html',
  styleUrls: ['./select-auto-complete.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectAutoCompleteComponent),
      multi: true,
    },
  ],
})
export class SelectAutoCompleteComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() options: AutoCompleteOption[] = [];
  @Input() disabled: boolean = false;
  @Input() allowAddNew: boolean = false;
  @Input() maxItems: number | null = null;
  @Input() multiple: boolean = true;

  @Output() itemAdded = new EventEmitter<AutoCompleteOption>();
  @Output() itemRemoved = new EventEmitter<AutoCompleteOption>();
  @Output() addNewRequested = new EventEmitter<string>();
  @Output() selectionChange = new EventEmitter<string | string[]>();

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  selectedItems: AutoCompleteOption[] = [];
  selectedItem: AutoCompleteOption | null = null;
  searchText: string = '';
  isOpen: boolean = false;
  filteredOptions: AutoCompleteOption[] = [];
  highlightedIndex: number = -1;

  // ControlValueAccessor
  onChange = (value: string[]) => {};
  onTouched = () => {};

  constructor(private elementRef: ElementRef) {
    this.filteredOptions = this.options;
  }

  ngOnInit() {
    this.updateFilteredOptions();
  }

  ngOnChanges() {
    this.updateFilteredOptions();
  }

  // ControlValueAccessor implementation
  writeValue(value: string | string[]): void {
    if (this.multiple) {
      // Modo múltiplo
      if (value && Array.isArray(value)) {
        this.selectedItems = value.map(
          (val) =>
            this.options.find((opt) => opt.value === val) || {
              value: val,
              description: val,
            }
        );
      } else {
        this.selectedItems = [];
      }
      this.selectedItem = null;
    } else {
      // Modo único
      if (value && typeof value === 'string') {
        this.selectedItem = this.options.find((opt) => opt.value === value) || {
          value: value,
          description: value,
        };
      } else {
        this.selectedItem = null;
      }
      this.selectedItems = [];
    }
    this.updateFilteredOptions();
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Eventos
  onSearch(event: any): void {
    this.searchText = event.target.value;
    this.updateFilteredOptions();
    this.isOpen = true;
    this.highlightedIndex = -1;
  }

  selectItem(option: AutoCompleteOption): void {
    if (this.multiple) {
      // Modo múltiplo: adiciona se não estiver selecionado
      if (this.isSelected(option)) return;

      if (this.maxItems && this.selectedItems.length >= this.maxItems) return;

      this.selectedItems.push(option);
    } else {
      // Modo único: substitui automaticamente
      this.selectedItems = [option];
    }

    this.searchText = '';
    this.isOpen = false;
    this.updateFilteredOptions();
    this.emitChange();
    this.itemAdded.emit(option);
    this.focusInput();
  }

  removeItem(index: number): void {
    const removedItem = this.selectedItems[index];
    this.selectedItems.splice(index, 1);
    this.updateFilteredOptions();
    this.emitChange();
    this.itemRemoved.emit(removedItem);
    this.focusInput();
  }

  removeSingleItem(): void {
    if (!this.multiple && this.selectedItem) {
      const removedItem = this.selectedItem;
      this.selectedItem = null;
      this.updateFilteredOptions();
      this.emitChange();
      this.itemRemoved.emit(removedItem);
      this.focusInput();
    }
  }

  addNewItem(): void {
    if (!this.searchText.trim()) return;

    const newOption: AutoCompleteOption = {
      value: this.searchText.trim(),
      description: this.searchText.trim(),
    };

    this.selectItem(newOption);
    this.addNewRequested.emit(this.searchText.trim());
  }

  isSelected(option: AutoCompleteOption): boolean {
    return this.selectedItems.some((item) => item.value === option.value);
  }

  exactMatch(): boolean {
    return this.options.some(
      (opt) => opt.description.toLowerCase() === this.searchText.toLowerCase()
    );
  }

  // Getter para verificar se há itens selecionados
  get hasSelection(): boolean {
    return this.multiple
      ? this.selectedItems.length > 0
      : this.selectedItem !== null;
  }

  // Getter para o texto do item selecionado (modo único)
  get selectedDescription(): string {
    return this.selectedItem ? this.selectedItem.description : '';
  }

  private updateFilteredOptions(): void {
    if (!this.searchText) {
      this.filteredOptions = this.options.filter(
        (opt) => !this.isSelected(opt)
      );
    } else {
      this.filteredOptions = this.options.filter(
        (opt) =>
          opt.description
            .toLowerCase()
            .includes(this.searchText.toLowerCase()) && !this.isSelected(opt)
      );
    }
  }

  private emitChange(): void {
    const values = this.selectedItems.map((item) => item.value);
    this.onChange(values);
    this.onTouched();
  }

  private focusInput(): void {
    setTimeout(() => {
      if (this.searchInput) {
        this.searchInput.nativeElement.focus();
      }
    }, 0);
  }

  // Navegação por teclado
  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.highlightedIndex = Math.min(
          this.highlightedIndex + 1,
          this.filteredOptions.length - 1
        );
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.highlightedIndex = Math.max(this.highlightedIndex - 1, -1);
        break;

      case 'Enter':
        event.preventDefault();
        if (
          this.highlightedIndex >= 0 &&
          this.filteredOptions[this.highlightedIndex]
        ) {
          this.selectItem(this.filteredOptions[this.highlightedIndex]);
        } else if (this.allowAddNew && this.searchText && !this.exactMatch()) {
          this.addNewItem();
        }
        break;

      case 'Escape':
        this.isOpen = false;
        this.searchText = '';
        break;

      case 'Backspace':
        if (!this.searchText && this.selectedItems.length > 0) {
          this.removeItem(this.selectedItems.length - 1);
        }
        break;
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
