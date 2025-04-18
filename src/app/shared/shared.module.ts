import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputArquivosComponent } from './input-arquivos/input-arquivos.component';
import { InputImagensComponent } from './input-imagens/input-imagens.component';
import { ModalGeralComponent } from './modal-geral/modal-geral.component';
import { MultiploSelectComponent } from './multiplo-select/multiplo-select.component';
import { SelectPadraoComponent } from './select-padrao/select-padrao.component';
import { SearchComponent } from './search/search.component';
import { FormsModule } from '@angular/forms';
import { SetorTagComponent } from './setor-tag/setor-tag.component';
import { InputPlusComponent } from './input-plus/input-plus.component';



@NgModule({
  declarations: [
    InputArquivosComponent,
    InputImagensComponent,
    ModalGeralComponent,
    MultiploSelectComponent,
    SelectPadraoComponent,
    SearchComponent,
    SetorTagComponent,
    InputPlusComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    InputArquivosComponent,
    InputImagensComponent,
    ModalGeralComponent,
    MultiploSelectComponent,
    SelectPadraoComponent,
    SearchComponent,
    SetorTagComponent,
    InputPlusComponent
  ]
})
export class SharedModule { }
