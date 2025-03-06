import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  chatForm: FormGroup;
  selectedChat: string = 'Todos os setores';
  notifications: { [key: string]: number } = {
    'Todos os setores': 3,
    'Setor Fiscal': 0,
    'Setor Pessoal': 2,
    'Setor Contábil': 4,
    'Setor Paralegal': 0,
    'Setor Financeiro': 0,
  };

  constructor(
    private router: Router,
  ) {
    this.chatForm = new FormGroup({
      replymessage: new FormControl(),
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  onSearch(searchTerm: string) {
    console.log('Search term:', searchTerm);
  }

  // Carrega mensagens do chat atual
  carregarChat() {
  }

  // Carrega lista de chats do usuário logado
  loadUserChats() {
  }

  // Carrega lista de usuários para exibição no chat
  loadAllUsers() {
  }

  // Abre um chat existente ou cria um novo
  goToChat() {
  }

  selectChat(chat: string) {
    this.selectedChat = chat;
    // Implementar a lógica para carregar o chat selecionado
  }

  getNotificationCount(chat: string): number {
    return this.notifications[chat] || 0;
  }

  // Envia mensagem no chat atual
  enviarMensagem() {
  }
}
