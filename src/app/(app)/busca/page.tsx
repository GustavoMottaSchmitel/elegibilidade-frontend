'use client'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { clienteApi } from '@/lib/api'
import { formatCpfCnpj } from '@/lib/utils'
import { Search, Building2, UserX, ArrowRight, Loader2, SlidersHorizontal } from 'lucide-react'
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

    if (/^\d{11,}$/.test(searchTerm.replace(/\D/g, ''))) {
      router.push(`/busca?doc=${searchTerm.replace(/\D/g, '')}`)
    } else {
      router.push(`/busca?q=${searchTerm}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-10 text-center animate-fade-up">
        <h1 className="text-title text-3xl mb-3">Encontrar Clientes</h1>
        <p className="text-base-400 text-sm max-w-lg mx-auto leading-relaxed">
          Pesquise por Razão Social, Nome Fantasia, CPF ou CNPJ para consultar a elegibilidade técnica.
        </p>
      </div>

      {/* Search Box */}
      <div className="mb-10 animate-fade-up animate-delay-100">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-base-500 group-focus-within:text-accent-400 transition-colors">
            {isFetching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite o nome ou documento do cliente..."
            className="input-search h-14 !pl-14 !pr-32"
          />
          <button
            type="submit"
            className="btn-primary absolute right-2 top-2 bottom-2 !py-0 !px-5 !rounded-[0.625rem] text-sm"
          >
            Buscar
          </button>
        </form>

        {(queryParam || docParam) && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <SlidersHorizontal size={12} className="text-base-500" />
            <span className="text-label text-[9px]">
              Filtro: {docParam ? 'Documento' : 'Texto livre'}
            </span>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="animate-fade-up animate-delay-200">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="premium-card space-y-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="pt-4 border-t border-base-700">
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : resultados && resultados.length > 0 ? (
          <>
            <p className="text-label mb-4">{resultados.length} resultado(s)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resultados.map((cliente) => (
                <Link
                  key={cliente.id}
                  href={`/clientes/${cliente.id}`}
                  className="premium-card group hover:scale-[1.02] flex flex-col justify-between transition-transform duration-200"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-accent-glow flex items-center justify-center text-accent-400">
                        <Building2 size={20} />
                      </div>
                      <StatusAtendimentoBadge status={cliente.statusAtendimento || 'PODE_ATENDER'} />
                    </div>

                    <h3 className="font-bold text-white text-[15px] mb-1 leading-snug group-hover:text-accent-300 transition-colors">
                      {cliente.razaoSocial}
                    </h3>
                    <p className="text-base-400 text-xs font-mono mb-4">
                      {formatCpfCnpj(cliente.cnpj)}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-base-700 flex items-center justify-between">
                    <span className="text-label text-[9px]">Ver Elegibilidade</span>
                    <ArrowRight size={14} className="text-base-500 group-hover:text-accent-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (queryParam || docParam) ? (
          <div className="premium-card py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-base-850 flex items-center justify-center mx-auto mb-4 border border-base-700">
              <UserX size={32} className="text-base-500" />
            </div>
            <p className="text-title text-xl mb-2">Nenhum cliente encontrado</p>
            <p className="text-sm text-base-400 max-w-sm mx-auto">
              Tente outro termo de busca ou verifique o documento informado.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
