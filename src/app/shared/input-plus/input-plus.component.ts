import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import { Tarefa } from 'src/app/sistema/gerenciamento/processos/tarefas';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-plus',
  templateUrl: './input-plus.component.html',
  styleUrls: ['./input-plus.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputPlusComponent),
      multi: true,
    },
  ],
})
export class InputPlusComponent implements OnInit {
  @Input() items: any[] = [];
  @Output() itemsChange = new EventEmitter<any[]>();
  @Input() initialCount = 0;

  onChange: (value: any[]) => void = () => {};
  onTouched: () => void = () => {};

  ngOnInit(): void {
    if (this.items.length === 0 && this.initialCount > 0) {
      const newItems: Tarefa[] = Array.from(
        { length: this.initialCount },
        (_, i) => ({
          id: 0,
          tarefa: '',
          checked: false,
        })
      );
      this.items = [...newItems];
      this.onChange(this.items);
      this.itemsChange.emit(this.items);
      console.log('Inicializado com itens vazios:', this.items);
    }
  }

  writeValue(value: any[]): void {
    if (value && value.length > 0) {
      this.items = value;
    } else if (this.items.length === 0 && this.initialCount > 0) {
      const newItems: Tarefa[] = Array.from(
        { length: this.initialCount },
        (_, i) => ({
          id: 0,
          tarefa: '',
          checked: false,
        })
      );
      this.items = [...newItems];
    }
    this.onChange(this.items);
    this.emitChange();
  }

  registerOnChange(fn: (value: any[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  addItem() {
    const newItem: Tarefa = {
      id: 0,
      tarefa: '',
      checked: false,
    };

    this.items = [...this.items, newItem];
    this.onChange(this.items);
    this.itemsChange.emit(this.items);
    console.log('Item adicionado:', newItem);
  }

  updateItem(index: number, field: 'checked' | 'tarefa', event: Event) {
    const target = event.target as HTMLInputElement;
    const value = field === 'checked' ? target.checked : target.value;

    this.items[index] = {
      ...this.items[index],
      [field]: value,
    };

    this.items = [...this.items];
    this.onChange(this.items);
    this.itemsChange.emit(this.items);
    console.log(
      `Atualizado [${field}] no item ${this.items[index].id}:`,
      this.items[index]
    );
  }

  removeItem(index: number) {
    const removed = this.items[index];
    this.items = this.items.filter((_, i) => i !== index);
    this.reorderIds();
    this.onChange(this.items);
    this.itemsChange.emit(this.items);
    console.log('Removido:', removed);
    console.log('Itens agora:', this.items);
  }

  emitChange() {
    this.itemsChange.emit(this.items);
  }

  private reorderIds() {
    this.items = this.items.map((item) => ({
      ...item,
      id: item.id ?? null,
    }));
    console.log('IDs reordenados:', this.items);
  }
}
