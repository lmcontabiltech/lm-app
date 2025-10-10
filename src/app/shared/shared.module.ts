import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputArquivosComponent } from './input-arquivos/input-arquivos.component';
import { InputImagensComponent } from './input-imagens/input-imagens.component';
import { ModalDeleteComponent } from './modal/modal-delete/modal-delete.component';
import { MultiploSelectComponent } from './multiplo-select/multiplo-select.component';
import { SelectPadraoComponent } from './select-padrao/select-padrao.component';
import { SearchComponent } from './search/search.component';
import { FormsModule } from '@angular/forms';
import { SetorTagComponent } from './setor-tag/setor-tag.component';
import { InputPlusComponent } from './input-plus/input-plus.component';
import { CardAtvComponent } from './card-atv/card-atv.component';
import { ModalAtividadeComponent } from './modal/modal-atividade/modal-atividade.component';
import { FiltroAtividadesComponent } from './filtro-atividades/filtro-atividades.component';
import { PaginationComponent } from './pagination/pagination.component';
import { LoadingComponent } from './loading/loading.component';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { SelectAutoCompleteComponent } from './select-auto-complete/select-auto-complete.component';
import { GraficoBarraHorizontalComponent } from './graficos/grafico-barra-horizontal/grafico-barra-horizontal.component';
import { GraficoLinhaComponent } from './graficos/grafico-linha/grafico-linha.component';
import { GraficoBarraVerticalComponent } from './graficos/grafico-barra-vertical/grafico-barra-vertical.component';
import { GraficoRosquinhaComponent } from './graficos/grafico-rosquinha/grafico-rosquinha.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ModalPadraoComponent } from './modal/modal-padrao/modal-padrao.component';
import { BotTiComponent } from './suporte/bot-ti/bot-ti.component';
import { InputWordComponent } from './input-word/input-word.component';
import { InputMidiasComponent } from './input-midias/input-midias.component';
import { MensalComponent } from './agenda/mensal/mensal.component';
import { SemanalComponent } from './agenda/semanal/semanal.component';
import { AnualComponent } from './agenda/anual/anual.component';
import { ModalCadastroComponent } from './modal/modal-cadastro/modal-cadastro.component';
import { InputParticipantesComponent } from './input-participantes/input-participantes.component';

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
    GraficoBarraHorizontalComponent,
    GraficoLinhaComponent,
    GraficoBarraVerticalComponent,
    GraficoRosquinhaComponent,
    FeedbackComponent,
    ModalPadraoComponent,
    BotTiComponent,
    InputWordComponent,
    InputMidiasComponent,
    MensalComponent,
    SemanalComponent,
    AnualComponent,
    ModalCadastroComponent,
    InputParticipantesComponent,
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
    SelectAutoCompleteComponent,
    GraficoBarraHorizontalComponent,
    GraficoLinhaComponent,
    GraficoBarraVerticalComponent,
    GraficoRosquinhaComponent,
    FeedbackComponent,
    ModalPadraoComponent,
    BotTiComponent,
    InputMidiasComponent,
    InputWordComponent,
    MensalComponent,
    SemanalComponent,
    AnualComponent,
    ModalCadastroComponent,
    InputParticipantesComponent,
  ],
})
export class SharedModule {}
