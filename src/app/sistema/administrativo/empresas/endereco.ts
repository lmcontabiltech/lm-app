export class Endereco {
  estado?: string;
  cidade?: string;
  cep?: string;
  bairro?: string;
  rua?: string;
  numero?: string;
  logradouro?: string;
  complemento?: string;
  pais?: string;

  toJson(): string {
    return JSON.stringify({
      estado: this.estado,
      cidade: this.cidade,
      cep: this.cep,
      bairro: this.bairro,
      rua: this.rua,
      numero: this.numero,
      logradouro: this.logradouro,
      complemento: this.complemento,
      pais: this.pais,
    });
  }
}
