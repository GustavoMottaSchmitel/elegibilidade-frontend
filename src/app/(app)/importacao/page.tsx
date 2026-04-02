'use client'
import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { importacaoApi } from '@/lib/api'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, RefreshCw, X, FileText, Database, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

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
    <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 60 }}>
      {/* Header */}
      <div className="animate-fade-up" style={{ marginBottom: 32 }}>
        <h1 className="text-title" style={{ fontSize: 24, marginBottom: 6 }}>Importação de Dados</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          Atualize a base de clientes e elegibilidade processando arquivos CSV do sistema de faturamento.
        </p>
      </div>

      {/* Info cards */}
      <div className="animate-fade-up animate-delay-100" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <InfoCard icon={<FileText size={18} />} title="Formato" desc="Arquivos .CSV compatíveis com o sistema de faturamento" />
        <InfoCard icon={<Database size={18} />} title="Processamento" desc="Novos clientes serão criados, existentes atualizados" />
        <InfoCard icon={<Shield size={18} />} title="Validação" desc="Registros inválidos são reportados sem afetar os demais" />
      </div>

      {!results ? (
        <div className="card animate-fade-up animate-delay-200" style={{ padding: 32 }}>
          {/* Dropzone */}
          <div
            {...getRootProps()}
            style={{
              border: `2px dashed ${isDragActive ? 'var(--accent)' : 'var(--border-default)'}`,
              borderRadius: 16,
              padding: '48px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: isDragActive ? 'var(--accent-light)' : 'var(--bg-elevated)',
              transition: 'all 0.2s ease',
            }}
          >
            <input {...getInputProps()} />

            <div style={{
              width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: file ? 'rgba(34,197,94,0.1)' : 'var(--bg-card)',
              color: file ? '#22c55e' : 'var(--text-muted)',
              border: `1px solid ${file ? 'rgba(34,197,94,0.2)' : 'var(--border-light)'}`,
              transition: 'all 0.2s',
            }}>
              {file ? <FileSpreadsheet size={28} /> : <UploadCloud size={28} />}
            </div>

            {file ? (
              <>
                <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Arquivo Selecionado</p>
                <p style={{ fontSize: 14, fontFamily: 'var(--font-mono)', color: 'var(--accent-text)', marginBottom: 8 }}>{file.name}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(1)} KB</p>
              </>
            ) : (
              <>
                <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                  {isDragActive ? 'Solte para selecionar' : 'Arraste ou clique para selecionar'}
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Formato aceito: .CSV (padrão sistema de faturamento)</p>
              </>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button
              onClick={handleImport}
              disabled={!file || mutation.isPending}
              className="btn-primary"
              style={{ flex: 1, height: 48, fontSize: 14 }}
            >
              {mutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
              {mutation.isPending ? 'Processando...' : 'Iniciar Processamento'}
            </button>
            {file && !mutation.isPending && (
              <button onClick={handleReset} className="btn-ghost" style={{ width: 48, height: 48, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Result Header */}
          <div className="card" style={{
            padding: 24,
            borderLeft: `4px solid ${results.errosCount > 0 ? '#f59e0b' : '#22c55e'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {results.errosCount > 0
                  ? <AlertCircle size={22} style={{ color: '#f59e0b' }} />
                  : <CheckCircle2 size={22} style={{ color: '#22c55e' }} />
                }
                <div>
                  <h3 className="text-title" style={{ fontSize: 18 }}>
                    {results.errosCount > 0 ? 'Concluída com Alertas' : 'Importação Concluída'}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{results.message}</p>
                </div>
              </div>
              <button onClick={handleReset} className="btn-ghost" style={{ fontSize: 13, flexShrink: 0 }}>
                Nova Importação
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <ResultStat label="Processados" value={results.totalProcessados} />
            <ResultStat label="Novos" value={results.totalCriados} color="#22c55e" />
            <ResultStat label="Atualizados" value={results.totalAtualizados} color="#3b82f6" />
            <ResultStat label="Com Erro" value={results.errosCount} color={results.errosCount > 0 ? '#ef4444' : undefined} />
          </div>

          {/* Error Details */}
          {results.errosCount > 0 && (
            <div className="card" style={{ padding: 20, background: 'rgba(239,68,68,0.04)', borderColor: 'rgba(239,68,68,0.15)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: '#ef4444', marginBottom: 12 }}>
                <AlertCircle size={16} /> Relatório de Falhas
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 240, overflowY: 'auto' }}>
                {results.erros.map((err, i) => (
                  <div key={i} style={{
                    padding: '8px 12px', borderRadius: 8,
                    background: 'var(--bg-card)', border: '1px solid var(--border-light)',
                    fontFamily: 'var(--font-mono)', fontSize: 11, color: '#ef4444',
                  }}>
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

function InfoCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="card" style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }}>{icon}</div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{title}</p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{desc}</p>
      </div>
    </div>
  )
}

function ResultStat({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="card" style={{ padding: 16, textAlign: 'center' }}>
      <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>{label}</span>
      <p style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em', color: color || 'var(--text-primary)' }}>{value}</p>
    </div>
  )
}
