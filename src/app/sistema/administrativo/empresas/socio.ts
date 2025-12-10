import { Endereco } from './endereco';
import { EstadoCivil } from './enums/estado-civil';

export class Socio {
  nome?: string;
  cpf?: string;
  estadoCivil?: EstadoCivil;
  endereco?: Endereco;
  telefone?: string;
  whatsapp?: string;
  email?: string;
  inscricaoEstadual?: string;

  toJson(): string {
    return JSON.stringify({
      nome: this.nome,
      cpf: this.cpf,
      estadoCivil: this.estadoCivil,
      endereco: this.endereco ? JSON.parse(this.endereco.toJson()) : null,
      telefone: this.telefone,
      whatsapp: this.whatsapp,
      email: this.email,
      inscricaoEstadual: this.inscricaoEstadual,
    });
  }
}
