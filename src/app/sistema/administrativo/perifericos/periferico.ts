export class Periferico {
  id!: string;
  nome!: string;
  descricaoProduto!: string;
  dataEntrega!: string;
  dataDevolucao!: string;
  idColaborador?: number;
  anotacao!: string;
  estacao!: string;
  tipoPosse!: string;
  colaborador!: { id: string; nome: string };
  fotoUrl?: string;

  toJson?(): string {
    return JSON.stringify({
      nome: this.nome,
      descricaoProduto: this.descricaoProduto,
      dataEntrega: this.dataEntrega,
      dataDevolucao: this.dataDevolucao,
      idColaborador: this.idColaborador,
      anotacao: this.anotacao,
      estacao: this.estacao,
      tipoPosse: this.tipoPosse,
    });
  }
}
