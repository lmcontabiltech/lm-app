import { Setor } from "./setor";

export const SetorDescricao: Record<Setor, string> = {
    [Setor.CONTABIL]: 'Contábil',
    [Setor.FISCAL]: 'Fiscal',
    [Setor.PESSOAL]: 'Pessoal',
    [Setor.PARALEGAL]: 'Paralegal',
    [Setor.FINANCEIRO]: 'Financeiro',
    [Setor.JURIDICO]: 'Jurídico',
    [Setor.ADMINISTRATIVO]: 'Administrativo',
    [Setor.RH]: 'Recursos Humanos',
    [Setor.SUPORTE_TI]: 'Suporte de TI',
    [Setor.ESTAGIARIO]: 'Estagiário',
    [Setor.OUTRO]: 'Outro'
};
