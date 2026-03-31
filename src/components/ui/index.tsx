import clsx from 'clsx'
import type { StatusAtendimento, StatusContrato, StatusImportacao } from '@/types/api'
import {
  statusAtendimentoLabel, statusAtendimentoColor,
  statusContratoLabel,    statusContratoColor,
  statusImportacaoLabel,  statusImportacaoColor,
} from '@/lib/utils'

// ── Badge base ────────────────────────────────────────────────────────────

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border',
      className
    )}>
      {children}
    </span>
  )
}

// ── Status de Atendimento ─────────────────────────────────────────────────

export function StatusAtendimentoBadge({ status }: { status: StatusAtendimento }) {
  const c = statusAtendimentoColor(status)
  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[11px] font-medium border tracking-wider',
      c.bg, c.text, c.border
    )}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {statusAtendimentoLabel[status]}
    </span>
  )
}

// ── Status de Contrato ────────────────────────────────────────────────────

export function StatusContratoBadge({ status }: { status: StatusContrato }) {
  return (
    <span className={clsx(
      'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border',
      statusContratoColor(status)
    )}>
      {statusContratoLabel[status]}
    </span>
  )
}

// ── Status de Importação ──────────────────────────────────────────────────

export function StatusImportacaoBadge({ status }: { status: StatusImportacao }) {
  return (
    <span className={clsx(
      'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border',
      statusImportacaoColor(status)
    )}>
      {statusImportacaoLabel[status]}
    </span>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={clsx(
      'rounded bg-ink-800 animate-pulse',
      className
    )} />
  )
}

// ── Divider ───────────────────────────────────────────────────────────────

export function Divider({ label }: { label?: string }) {
  if (!label) return <div className="border-t border-ink-700 my-4" />
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 border-t border-ink-700" />
      <span className="font-mono text-[10px] text-ink-600 tracking-widest uppercase">{label}</span>
      <div className="flex-1 border-t border-ink-700" />
    </div>
  )
}
