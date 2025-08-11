import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { ColaboradoresService } from 'src/app/services/administrativo/colaboradores.service';

interface Mensagem {
  autor: 'BOT' | 'USER';
  texto: string;
  digitando?: boolean;
}

@Component({
  selector: 'app-bot-ti',
  templateUrl: './bot-ti.component.html',
  styleUrls: ['./bot-ti.component.css'],
  animations: [
    trigger('chatOpen', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'translateY(20px)' })
        ),
      ]),
    ]),
    trigger('mensagemAnimada', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class BotTiComponent implements OnInit {
  isOpen = false;
  mensagens: Mensagem[] = [];
  inputMensagem = '';
  digitandoBot = false;
  conversaEncerrada = false;
  podeEncerrar = false;

  nome = '';
  marca = 'DRC Suporte de TI';
  protocolo = '';

  constructor(
    private authService: AuthService,
    private colaboradoresService: ColaboradoresService
  ) {}

  ngOnInit(): void {
    this.protocolo = Math.floor(100000 + Math.random() * 900000).toString();
    this.authService.obterPerfilUsuario().subscribe({
      next: (usuario) => {
        this.nome = usuario.nome || 'Usuário';
      },
      error: () => {
        this.nome = 'Usuário';
      },
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.authService.obterPerfilUsuario().subscribe({
        next: (usuario) => {
          this.nome = usuario.nome || 'Usuário';
          if (this.mensagens.length === 0) {
            this.iniciarConversa();
          }
        },
        error: () => {
          this.nome = 'Usuário';
          if (this.mensagens.length === 0) {
            this.iniciarConversa();
          }
        },
      });
    }
    if (!this.isOpen) {
      this.resetarConversa();
    }
  }

  iniciarConversa(novaSolicitacao: boolean = false) {
    this.mensagens = [];
    this.inputMensagem = '';
    this.conversaEncerrada = false;
    const textoInicial = novaSolicitacao
      ? `Seja bem-vindo novamente ${this.nome}! Como podemos ajudar você desta vez?`
      : `Olá, ${this.nome} tudo bem? Em que posso te ajudar?`;
    this.digitarBot(textoInicial);
  }

  digitarBot(texto: string, callback?: () => void) {
    this.digitandoBot = true;
    this.mensagens.push({ autor: 'BOT', texto: '', digitando: true });
    setTimeout(() => {
      this.mensagens.pop();
      let msg = '';
      this.mensagens.push({ autor: 'BOT', texto: msg });
      let i = 0;
      const intervalo = setInterval(() => {
        if (i < texto.length) {
          msg += texto[i];
          this.mensagens[this.mensagens.length - 1].texto = msg;
          i++;
        } else {
          clearInterval(intervalo);
          this.digitandoBot = false;
          if (callback) callback();
        }
      }, 18);
    }, 1000);
  }

  enviarMensagem() {
    if (
      !this.inputMensagem.trim() ||
      this.digitandoBot ||
      this.conversaEncerrada
    )
      return;

    // Adiciona mensagem do usuário ao chat
    this.mensagens.push({ autor: 'USER', texto: this.inputMensagem });

    // Envia mensagem ao suporte
    this.colaboradoresService.enviarEmailSuporte(this.inputMensagem).subscribe({
      next: (resposta) => {
        // Captura o protocolo retornado pelo backend
        this.protocolo = resposta?.idSolicitacao || '';
        const respostaBot = `Perfeito! Já acionamos nosso time de suporte. Em breve entraremos em contato para resolver sua solicitação. Protocolo: ${this.protocolo}`;
        this.inputMensagem = '';
        setTimeout(() => {
          this.digitarBot(respostaBot, () => {
            setTimeout(() => {
              this.mensagens.push({
                autor: 'BOT',
                texto: `Atendimento encerrado. Se precisar de algo, é só chamar novamente a ${this.marca}.`,
              });
              this.conversaEncerrada = true;
            }, 600);
          });
        }, 400);
      },
      error: () => {
        // Erro: mostra mensagem de erro do bot
        this.inputMensagem = '';
        this.digitarBot(
          'Desculpe, não foi possível enviar sua mensagem ao suporte. Tente novamente mais tarde.',
          () => {
            setTimeout(() => {
              this.mensagens.push({
                autor: 'BOT',
                texto: `Atendimento encerrado. Se precisar de algo, é só chamar novamente a ${this.marca}.`,
              });
              this.conversaEncerrada = true;
            }, 600);
          }
        );
      },
    });
  }

  fecharChat() {
    this.isOpen = false;
    this.resetarConversa();
  }

  novaSolicitacao() {
    this.resetarConversa();
    this.iniciarConversa(true);
  }

  resetarConversa() {
    this.mensagens = [];
    this.inputMensagem = '';
    this.digitandoBot = false;
    this.conversaEncerrada = false;
  }
}
