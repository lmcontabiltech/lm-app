import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Usuario } from 'src/app/login/usuario';
import { ColaboradoresService } from 'src/app/services/administrativo/colaboradores.service';
import { ExchangeService } from 'src/app/services/exchange.service';
import {
  DashboardAdminService,
  GraficoSetor,
} from 'src/app/services/graficos/dashboard-admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { DashboardColaboradorService } from 'src/app/services/graficos/dashboard-colaborador.service';
import { DashboardAtividadesPorSetorResponseDTO } from '../dashboard-admin/models/atividades-por-setor';
import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';
import { GraficoAtividadesPorMes } from '../dashboard-admin/models/atividades-por-mes';
import { PeriodoDias } from '../dashboard-admin/enums/periodo-dias';
import { PeriodoDiasDescricao } from '../dashboard-admin/enums/periodo-dias-descricao';
import { Status } from '../../gerenciamento/atividades/enums/status';
import { StatusDescricao } from '../../gerenciamento/atividades/enums/status-descricao';
import { ModalCadastroService } from 'src/app/services/modal/modal-cadastro.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard-colaborador',
  templateUrl: './dashboard-colaborador.component.html',
  styleUrls: ['./dashboard-colaborador.component.css'],
})
export class DashboardColaboradorComponent implements OnInit {
  usuario: Usuario | null = null;
  cotacoes: any = {};
  selic: string = '';
  permissaoUsuario: string = '';
  nomeSetorGrafico: string = '';
  setorUsuarioEnum: Setor | null = null;

  @ViewChild('anuncioTemplate') anuncioTemplate!: TemplateRef<any>;

  @ViewChild('videoModalTemplate') videoModalTemplate!: TemplateRef<any>;
  videoUrl: string =
    'https://drive.google.com/file/d/1J1JjuLWT4QU2x_L_EpaFoMawtduHZMcJ/view?usp=sharing';
  safeVideoUrl!: SafeResourceUrl;

  setorUsuario = {
    nome: '',
    key: '',
    porcentagem: 0,
    icone: '',
  };

  private setoresMap: {
    [key: string]: { nome: string; key: string; icone: string };
  } = {
    CONTABIL: { nome: 'Contábil', key: 'contabil', icone: 'calculator.svg' },
    FISCAL: { nome: 'Fiscal', key: 'fiscal', icone: 'coin.svg' },
    PESSOAL: { nome: 'Pessoal', key: 'pessoal', icone: 'duo.svg' },
    PARALEGAL: { nome: 'Paralegal', key: 'paralegal', icone: 'balanca.svg' },
    FINANCEIRO: { nome: 'Financeiro', key: 'financeiro', icone: 'money.svg' },
    JURIDICO: { nome: 'Jurídico', key: 'juridico', icone: 'materlo.svg' },
    ADMINISTRATIVO: {
      nome: 'Administrativo',
      key: 'administrativo',
      icone: 'case.svg',
    },
    RH: { nome: 'RH', key: 'rh', icone: 'duo.svg' },
    SUPORTE_TI: {
      nome: 'Suporte TI',
      key: 'suporte_ti',
      icone: 'computer.svg',
    },
    ESTAGIARIO: {
      nome: 'Estagiário',
      key: 'estagiario',
      icone: 'estagiario.svg',
    },
    OUTROS: { nome: 'Outros', key: 'outros', icone: 'outros.svg' },
  };

  resumoAtividadesUsuario = {
    concluidas: 0,
    emAndamento: 0,
    totalAtribuidas: 0,
  };

  periodos = Object.keys(PeriodoDias).map((key) => ({
    value: PeriodoDias[key as keyof typeof PeriodoDias],
    description:
      PeriodoDiasDescricao[PeriodoDias[key as keyof typeof PeriodoDias]],
  }));

  periodoSelecionado: string = '';

  atividadesResumoSetor?: DashboardAtividadesPorSetorResponseDTO;

  atividadesPorMesSetor: { mes: string; quantidade: number }[] = [];
  totalAtividadesPorMes: number = 0;

  graficoAtividadesMensaisSetor = {
    series: [
      { name: 'Atividades', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    ],
    categories: [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ],
  };

  private statusColorsMap: Record<
    Status,
    { color: string; background: string }
  > = {
    [Status.A_FAZER]: {
      color: '#a22bc6',
      background: '#a22bc615',
    },
    [Status.EM_PROGRESSO]: {
      color: '#3498db',
      background: '#3498db15',
    },
    [Status.REVISAO]: {
      color: '#f39c12',
      background: '#f39c1215',
    },
    [Status.CONCLUIDO]: {
      color: '#1D7206',
      background: '#1D720615',
    },
  };

  constructor(
    private exchangeService: ExchangeService,
    private colaboradorService: ColaboradoresService,
    private dashboardAdminService: DashboardAdminService,
    private authService: AuthService,
    private dashboardColaboradorService: DashboardColaboradorService,
    private modalCadastroService: ModalCadastroService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadTaxas();
    this.carregarPerfilUsuario();
    this.carregarResumoAtividadesUsuario();
  }

  ngAfterViewInit(): void {
    this.safeVideoUrl = this.buildSafeVideoUrl(this.videoUrl);
  }

  loadTaxas(): void {
    this.exchangeService.getExchangeRates().subscribe({
      next: (data) => {
        this.cotacoes = data;
      },
      error: (err) => console.error('Erro ao buscar taxas de câmbio:', err),
    });

    this.exchangeService.getSelicRate().subscribe({
      next: (valorSelic) => {
        this.selic = valorSelic.toFixed(2);
      },
      error: (err) => console.error('Erro ao buscar taxa Selic:', err),
    });
  }

  carregarPerfilUsuario(): void {
    this.authService.obterPerfilUsuario().subscribe({
      next: (usuario) => {
        this.usuario = usuario;

        switch (usuario.permissao) {
          case 'ROLE_ADMIN':
            this.permissaoUsuario = 'Administrador';
            break;
          case 'ROLE_COORDENADOR':
            this.permissaoUsuario = 'Coordenador';
            break;
          case 'ROLE_USER':
            this.permissaoUsuario = 'Colaborador';
            break;
          default:
            this.permissaoUsuario = 'Desconhecido';
        }

        if (usuario.setor && this.setoresMap[usuario.setor]) {
          this.setorUsuario = {
            nome: this.setoresMap[usuario.setor].nome,
            key: this.setoresMap[usuario.setor].key,
            icone: this.setoresMap[usuario.setor].icone,
            porcentagem: 0,
          };

          this.nomeSetorGrafico = this.setoresMap[usuario.setor].nome;
          this.carregarProgressoSetor(usuario.setor);
          this.carregarResumoSetor(usuario.setor);
          this.carregarGraficoAtividadesPorMes(usuario.setor);
          this.usuario = usuario;
        }

        try {
          const key = `videoSeen_${usuario.id}`;
          const seen = localStorage.getItem(key);
          // abrir apenas se não foi marcado como assistido
          if (!seen) {
            this.openModalVideo();
            console.log('Modal de vídeo aberto automaticamente');
          } else {
            console.log('Vídeo já marcado como assistido para', usuario.id);
          }
        } catch (e) {
          console.warn('Erro ao verificar videoSeen no localStorage', e);
        }
      },
      error: (error) => {
        console.error('Erro ao obter perfil do usuário:', error);
      },
    });
  }

  carregarProgressoSetor(setor: string): void {
    this.dashboardAdminService
      .getAtividadesConcluidasPorSetor(setor)
      .subscribe({
        next: (data: GraficoSetor) => {
          const porcentagem =
            data.total > 0
              ? Math.round((data.concluidas / data.total) * 100)
              : 0;
          this.setorUsuario.porcentagem = porcentagem;
        },
        error: () => {
          this.setorUsuario.porcentagem = 0;
        },
      });
  }

  carregarResumoAtividadesUsuario(): void {
    this.dashboardColaboradorService.getResumoAtividadesUsuario().subscribe({
      next: (resumo) => {
        this.resumoAtividadesUsuario = resumo;
      },
      error: (err) => {
        console.error('Erro ao buscar resumo das atividades do usuário:', err);
      },
    });
  }

  carregarResumoSetor(setor: Setor): void {
    const dataInicio = this.getDataInicioPeriodo();
    this.dashboardColaboradorService
      .getAtividadesResumoSetor(setor, dataInicio)
      .subscribe({
        next: (resumo) => {
          this.atividadesResumoSetor = resumo;
          console.log('Resumo de atividades do setor carregado:', resumo);
        },
        error: (err) => {
          console.error('Erro ao buscar resumo de atividades do setor:', err);
        },
      });
  }

  getDataInicioPeriodo(): string {
    if (!this.periodoSelecionado) {
      return this.getDataInicioAno();
    }

    const hoje = new Date();
    const dias = Number(this.periodoSelecionado);
    hoje.setDate(hoje.getDate() - dias);
    return hoje.toISOString().split('T')[0];
  }

  getDataInicioAno(): string {
    const hoje = new Date();
    const inicioAno = new Date(hoje.getFullYear(), 0, 1);
    return inicioAno.toISOString().split('T')[0];
  }

  carregarGraficoAtividadesPorMes(setor: Setor): void {
    this.dashboardColaboradorService.getAtividadesPorMesSetor(setor).subscribe({
      next: (data: GraficoAtividadesPorMes) => {
        console.log('Dados recebidos para atividades por mês:', data);
        this.atividadesPorMesSetor = data.valoresPorMes;
        this.totalAtividadesPorMes = data.total;
        this.atualizarGraficoAtividades();
      },
      error: (error) => {
        console.error('Erro ao carregar atividades por mês:', error);
        this.atividadesPorMesSetor = [];
        this.totalAtividadesPorMes = 0;
        this.graficoAtividadesMensaisSetor.series = [
          { name: 'Atividades', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        ];
      },
    });
  }

  atualizarGraficoAtividades(): void {
    const mesesOrdenados = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const dadosGrafico: number[] = [];

    mesesOrdenados.forEach((mes) => {
      const mesEncontrado = this.atividadesPorMesSetor.find(
        (m) => m.mes === mes
      );
      dadosGrafico.push(
        mesEncontrado ? Math.floor(mesEncontrado.quantidade) : 0
      );
    });

    this.graficoAtividadesMensaisSetor.series = [
      {
        name: 'Atividades',
        data: dadosGrafico,
      },
    ];
  }

  onPeriodoChange(novoPeriodo: string): void {
    this.periodoSelecionado = novoPeriodo;
    console.log('Novo período selecionado:', novoPeriodo);

    if (this.setorUsuarioEnum) {
      this.carregarResumoSetor(this.setorUsuarioEnum);
    }
  }

  getStatusConfig(status: Status): {
    label: string;
    color: string;
    background: string;
  } {
    const colors = this.statusColorsMap[status] || {
      color: '#666',
      background: '#f0f0f0',
    };

    return {
      label: StatusDescricao[status] || status,
      ...colors,
    };
  }

  openModalVideo(): void {
    this.safeVideoUrl = this.buildSafeVideoUrl(this.videoUrl);
    const open = () => {
      try {
        console.log(
          'Abrindo modal de vídeo, template:',
          this.videoModalTemplate
        );
        const key = `videoSeen_${this.usuario?.id ?? 'anon'}`;

        // callback chamado ao clicar no botão confirm (Assistido)
        const onConfirm = () => {
          try {
            localStorage.setItem(key, 'true'); // marca como assistido
          } catch (e) {
            console.warn(
              'Não foi possível salvar videoSeen no localStorage',
              e
            );
          }
          this.modalCadastroService.closeModal();
          setTimeout(() => {
            this.openModalAnuncio();
          }, 300); // pequeno delay para transição suave
        };

        // também abre o anúncio se clicar em Fechar (cancelar)
        const onCancel = () => {
          this.modalCadastroService.closeModal();
          setTimeout(() => {
            this.openModalAnuncio();
          }, 300);
        };

        // abre modal (passa callback de confirm)
        this.modalCadastroService.openModal(
          {
            title: 'Primeiro acesso',
            description: `Assista ao vídeo para entender como utilizar o sistema de forma eficiente.`,
            size: 'lg',
            confirmTextoBotao: 'Assistido',
            cancelTextoBotao: 'Fechar',
          },
          onConfirm,
          this.videoModalTemplate
        );
      } catch (err) {
        console.error('Erro ao abrir modal de vídeo:', err);
      }
    };

    if (!this.videoModalTemplate) {
      setTimeout(() => open(), 50);
    } else {
      open();
    }
  }

  private buildSafeVideoUrl(url: string): SafeResourceUrl {
    if (!url) return this.sanitizer.bypassSecurityTrustResourceUrl('');
    const ytMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/
    );
    if (ytMatch && ytMatch[1]) {
      const embed = `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(embed);
    }
    const driveMatch = url.match(
      /drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/
    );
    if (driveMatch && driveMatch[1]) {
      const embed = `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(embed);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  openModalAnuncio(): void {
    try {
      console.log('Abrindo modal de anúncio, template:', this.anuncioTemplate);

      const key = `anuncioSeen_${this.usuario?.id ?? 'anon'}`;
      const seen = localStorage.getItem(key);

      // só abre se não foi marcado como visto
      if (seen) {
        console.log('Anúncio já foi visto pelo usuário');
        return;
      }

      const onConfirm = () => {
        try {
          localStorage.setItem(key, 'true');
        } catch (e) {
          console.warn(
            'Não foi possível salvar anuncioSeen no localStorage',
            e
          );
        }
        this.modalCadastroService.closeModal();
      };

      this.modalCadastroService.openModal(
        {
          title: 'Aviso importante',
          description: 'Informação sobre o sistema',
          size: 'md',
          confirmTextoBotao: 'Entendi',
        },
        onConfirm,
        this.anuncioTemplate
      );
    } catch (err) {
      console.error('Erro ao abrir modal de anúncio:', err);
    }
  }
}
