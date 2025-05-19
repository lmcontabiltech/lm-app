import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputArquivosComponent } from './input-arquivos/input-arquivos.component';
import { InputImagensComponent } from './input-imagens/input-imagens.component';
import { ModalDeleteComponent } from './modal-delete/modal-delete.component';
import { MultiploSelectComponent } from './multiplo-select/multiplo-select.component';
import { SelectPadraoComponent } from './select-padrao/select-padrao.component';
import { SearchComponent } from './search/search.component';
import { FormsModule } from '@angular/forms';
import { SetorTagComponent } from './setor-tag/setor-tag.component';
import { InputPlusComponent } from './input-plus/input-plus.component';
import { CardAtvComponent } from './card-atv/card-atv.component';

@NgModule({
  declarations: [
    InputArquivosComponent,
    InputImagensComponent,
    ModalDeleteComponent,
    MultiploSelectComponent,
    SelectPadraoComponent,
    SearchComponent,
    SetorTagComponent,
    InputPlusComponent,
    CardAtvComponent,
  ],
  imports: [CommonModule, FormsModule],
  exports: [
    InputArquivosComponent,
    InputImagensComponent,
    ModalDeleteComponent,
    MultiploSelectComponent,
    SelectPadraoComponent,
    SearchComponent,
    SetorTagComponent,
    InputPlusComponent,
    CardAtvComponent,
  ],
})
export class SharedModule {}
