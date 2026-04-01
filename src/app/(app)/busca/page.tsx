'use client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { clienteApi } from '@/lib/api'
import { formatCpfCnpj } from '@/lib/utils'
import { Search, Building2, UserX, ArrowRight, Loader2, Filter } from 'lucide-react'
import { Skeleton, StatusAtendimentoBadge } from '@/components/ui'
import Link from 'next/link'
import clsx from 'clsx'

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
    
    // Se for apenas números e longo, busca como doc
    if (/^\d{11,}$/.test(searchTerm.replace(/\D/g, ''))) {
      router.push(`/busca?doc=${searchTerm.replace(/\D/g, '')}`)
    } else {
      router.push(`/busca?q=${searchTerm}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-10 text-center animate-fade-up">
        <h1 className="text-3xl text-premium-title mb-3">Encontrar Clientes</h1>
        <p className="text-[var(--dash-text-secondary)] text-sm max-w-md mx-auto">
          Pesquise por Razão Social, Nome Fantasia, CPF ou CNPJ para consultar a elegibilidade técnica.
        </p>
      </div>

      <div className="mb-12 animate-fade-up animate-delay-100">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-[var(--dash-text-muted)] group-focus-within:text-[var(--dash-accent)] transition-colors">
            {isFetching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite o nome ou documento do cliente..."
            className="w-full h-16 pl-14 pr-6 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] text-[var(--dash-text-primary)] placeholder:text-[var(--dash-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--dash-accent-soft)] focus:border-[var(--dash-accent)] transition-all shadow-xl shadow-black/5"
          />
          <button 
            type="submit"
            className="absolute right-3 top-3 bottom-3 px-6 rounded-xl bg-[var(--dash-accent)] text-white font-bold text-sm hover:bg-[var(--dash-accent-text)] transition-all shadow-lg shadow-[var(--dash-accent-soft)]"
          >
            Buscar
          </button>
        </form>
        
        <div className="mt-4 flex items-center justify-center gap-6">
           <div className="flex items-center gap-1.5 text-[10px] text-[var(--dash-text-muted)] uppercase tracking-widest font-mono">
              <Filter size={12} /> Filtros ativos: {docParam ? 'Documento' : queryParam ? 'Texto' : 'Nenhum'}
           </div>
        </div>
      </div>

      <div className="animate-fade-up animate-delay-200">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="premium-card p-6 space-y-4">
                <Skeleton className="h-5 w-3/4 bg-[var(--dash-bg)]" />
                <Skeleton className="h-4 w-1/2 bg-[var(--dash-bg)]" />
                <div className="pt-4 border-t border-[var(--dash-border)]">
                  <Skeleton className="h-4 w-1/4 bg-[var(--dash-bg)]" />
                </div>
              </div>
            ))}
          </div>
        ) : resultados && resultados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resultados.map((cliente) => (
              <Link 
                key={cliente.id} 
                href={`/clientes/${cliente.id}`}
                className="premium-card group hover:scale-[1.02] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--dash-accent-soft)] border border-[var(--dash-accent-soft)] flex items-center justify-center text-[var(--dash-accent-text)]">
                      <Building2 size={20} />
                    </div>
                    <StatusAtendimentoBadge status={cliente.statusAtendimento || 'PODE_ATENDER'} />
                  </div>
                  
                  <h3 className="font-bold text-[var(--dash-text-primary)] text-lg mb-1 leading-tight group-hover:text-[var(--dash-accent-text)] transition-colors">
                    {cliente.razaoSocial}
                  </h3>
                  <p className="text-[var(--dash-text-secondary)] text-xs font-mono mb-4">
                    {formatCpfCnpj(cliente.cnpj)}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--dash-border)] flex items-center justify-between">
                   <span className="text-premium-muted text-[9px] uppercase">Ver Elegibilidade</span>
                   <ArrowRight size={14} className="text-[var(--dash-text-muted)] group-hover:text-[var(--dash-accent)] group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        ) : (queryParam || docParam) ? (
          <div className="premium-card py-20 text-center opacity-70">
            <UserX size={40} className="text-[var(--dash-text-muted)] mx-auto mb-4" />
            <p className="text-premium-title text-xl mb-1">Nenhum cliente encontrado</p>
            <p className="text-sm text-[var(--dash-text-secondary)]">Tente outro termo de busca ou verifique o documento.</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
