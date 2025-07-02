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
import { PaginationComponent } from './pagination/pagination.component';
import { LoadingComponent } from './loading/loading.component';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { SelectAutoCompleteComponent } from './select-auto-complete/select-auto-complete.component';

export function playerFactory() {
  return player;
}

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
    PaginationComponent,
    LoadingComponent,
    SelectAutoCompleteComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    LottieModule.forRoot({ player: playerFactory }),
  ],
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
    PaginationComponent,
    LoadingComponent,
    SelectAutoCompleteComponent
  ],
})
export class SharedModule {}
