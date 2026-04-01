'use client'
import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { importacaoApi } from '@/lib/api'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, RefreshCw, X, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'

interface ImportResult {
  message: string
  totalProcessados: number
  totalCriados: number
  totalAtualizados: number
  errosCount: number
  erros: string[]
}

export default function ImportacaoPage() {
  const [file, setFile] = useState<File | null>(null)
  const [results, setResults] = useState<ImportResult | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0])
    setResults(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
  })

  const mutation = useMutation({
    mutationFn: (f: File) => importacaoApi.importarCsv(f),
    onSuccess: (data) => {
      setResults(data as ImportResult)
      toast.success('Processamento concluído!')
    },
    onError: (error: any) => {
      toast.error('Erro ao processar: ' + error.message)
    },
  })

  const handleImport = () => {
    if (!file) return
    mutation.mutate(file)
  }

  const handleReset = () => {
    setFile(null)
    setResults(null)
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-10 text-center animate-fade-up">
        <h1 className="text-title text-3xl mb-3">Importação de Dados</h1>
        <p className="text-base-400 text-sm max-w-lg mx-auto leading-relaxed">
          Arraste o arquivo CSV do sistema de faturamento para atualizar a base de clientes e elegibilidade.
        </p>
      </div>

      {!results ? (
        <div className="premium-card p-8 animate-fade-up animate-delay-100">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={clsx(
              'group relative border-2 border-dashed rounded-2xl p-14 text-center transition-all cursor-pointer',
              isDragActive
                ? 'border-accent-500 bg-accent-glow'
                : 'border-base-600 hover:border-base-400'
            )}
          >
            <input {...getInputProps()} />

            <div className="mb-6 flex justify-center">
              <div className={clsx(
                "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300",
                file
                  ? "bg-ok-dim text-ok glow-ok"
                  : "bg-base-850 text-base-400 group-hover:text-accent-400 group-hover:bg-accent-glow group-hover:scale-110"
              )}>
                {file ? <FileSpreadsheet size={32} /> : <UploadCloud size={32} />}
              </div>
            </div>

            <div className="space-y-2">
              {file ? (
                <>
                  <p className="text-lg font-bold text-white">Arquivo Selecionado</p>
                  <p className="text-sm font-mono text-accent-300">{file.name}</p>
                  <p className="text-label mt-4">{(file.size / 1024).toFixed(1)} KB</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold text-white">
                    {isDragActive ? 'Solte para selecionar' : 'Arraste ou clique para selecionar'}
                  </p>
                  <p className="text-sm text-base-400">Formato aceito: .CSV (padrão sistema de faturamento)</p>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={handleImport}
              disabled={!file || mutation.isPending}
              className="btn-primary flex-1 h-14 text-sm"
            >
              {mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
              {mutation.isPending ? 'Processando...' : 'Iniciar Processamento'}
            </button>
            {file && !mutation.isPending && (
              <button
                onClick={handleReset}
                className="btn-ghost w-14 h-14 !p-0 text-base-400 hover:!text-danger hover:!border-danger/30 hover:!bg-danger-dim"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {/* Result Header */}
          <div className={clsx(
            "premium-card border-l-4",
            results.errosCount > 0 ? "border-l-warn" : "border-l-ok"
          )}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {results.errosCount > 0
                  ? <AlertCircle className="text-warn shrink-0" size={24} />
                  : <CheckCircle2 className="text-ok shrink-0" size={24} />
                }
                <div>
                  <h3 className="text-title text-xl">
                    {results.errosCount > 0 ? 'Concluída com Alertas' : 'Importação Concluída'}
                  </h3>
                  <p className="text-sm text-base-400 mt-0.5">{results.message}</p>
                </div>
              </div>
              <button onClick={handleReset} className="btn-ghost text-sm shrink-0">
                Nova Importação
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBox label="Processados" value={results.totalProcessados} />
            <StatBox label="Novos" value={results.totalCriados} color="text-ok" />
            <StatBox label="Atualizados" value={results.totalAtualizados} color="text-info" />
            <StatBox label="Com Erro" value={results.errosCount} color={results.errosCount > 0 ? "text-danger" : "text-base-500"} />
          </div>

          {/* Error Details */}
          {results.errosCount > 0 && (
            <div className="premium-card !bg-danger-dim !border-danger/10">
              <h4 className="flex items-center gap-2 text-danger font-bold text-sm mb-4">
                <AlertCircle size={16} /> Relatório de Falhas
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scroll pr-2">
                {results.erros.map((err, i) => (
                  <div key={i} className="py-2 px-3 bg-base-950/60 rounded-lg font-mono text-[11px] text-red-300 border border-danger/10">
                    {err}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function StatBox({ label, value, color = "text-white" }: { label: string; value: number; color?: string }) {
  return (
    <div className="premium-card text-center py-5">
      <span className="text-label text-[8px] mb-1.5 block">{label}</span>
      <p className={clsx("text-2xl font-bold font-mono tracking-tighter", color)}>{value}</p>
    </div>
  )
}
