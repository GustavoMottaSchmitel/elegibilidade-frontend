'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { clienteApi } from '@/lib/api'
import { formatCpfCnpj, formatMoeda } from '@/lib/utils'
import { AlertCircle, UserX, ChevronLeft, ChevronRight, TrendingDown, ArrowUpRight, CalendarClock } from 'lucide-react'
import { Skeleton } from '@/components/ui'
import Link from 'next/link'
import clsx from 'clsx'

export default function InadimplentesPage() {
  const [page, setPage] = useState(0)
  const pageSize = 15

  const { data, isLoading, isError } = useQuery({
    queryKey: ['inadimplentes', page],
    queryFn: () => clienteApi.inadimplentes(page, pageSize),
  })

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-status-yellow-bg border border-status-yellow/20 shadow-lg shadow-status-yellow/5">
            <AlertCircle size={20} className="text-status-yellow" />
          </div>
          <h1 className="text-2xl text-premium-title tracking-tight">Clientes Inadimplentes</h1>
        </div>
        <p className="text-[var(--dash-text-secondary)] text-sm ml-14">Acompanhamento de clientes com parcelas em atraso (1 a 90 dias)</p>
      </div>

      <div className="animate-fade-up animate-delay-100">
        {isLoading ? (
          <div className="premium-card divide-y divide-[var(--dash-border)]">
             {[...Array(6)].map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-52 rounded bg-[var(--dash-bg)]" />
                  <Skeleton className="h-3 w-32 rounded bg-[var(--dash-bg)]" />
                </div>
                <Skeleton className="h-6 w-28 rounded-full bg-[var(--dash-bg)]" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="premium-card bg-status-red-bg border-status-red/20 px-6 py-5">
            <p className="text-premium-muted text-status-red mb-1">Erro de Conexão</p>
            <p className="text-sm text-[var(--dash-text-secondary)]">Não foi possível carregar a lista de inadimplentes.</p>
          </div>
        ) : !data?.content.length ? (
          <div className="premium-card px-8 py-20 text-center opacity-60">
            <div className="w-16 h-16 rounded-full bg-[var(--dash-bg)] flex items-center justify-center mx-auto mb-4 border border-[var(--dash-border)]">
              <UserX size={32} className="text-[var(--dash-text-muted)]" />
            </div>
            <p className="text-premium-title text-lg mb-1">Tudo em dia!</p>
            <p className="text-sm text-[var(--dash-text-secondary)]">Não foram encontrados clientes com faturas em atraso.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <MetricCard label="Total Inadimplentes" value={String(data.totalElements)} icon={<TrendingDown size={18} />} color="yellow" />
              <MetricCard label="Registros Página"   value={String(data.content.length)} icon={<AlertCircle size={18} />} color="yellow" />
              <MetricCard label="Total de Páginas"   value={String(data.totalPages)} icon={<CalendarClock size={18} />} color="blue" />
            </div>

            <div className="premium-card !p-0 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-[var(--dash-bg)] border-b border-[var(--dash-border)]">
                      {['Cliente', 'Documento', 'Financeiro', 'Ação / Perfil'].map(h => (
                        <th key={h} className="px-6 py-4 text-premium-muted font-bold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--dash-border)]">
                    {data.content.map((cliente) => {
                      const fin = cliente.financeiros?.[0]
                      return (
                        <tr key={cliente.id} className="transition-all hover:bg-[var(--dash-accent-soft)]">
                          <td className="px-6 py-5">
                            <p className="font-semibold text-[var(--dash-text-primary)] text-[15px]">{cliente.razaoSocial}</p>
                            {cliente.nomeFantasia && <p className="text-[12px] text-[var(--dash-text-secondary)] mt-0.5">{cliente.nomeFantasia}</p>}
                          </td>
                          <td className="px-6 py-5">
                            <span className="font-mono text-[12px] text-[var(--dash-accent-text)] px-2.5 py-1.5 rounded-lg bg-[var(--dash-accent-soft)] border border-[var(--dash-accent-soft)]">
                              {formatCpfCnpj(cliente.cnpj)}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            {fin ? (
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] text-[var(--dash-text-muted)] uppercase tracking-tighter">Aberto:</span>
                                  <span className="text-[13px] font-mono font-bold text-status-yellow">{formatMoeda(fin.valorEmAberto)}</span>
                                </div>
                                {fin.diasAtraso > 0 && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] text-[var(--dash-text-muted)] uppercase tracking-tighter">Atraso:</span>
                                    <span className={clsx(
                                      'text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border',
                                      fin.diasAtraso > 30 ? 'text-status-yellow bg-status-yellow-bg border-status-yellow/20'
                                      : 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                                    )}>
                                      {fin.diasAtraso} dias
                                    </span>
                                  </div>
                                )}
                              </div>
                            ) : <span className="text-[var(--dash-text-muted)] text-[12px]">—</span>}
                          </td>
                          <td className="px-6 py-5">
                            <Link href={`/busca?doc=${cliente.cnpj}`}
                              className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[var(--dash-accent-text)] hover:text-[var(--dash-text-primary)] transition-all group">
                              Consultar Perfil <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {data.totalPages > 1 && (
                <div className="px-6 py-5 flex items-center justify-between bg-[var(--dash-bg)] border-t border-[var(--dash-border)]">
                  <p className="text-[11px] text-[var(--dash-text-muted)] font-mono">
                    Mostrando <span className="text-[var(--dash-text-primary)]">{data.number * data.size + 1}–{Math.min((data.number + 1) * data.size, data.totalElements)}</span> de <span className="text-[var(--dash-text-primary)]">{data.totalElements}</span> resultados
                  </p>
                  <div className="flex gap-2">
                    <NavBtn onClick={() => setPage(p => Math.max(0, p - 1))} disabled={data.number === 0}><ChevronLeft size={16} /></NavBtn>
                    <NavBtn onClick={() => setPage(p => Math.min(data.totalPages - 1, p + 1))} disabled={data.number >= data.totalPages - 1}><ChevronRight size={16} /></NavBtn>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function MetricCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: 'yellow' | 'blue' }) {
  const isYellow = color === 'yellow'
  return (
    <div className="premium-card flex items-center gap-4 py-4 px-5">
      <div className={clsx(
        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
        isYellow ? "bg-status-yellow-bg text-status-yellow border-status-yellow/10" : "bg-blue-500/10 text-blue-500 border-blue-500/10"
      )}>
        {icon}
      </div>
      <div>
        <p className="text-premium-muted text-[8px]">{label}</p>
        <p className={clsx("text-2xl font-bold font-mono tracking-tight", isYellow ? "text-status-yellow" : "text-[var(--dash-text-primary)]")}>
          {value}
        </p>
      </div>
    </div>
  )
}

function NavBtn({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-[var(--dash-surface)] border border-[var(--dash-border)] text-[var(--dash-text-secondary)] hover:border-[var(--dash-accent)] hover:text-[var(--dash-accent-text)] shadow-sm"
    >
      {children}
    </button>
  )
}
