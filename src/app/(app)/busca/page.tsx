'use client'
import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, X, Loader2 } from 'lucide-react'
import { clienteApi } from '@/lib/api'
import { formatCpfCnpj } from '@/lib/utils'
import { StatusCard } from '@/components/busca/StatusCard'
import { Skeleton } from '@/components/ui'
import clsx from 'clsx'

export default function BuscaPage() {
  const [input, setInput] = useState('')
  const [query, setQuery] = useState('')

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['elegibilidade', query],
    queryFn:  () => clienteApi.consultarPorDocumento(query),
    enabled:  query.length === 11 || query.length === 14,
    retry: false,
  })

  const handleInput = useCallback((v: string) => {
    setInput(formatCpfCnpj(v))
  }, [])

  const handleSubmit = useCallback(() => {
    const limpo = input.replace(/\D/g, '')
    if (limpo.length === 11 || limpo.length === 14) setQuery(limpo)
  }, [input])

  const handleClear = () => { setInput(''); setQuery('') }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 animate-fade-up">
        <h1 className="font-sans text-2xl font-bold text-[#f8f8f2] tracking-tight mb-1">Consulta de Elegibilidade</h1>
        <p className="text-[#6272a4] text-sm font-sans font-medium">
          Digite o CPF ou CNPJ para verificar se o cliente pode ser atendido
        </p>
      </div>

      {/* Input */}
      <div className="animate-fade-up animate-delay-100 mb-6">
        <div className={clsx(
          'flex items-center gap-3 bg-[#44475a] px-5 py-3 transition-all duration-200 shadow-sm rounded-2xl border',
          query && data ? 'border-transparent shadow-md' : 'border-transparent hover:border-[#6272a4]'
        )}>
          <Search size={20} className="text-[#6272a4] shrink-0" />
          <input
            type="text"
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="CPF ou CNPJ (ex: 000.000.000-00 ou 00.000.000/0000-00)"
            className="flex-1 bg-transparent font-sans text-base text-[#f8f8f2] placeholder-[#6272a4] focus:outline-none"
            maxLength={18}
            autoFocus
          />
          {input && (
            <button onClick={handleClear} className="text-[#6272a4] hover:text-[#ff79c6] transition-colors">
              <X size={18} />
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!(input.replace(/\D/g, '').length === 11 || input.replace(/\D/g, '').length === 14)}
            className={clsx(
              'font-sans text-[13px] px-6 py-2.5 rounded-xl transition-all duration-200 shrink-0 font-bold',
              (input.replace(/\D/g, '').length === 11 || input.replace(/\D/g, '').length === 14)
                ? 'bg-[#bd93f9] text-[#282a36] hover:bg-[#ff79c6] hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
                : 'bg-[#282a36] text-[#6272a4] cursor-not-allowed'
            )}
          >
            CONSULTAR
          </button>
        </div>
        <p className="font-sans text-[13px] text-[#6272a4] mt-3 px-2 font-medium">
          ↵ pressione Enter ou clique em CONSULTAR após digitar
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-5 animate-fade-in panel p-8">
          <div className="flex items-center gap-3 mb-2">
            <Loader2 size={18} className="text-[#bd93f9] animate-spin" />
            <span className="font-sans text-sm text-[#f8f8f2] font-semibold">Consultando motor de regras…</span>
          </div>
          <Skeleton className="h-4 w-3/4 bg-[#282a36] rounded" />
          <Skeleton className="h-4 w-1/2 bg-[#282a36] rounded" />
          <Skeleton className="h-4 w-2/3 bg-[#282a36] rounded" />
        </div>
      )}

      {/* Erro */}
      {isError && !isLoading && (
        <div className="bg-[#ff5555]/10 border border-[#ff5555] rounded-2xl px-6 py-5 animate-fade-in shadow-sm">
          <p className="font-sans text-xs text-[#ff5555] mb-1.5 font-bold tracking-widest uppercase">ERRO NA CONSULTA</p>
          <p className="text-[#f8f8f2] text-sm font-sans font-medium">{(error as Error).message}</p>
        </div>
      )}

      {/* Resultado */}
      {data && !isLoading && <StatusCard data={data} />}

      {/* Estado inicial */}
      {!query && !isLoading && (
        <div className="animate-fade-in animate-delay-200 mt-20 text-center space-y-5">
          <div className="w-20 h-20 rounded-full bg-[#44475a] shadow-sm flex items-center justify-center mx-auto text-[#6272a4]">
            <Search size={32} strokeWidth={1.5} />
          </div>
          <p className="font-sans text-[13px] text-[#6272a4] font-semibold uppercase tracking-widest">AGUARDANDO CPF OU CNPJ</p>
          <div className="flex flex-col items-center gap-2 mt-8">
            {['12.345.678/0001-90', '123.456.789-00', '98.765.432/0001-10'].map(cnpj => (
              <p key={cnpj} className="font-mono text-[13px] font-medium text-[#bd93f9] bg-[#44475a] px-4 py-1.5 rounded-full shadow-sm">{cnpj}</p>
            ))}
            <p className="font-sans text-[13px] text-[#6272a4] mt-3 font-medium">exemplos de documentos a consultar</p>
          </div>
        </div>
      )}
    </div>
  )
}
