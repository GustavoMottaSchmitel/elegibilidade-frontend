'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { clienteApi } from '@/lib/api'
import { formatCpfCnpj, formatMoeda } from '@/lib/utils'
import { ShieldX, UserX, ChevronLeft, ChevronRight, TrendingDown, ArrowUpRight, Hash } from 'lucide-react'
import { Skeleton } from '@/components/ui'
import Link from 'next/link'
import clsx from 'clsx'

export default function BloqueadosPage() {
  const [page, setPage] = useState(0)
  const pageSize = 15

  const { data, isLoading, isError } = useQuery({
    queryKey: ['bloqueados', page],
    queryFn: () => clienteApi.bloqueados(page, pageSize),
  })

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-danger-dim border border-danger/15">
            <ShieldX size={20} className="text-danger" />
          </div>
          <h1 className="text-title text-2xl">Clientes Bloqueados</h1>
        </div>
        <p className="text-base-400 text-sm ml-[52px]">
          Clientes com atendimento bloqueado (atrasos superiores a 90 dias)
        </p>
      </div>

      <div className="animate-fade-up animate-delay-100">
        {isLoading ? (
          <div className="card divide-y divide-base-750">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-52" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="premium-card !bg-danger-dim !border-danger/15">
            <p className="text-danger font-bold text-sm mb-1">Erro de Conexão</p>
            <p className="text-sm text-base-400">Não foi possível carregar a lista.</p>
          </div>
        ) : !data?.content.length ? (
          <div className="premium-card py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-base-850 flex items-center justify-center mx-auto mb-4 border border-base-700">
              <UserX size={32} className="text-base-500" />
            </div>
            <p className="text-title text-lg mb-1">Nenhum cliente bloqueado</p>
            <p className="text-sm text-base-400">Nenhum registro encontrado no período.</p>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              <MiniStat label="Total Bloqueados" value={data.totalElements} color="danger" icon={<TrendingDown size={16} />} />
              <MiniStat label="Nesta Página" value={data.content.length} color="danger" icon={<Hash size={16} />} />
              <MiniStat label="Páginas" value={data.totalPages} color="info" icon={<ShieldX size={16} />} />
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Documento</th>
                      <th>Financeiro</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.content.map((cliente) => {
                      const fin = cliente.financeiros?.[0]
                      return (
                        <tr key={cliente.id}>
                          <td>
                            <p className="font-semibold text-white text-[14px]">{cliente.razaoSocial}</p>
                            {cliente.nomeFantasia && <p className="text-[12px] text-base-400 mt-0.5">{cliente.nomeFantasia}</p>}
                          </td>
                          <td>
                            <span className="font-mono text-[12px] text-accent-300 px-2.5 py-1 rounded-lg bg-accent-glow">
                              {formatCpfCnpj(cliente.cnpj)}
                            </span>
                          </td>
                          <td>
                            {fin ? (
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-label text-[9px]">Aberto:</span>
                                  <span className="text-[13px] font-mono font-bold text-danger">{formatMoeda(fin.valorEmAberto)}</span>
                                </div>
                                {fin.diasAtraso > 0 && (
                                  <span className={clsx(
                                    'badge text-[10px]',
                                    fin.diasAtraso > 90 ? 'badge-danger' :
                                    fin.diasAtraso > 30 ? 'badge-warn' : 'badge-muted'
                                  )}>
                                    {fin.diasAtraso} dias
                                  </span>
                                )}
                              </div>
                            ) : <span className="text-base-500 text-xs">—</span>}
                          </td>
                          <td>
                            <Link href={`/busca?doc=${cliente.cnpj}`}
                              className="inline-flex items-center gap-1.5 text-[12px] font-bold text-accent-300 hover:text-white transition-all group">
                              Consultar <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between bg-base-850 border-t border-base-750">
                  <p className="text-[11px] text-base-400 font-mono">
                    <span className="text-white">{data.number * data.size + 1}–{Math.min((data.number + 1) * data.size, data.totalElements)}</span> de <span className="text-white">{data.totalElements}</span>
                  </p>
                  <div className="flex gap-2">
                    <PaginationBtn onClick={() => setPage(p => Math.max(0, p - 1))} disabled={data.number === 0}><ChevronLeft size={16} /></PaginationBtn>
                    <PaginationBtn onClick={() => setPage(p => Math.min(data.totalPages - 1, p + 1))} disabled={data.number >= data.totalPages - 1}><ChevronRight size={16} /></PaginationBtn>
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

function MiniStat({ label, value, color, icon }: { label: string; value: number; color: 'danger' | 'info'; icon: React.ReactNode }) {
  const isDanger = color === 'danger'
  return (
    <div className="premium-card flex items-center gap-4 py-4 px-5">
      <div className={clsx(
        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
        isDanger ? "bg-danger-dim text-danger" : "bg-info-dim text-info"
      )}>
        {icon}
      </div>
      <div>
        <p className="text-label text-[8px]">{label}</p>
        <p className={clsx("text-2xl font-bold font-mono tracking-tighter", isDanger ? "text-danger" : "text-white")}>
          {value}
        </p>
      </div>
    </div>
  )
}

function PaginationBtn({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="btn-ghost w-9 h-9 !p-0 disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  )
}
