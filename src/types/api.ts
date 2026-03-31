// ── Enums ──────────────────────────────────────────────────────────────────

export type StatusAtendimento =
  | 'PODE_ATENDER'
  | 'ATENDER_COM_RESTRICAO'
  | 'NAO_PODE_ATENDER'
  | 'SEM_CONTRATO'
  | 'CONTRATO_VENCIDO'
  | 'INADIMPLENTE'
  | 'BLOQUEADO'
  | 'DADOS_INSUFICIENTES'

export type StatusContrato =
  | 'ATIVO'
  | 'VENCIDO'
  | 'CANCELADO'
  | 'SUSPENSO'
  | 'EM_NEGOCIACAO'

export type StatusImportacao =
  | 'PROCESSANDO'
  | 'CONCLUIDO'
  | 'CONCLUIDO_COM_ERROS'
  | 'ERRO'

// ── DTOs ──────────────────────────────────────────────────────────────────

export interface ClienteResumoDto {
  id: number
  cnpj: string
  razaoSocial: string
  nomeFantasia?: string
  cidade?: string
  estado?: string
}

export interface ContratoResumoDto {
  id: number
  numeroContrato: string
  tipoContrato: string
  statusContrato: StatusContrato
  dataInicio?: string
  dataFim?: string
  valorMensal?: number
  observacao?: string
  referencia?: string
  descricao?: string
}

export interface FinanceiroResumoDto {
  possuiDebito: boolean
  valorEmAberto: number
  diasAtraso: number
  dataUltimoPagamento?: string
}

export interface StatusAtendimentoResponse {
  cliente: ClienteResumoDto
  statusAtendimento: StatusAtendimento
  motivo: string
  contrato?: ContratoResumoDto
  financeiro?: FinanceiroResumoDto
  ultimaAtualizacao: string
}

export interface ContratoDetalheDto {
  id: number
  numeroContrato: string
  tipoContrato: string
  statusContrato: StatusContrato
  dataInicio?: string
  dataFim?: string
  ativo: boolean
  valorMensal?: number
  observacao?: string
}

export interface FinanceiroDetalheDto {
  id: number
  numeroContrato?: string
  possuiDebito: boolean
  valorEmAberto: number
  diasAtraso: number
  dataUltimoPagamento?: string
  atualizadoEm: string
}

export interface ClienteDetalheResponse {
  id: number
  cnpj: string
  razaoSocial: string
  nomeFantasia?: string
  email?: string
  telefone?: string
  cidade?: string
  estado?: string
  ativo: boolean
  criadoEm: string
  atualizadoEm: string
  contratos: ContratoDetalheDto[]
  financeiros: FinanceiroDetalheDto[]
}

export interface DashboardResponse {
  totalClientesAtivos: number
  totalInadimplentes: number
  totalBloqueados: number
  contratosVencendo30Dias: number
  totalContratosAtivos: number
  geradoEm: string
}

export interface ImportacaoCsv {
  id: number
  nomeArquivo: string
  dataImportacao: string
  totalRegistros: number
  registrosSucesso: number
  registrosErro: number
  status: StatusImportacao
  detalhesErro?: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}
