import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

export interface ChecklistItem {
  id: number;
  description: string;
  checked: boolean;
}

@Component({
  selector: 'app-input-plus',
  templateUrl: './input-plus.component.html',
  styleUrls: ['./input-plus.component.css'],
})
export class InputPlusComponent implements OnInit {
  @Input() items: ChecklistItem[] = [];
  @Output() itemsChange = new EventEmitter<ChecklistItem[]>();
  @Input() initialCount = 0;

  ngOnInit(): void {
    if (this.items.length === 0 && this.initialCount > 0) {
      const newItems: ChecklistItem[] = Array.from({
        length: this.initialCount,
      }).map((_, i) => ({
        id: i + 1,
        description: '',
        checked: false,
      }));
      this.items = newItems;
      this.itemsChange.emit(this.items);
      console.log('Inicializados:', this.items);
    }
  }

  addItem() {
    const newId =
      this.items.length > 0
        ? Math.max(...this.items.map((item) => item.id)) + 1
        : 1;

    const newItem: ChecklistItem = {
      id: newId,
      description: '',
      checked: false,
    };

    this.items = [...this.items, newItem];
    this.itemsChange.emit(this.items);
  }

  updateItem(index: number, field: 'checked' | 'description', event: Event) {
    const target = event.target as HTMLInputElement;
    const value = field === 'checked' ? target.checked : target.value;

    this.items[index] = {
      ...this.items[index],
      [field]: value,
    };

    this.items = [...this.items];
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
    this.itemsChange.emit(this.items);
    console.log('Removido:', removed);
    console.log('Itens agora:', this.items);
  }

  emitChange() {
    this.itemsChange.emit(this.items);
  }

  private reorderIds() {
    this.items = this.items.map((item, index) => ({
      ...item,
      id: index + 1,
    }));
    console.log('IDs reordenados:', this.items);
  }
}
