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
    <span className={clsx('badge', className)}>
      {children}
    </span>
  )
}

// ── Status de Atendimento ─────────────────────────────────────────────────

export function StatusAtendimentoBadge({ status }: { status: StatusAtendimento }) {
  const c = statusAtendimentoColor(status)
  return (
    <span className={clsx('badge', c.className)}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {statusAtendimentoLabel[status]}
    </span>
  )
}

// ── Status de Contrato ────────────────────────────────────────────────────

export function StatusContratoBadge({ status }: { status: StatusContrato }) {
  return (
    <span className={clsx('badge', statusContratoColor(status))}>
      {statusContratoLabel[status]}
    </span>
  )
}

// ── Status de Importação ──────────────────────────────────────────────────

export function StatusImportacaoBadge({ status }: { status: StatusImportacao }) {
  return (
    <span className={clsx('badge', statusImportacaoColor(status))}>
      {statusImportacaoLabel[status]}
    </span>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={clsx(
      'rounded-lg bg-base-750 animate-pulse',
      className
    )} />
  )
}

// ── Divider ───────────────────────────────────────────────────────────────

export function Divider({ label }: { label?: string }) {
  if (!label) return <div className="border-t border-base-700 my-4" />
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 border-t border-base-700" />
      <span className="text-label">{label}</span>
      <div className="flex-1 border-t border-base-700" />
    </div>
  )
}
