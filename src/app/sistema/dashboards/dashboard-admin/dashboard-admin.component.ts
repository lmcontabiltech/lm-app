import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/login/usuario';
import { ColaboradoresService } from 'src/app/services/administrativo/colaboradores.service';
import { ExchangeService } from 'src/app/services/exchange.service';
import { RegimeDaEmpresa } from '../../administrativo/empresas/enums/regime-da-empresa';
import { RegimeDaEmpresaDescricao } from '../../administrativo/empresas/enums/regime-da-empresa-descricao';
import { Setor } from '../../administrativo/cadastro-de-colaborador/setor';
import {
  GraficoFuncionariosPorSetor,
  FuncionarioPorSetor,
} from 'src/app/sistema/dashboards/dashboard-admin/models/funcionarios-por-setor';
import {
  AtividadePorMes,
  GraficoAtividadesPorMes,
} from 'src/app/sistema/dashboards/dashboard-admin/models/atividades-por-mes';
import {
  EmpresaPorRegime,
  GraficoEmpresasPorRegime,
} from 'src/app/sistema/dashboards/dashboard-admin/models/empresa-por-regime';
import { DashboardAtividadesPorSetorResponseDTO } from './models/atividades-por-setor';
import {
  DashboardAdminService,
  GraficoSetor,
} from 'src/app/services/graficos/dashboard-admin.service';
import { forkJoin } from 'rxjs';
import { PeriodoDias } from './enums/periodo-dias';
import { PeriodoDiasDescricao } from './enums/periodo-dias-descricao';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css'],
})
export class DashboardAdminComponent implements OnInit {
  usuario: Usuario | null = null;
  cotacoes: any = {};
  selic: string = '';
  permissaoUsuario: string = '';

  totalColaboradores: number = 0;
  totalEmpresas: number = 0;
  totalAtividadesNaoAtribuidas: number = 0;

  funcionariosPorSetor: FuncionarioPorSetor[] = [];
  totalFuncionarios: number = 0;
  graficoFuncionarios = {
    series: [{ name: 'Funcionários', data: [0, 0, 0, 0, 0] }],
    categories: ['Contábil', 'Fiscal', 'Financeiro', 'Paralegal', 'Pessoal'],
    colors: ['#08195D', '#1F337F', '#4a59a0', '#585A60', '#5a5f7b'],
  };

  atividadesPorMes: AtividadePorMes[] = [];
  totalAtividadesAno: number = 0;
  graficoAtividadesMensais = {
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

  empresasPorRegime: EmpresaPorRegime[] = [];
  totalEmpresasRegime: number = 0;
  graficoEmpresasRegime = {
    series: [] as number[],
    labels: [] as string[],
    colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'],
  };

  progressoAtividades: {
    [key: string]: { porcentagem: number };
  } = {
    contabil: { porcentagem: 0 },
    fiscal: { porcentagem: 0 },
    pessoal: { porcentagem: 0 },
    paralegal: { porcentagem: 0 },
    financeiro: { porcentagem: 0 },
  };

  resumoAtividadesSetores: {
    [key: string]: DashboardAtividadesPorSetorResponseDTO;
  } = {};

  graficosAtividadesPorSetor: { [key: string]: any } = {
    CONTABIL: {
      abertas: {
        series: [{ name: 'Abertas', data: [0, 0, 0] }],
        categories: ['No prazo', 'Em atraso', 'Com multas'],
      },
      concluidas: {
        series: [{ name: 'Concluídas', data: [0, 0, 0] }],
        categories: ['No prazo', 'Em atraso', 'Com multas'],
      },
    },
    FISCAL: {
      abertas: {
        series: [{ name: 'Abertas', data: [0, 0, 0] }],
        categories: ['No prazo', 'Em atraso', 'Com multas'],
      },
      concluidas: {
        series: [{ name: 'Concluídas', data: [0, 0, 0] }],
        categories: ['No prazo', 'Em atraso', 'Com multas'],
      },
    },
    PESSOAL: {
      abertas: {
        series: [{ name: 'Abertas', data: [0, 0, 0] }],
        categories: ['No prazo', 'Em atraso', 'Com multas'],
      },
      concluidas: {
        series: [{ name: 'Concluídas', data: [0, 0, 0] }],
        categories: ['No prazo', 'Em atraso', 'Com multas'],
      },
    },
    PARALEGAL: {
      abertas: {
        series: [{ name: 'Abertas', data: [0, 0, 0] }],
        categories: ['No prazo', 'Em atraso', 'Com multas'],
      },
      concluidas: {
        series: [{ name: 'Concluídas', data: [0, 0, 0] }],
        categories: ['No prazo', 'Em atraso', 'Com multas'],
      },
    },
    FINANCEIRO: {
      abertas: {
        series: [{ name: 'Abertas', data: [0, 0, 0] }],
        categories: ['No prazo', 'Em atraso', 'Com multas'],
      },
      concluidas: {
        series: [{ name: 'Concluídas', data: [0, 0, 0] }],
        categories: ['No prazo', 'Em atraso', 'Com multas'],
      },
    },
  };

  periodos = Object.keys(PeriodoDias).map((key) => ({
    value: PeriodoDias[key as keyof typeof PeriodoDias],
    description:
      PeriodoDiasDescricao[PeriodoDias[key as keyof typeof PeriodoDias]],
  }));

  periodoSelecionadoSetor: { [key: string]: string } = {
    CONTABIL: '',
    FISCAL: '',
    PESSOAL: '',
    PARALEGAL: '',
    FINANCEIRO: '',
  };

  constructor(
    private exchangeService: ExchangeService,
    private colaboradorService: ColaboradoresService,
    private dashboardAdminService: DashboardAdminService
  ) {}

  ngOnInit(): void {
    this.loadTaxas();
    this.carregarProgressoSetores();
    this.carregarDadosGeral();
    this.carregarFuncionariosPorSetor();
    this.carregarAtividadesPorMes();
    this.carregarEmpresasPorRegime();
    this.carregarResumoAtividadesSetores();

    this.colaboradorService.getUsuarioByToken().subscribe(
      (usuario) => {
        this.usuario = usuario;
        console.log('Perfil do usuário:', usuario);

        // 🔹 Mapeamento da permissão
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
      },
      (error) => {
        console.error('Erro ao obter perfil do usuário:', error);
      }
    );
  }

  loadTaxas(): void {
    this.exchangeService.getExchangeRates().subscribe({
      next: (data) => {
        this.cotacoes = data;
        console.log('Cotações armazenadas:', this.cotacoes);
      },
      error: (err) => console.error('Erro ao buscar taxas de câmbio:', err),
    });

    this.exchangeService.getSelicRate().subscribe({
      next: (valorSelic) => {
        this.selic = valorSelic.toFixed(2);
        console.log('Taxa Selic:', this.selic);
      },
      error: (err) => console.error('Erro ao buscar taxa Selic:', err),
    });
  }

  carregarProgressoSetores() {
    const setores = [
      { key: 'contabil', nome: 'CONTABIL' },
      { key: 'fiscal', nome: 'FISCAL' },
      { key: 'pessoal', nome: 'PESSOAL' },
      { key: 'paralegal', nome: 'PARALEGAL' },
      { key: 'financeiro', nome: 'FINANCEIRO' },
    ];

    setores.forEach((setor) => {
      this.dashboardAdminService
        .getAtividadesConcluidasPorSetor(setor.nome)
        .subscribe({
          next: (data: GraficoSetor) => {
            const porcentagem =
              data.total > 0
                ? Math.round((data.concluidas / data.total) * 100)
                : 0;
            this.progressoAtividades[setor.key].porcentagem = porcentagem;
          },
          error: () => {
            this.progressoAtividades[setor.key].porcentagem = 0;
          },
        });
    });
  }

  carregarDadosGeral(): void {
    const requests = {
      colaboradores: this.dashboardAdminService.getQuantidadeUsuarios(),
      empresas: this.dashboardAdminService.getQuantidadeEmpresasNumero(),
      atividadesNaoAtribuidas:
        this.dashboardAdminService.getQuantidadeAtividadesNaoAtribuidas(),
    };

    forkJoin(requests).subscribe({
      next: (data) => {
        this.totalColaboradores = data.colaboradores.total;
        this.totalEmpresas = data.empresas.total;
        this.totalAtividadesNaoAtribuidas = data.atividadesNaoAtribuidas.total;

        console.log('Dados do dashboard carregados:', {
          colaboradores: this.totalColaboradores,
          empresas: this.totalEmpresas,
          atividadesNaoAtribuidas: this.totalAtividadesNaoAtribuidas,
        });
      },
      error: (error) => {
        console.error('Erro ao carregar dados do dashboard:', error);
        this.totalColaboradores = 0;
        this.totalEmpresas = 0;
        this.totalAtividadesNaoAtribuidas = 0;
      },
    });
  }

  carregarFuncionariosPorSetor(): void {
    this.dashboardAdminService.getFuncionariosPorSetor().subscribe({
      next: (data: GraficoFuncionariosPorSetor) => {
        this.funcionariosPorSetor = data.setores;
        this.totalFuncionarios = Math.floor(data.total);

        this.atualizarGraficoFuncionarios();
      },
      error: (error) => {
        console.error('Erro ao carregar funcionários por setor:', error);
        this.funcionariosPorSetor = [];
        this.totalFuncionarios = 0;
        this.graficoFuncionarios.series = [
          { name: 'Funcionários', data: [0, 0, 0, 0, 0] },
        ];
      },
    });
  }

  atualizarGraficoFuncionarios(): void {
    const setoresOrdenados = [
      'CONTABIL',
      'FISCAL',
      'FINANCEIRO',
      'PARALEGAL',
      'PESSOAL',
    ];
    const dadosGrafico: number[] = [];

    setoresOrdenados.forEach((setor) => {
      const setorEncontrado = this.funcionariosPorSetor.find(
        (s) => s.setor === setor
      );
      dadosGrafico.push(
        setorEncontrado ? Math.floor(setorEncontrado.qtdFuncionarios) : 0
      );
    });

    this.graficoFuncionarios.series = [
      {
        name: 'Funcionários',
        data: dadosGrafico,
      },
    ];
  }

  getFuncionariosPorSetorEspecifico(setor: string): number {
    const setorEncontrado = this.funcionariosPorSetor.find(
      (s) => s.setor === setor
    );
    return setorEncontrado ? Math.floor(setorEncontrado.qtdFuncionarios) : 0;
  }

  carregarAtividadesPorMes(): void {
    this.dashboardAdminService.getAtividadesPorMes().subscribe({
      next: (data: GraficoAtividadesPorMes) => {
        this.atividadesPorMes = data.valoresPorMes;
        this.totalAtividadesAno = data.total;

        this.atualizarGraficoAtividades();

        console.log('Atividades por mês:', this.atividadesPorMes);
        console.log('Total de atividades no ano:', this.totalAtividadesAno);
      },
      error: (error) => {
        console.error('Erro ao carregar atividades por mês:', error);
        this.atividadesPorMes = [];
        this.totalAtividadesAno = 0;
        this.graficoAtividadesMensais.series = [
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
      const mesEncontrado = this.atividadesPorMes.find((m) => m.mes === mes);
      dadosGrafico.push(
        mesEncontrado ? Math.floor(mesEncontrado.quantidade) : 0
      );
    });

    this.graficoAtividadesMensais.series = [
      {
        name: 'Atividades',
        data: dadosGrafico,
      },
    ];

    console.log(
      'Dados do gráfico de atividades atualizados:',
      this.graficoAtividadesMensais.series
    );
  }

  carregarEmpresasPorRegime(): void {
    this.dashboardAdminService.getEmpresasPorRegime().subscribe({
      next: (data: GraficoEmpresasPorRegime) => {
        this.empresasPorRegime = data.regimes;
        this.totalEmpresasRegime = data.total;

        this.atualizarGraficoEmpresasRegime();
      },
      error: (error) => {
        console.error('Erro ao carregar empresas por regime:', error);
        this.empresasPorRegime = [];
        this.totalEmpresasRegime = 0;
        this.graficoEmpresasRegime.series = [0, 0, 0];
      },
    });
  }

  private getDescricaoRegime(regimeEnum: string): string {
    const regimeKey = Object.keys(RegimeDaEmpresa).find(
      (key) =>
        RegimeDaEmpresa[key as keyof typeof RegimeDaEmpresa] === regimeEnum
    );

    if (
      regimeKey &&
      RegimeDaEmpresaDescricao[
        regimeKey as keyof typeof RegimeDaEmpresaDescricao
      ]
    ) {
      return RegimeDaEmpresaDescricao[
        regimeKey as keyof typeof RegimeDaEmpresaDescricao
      ];
    }

    return this.formatarRegimeParaExibicao(regimeEnum);
  }

  private formatarRegimeParaExibicao(regime: string): string {
    return regime
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  atualizarGraficoEmpresasRegime(): void {
    const regimesComEmpresas = this.empresasPorRegime.filter(
      (regime) => regime.qtdEmpresas > 0
    );

    const regimesParaExibir =
      regimesComEmpresas.length > 0
        ? regimesComEmpresas
        : this.empresasPorRegime;

    const series: number[] = [];
    const labels: string[] = [];

    regimesParaExibir.forEach((regime) => {
      series.push(Math.floor(regime.qtdEmpresas));
      labels.push(this.getDescricaoRegime(regime.regimeEmpresa));
    });

    this.graficoEmpresasRegime = {
      ...this.graficoEmpresasRegime,
      series: series,
      labels: labels,
    };
  }

  getEmpresasPorRegimeEspecifico(regime: RegimeDaEmpresa): number {
    const regimeEncontrado = this.empresasPorRegime.find(
      (r) => r.regimeEmpresa === regime
    );
    return regimeEncontrado ? Math.floor(regimeEncontrado.qtdEmpresas) : 0;
  }

  getRegimesDisponiveis(): {
    regime: RegimeDaEmpresa;
    descricao: string;
    quantidade: number;
  }[] {
    return this.empresasPorRegime.map((empresaRegime) => ({
      regime: empresaRegime.regimeEmpresa as RegimeDaEmpresa,
      descricao: this.getDescricaoRegime(empresaRegime.regimeEmpresa),
      quantidade: Math.floor(empresaRegime.qtdEmpresas),
    }));
  }

  temRegime(regime: RegimeDaEmpresa): boolean {
    return this.empresasPorRegime.some((r) => r.regimeEmpresa === regime);
  }

  carregarResumoAtividadesSetores(): void {
    const dataInicio = this.getDataInicioAno();
    const setores = [
      Setor.CONTABIL,
      Setor.FISCAL,
      Setor.PESSOAL,
      Setor.PARALEGAL,
      Setor.FINANCEIRO,
    ];

    const requests = setores.map((setor) =>
      this.dashboardAdminService.getAtividadesResumoSetor(setor, dataInicio)
    );

    forkJoin(requests).subscribe({
      next: (resultados) => {
        setores.forEach((setor, index) => {
          this.resumoAtividadesSetores[setor] = resultados[index];
          this.atualizarGraficosSetor(setor, resultados[index]);
        });
      },
      error: (error) => {
        this.resetarGraficosSetores();
      },
    });
  }

  private atualizarGraficosSetor(
    setor: Setor,
    dados: DashboardAtividadesPorSetorResponseDTO
  ): void {
    // Dados para gráfico de atividades ABERTAS
    const dadosAbertas = [
      dados.abertas.noPrazo,
      dados.abertas.emAtraso,
      dados.abertas.comMultas,
    ];

    // Dados para gráfico de atividades CONCLUÍDAS
    const dadosConcluidas = [
      dados.concluidas.noPrazo,
      dados.concluidas.emAtraso,
      dados.concluidas.comMultas,
    ];

    this.graficosAtividadesPorSetor[setor] = {
      abertas: {
        series: [{ name: 'Abertas', data: dadosAbertas }],
        categories: ['No prazo', 'Em atraso', 'Com multas'],
      },
      concluidas: {
        series: [{ name: 'Concluídas', data: dadosConcluidas }],
        categories: ['No prazo', 'Em atraso', 'Com multas'],
      },
    };

    console.log(
      `Gráficos do setor ${setor} atualizados:`,
      this.graficosAtividadesPorSetor[setor]
    );
  }

  private getDataInicioAno(): string {
    const anoAtual = new Date().getFullYear();
    return `${anoAtual}-01-01`;
  }

  private resetarGraficosSetores(): void {
    Object.keys(this.graficosAtividadesPorSetor).forEach((setor) => {
      this.graficosAtividadesPorSetor[setor] = {
        abertas: {
          series: [{ name: 'Abertas', data: [0, 0, 0] }],
          categories: ['No prazo', 'Em atraso', 'Com multas'],
        },
        concluidas: {
          series: [{ name: 'Concluídas', data: [0, 0, 0] }],
          categories: ['No prazo', 'Em atraso', 'Com multas'],
        },
      };
    });
  }

  getTotalAtividadesAbertas(setor: Setor): number {
    const resumo = this.resumoAtividadesSetores[setor];
    if (!resumo) return 0;
    return (
      resumo.abertas.noPrazo +
      resumo.abertas.emAtraso +
      resumo.abertas.comMultas
    );
  }

  getTotalAtividadesConcluidas(setor: Setor): number {
    const resumo = this.resumoAtividadesSetores[setor];
    if (!resumo) return 0;
    return (
      resumo.concluidas.noPrazo +
      resumo.concluidas.emAtraso +
      resumo.concluidas.comMultas
    );
  }

  getGraficoAbertas(setor: string): any {
    return (
      this.graficosAtividadesPorSetor[setor]?.abertas || {
        series: [{ name: 'Abertas', data: [0, 0, 0] }],
        categories: ['No prazo', 'Em atraso', 'Com multas'],
      }
    );
  }

  getGraficoConcluidas(setor: string): any {
    return (
      this.graficosAtividadesPorSetor[setor]?.concluidas || {
        series: [{ name: 'Concluídas', data: [0, 0, 0] }],
        categories: ['No prazo', 'Em atraso', 'Com multas'],
      }
    );
  }

  recarregarDadosSetor(setor: Setor): void {
    const dataInicio = this.getDataInicioAno();

    this.dashboardAdminService
      .getAtividadesResumoSetor(setor, dataInicio)
      .subscribe({
        next: (dados) => {
          this.resumoAtividadesSetores[setor] = dados;
          this.atualizarGraficosSetor(setor, dados);
          console.log(`Dados do setor ${setor} recarregados:`, dados);
        },
        error: (error) => {
          console.error(`Erro ao recarregar dados do setor ${setor}:`, error);
        },
      });
  }

  carregarResumoAtividadesSetor(setor: Setor): void {
    const dataInicio = this.getDataInicioPeriodoSetor(setor);
    this.dashboardAdminService
      .getAtividadesResumoSetor(setor, dataInicio)
      .subscribe({
        next: (dados) => {
          this.resumoAtividadesSetores[setor] = dados;
          this.atualizarGraficosSetor(setor, dados);
        },
        error: () => {},
      });
  }

  onPeriodoChangeSetor(setor: string, novoPeriodo: string) {
    const setorEnum = Setor[setor as keyof typeof Setor];
    this.periodoSelecionadoSetor[setorEnum] = novoPeriodo;
    this.carregarResumoAtividadesSetor(setorEnum);
  }

  getDataInicioPeriodoSetor(setor: Setor): string {
    const hoje = new Date();
    const dias = Number(this.periodoSelecionadoSetor[setor]) || 7;
    hoje.setDate(hoje.getDate() - dias);
    return hoje.toISOString().split('T')[0];
  }

  resetPeriodo() {
    Object.keys(this.periodoSelecionadoSetor).forEach((setor) => {
      this.periodoSelecionadoSetor[setor] = PeriodoDias.SETE;
    });
    this.carregarResumoAtividadesSetores();
  }
}
