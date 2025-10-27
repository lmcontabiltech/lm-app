import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ModalCadastroService } from 'src/app/services/modal/modal-cadastro.service';
import { ModalDeleteService } from 'src/app/services/modal/modalDeletar.service';
import { ColaboradoresService } from 'src/app/services/administrativo/colaboradores.service';
import { Colaborador } from '../../administrativo/colaboradores/colaborador';
import { AuthService } from 'src/app/services/auth.service';
import { TipoEvento } from './enums/tipo-evento';
import { TipoEventoDescricao } from './enums/tipo-evento-descricao';
import { Frequencia } from './enums/frequencia';
import { FrequenciaDescricao } from './enums/frequencia-descricao';
import { Evento } from './evento';
import { Agenda } from './enums/agenda';
import { AgendaDescricao } from './enums/agenda-descricao';
import { AgendaService } from 'src/app/services/gerenciamento/agenda.service';
import { finalize } from 'rxjs/operators';
import { FeedbackComponent } from 'src/app/shared/feedback/feedback.component';
import { ErrorMessageService } from 'src/app/services/feedback/error-message.service';

type ViewMode = 'week' | 'month' | 'year';

interface CalendarDay {
  date: Date;
  otherMonth: boolean;
}

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
})
export class AgendaComponent implements OnInit {
  @ViewChild(FeedbackComponent) feedbackComponent!: FeedbackComponent;
  eventoForm: FormGroup;

  colaboradores: Colaborador[] = [];
  agenda: string = 'PESSOAL';

  isLoading = false;
  successMessage: string = '';
  messageTimeout: any;

  @ViewChild('formCadastroTemplate') formCadastroTemplate!: TemplateRef<any>;
  @ViewChild('detalheEventoTemplate') detalheEventoTemplate!: TemplateRef<any>;
  @ViewChild('listaEventosDiaTemplate')
  listaEventosDiaTemplate!: TemplateRef<any>;

  eventoSelecionado?: Evento;
  dataSelecionada!: Date;
  eventosDoDiaSelecionado: Evento[] = [];

  diaSemana = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
  ];
  meses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  viewMode: ViewMode = 'month';
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth();
  selectedDate: Date = new Date();

  monthDays: CalendarDay[] = [];
  weekDays: Date[] = [];
  eventos: Evento[] = [];

  horasDoDia: string[] = Array.from(
    { length: 24 },
    (_, i) => i.toString().padStart(2, '0') + ':00'
  );

  hoje = new Date().toDateString();

  TipoEventoDescricao = TipoEventoDescricao;

  selectedFrequencia: string = '';
  frequencia = Object.keys(Frequencia).map((key) => ({
    value: Frequencia[key as keyof typeof Frequencia],
    description:
      FrequenciaDescricao[Frequencia[key as keyof typeof Frequencia]],
  }));

  selectedTipo: string = '';
  TipoEvento = Object.keys(TipoEvento).map((key) => ({
    value: TipoEvento[key as keyof typeof TipoEvento],
    description:
      TipoEventoDescricao[TipoEvento[key as keyof typeof TipoEvento]],
  }));

  selectedAgenda: string = '';
  Agenda = Object.keys(Agenda).map((key) => ({
    value: Agenda[key as keyof typeof Agenda],
    description: AgendaDescricao[Agenda[key as keyof typeof Agenda]],
  }));

  constructor(
    private formBuilder: FormBuilder,
    private modalCadastroService: ModalCadastroService,
    private modalDeleteService: ModalDeleteService,
    private colaboradoresService: ColaboradoresService,
    private authService: AuthService,
    private agendaService: AgendaService,
    private errorMessageService: ErrorMessageService
  ) {
    this.eventoForm = this.formBuilder.group({
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      descricao: ['', [Validators.maxLength(500)]],
      data: ['', Validators.required],
      horaInicio: [''],
      horaFim: [''],
      frequencia: [''],
      tipoEvento: ['', Validators.required],
      link: [''],
      cor: [this.cores[7]],
      participantes: [[]],
      agenda: ['PESSOAL'],
    });
  }

  ngOnInit(): void {
    this.applyFilters();
    this.carregarColaboradores();
    this.fetchEventos();
  }

  setView(mode: ViewMode) {
    this.viewMode = mode;
    this.applyFilters();
  }

  prevPeriod() {
    if (this.viewMode === 'month') {
      if (this.selectedMonth === 0) {
        this.selectedMonth = 11;
        this.selectedYear--;
      } else {
        this.selectedMonth--;
      }
    } else if (this.viewMode === 'week') {
      this.selectedDate = new Date(
        this.selectedDate.setDate(this.selectedDate.getDate() - 7)
      );
    } else if (this.viewMode === 'year') {
      this.selectedYear--;
    }
    this.applyFilters();
    this.fetchEventos();
  }

  nextPeriod() {
    if (this.viewMode === 'month') {
      if (this.selectedMonth === 11) {
        this.selectedMonth = 0;
        this.selectedYear++;
      } else {
        this.selectedMonth++;
      }
    } else if (this.viewMode === 'week') {
      this.selectedDate = new Date(
        this.selectedDate.setDate(this.selectedDate.getDate() + 7)
      );
    } else if (this.viewMode === 'year') {
      this.selectedYear++;
    }
    this.applyFilters();
    this.fetchEventos();
  }

  goToMonth(month: number) {
    this.selectedMonth = month;
    this.viewMode = 'month';
    this.applyFilters();
  }

  applyFilters(): void {
    if (this.viewMode === 'week') {
      this.generateWeekDays();
    } else if (this.viewMode === 'month') {
      this.generateMonthDays();
    }
  }

  generateMonthDays(): void {
    this.monthDays = [];
    const first = new Date(this.selectedYear, this.selectedMonth, 1);
    const last = new Date(this.selectedYear, this.selectedMonth + 1, 0);
    const startDay = first.getDay();

    // Dias do mês anterior
    for (let i = 0; i < startDay; i++) {
      this.monthDays.push({
        date: new Date(this.selectedYear, this.selectedMonth, 1 - startDay + i),
        otherMonth: true,
      });
    }
    // Dias do mês atual
    for (let d = 1; d <= last.getDate(); d++) {
      this.monthDays.push({
        date: new Date(this.selectedYear, this.selectedMonth, d),
        otherMonth: false,
      });
    }
    // Pós-lacunas
    while (this.monthDays.length % 7 !== 0) {
      const prev = this.monthDays[this.monthDays.length - 1].date.getDate();
      this.monthDays.push({
        date: new Date(this.selectedYear, this.selectedMonth, prev + 1),
        otherMonth: true,
      });
    }
  }

  generateWeekDays(): void {
    this.weekDays = [];
    const d = new Date(this.selectedDate);
    // início da semana (domingo)
    const start = new Date(d);
    start.setDate(d.getDate() - d.getDay());
    for (let i = 0; i < 7; i++) {
      const wd = new Date(start);
      wd.setDate(start.getDate() + i);
      this.weekDays.push(wd);
    }
  }

  // Visão anual: retorna array de 12 meses
  get yearMonths(): number[] {
    return Array.from({ length: 12 }, (_, i) => i);
  }

  // Eventos do dia
  getEventosDoDia(date: Date): Evento[] {
    const resultado = this.eventos.filter((ev) => {
      // Parse manual: "2025-10-21" → ano, mês, dia
      const [ano, mes, dia] = ev.data.split('-').map(Number);
      // Cria Date local (sem conversão UTC)
      const evDate = new Date(ano, mes - 1, dia);

      const match =
        evDate.getFullYear() === date.getFullYear() &&
        evDate.getMonth() === date.getMonth() &&
        evDate.getDate() === date.getDate();

      return match;
    });

    console.log(
      `📅 getEventosDoDia(${date.toLocaleDateString()}) →`,
      resultado.map((e) => ({ id: e.id, data: e.data, titulo: e.titulo }))
    );

    return resultado;
  }

  // Eventos do mês (usado na visão anual)
  getEventosNoMes(mes: number, ano: number): number {
    return this.eventos.filter((ev) => {
      const evDate = new Date(ev.data);
      return evDate.getFullYear() === ano && evDate.getMonth() === mes;
    }).length;
  }

  // Eventos por hora (usado na visão semanal)
  getEventosNoHorario(date: Date, hora: string): Evento[] {
    return this.eventos.filter((ev) => {
      const [ano, mes, dia] = ev.data.split('-').map(Number);
      const evDate = new Date(ano, mes - 1, dia);

      if (
        evDate.getFullYear() !== date.getFullYear() ||
        evDate.getMonth() !== date.getMonth() ||
        evDate.getDate() !== date.getDate()
      ) {
        return false;
      }

      if (!ev.horaInicio) return false;
      const evHour = ev.horaInicio.split(':')[0];
      return evHour === hora.split(':')[0];
    });
  }

  // Matriz de dias para cada mês do ano (usado na visão anual)
  getMonthMatrix(
    month: number,
    year: number
  ): { date: Date; otherMonth: boolean }[][] {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startDay = first.getDay();
    const matrix: { date: Date; otherMonth: boolean }[][] = [];
    let week: { date: Date; otherMonth: boolean }[] = [];

    // Dias do mês anterior
    for (let i = 0; i < startDay; i++) {
      week.push({
        date: new Date(year, month, 1 - startDay + i),
        otherMonth: true,
      });
    }
    // Dias do mês atual
    for (let d = 1; d <= last.getDate(); d++) {
      week.push({
        date: new Date(year, month, d),
        otherMonth: false,
      });
      if (week.length === 7) {
        matrix.push(week);
        week = [];
      }
    }
    // Pós-lacunas
    while (week.length && week.length < 7) {
      const prev = week[week.length - 1].date.getDate();
      week.push({
        date: new Date(year, month, prev + 1),
        otherMonth: true,
      });
    }
    if (week.length) matrix.push(week);
    return matrix;
  }

  adicionarEvento(): void {
    this.authService.obterPerfilUsuario().subscribe({
      next: (usuario) => {
        this.openModalCadastro(usuario);
      },
      error: (err) => {},
    });
  }

  openModalCadastro(colaborador: Colaborador): void {
    this.colaboradoresService
      .getUsuarioById(colaborador.id)
      .subscribe((colab) => {
        this.modalCadastroService.openModal(
          {
            title: 'Cadastrar evento',
            description: `Preencha os dados do evento`,
            size: 'md',
            confirmTextoBotao: 'Salvar',
          },
          () => this.onSubmit(colab),
          this.formCadastroTemplate
        );
      });
  }

  onSubmit(colab: Colaborador): void {
    if (this.eventoForm.invalid) return;

    const dadosEvento: Evento = {
      ...this.eventoForm.value,
      colaboradorId: colab.id,
    };

    console.log('📦 Novo evento montado:', dadosEvento);
    console.log('👤 Colaborador ID:', colab.id);
    console.log('🚀 Iniciando requisição...');

    this.isLoading = true;

    this.agendaService
      .cadastrarEvento(Number(colab.id), dadosEvento)
      .subscribe({
        next: () => {
          this.showFeedback('success', 'Evento cadastrado com sucesso!');
          this.modalCadastroService.closeModal();
          this.eventoForm.reset();
          this.isLoading = false;
          this.fetchEventos();
        },
        error: (err) => {
          const status = err?.status || 500;
          const msg = this.errorMessageService.getErrorMessage(
            status,
            'POST',
            'evento'
          );
          this.showFeedback('error', msg);
        },
      });
  }

  private showFeedback(type: 'success' | 'error', message: string): void {
    const title = type === 'success' ? 'Sucesso' : 'Erro';
    this.feedbackComponent?.show(type, title, message);
  }

  cores: string[] = [
    '#D50000', // Tomate
    '#dc3058ff', // chiclete
    '#E67C73', // Flamingo
    '#E3683E', // Tangerina
    '#E7BA51', // Banana
    '#55B080', // Sálvia
    '#489160', // Manjericão
    '#4B99D2', // Pavão
    '#3F51B5', // Mirtilo
    '#6E72C3', // Lavanda
    '#A75ABA', // Uva
    '#7C7C7C', // Grafite
  ];

  dropdownOpen: boolean = false;

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selecionarCor(cor: string): void {
    this.eventoForm.get('cor')?.setValue(cor);
    setTimeout(() => {
      this.dropdownOpen = false;
    }, 100);
  }

  carregarColaboradores(): void {
    this.isLoading = true;
    this.colaboradoresService.getUsuariosNonAdmin().subscribe(
      (response: Colaborador[]) => {
        this.colaboradores = response.map((colaborador) => ({
          ...colaborador,
        }));
        this.isLoading = false; // Finaliza o estado de carregamento
        console.log('Colaboradores carregados na agenda:', this.colaboradores);
      },
      (error) => {
        this.isLoading = false; // Finaliza o estado de carregamento em caso de erro
        console.error('Erro ao carregar colaboradores na agenda:', error);
      }
    );
  }

  private getMesAtual(): string {
    return `${this.selectedYear}-${String(this.selectedMonth + 1).padStart(
      2,
      '0'
    )}`;
  }

  fetchEventos(): void {
    this.eventos = [];

    this.authService.obterPerfilUsuario().subscribe({
      next: (usuario: any) => {
        const mes = this.getMesAtual();
        this.agendaService
          .listarEventosDoMes(Number(usuario.id), mes)
          .subscribe({
            next: (eventos) => {
              this.eventos = eventos || [];
            },
            error: (err) => {
              console.error('Erro ao buscar eventos do mês:', err);
              this.eventos = [];
            },
          });
      },
      error: (err) => {
        console.error('Erro ao obter usuário logado:', err);
        this.eventos = [];
      },
    });
  }

  exibirMensagemDeSucesso(): void {
    const state = window.history.state as { successMessage?: string };
    if (state?.successMessage) {
      this.successMessage = state.successMessage;
      setTimeout(() => (this.successMessage = ''), 3000);
      window.history.replaceState({}, document.title);
    }
  }

  showMessage(type: 'success' | 'error', msg: string) {
    this.clearMessage();
    if (type === 'success') this.successMessage = msg;
    this.messageTimeout = setTimeout(() => this.clearMessage(), 3000);
  }

  clearMessage() {
    this.successMessage = '';
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
  }

  openDetalheEventoModal(ev: Evento): void {
    this.eventoSelecionado = ev;
    this.modalCadastroService.openModal(
      {
        title: 'Detalhes do evento',
        description: '',
        size: 'md',
        confirmTextoBotao: 'Editar',
        cancelTextoBotao: 'Fechar',
        extraButtonText: 'Deletar',
        extraButtonEnabled: false,
      },
      () => this.modalCadastroService.closeModal(),
      this.detalheEventoTemplate,
      () => this.abrirModalConfirmacaoDeletar(ev) 
    );
  }

  openEventosDoDiaModal(date: Date): void {
    this.dataSelecionada = date;
    this.eventosDoDiaSelecionado = this.getEventosDoDia(date);
    this.modalCadastroService.openModal(
      {
        title: 'Eventos do dia',
        description: '',
        size: 'md',
        cancelTextoBotao: 'Fechar',
        showConfirmButton: false,
      },
      () => this.modalCadastroService.closeModal(),
      this.listaEventosDiaTemplate
    );
  }

  getTipoDescricao(value: any): string {
    const key = value as keyof typeof this.TipoEventoDescricao;
    return value && this.TipoEventoDescricao[key]
      ? this.TipoEventoDescricao[key]
      : String(value || '');
  }

  getAgendaDescricao(value: any): string {
    const key = value as keyof typeof AgendaDescricao;
    return value && AgendaDescricao[key]
      ? AgendaDescricao[key]
      : String(value || '');
  }

  deletarEvento(evento: Evento): void {
    if (evento.id) {
      this.authService.obterUsuarioAutenticadoDoBackend().subscribe({
        next: (usuario) => {
          const usuarioId = Number(usuario.id);
          this.agendaService.deletarEvento(usuarioId, Number(evento.id)).subscribe({
            next: () => {
              this.showFeedback('success', 'Evento excluído com sucesso!');
              this.fetchEventos();
            },
            error: (err) => {
              const status = err?.status || 500;
              const msg = this.errorMessageService.getErrorMessage(
                status,
                'DELETE',
                'evento'
              );
              this.showFeedback('error', msg);
            },
          });
        },
        error: (err) => {
          this.showFeedback('error', 'Erro ao obter usuário autenticado.');
        },
      });
    } else {
      this.showFeedback('error', 'Evento inválido para exclusão.');
    }
  }

  abrirModalConfirmacaoDeletar(evento: Evento): void {
    this.modalDeleteService.openModal(
      {
        title: 'Deletar Evento',
        description: `Tem certeza que deseja deletar o evento <strong>${evento.titulo}</strong>?`,
        item: evento,
        deletarTextoBotao: 'Deletar',
        size: 'md',
      },
      () => this.deletarEvento(evento)
    );
  }
}
