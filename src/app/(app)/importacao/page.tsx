'use client'
import { useState, useCallback, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { importacaoApi } from '@/lib/api'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, RefreshCw, X, FileText, Database, Shield, Building2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import type { ImportacaoCsv, EmpresaOrigem } from '@/types/api'

export default function ImportacaoPage() {
  const [file, setFile] = useState<File | null>(null)
  const [empresa, setEmpresa] = useState<EmpresaOrigem | ''>('')
  const [results, setResults] = useState<ImportacaoCsv | null>(null)
  
  const queryClient = useQueryClient()

  // Verifica se existem contratos na base (para bloquear financeiro se necessário)
  const { data: contratosCheck } = useQuery({
    queryKey: ['tem-contratos'],
    queryFn: importacaoApi.temContratos,
  })

  useEffect(() => {
    // Tenta detectar o tipo de arquivo pelo nome (heurística simples só pro UI)
    if (file) {
      const nome = file.name.toLowerCase()
      const isFinanceiro = nome.includes('fin') || nome.includes('receb')
      if (isFinanceiro && contratosCheck && !contratosCheck.temContratos) {
        toast.error('Atenção: É necessário importar os Contratos antes do Financeiro!')
      }
    }
  }, [file, contratosCheck])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0])
    setResults(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
    disabled: !empresa // desabilita drag & drop se não escolheu empresa
  })

  const importMutation = useMutation({
    mutationFn: (f: File) => importacaoApi.importarCsv(f, empresa),
    onSuccess: (data) => {
      setResults(data as ImportacaoCsv)
      queryClient.invalidateQueries({ queryKey: ['tem-contratos'] })
      toast.success('Processamento concluído!')
    },
    onError: (error: any) => {
      toast.error('Erro ao processar: ' + error.message)
    },
  })

  const clearMutation = useMutation({
    mutationFn: (emp: EmpresaOrigem) => importacaoApi.limparDados(emp),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tem-contratos'] })
      toast.success(`Base da empresa ${variables} limpa com sucesso.`)
      handleReset()
    },
    onError: (error: any) => {
      toast.error('Erro ao limpar base: ' + error.message)
    },
  })

  const handleImport = () => {
    if (!empresa) {
      toast.error('Selecione a empresa de origem.')
      return
    }
    if (!file) {
      toast.error('Selecione um arquivo.')
      return
    }
    const nome = file.name.toLowerCase()
    const isFinanceiro = nome.includes('fin') || nome.includes('receb') || nome.includes('titulo')
    if (isFinanceiro && contratosCheck && !contratosCheck.temContratos) {
      toast.error('Importe o arquivo de Contratos primeiro!')
      return
    }
    importMutation.mutate(file)
  }

  const handleClear = () => {
    if (!empresa) {
      toast.error('Selecione uma empresa para limpar a base.')
      return
    }
    if (window.confirm(`Tem certeza que deseja apagar TODOS os clientes, contratos e financeiros atrelados à empresa ${empresa}? Isso não pode ser desfeito.`)) {
      clearMutation.mutate(empresa)
    }
  }

  const handleReset = () => {
    setFile(null)
    setResults(null)
  }

  // Parses os erros que vêm como string separada por quebras de linha
  const errorLines = results?.detalhesErro ? results.detalhesErro.split('\n') : []

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 60 }}>
      {/* Header */}
      <div className="animate-fade-up" style={{ marginBottom: 32 }}>
        <h1 className="text-title" style={{ fontSize: 24, marginBottom: 6 }}>Importação de Dados</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          Atualize a base de clientes e elegibilidade processando arquivos CSV do sistema de faturamento.
        </p>
      </div>

      {/* Info cards - Responsivo */}
      <div className="animate-fade-up animate-delay-100" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 12, 
        marginBottom: 24 
      }}>
        <InfoCard icon={<FileText size={18} />} title="Ordem Correta" desc="Suba PRIMEIRO Contratos, e SÓ DEPOIS o Financeiro" />
        <InfoCard icon={<Building2 size={18} />} title="Empresas" desc="Os dados são separados por empresa (Active ou Ata Sistemas)" />
        <InfoCard icon={<Shield size={18} />} title="Validação" desc="Registros inválidos são reportados sem afetar os demais" />
      </div>

      <div className="card animate-fade-up animate-delay-200" style={{ padding: '24px 32px', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 250 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
              1. De qual empresa são esses dados? <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select 
              value={empresa} 
              onChange={(e) => setEmpresa(e.target.value as EmpresaOrigem | '')}
              className="input-field"
              style={{ width: '100%', maxWidth: 350, padding: 12 }}
              disabled={importMutation.isPending || !!results}
            >
              <option value="" disabled>-- Selecione a empresa --</option>
              <option value="ACTIVE">Active</option>
              <option value="ATA_SISTEMAS">Ata Sistemas</option>
            </select>
          </div>
          
          <div style={{ flexShrink: 0 }}>
            <button 
              onClick={handleClear}
              disabled={!empresa || clearMutation.isPending || importMutation.isPending}
              className="btn-ghost"
              style={{ padding: '8px 16px', color: '#ef4444', fontSize: 13, border: '1px solid rgba(239,68,68,0.2)' }}
            >
              {clearMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              Zerar Base da Empresa
            </button>
          </div>
        </div>
        {!empresa && (
          <p style={{ fontSize: 13, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertCircle size={14} /> Você precisa selecionar a empresa antes de importar o arquivo.
          </p>
        )}
      </div>

      {!results ? (
        <div className="card animate-fade-up animate-delay-300" style={{ padding: 32, opacity: empresa ? 1 : 0.5, pointerEvents: empresa ? 'auto' : 'none', transition: 'all 0.3s' }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>
            2. Selecione o arquivo CSV: <span style={{ color: '#ef4444' }}>*</span>
          </label>
          
          {/* Dropzone */}
          <div
            {...getRootProps()}
            style={{
              border: `2px dashed ${isDragActive ? 'var(--accent)' : 'var(--border-default)'}`,
              borderRadius: 16,
              padding: '48px 24px',
              textAlign: 'center',
              cursor: empresa ? 'pointer' : 'not-allowed',
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
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Mande o CSV de Contratos. Depois mande o Financeiro.</p>
              </>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button
              onClick={handleImport}
              disabled={!file || !empresa || importMutation.isPending}
              className="btn-primary"
              style={{ flex: 1, height: 48, fontSize: 14 }}
            >
              {importMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
              {importMutation.isPending ? 'Processando...' : 'Iniciar Processamento'}
            </button>
            {file && !importMutation.isPending && (
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
            borderLeft: `4px solid ${results.registrosErro > 0 ? '#f59e0b' : '#22c55e'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {results.registrosErro > 0
                  ? <AlertCircle size={22} style={{ color: '#f59e0b' }} />
                  : <CheckCircle2 size={22} style={{ color: '#22c55e' }} />
                }
                <div>
                  <h3 className="text-title" style={{ fontSize: 18 }}>
                    {results.status === 'CONCLUIDO_COM_ERROS' ? 'Concluída com Alertas' : results.status === 'ERRO' ? 'Falha na Importação' : 'Importação Concluída'}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{file?.name}</p>
                </div>
              </div>
              <button onClick={handleReset} className="btn-ghost" style={{ fontSize: 13, flexShrink: 0 }}>
                Nova Importação
              </button>
            </div>
          </div>

          {/* Stats Grid - Responsivo */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
            <ResultStat label="Registros Líquidos" value={results.totalRegistros} />
            <ResultStat label="Importados/Atualizados" value={results.registrosSucesso} color="#3b82f6" />
            <ResultStat label="Com Erro" value={results.registrosErro} color={results.registrosErro > 0 ? '#ef4444' : undefined} />
          </div>

          {/* Error Details */}
          {errorLines.length > 0 && (
            <div className="card" style={{ padding: 20, background: 'rgba(239,68,68,0.04)', borderColor: 'rgba(239,68,68,0.15)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: '#ef4444', marginBottom: 12 }}>
                <AlertCircle size={16} /> Relatório de Falhas ({results.registrosErro})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 240, overflowY: 'auto' }}>
                {errorLines.map((err, i) => err.trim() ? (
                  <div key={i} style={{
                    padding: '8px 12px', borderRadius: 8,
                    background: 'var(--bg-card)', border: '1px solid var(--border-light)',
                    fontFamily: 'var(--font-mono)', fontSize: 11, color: '#ef4444',
                  }}>
                    {err}
                  </div>
                ) : null)}
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
