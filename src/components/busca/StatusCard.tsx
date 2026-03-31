'use client'
import type { StatusAtendimentoResponse } from '@/types/api'
import { statusAtendimentoColor, statusAtendimentoLabel, formatCpfCnpj, formatMoeda, formatData, formatDataHora } from '@/lib/utils'
import { StatusContratoBadge } from '@/components/ui'
import {
  CheckCircle2, XCircle, AlertTriangle, HelpCircle,
  Building2, FileText, Wallet, Tag, ScrollText, ChevronDown, ChevronUp,
} from 'lucide-react'
import clsx from 'clsx'
import { useState } from 'react'

interface Props { data: StatusAtendimentoResponse }

// ── Ícone por status ──────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: string }) {
  const sz = 'w-5 h-5'
  switch (status) {
    case 'PODE_ATENDER':          return <CheckCircle2 className={clsx(sz, 'text-[#50fa7b]')} />
    case 'ATENDER_COM_RESTRICAO': return <AlertTriangle className={clsx(sz, 'text-[#f1fa8c]')} />
    case 'DADOS_INSUFICIENTES':
    case 'SEM_CONTRATO':          return <HelpCircle className={clsx(sz, 'text-[#6272a4]')} />
    default:                      return <XCircle className={clsx(sz, 'text-[#ff5555]')} />
  }
}

// ── Cores por status ──────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, { bar: string; badge: string; text: string }> = {
  PODE_ATENDER:         { bar: '#50fa7b', badge: 'rgba(80,250,123,0.12)', text: '#50fa7b' },
  ATENDER_COM_RESTRICAO:{ bar: '#f1fa8c', badge: 'rgba(241,250,140,0.12)', text: '#f1fa8c' },
  NAO_PODE_ATENDER:     { bar: '#ff5555', badge: 'rgba(255,85,85,0.12)',  text: '#ff5555' },
  SEM_CONTRATO:         { bar: '#6272a4', badge: 'rgba(98,114,164,0.12)', text: '#6272a4' },
  CONTRATO_VENCIDO:     { bar: '#ff5555', badge: 'rgba(255,85,85,0.12)',  text: '#ff5555' },
  INADIMPLENTE:         { bar: '#ff5555', badge: 'rgba(255,85,85,0.12)',  text: '#ff5555' },
  BLOQUEADO:            { bar: '#ff5555', badge: 'rgba(255,85,85,0.12)',  text: '#ff5555' },
  DADOS_INSUFICIENTES:  { bar: '#6272a4', badge: 'rgba(98,114,164,0.12)', text: '#6272a4' },
}

// ── Componente principal ──────────────────────────────────────────────────────

export function StatusCard({ data }: Props) {
  const { cliente, statusAtendimento, motivo, contrato, financeiro, ultimaAtualizacao } = data
  const style = STATUS_STYLE[statusAtendimento] ?? STATUS_STYLE.DADOS_INSUFICIENTES

  return (
    <div className="space-y-3 animate-fade-up">

      {/* ── Banner de status ── */}
      <div className="panel overflow-hidden">
        {/* Barra colorida no topo */}
        <div className="h-1 w-full" style={{ background: style.bar }} />

        <div className="px-6 py-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: style.badge }}>
            <StatusIcon status={statusAtendimento} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-base" style={{ color: style.text }}>
              {statusAtendimentoLabel[statusAtendimento]}
            </p>
            <p className="text-[#6272a4] text-sm mt-0.5 leading-relaxed">{motivo}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-[#6272a4] font-mono">atualizado</p>
            <p className="text-[11px] text-[#6272a4] font-mono">{formatDataHora(ultimaAtualizacao)}</p>
          </div>
        </div>
      </div>

      {/* ── Grid: Cliente + Financeiro lado a lado ── */}
      <div className="grid grid-cols-5 gap-3">

        {/* Cliente — 3 colunas */}
        <div className="col-span-3 card px-6 py-5">
          <SectionHeader icon={<Building2 size={14} className="text-[#bd93f9]" />} label="Cliente" />
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <p className="font-semibold text-white text-[15px] leading-snug">{cliente.razaoSocial}</p>
              {cliente.nomeFantasia && (
                <p className="text-[#6272a4] text-[13px] mt-1">{cliente.nomeFantasia}</p>
              )}
            </div>
            <div className="px-3 py-1.5 rounded-lg shrink-0 font-mono text-[12px] text-[#bd93f9]"
              style={{ background: 'rgba(189,147,249,0.1)' }}>
              {formatCpfCnpj(cliente.cnpj)}
            </div>
          </div>
          {(cliente.cidade || cliente.estado) && (
            <p className="text-[13px] text-[#6272a4] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#6272a4' }} />
              {[cliente.cidade, cliente.estado].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>

        {/* Financeiro — 2 colunas */}
        <div className="col-span-2 card px-6 py-5">
          <SectionHeader icon={<Wallet size={14} className="text-[#50fa7b]" />} label="Financeiro" />
          {financeiro ? (
            <div className="space-y-3">
              <FinRow
                label="Possui débito"
                value={financeiro.possuiDebito ? 'Sim' : 'Não'}
                danger={financeiro.possuiDebito}
              />
              <FinRow
                label="Valor em aberto"
                value={formatMoeda(financeiro.valorEmAberto)}
                danger={financeiro.valorEmAberto > 0}
              />
              <FinRow
                label="Dias de atraso"
                value={financeiro.diasAtraso > 0 ? `${financeiro.diasAtraso} dias` : '—'}
                danger={financeiro.diasAtraso > 0}
              />
              {financeiro.dataUltimoPagamento && (
                <div className="pt-2 border-t border-white/5">
                  <p className="text-[10px] text-[#6272a4] uppercase tracking-widest mb-0.5">Último pagto.</p>
                  <p className="text-[13px] font-mono text-white">{formatData(financeiro.dataUltimoPagamento)}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-[#6272a4] text-sm">Sem dados financeiros</p>
          )}
        </div>
      </div>

      {/* ── Contrato ── */}
      {contrato && (
        <div className="panel px-6 py-5">
          <SectionHeader icon={<FileText size={14} className="text-[#ff79c6]" />} label="Contrato" />

          {/* Linha de campos básicos */}
          <div className="grid grid-cols-3 gap-x-6 gap-y-4 mb-4">
            <MetaField label="Número"       value={contrato.numeroContrato} mono />
            <MetaField label="Tipo"         value={contrato.tipoContrato} />
            <div>
              <p className="text-[10px] text-[#6272a4] uppercase tracking-widest mb-1.5">Status</p>
              <StatusContratoBadge status={contrato.statusContrato} />
            </div>
            <MetaField label="Início"       value={formatData(contrato.dataInicio)} mono />
            <MetaField label="Vencimento"   value={formatData(contrato.dataFim)}    mono />
            <MetaField label="Mensal"       value={formatMoeda(contrato.valorMensal)} mono />
          </div>

          {/* Referência (sistema) */}
          {contrato.referencia && (
            <ReferenceBlock value={contrato.referencia} />
          )}

          {/* Observações */}
          {contrato.observacao && (
            <ObsBlock value={contrato.observacao} />
          )}
        </div>
      )}
    </div>
  )
}

// ── Blocos de referência e observações ───────────────────────────────────────

function ReferenceBlock({ value }: { value: string }) {
  // Valor pode ser multi-linha separado por | ou \n
  const linhas = value.split(/\||\n/).map(l => l.trim()).filter(Boolean)

  return (
    <div className="mb-3 rounded-xl p-4" style={{ background: 'rgba(189,147,249,0.06)', border: '1px solid rgba(189,147,249,0.15)' }}>
      <div className="flex items-center gap-2 mb-3">
        <Tag size={13} className="text-[#bd93f9] shrink-0" />
        <p className="text-[11px] font-semibold text-[#bd93f9] uppercase tracking-widest">
          Referência · Sistema Contratado
        </p>
      </div>
      <div className="space-y-1.5">
        {linhas.map((linha, i) => (
          <p key={i} className="text-[13px] text-[#f8f8f2] leading-relaxed flex items-start gap-2">
            {linhas.length > 1 && (
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#bd93f9' }} />
            )}
            {linha}
          </p>
        ))}
      </div>
    </div>
  )
}

function ObsBlock({ value }: { value: string }) {
  const [expanded, setExpanded] = useState(false)

  // Linhas limpas (remove vazias duplas)
  const linhas = value
    .split(/\|{2,}|\n{2,}/)
    .flatMap(bloco => bloco.split(/\||\n/).map(l => l.trim()))
    .filter(Boolean)

  const PREVIEW = 4
  const temMais = linhas.length > PREVIEW
  const visíveis = expanded ? linhas : linhas.slice(0, PREVIEW)

  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-2 mb-3">
        <ScrollText size={13} className="text-[#6272a4] shrink-0" />
        <p className="text-[11px] font-semibold text-[#6272a4] uppercase tracking-widest">
          Observações / Histórico
        </p>
      </div>
      <div className="space-y-1.5">
        {visíveis.map((linha, i) => {
          // Detecta se é uma linha de data/evento (começa com data)
          const isEvento = /^\d{2}\/\d{2}\/\d{4}/.test(linha) || /^\d{2}\/\d{2}/.test(linha)
          return (
            <p key={i} className={clsx(
              'text-[13px] leading-relaxed flex items-start gap-2',
              isEvento ? 'text-[#f8f8f2]' : 'text-[#6272a4]'
            )}>
              {isEvento
                ? <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-[#ff79c6]" />
                : <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-[#383a52]" />
              }
              {linha}
            </p>
          )
        })}
      </div>

      {temMais && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="mt-3 flex items-center gap-1.5 text-[12px] text-[#6272a4] hover:text-[#bd93f9] transition-colors"
        >
          {expanded
            ? <><ChevronUp size={13} /> Recolher</>
            : <><ChevronDown size={13} /> Ver mais {linhas.length - PREVIEW} linha(s)</>
          }
        </button>
      )}
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <p className="text-[11px] font-semibold text-[#6272a4] uppercase tracking-widest">{label}</p>
    </div>
  )
}

function MetaField({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] text-[#6272a4] uppercase tracking-widest mb-1">{label}</p>
      <p className={clsx(
        'text-[13px] text-white',
        mono ? 'font-mono' : 'font-medium'
      )}>{value || '—'}</p>
    </div>
  )
}

function FinRow({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-[12px] text-[#6272a4]">{label}</p>
      <p className={clsx(
        'text-[13px] font-mono font-medium',
        danger ? 'text-[#ff5555]' : 'text-white'
      )}>{value}</p>
    </div>
  )
}
