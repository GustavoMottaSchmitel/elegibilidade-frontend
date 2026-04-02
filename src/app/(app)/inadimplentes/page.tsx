'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { clienteApi } from '@/lib/api'
import { formatCpfCnpj, formatMoeda } from '@/lib/utils'
import { AlertCircle, UserX, ChevronLeft, ChevronRight, TrendingDown, ArrowUpRight, Hash } from 'lucide-react'
import { Skeleton } from '@/components/ui'
import Link from 'next/link'

export default function InadimplentesPage() {
  const [page, setPage] = useState(0)
  const pageSize = 15

  const { data, isLoading, isError } = useQuery({
    queryKey: ['inadimplentes', page],
    queryFn: () => clienteApi.inadimplentes(page, pageSize),
  })

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div className="animate-fade-up" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: 'rgba(245,158,11,0.1)', color: '#f59e0b',
          }}>
            <AlertCircle size={20} />
          </div>
          <h1 className="text-title" style={{ fontSize: 22 }}>Clientes Inadimplentes</h1>
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginLeft: 52 }}>
          Clientes com parcelas em atraso (1 a 90 dias)
        </p>
      </div>

      <div className="animate-fade-up animate-delay-100">
        {isLoading ? (
          <div className="card" style={{ overflow: 'hidden' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Skeleton className="h-4 w-52" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="card" style={{ padding: 24, borderLeft: '4px solid #ef4444' }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#ef4444', marginBottom: 4 }}>Erro de Conexão</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Não foi possível carregar a lista.</p>
          </div>
        ) : !data?.content.length ? (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid var(--border-light)' }}>
              <UserX size={28} style={{ color: 'var(--text-muted)' }} />
            </div>
            <p className="text-title" style={{ fontSize: 16, marginBottom: 4 }}>Tudo em dia!</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Não há clientes com faturas em atraso.</p>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 20 }}>
              <MiniStat label="Total Inadimplentes" value={data.totalElements} color="#f59e0b" icon={<TrendingDown size={16} />} />
              <MiniStat label="Nesta Página" value={data.content.length} color="var(--text-primary)" icon={<Hash size={16} />} />
              <MiniStat label="Páginas" value={data.totalPages} color="var(--accent)" icon={<AlertCircle size={16} />} />
            </div>

            {/* Table */}
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
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
                            <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>{cliente.razaoSocial}</p>
                            {cliente.nomeFantasia && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{cliente.nomeFantasia}</p>}
                          </td>
                          <td>
                            <span style={{
                              fontFamily: 'var(--font-mono)', fontSize: 12,
                              color: 'var(--accent-text)', padding: '3px 8px',
                              borderRadius: 6, background: 'var(--accent-light)',
                            }}>
                              {formatCpfCnpj(cliente.cnpj)}
                            </span>
                          </td>
                          <td>
                            {fin ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Aberto:</span>
                                  <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#f59e0b' }}>{formatMoeda(fin.valorEmAberto)}</span>
                                </div>
                                {fin.diasAtraso > 0 && (
                                  <span className={fin.diasAtraso > 30 ? 'badge badge-warn' : 'badge badge-muted'}
                                    style={{ width: 'fit-content' }}
                                  >
                                    {fin.diasAtraso} dias
                                  </span>
                                )}
                              </div>
                            ) : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>}
                          </td>
                          <td>
                            <Link href={`/busca?doc=${cliente.cnpj}`}
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                fontSize: 12, fontWeight: 600, color: 'var(--accent-text)',
                                textDecoration: 'none',
                              }}>
                              Consultar <ArrowUpRight size={13} />
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
                <div style={{
                  padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'var(--bg-elevated)', borderTop: '1px solid var(--border-light)',
                }}>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{data.number * data.size + 1}–{Math.min((data.number + 1) * data.size, data.totalElements)}</span>
                    {' '}de{' '}
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{data.totalElements}</span>
                  </p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <PagBtn onClick={() => setPage(p => Math.max(0, p - 1))} disabled={data.number === 0}><ChevronLeft size={16} /></PagBtn>
                    <PagBtn onClick={() => setPage(p => Math.min(data.totalPages - 1, p + 1))} disabled={data.number >= data.totalPages - 1}><ChevronRight size={16} /></PagBtn>
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

function MiniStat({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <div className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        background: `${color}15`, color,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
        <p style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em', color }}>{value}</p>
      </div>
    </div>
  )
}

function PagBtn({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn-ghost"
      style={{ width: 36, height: 36, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.3 : 1 }}
    >
      {children}
    </button>
  )
}
