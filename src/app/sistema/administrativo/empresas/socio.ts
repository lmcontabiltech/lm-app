import { Endereco } from './endereco';
import { EstadoCivil } from './enums/estado-civil';

export class Socio {
  nomeCompleto?: string;
  cpf?: string;
  estadoCivil?: EstadoCivil;
  endereco?: Endereco;
  telefone?: string;
  whatsapp?: string;
  email?: string;
  inscricaoEstadual?: string;

  toJson(): string {
    return JSON.stringify({
      nomeCompleto: this.nomeCompleto,
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
