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
      <span style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: c.dot }} />
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
    <div
      className={clsx('rounded-lg animate-pulse', className)}
      style={{ background: 'var(--border-light)' }}
    />
  )
}

// ── Divider ───────────────────────────────────────────────────────────────

export function Divider({ label }: { label?: string }) {
  if (!label) return <div style={{ borderTop: '1px solid var(--border-light)', margin: '16px 0' }} />
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
      <div style={{ flex: 1, borderTop: '1px solid var(--border-light)' }} />
      <span className="text-label">{label}</span>
      <div style={{ flex: 1, borderTop: '1px solid var(--border-light)' }} />
    </div>
  )
}
