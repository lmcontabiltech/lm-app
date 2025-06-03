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
import { ModalAtividadeComponent } from './modal-atividade/modal-atividade.component';
import { FiltroAtividadesComponent } from './filtro-atividades/filtro-atividades.component';

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
    ModalAtividadeComponent,
    FiltroAtividadesComponent,
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
    ModalAtividadeComponent,
    FiltroAtividadesComponent,
  ],
})
export class SharedModule {}
