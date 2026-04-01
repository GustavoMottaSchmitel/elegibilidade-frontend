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

// ── Status Icon ──────────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: string }) {
  const sz = 'w-5 h-5'
  switch (status) {
    case 'PODE_ATENDER':          return <CheckCircle2 className={clsx(sz, 'text-ok')} />
    case 'ATENDER_COM_RESTRICAO': return <AlertTriangle className={clsx(sz, 'text-warn')} />
    case 'DADOS_INSUFICIENTES':
    case 'SEM_CONTRATO':          return <HelpCircle className={clsx(sz, 'text-base-400')} />
    default:                      return <XCircle className={clsx(sz, 'text-danger')} />
  }
}

// ── Style map ────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, { bar: string; badge: string; text: string }> = {
  PODE_ATENDER:         { bar: '#34d399', badge: 'rgba(52,211,153,0.12)',   text: '#34d399' },
  ATENDER_COM_RESTRICAO:{ bar: '#fbbf24', badge: 'rgba(251,191,36,0.12)',  text: '#fbbf24' },
  NAO_PODE_ATENDER:     { bar: '#f87171', badge: 'rgba(248,113,113,0.12)', text: '#f87171' },
  SEM_CONTRATO:         { bar: '#525a78', badge: 'rgba(82,90,120,0.12)',   text: '#525a78' },
  CONTRATO_VENCIDO:     { bar: '#f87171', badge: 'rgba(248,113,113,0.12)', text: '#f87171' },
  INADIMPLENTE:         { bar: '#f87171', badge: 'rgba(248,113,113,0.12)', text: '#f87171' },
  BLOQUEADO:            { bar: '#f87171', badge: 'rgba(248,113,113,0.12)', text: '#f87171' },
  DADOS_INSUFICIENTES:  { bar: '#525a78', badge: 'rgba(82,90,120,0.12)',   text: '#525a78' },
}

// ── Main Component ───────────────────────────────────────────────────────────

export function StatusCard({ data }: Props) {
  const { cliente, statusAtendimento, motivo, contrato, financeiro, ultimaAtualizacao } = data
  const style = STATUS_STYLE[statusAtendimento] ?? STATUS_STYLE.DADOS_INSUFICIENTES

  return (
    <div className="space-y-3 animate-fade-up">
      {/* Status Banner */}
      <div className="card overflow-hidden">
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
            <p className="text-base-400 text-sm mt-0.5 leading-relaxed">{motivo}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-label text-[9px]">atualizado</p>
            <p className="text-[11px] text-base-400 font-mono">{formatDataHora(ultimaAtualizacao)}</p>
          </div>
        </div>
      </div>

      {/* Client + Financial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Client — 3 cols */}
        <div className="md:col-span-3 card px-6 py-5">
          <SectionHeader icon={<Building2 size={14} className="text-accent-400" />} label="Cliente" />
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <p className="font-semibold text-white text-[15px] leading-snug">{cliente.razaoSocial}</p>
              {cliente.nomeFantasia && (
                <p className="text-base-400 text-[13px] mt-1">{cliente.nomeFantasia}</p>
              )}
            </div>
            <div className="px-3 py-1.5 rounded-lg shrink-0 font-mono text-[12px] text-accent-300 bg-accent-glow">
              {formatCpfCnpj(cliente.cnpj)}
            </div>
          </div>
          {(cliente.cidade || cliente.estado) && (
            <p className="text-[13px] text-base-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-base-500" />
              {[cliente.cidade, cliente.estado].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>

        {/* Financial — 2 cols */}
        <div className="md:col-span-2 card px-6 py-5">
          <SectionHeader icon={<Wallet size={14} className="text-ok" />} label="Financeiro" />
          {financeiro ? (
            <div className="space-y-3">
              <FinRow label="Possui débito" value={financeiro.possuiDebito ? 'Sim' : 'Não'} danger={financeiro.possuiDebito} />
              <FinRow label="Valor em aberto" value={formatMoeda(financeiro.valorEmAberto)} danger={financeiro.valorEmAberto > 0} />
              <FinRow label="Dias de atraso" value={financeiro.diasAtraso > 0 ? `${financeiro.diasAtraso} dias` : '—'} danger={financeiro.diasAtraso > 0} />
              {financeiro.dataUltimoPagamento && (
                <div className="pt-2 border-t border-base-700">
                  <p className="text-label text-[9px] mb-0.5">Último pagto.</p>
                  <p className="text-[13px] font-mono text-white">{formatData(financeiro.dataUltimoPagamento)}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-base-400 text-sm">Sem dados financeiros</p>
          )}
        </div>
      </div>

      {/* Contract */}
      {contrato && (
        <div className="card px-6 py-5">
          <SectionHeader icon={<FileText size={14} className="text-accent-300" />} label="Contrato" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 mb-4">
            <MetaField label="Número" value={contrato.numeroContrato} mono />
            <MetaField label="Tipo" value={contrato.tipoContrato} />
            <div>
              <p className="text-label text-[9px] mb-1.5">Status</p>
              <StatusContratoBadge status={contrato.statusContrato} />
            </div>
            <MetaField label="Início" value={formatData(contrato.dataInicio)} mono />
            <MetaField label="Vencimento" value={formatData(contrato.dataFim)} mono />
            <MetaField label="Mensal" value={formatMoeda(contrato.valorMensal)} mono />
          </div>

          {contrato.referencia && <ReferenceBlock value={contrato.referencia} />}
          {contrato.observacao && <ObsBlock value={contrato.observacao} />}
        </div>
      )}
    </div>
  )
}

// ── Sub-components ───────────────────────────────────────────────────────────

function ReferenceBlock({ value }: { value: string }) {
  const linhas = value.split(/\||\n/).map(l => l.trim()).filter(Boolean)
  return (
    <div className="mb-3 rounded-xl p-4 bg-accent-glow border border-accent-500/15">
      <div className="flex items-center gap-2 mb-3">
        <Tag size={13} className="text-accent-400 shrink-0" />
        <p className="text-[11px] font-semibold text-accent-400 uppercase tracking-widest">
          Referência · Sistema Contratado
        </p>
      </div>
      <div className="space-y-1.5">
        {linhas.map((linha, i) => (
          <p key={i} className="text-[13px] text-base-100 leading-relaxed flex items-start gap-2">
            {linhas.length > 1 && <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-accent-400" />}
            {linha}
          </p>
        ))}
      </div>
    </div>
  )
}

function ObsBlock({ value }: { value: string }) {
  const [expanded, setExpanded] = useState(false)
  const linhas = value.split(/\|{2,}|\n{2,}/).flatMap(bloco => bloco.split(/\||\n/).map(l => l.trim())).filter(Boolean)
  const PREVIEW = 4
  const temMais = linhas.length > PREVIEW
  const visíveis = expanded ? linhas : linhas.slice(0, PREVIEW)

  return (
    <div className="rounded-xl p-4 bg-base-850 border border-base-750">
      <div className="flex items-center gap-2 mb-3">
        <ScrollText size={13} className="text-base-400 shrink-0" />
        <p className="text-label">Observações / Histórico</p>
      </div>
      <div className="space-y-1.5">
        {visíveis.map((linha, i) => {
          const isEvento = /^\d{2}\/\d{2}\/\d{4}/.test(linha) || /^\d{2}\/\d{2}/.test(linha)
          return (
            <p key={i} className={clsx('text-[13px] leading-relaxed flex items-start gap-2', isEvento ? 'text-base-100' : 'text-base-400')}>
              <span className={clsx('mt-1.5 w-1.5 h-1.5 rounded-full shrink-0', isEvento ? 'bg-accent-400' : 'bg-base-600')} />
              {linha}
            </p>
          )
        })}
      </div>
      {temMais && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="mt-3 flex items-center gap-1.5 text-[12px] text-base-400 hover:text-accent-400 transition-colors"
        >
          {expanded ? <><ChevronUp size={13} /> Recolher</> : <><ChevronDown size={13} /> Ver mais {linhas.length - PREVIEW} linha(s)</>}
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
      <p className="text-label">{label}</p>
    </div>
  )
}

function MetaField({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-label text-[9px] mb-1">{label}</p>
      <p className={clsx('text-[13px] text-white', mono ? 'font-mono' : 'font-medium')}>{value || '—'}</p>
    </div>
  )
}

function FinRow({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-[12px] text-base-400">{label}</p>
      <p className={clsx('text-[13px] font-mono font-medium', danger ? 'text-danger' : 'text-white')}>{value}</p>
    </div>
  )
}
