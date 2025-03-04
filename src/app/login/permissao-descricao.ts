import { Permissao } from "./permissao";

export const PermissaoDescricoes: Record<Permissao, string> = {
    [Permissao.ADMIN]: 'ADMIN',
    [Permissao.COORDENADOR]: "COORDENADOR",
    [Permissao.USER]: 'COLABORADOR'
}