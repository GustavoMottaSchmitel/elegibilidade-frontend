'use client'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { importacaoApi } from '@/lib/api'
import { formatDataHora } from '@/lib/utils'
import { StatusImportacaoBadge, Skeleton } from '@/components/ui'
import {
  Upload, FileText, CheckCircle2, AlertTriangle,
  ChevronDown, ChevronUp, Terminal, Info,
} from 'lucide-react'
import clsx from 'clsx'
import type { ImportacaoCsv } from '@/types/api'

export default function ImportacaoPage() {
  const qc = useQueryClient()
  const [expanded, setExpanded] = useState<number | null>(null)

  const { data: historico, isLoading } = useQuery({
    queryKey: ['importacoes'],
    queryFn:  () => importacaoApi.listar(0, 30),
  })

  const mutation = useMutation({
    mutationFn: importacaoApi.enviar,
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: ['importacoes'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      if (result.status === 'CONCLUIDO') {
        toast.success(`Concluído — ${result.registrosSucesso} registros importados`)
      } else if (result.status === 'CONCLUIDO_COM_ERROS') {
        toast(`Concluído com ${result.registrosErro} erro(s)`, { icon: '⚠️' })
      } else {
        toast.error('Falha na importação')
      }
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const onDrop = useCallback((files: File[]) => {
    if (files[0]) mutation.mutate(files[0])
  }, [mutation])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
    disabled: mutation.isPending,
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Importação CSV</h1>
        <p className="text-[#6272a4] text-sm">
          Envie os relatórios exportados do RP Now — tipo detectado automaticamente pelo cabeçalho
        </p>
      </div>

      {/* Dropzone */}
      <div className="animate-fade-up animate-delay-100 mb-6">
        <div {...getRootProps()} className={clsx(
          'relative rounded-2xl p-10 text-center transition-all duration-200 cursor-pointer',
          mutation.isPending
            ? 'border-2 border-dashed border-[#bd93f9]/40 bg-[#bd93f9]/5'
            : isDragActive
            ? 'border-2 border-dashed border-[#bd93f9] bg-[#bd93f9]/8'
            : 'border-2 border-dashed border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
        )}>
          <input {...getInputProps()} />

          {mutation.isPending ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#bd93f9]/30 border-t-[#bd93f9] animate-spin" />
              <p className="text-sm font-semibold text-[#bd93f9]">Processando…</p>
              {mutation.variables?.name && (
                <p className="text-[13px] text-[#6272a4]">{mutation.variables.name}</p>
              )}
            </div>
          ) : mutation.isSuccess ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle2 size={32} className="text-[#50fa7b]" />
              <p className="font-semibold text-[#50fa7b]">Importação concluída</p>
              <div className="flex items-center gap-5 text-[13px] text-[#6272a4]">
                <span>{mutation.data.totalRegistros} total</span>
                <span className="text-[#50fa7b]">✓ {mutation.data.registrosSucesso} sucesso</span>
                {mutation.data.registrosErro > 0 && (
                  <span className="text-[#ff5555]">✗ {mutation.data.registrosErro} erros</span>
                )}
              </div>
              <button onClick={(e) => { e.stopPropagation(); mutation.reset() }}
                className="mt-1 text-[12px] text-[#6272a4] hover:text-[#bd93f9] transition-colors">
                importar outro arquivo →
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className={clsx(
                'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200',
                isDragActive ? 'bg-[#bd93f9]/20' : 'bg-white/5'
              )}>
                <Upload size={22} className={isDragActive ? 'text-[#bd93f9]' : 'text-[#6272a4]'} />
              </div>
              <div>
                <p className="text-sm font-medium text-white mb-1">
                  {isDragActive ? 'Solte o arquivo aqui' : 'Arraste o CSV ou clique para selecionar'}
                </p>
                <p className="text-[12px] text-[#6272a4]">Apenas .csv até 50 MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Dicas de formato */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          {[
            { title: 'CSV Contratos', cols: 'Nº Contrato · Nome Cliente · Status · Tipo Contrato · Início Vigência · Fim Vigência · Referência · Obs' },
            { title: 'CSV Financeiro', cols: 'Cliente · Status · Tipo Pagto · Documento · Dt. Vencimento · Dt. Pagamento · Valor Título · Valor Pago' },
          ].map(({ title, cols }) => (
            <div key={title} className="rounded-xl px-4 py-3 flex gap-2"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Info size={13} className="text-[#6272a4] shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-[#bd93f9] mb-0.5">{title}</p>
                <p className="text-[11px] text-[#6272a4] leading-relaxed">{cols}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#6272a4] mt-2 px-1">
          ⓘ Importe sempre os <span className="text-white/60">Contratos antes do Financeiro</span>
        </p>
      </div>

      {/* Histórico */}
      <div className="animate-fade-up animate-delay-200">
        <p className="text-[11px] font-semibold text-[#6272a4] tracking-widest uppercase mb-3">
          Histórico de importações
        </p>

        {isLoading ? (
          <div className="panel divide-y divide-white/5">
            {[1, 2, 3].map(i => (
              <div key={i} className="px-5 py-4 flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-52 rounded bg-white/5" />
                <Skeleton className="h-5 w-24 rounded bg-white/5" />
              </div>
            ))}
          </div>
        ) : !historico?.content?.length ? (
          <div className="panel px-5 py-10 text-center">
            <FileText size={24} className="text-[#383a52] mx-auto mb-3" />
            <p className="text-[13px] text-[#6272a4]">Nenhuma importação realizada</p>
          </div>
        ) : (
          <div className="panel divide-y divide-white/5">
            {historico.content.map((imp) => (
              <ImportacaoRow
                key={imp.id}
                imp={imp}
                expanded={expanded === imp.id}
                onToggle={() => setExpanded(expanded === imp.id ? null : imp.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Linha de histórico ────────────────────────────────────────────────────────

function ImportacaoRow({ imp, expanded, onToggle }: {
  imp: ImportacaoCsv; expanded: boolean; onToggle: () => void
}) {
  return (
    <div>
      <button onClick={onToggle}
        className="w-full px-5 py-4 flex items-center gap-3 hover:bg-white/[0.02] transition-colors text-left group">
        <FileText size={14} className="text-[#6272a4] shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-medium text-white truncate">{imp.nomeArquivo}</p>
          <p className="text-[11px] text-[#6272a4] mt-0.5 font-mono">
            {formatDataHora(imp.dataImportacao)} · {imp.totalRegistros} registros
          </p>
        </div>
        <StatusImportacaoBadge status={imp.status} />
        <span className="text-[#6272a4] ml-1">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 animate-fade-in">
          {/* Stats */}
          <div className="flex gap-6 mb-4">
            <Stat label="Total"   value={imp.totalRegistros}   color="text-white" />
            <Stat label="Sucesso" value={imp.registrosSucesso} color="text-[#50fa7b]" />
            <Stat label="Erros"   value={imp.registrosErro}    color={imp.registrosErro > 0 ? 'text-[#ff5555]' : 'text-[#6272a4]'} />
          </div>

          {/* Log de erros — estilo terminal */}
          {imp.detalhesErro && (
            <div className="rounded-xl overflow-hidden"
              style={{ background: '#0d0e17', border: '1px solid rgba(255,85,85,0.2)' }}>
              {/* Barra de título do terminal */}
              <div className="flex items-center gap-2 px-4 py-2.5"
                style={{ background: 'rgba(255,85,85,0.08)', borderBottom: '1px solid rgba(255,85,85,0.15)' }}>
                <Terminal size={13} className="text-[#ff5555]" />
                <p className="text-[11px] font-semibold text-[#ff5555] tracking-widest uppercase">
                  Log de erros · {imp.registrosErro} ocorrência(s)
                </p>
              </div>
              {/* Conteúdo do terminal */}
              <div className="p-4 max-h-64 overflow-y-auto">
                {imp.detalhesErro.split('\n').filter(Boolean).map((linha, i) => {
                  // Extrai "Linha X" do início para destacar número da linha
                  const match = linha.match(/^(Linha\s+\d+):\s*(.+)/)
                  if (match) {
                    return (
                      <div key={i} className="flex gap-3 mb-2 last:mb-0">
                        <span className="shrink-0 font-mono text-[11px] font-bold text-[#ff5555] min-w-[64px]">
                          {match[1]}
                        </span>
                        <span className="font-mono text-[11px] text-[#6272a4] leading-relaxed">
                          {match[2]}
                        </span>
                      </div>
                    )
                  }
                  // Linha sem prefixo "Linha X"
                  return (
                    <p key={i} className="font-mono text-[11px] text-[#6272a4] leading-relaxed mb-1 last:mb-0">
                      {linha}
                    </p>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <p className="text-[10px] text-[#6272a4] uppercase tracking-widest mb-0.5">{label}</p>
      <p className={clsx('text-lg font-bold font-mono', color)}>{value}</p>
    </div>
  )
}
