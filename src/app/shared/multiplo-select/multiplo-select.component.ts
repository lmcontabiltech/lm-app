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

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    if (this.multiple && !Array.isArray(this.selectedValue)) {
      this.selectedValue = [];
    } else if (!this.multiple) {
      this.selectedValue = null;
    }
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
  }

  removeValue(value: any) {
    if (this.multiple && Array.isArray(this.selectedValue)) {
      this.selectedValue = this.selectedValue.filter(
        (item: any) => item.value !== value.value
      );
      this.selectedValueChange.emit([...this.selectedValue]);
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
}
