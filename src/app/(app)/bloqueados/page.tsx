'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { clienteApi } from '@/lib/api'
import { formatCpfCnpj, formatMoeda } from '@/lib/utils'
import { ShieldX, UserX, ChevronLeft, ChevronRight, TrendingDown } from 'lucide-react'
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
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,85,85,0.15)' }}>
            <ShieldX size={17} className="text-[#ff5555]" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Clientes Bloqueados</h1>
        </div>
        <p className="text-[#6272a4] text-sm ml-12">Clientes com atraso superior a 90 dias com atendimento bloqueado</p>
      </div>

      <div className="animate-fade-up animate-delay-100">
        {isLoading ? (
          <div className="panel divide-y divide-white/5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-52 rounded bg-white/5" />
                  <Skeleton className="h-3 w-32 rounded bg-white/5" />
                </div>
                <Skeleton className="h-5 w-28 rounded bg-white/5" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="panel px-6 py-5">
            <p className="text-[11px] font-semibold text-[#ff5555] uppercase tracking-widest mb-1">Erro</p>
            <p className="text-sm text-[#6272a4]">Não foi possível carregar a lista de bloqueados.</p>
          </div>
        ) : !data?.content.length ? (
          <div className="panel px-8 py-16 text-center">
            <UserX size={32} className="text-[#383a52] mx-auto mb-3" />
            <p className="font-semibold text-white">Nenhum cliente bloqueado</p>
            <p className="text-sm text-[#6272a4] mt-1">Nenhum cliente com mais de 90 dias de atraso encontrado.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <MetricCard label="Total bloqueados" value={String(data.totalElements)} icon={<TrendingDown size={16} className="text-[#ff5555]" />} color="#ff5555" />
              <MetricCard label="Nesta página"         value={String(data.content.length)} icon={<ShieldX size={16} className="text-[#ff5555]" />} color="#ff5555" />
              <MetricCard label="Páginas"              value={String(data.totalPages)} icon={<UserX size={16} className="text-[#6272a4]" />} color="#6272a4" />
            </div>

            <div className="panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      {['Cliente', 'CPF / CNPJ', 'Financeiro', 'Ação'].map(h => (
                        <th key={h} className="px-6 py-3.5 text-[10px] font-semibold text-[#6272a4] uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.content.map((cliente, i) => {
                      const fin = cliente.financeiros?.[0]
                      return (
                        <tr key={cliente.id} className="transition-colors hover:bg-white/[0.02]"
                          style={{ borderBottom: i < data.content.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                          <td className="px-6 py-4">
                            <p className="font-medium text-white text-[14px]">{cliente.razaoSocial}</p>
                            {cliente.nomeFantasia && <p className="text-[12px] text-[#6272a4] mt-0.5">{cliente.nomeFantasia}</p>}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono text-[12px] text-[#bd93f9] px-2.5 py-1 rounded-md" style={{ background: 'rgba(189,147,249,0.1)' }}>
                              {formatCpfCnpj(cliente.cnpj)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {fin ? (
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] text-[#6272a4]">Aberto:</span>
                                  <span className="text-[13px] font-mono font-semibold text-[#ff5555]">{formatMoeda(fin.valorEmAberto)}</span>
                                </div>
                                {fin.diasAtraso > 0 && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] text-[#6272a4]">Atraso:</span>
                                    <span className={clsx(
                                      'text-[12px] font-mono font-medium px-2 py-0.5 rounded',
                                      fin.diasAtraso > 90 ? 'text-[#ff5555] bg-[#ff5555]/10'
                                      : fin.diasAtraso > 30 ? 'text-[#f1fa8c] bg-[#f1fa8c]/10'
                                      : 'text-[#ffb86c] bg-[#ffb86c]/10'
                                    )}>
                                      {fin.diasAtraso}d
                                    </span>
                                  </div>
                                )}
                              </div>
                            ) : <span className="text-[#6272a4] text-[12px]">—</span>}
                          </td>
                          <td className="px-6 py-4">
                            <Link href={`/busca?doc=${cliente.cnpj}`}
                              className="text-[12px] font-medium text-[#bd93f9] hover:text-[#ff79c6] transition-colors">
                              Ver detalhes →
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {data.totalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                  <p className="text-[12px] text-[#6272a4] font-mono">
                    {data.number * data.size + 1}–{Math.min((data.number + 1) * data.size, data.totalElements)} de {data.totalElements}
                  </p>
                  <div className="flex gap-2">
                    <NavBtn onClick={() => setPage(p => Math.max(0, p - 1))} disabled={data.number === 0}><ChevronLeft size={15} /></NavBtn>
                    <NavBtn onClick={() => setPage(p => Math.min(data.totalPages - 1, p + 1))} disabled={data.number >= data.totalPages - 1}><ChevronRight size={15} /></NavBtn>
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

function MetricCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="panel px-5 py-4 flex items-center gap-4">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>{icon}</div>
      <div>
        <p className="text-[10px] text-[#6272a4] uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-bold font-mono" style={{ color }}>{value}</p>
      </div>
    </div>
  )
}

function NavBtn({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed text-[#6272a4] hover:text-white"
      style={{ background: 'rgba(255,255,255,0.06)' }}>
      {children}
    </button>
  )
}
