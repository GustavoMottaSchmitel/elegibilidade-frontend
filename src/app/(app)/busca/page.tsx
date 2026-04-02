'use client'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { clienteApi } from '@/lib/api'
import { formatCpfCnpj } from '@/lib/utils'
import { Search, Building2, UserX, ArrowRight, Loader2 } from 'lucide-react'
import { Skeleton, StatusAtendimentoBadge } from '@/components/ui'
import Link from 'next/link'

export default function BuscaPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryParam = searchParams.get('q') || ''
  const docParam = searchParams.get('doc') || ''

  const [searchTerm, setSearchTerm] = useState(queryParam || docParam)

  const { data: resultados, isLoading, isFetching } = useQuery({
    queryKey: ['busca-clientes', queryParam, docParam],
    queryFn: () => clienteApi.buscarPorTermo(docParam || queryParam),
    enabled: !!queryParam || !!docParam,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    if (/^\d{11,}$/.test(searchTerm.replace(/\D/g, ''))) {
      router.push(`/busca?doc=${searchTerm.replace(/\D/g, '')}`)
    } else {
      router.push(`/busca?q=${searchTerm}`)
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 60 }}>
      {/* Header */}
      <div className="animate-fade-up" style={{ marginBottom: 32 }}>
        <h1 className="text-title" style={{ fontSize: 24, marginBottom: 6 }}>Consulta</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          Pesquise por Razão Social, Nome Fantasia, CPF ou CNPJ.
        </p>
      </div>

      {/* Search */}
      <div className="animate-fade-up animate-delay-100" style={{ marginBottom: 32 }}>
        <form onSubmit={handleSearch} style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            {isFetching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite o nome ou documento do cliente..."
            className="input-search"
            style={{ paddingLeft: 44, paddingRight: 100, height: 48 }}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ position: 'absolute', right: 6, top: 6, bottom: 6, padding: '0 20px', fontSize: 13, borderRadius: 8 }}
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Results */}
      <div className="animate-fade-up animate-delay-200">
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        ) : resultados && resultados.length > 0 ? (
          <>
            <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {resultados.length} resultado(s)
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {resultados.map((cliente) => (
                <Link
                  key={cliente.id}
                  href={`/clientes/${cliente.id}`}
                  className="card"
                  style={{ display: 'flex', flexDirection: 'column', padding: 20, textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: 'var(--accent-light)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      color: 'var(--accent-text)',
                    }}>
                      <Building2 size={18} />
                    </div>
                    <StatusAtendimentoBadge status={cliente.statusAtendimento || 'PODE_ATENDER'} />
                  </div>

                  <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {cliente.razaoSocial}
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 16 }}>
                    {formatCpfCnpj(cliente.cnpj)}
                  </p>

                  <div style={{ paddingTop: 12, borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ver Elegibilidade</span>
                    <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (queryParam || docParam) ? (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--bg-elevated)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', border: '1px solid var(--border-light)',
            }}>
              <UserX size={28} style={{ color: 'var(--text-muted)' }} />
            </div>
            <p className="text-title" style={{ fontSize: 18, marginBottom: 6 }}>Nenhum cliente encontrado</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 360, margin: '0 auto' }}>
              Tente outro termo de busca ou verifique o documento informado.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
