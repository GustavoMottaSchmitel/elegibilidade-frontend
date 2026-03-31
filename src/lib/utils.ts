import type { StatusAtendimento, StatusContrato, StatusImportacao } from '@/types/api'

// ── Formatação ────────────────────────────────────────────────────────────

export function formatCpfCnpj(v: string): string {
  const n = v.replace(/\D/g, '').slice(0, 14)
  if (n.length <= 11) {
    if (n.length <= 3) return n
    if (n.length <= 6) return `${n.slice(0, 3)}.${n.slice(3)}`
    if (n.length <= 9) return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6)}`
    return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9, 11)}`
  }
  return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5, 8)}/${n.slice(8, 12)}-${n.slice(12, 14)}`
}

export function formatMoeda(v?: number): string {
  if (v == null) return '—'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

export function formatData(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric' }).format(d)
}

export function formatDataHora(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('pt-BR', {
    day:'2-digit', month:'2-digit', year:'numeric',
    hour:'2-digit', minute:'2-digit',
  }).format(d)
}

// ── Status de Atendimento ─────────────────────────────────────────────────

export const statusAtendimentoLabel: Record<StatusAtendimento, string> = {
  PODE_ATENDER:         'PODE ATENDER',
  ATENDER_COM_RESTRICAO:'COM RESTRIÇÃO',
  NAO_PODE_ATENDER:     'NÃO ATENDER',
  SEM_CONTRATO:         'SEM CONTRATO',
  CONTRATO_VENCIDO:     'CONTRATO VENCIDO',
  INADIMPLENTE:         'INADIMPLENTE',
  BLOQUEADO:            'BLOQUEADO',
  DADOS_INSUFICIENTES:  'DADOS INSUFICIENTES',
}

export function statusAtendimentoColor(s: StatusAtendimento) {
  switch (s) {
    case 'PODE_ATENDER':
      return { bg: 'bg-[#282a36]', text: 'text-[#50fa7b]', border: 'border-b border-[#282a36]', dot: '#50fa7b' }
    case 'ATENDER_COM_RESTRICAO':
      return { bg: 'bg-[#282a36]', text: 'text-[#f1fa8c]', border: 'border-b border-[#282a36]', dot: '#f1fa8c' }
    case 'SEM_CONTRATO':
    case 'DADOS_INSUFICIENTES':
      return { bg: 'bg-[#282a36]', text: 'text-[#6272a4]', border: 'border-b border-[#282a36]', dot: '#6272a4' }
    case 'NAO_PODE_ATENDER':
    case 'CONTRATO_VENCIDO':
    case 'INADIMPLENTE':
    case 'BLOQUEADO':
    default:
      return { bg: 'bg-[#282a36]', text: 'text-[#ff5555]', border: 'border-b border-[#282a36]', dot: '#ff5555' }
  }
}

// ── Status de Contrato ────────────────────────────────────────────────────

export const statusContratoLabel: Record<StatusContrato, string> = {
  ATIVO:          'Ativo',
  VENCIDO:        'Vencido',
  CANCELADO:      'Cancelado',
  SUSPENSO:       'Suspenso',
  EM_NEGOCIACAO:  'Em negociação',
}

export function statusContratoColor(s: StatusContrato) {
  switch (s) {
    case 'ATIVO':         return 'text-[#50fa7b] border-transparent bg-[#44475a]'
    case 'VENCIDO':       return 'text-[#ff5555] border-transparent bg-[#44475a]'
    case 'CANCELADO':     return 'text-[#ff5555] border-transparent bg-[#44475a]'
    case 'SUSPENSO':      return 'text-[#f1fa8c] border-transparent bg-[#44475a]'
    case 'EM_NEGOCIACAO': return 'text-[#f1fa8c] border-transparent bg-[#44475a]'
    default:              return 'text-[#6272a4] border-transparent bg-[#44475a]'
  }
}

// ── Status de Importação ──────────────────────────────────────────────────

export const statusImportacaoLabel: Record<StatusImportacao, string> = {
  PROCESSANDO:          'Processando',
  CONCLUIDO:            'Concluído',
  CONCLUIDO_COM_ERROS:  'Concluído c/ erros',
  ERRO:                 'Erro',
}

export function statusImportacaoColor(s: StatusImportacao) {
  switch (s) {
    case 'CONCLUIDO':           return 'text-[#50fa7b] bg-[#44475a] border-transparent'
    case 'CONCLUIDO_COM_ERROS': return 'text-[#f1fa8c] bg-[#44475a] border-transparent'
    case 'ERRO':                return 'text-[#ff5555] bg-[#44475a] border-transparent'
    default:                    return 'text-[#6272a4] bg-[#44475a] border-transparent'
  }
}
