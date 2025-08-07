import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

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

  constructor() {}

  ngOnInit(): void {}

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.mensagens.length === 0) {
      this.iniciarConversa();
    }
    if (!this.isOpen) {
      this.resetarConversa();
    }
  }

  iniciarConversa() {
    this.mensagens = [];
    this.inputMensagem = '';
    this.conversaEncerrada = false;
    this.digitarBot('Olá, tudo bem? Nos conte como podemos ajudar você hoje');
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
    this.mensagens.push({ autor: 'USER', texto: this.inputMensagem });
    const respostaBot =
      'Certo, nosso suporte já foi contactado, logo mais entraremos em contato e resolveremos sua solicitação. Se precisar de uma nova solicitação, inicie uma nova conversa.';
    this.inputMensagem = '';
    setTimeout(() => {
      this.digitarBot(respostaBot, () => {
        setTimeout(() => {
          this.mensagens.push({ autor: 'BOT', texto: 'Conversa encerrada.' });
          this.conversaEncerrada = true;
        }, 600);
      });
    }, 400);
  }

  fecharChat() {
    this.isOpen = false;
    this.resetarConversa();
  }

  novaSolicitacao() {
    this.resetarConversa();
    this.iniciarConversa();
  }

  resetarConversa() {
    this.mensagens = [];
    this.inputMensagem = '';
    this.digitandoBot = false;
    this.conversaEncerrada = false;
  }
}
