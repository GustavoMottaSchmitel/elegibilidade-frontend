'use client'
import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { importacaoApi } from '@/lib/api'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, FileJson, CheckCircle2, AlertCircle, Loader2, RefreshCw, X } from 'lucide-react'
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
      toast.error('Erro ao processar arquivo: ' + error.message)
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
      <div className="mb-10 text-center animate-fade-up">
        <h1 className="text-3xl text-premium-title mb-3">Importação de Dados</h1>
        <p className="text-[var(--dash-text-secondary)] text-sm max-w-md mx-auto">
          Arraste o arquivo CSV do sistema de faturamento para atualizar a base de clientes e elegibilidade técnica.
        </p>
      </div>

      {!results ? (
        <div className="premium-card p-10 animate-fade-up animate-delay-100">
          <div
            {...getRootProps()}
            className={clsx(
              'group relative border-2 border-dashed rounded-3xl p-16 text-center transition-all cursor-pointer',
              isDragActive ? 'border-[var(--dash-accent)] bg-[var(--dash-accent-soft)]' : 'border-[var(--dash-border)] hover:border-[var(--dash-text-muted)]'
            )}
          >
            <input {...getInputProps()} />
            
            <div className="mb-6 flex justify-center">
              <div className={clsx(
                "w-20 h-20 rounded-full flex items-center justify-center transition-all",
                file ? "bg-status-green-bg text-status-green" : "bg-[var(--dash-bg)] text-[var(--dash-text-muted)] group-hover:text-[var(--dash-accent-text)] group-hover:scale-110"
              )}>
                {file ? <FileJson size={32} /> : <UploadCloud size={32} />}
              </div>
            </div>

            <div className="space-y-2">
              {file ? (
                <>
                   <p className="text-lg font-bold text-[var(--dash-text-primary)]">Arquivo Selecionado</p>
                   <p className="text-sm font-mono text-[var(--dash-accent-text)]">{file.name}</p>
                   <p className="text-[10px] text-[var(--dash-text-muted)] mt-4">{(file.size / 1024).toFixed(1)} KB</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold text-[var(--dash-text-primary)]">
                    {isDragActive ? 'Solte para selecionar' : 'Arraste ou clique para selecionar'}
                  </p>
                  <p className="text-sm text-[var(--dash-text-secondary)]">Formato aceito: .CSV (padrão sistema)</p>
                </>
              )}
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleImport}
              disabled={!file || mutation.isPending}
              className="flex-1 h-14 rounded-2xl bg-[var(--dash-accent)] text-white font-bold tracking-wide shadow-xl shadow-[var(--dash-accent-soft)] hover:bg-[var(--dash-accent-text)] transition-all disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-2"
            >
              {mutation.isPending ? <Loader2 className="animate-spin" /> : <RefreshCw size={18} />}
              {mutation.isPending ? 'Processando...' : 'Iniciar Processamento'}
            </button>
            {file && !mutation.isPending && (
              <button 
                onClick={handleReset}
                className="w-14 h-14 rounded-2xl border border-[var(--dash-border)] text-[var(--dash-text-secondary)] flex items-center justify-center hover:bg-status-red-bg hover:text-status-red hover:border-status-red/20 transition-all"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Status Header */}
          <div className={clsx(
            "premium-card p-6 border-l-4",
            results.errosCount > 0 ? "border-l-status-yellow" : "border-l-status-green"
          )}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {results.errosCount > 0 ? (
                  <AlertCircle className="text-status-yellow" size={24} />
                ) : (
                  <CheckCircle2 className="text-status-green" size={24} />
                )}
                <div>
                  <h3 className="text-xl text-premium-title">Importação {results.errosCount > 0 ? 'Concluída com Alertas' : 'Concluída'}</h3>
                  <p className="text-sm text-[var(--dash-text-secondary)]">{results.message}</p>
                </div>
              </div>
              <button 
                 onClick={handleReset}
                 className="px-4 py-2 rounded-lg bg-[var(--dash-bg)] border border-[var(--dash-border)] text-premium-muted hover:text-[var(--dash-accent-text)] transition-all"
              >
                Voltar
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <StatBox label="Processados" value={results.totalProcessados} />
             <StatBox label="Novos"        value={results.totalCriados} color="text-status-green" />
             <StatBox label="Atualizados"  value={results.totalAtualizados} color="text-[var(--dash-accent-text)]" />
             <StatBox label="Com Erro"     value={results.errosCount} color={results.errosCount > 0 ? "text-status-red" : "text-[var(--dash-text-muted)]"} />
          </div>

          {/* Errors Section */}
          {results.errosCount > 0 && (
            <div className="premium-card bg-status-red-bg border-status-red/10">
               <h4 className="flex items-center gap-2 text-status-red font-bold text-sm mb-4">
                  <AlertCircle size={16} /> Relatório de Falhas
               </h4>
               <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {results.erros.map((err, i) => (
                    <div key={i} className="py-2 px-3 bg-black/20 rounded-lg font-mono text-[11px] text-red-200 border border-status-red/5">
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

function StatBox({ label, value, color = "text-[var(--dash-text-primary)]" }: { label: string; value: number; color?: string }) {
  return (
    <div className="premium-card p-5 text-center">
      <span className="text-premium-muted text-[8px] uppercase tracking-tighter mb-1 block">{label}</span>
      <p className={clsx("text-2xl font-bold font-mono tracking-tighter", color)}>{value}</p>
    </div>
  )
}
