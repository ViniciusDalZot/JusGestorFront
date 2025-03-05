export interface Processo {
    id: number;
    numero: string;
    valor_causa: number | null;
    tipo_processo: string | null;
    status: string;
    fase_processo: string | null;
    data_distribuicao: string | null;
    data_ultima_movimentacao: string | null;
    origem_processo: string | null;
    responsavel_processo: string | null;
    observacoes_internas: string | null;
    criadoEm: string;
  }
  