import { Setor } from "../sistema/administrativo/cadastro-de-colaborador/setor";
import { Permissao } from "./permissao"; 

export class Usuario {
  id!: string;
  fotoUrl!: any;
  username!: string;
  password!: string;
  confirmPassword!: string;
  email!: string;
  nome!: string;
  tipoUsuario!: string;
  permissao!: Permissao;  
  setor!: Setor;
  darkMode!: boolean;
}
