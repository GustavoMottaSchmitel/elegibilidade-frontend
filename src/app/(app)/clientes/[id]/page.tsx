'use client'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { clienteApi } from '@/lib/api'
import { formatCpfCnpj, formatMoeda, formatData, formatDataHora } from '@/lib/utils'
import { StatusAtendimentoBadge, StatusContratoBadge, Skeleton } from '@/components/ui'
import { ArrowLeft, Building2, Phone, Mail, MapPin, FileText, Wallet, Calendar, Clock, AlertCircle } from 'lucide-react'

export default function ClienteDetalhePage() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()
  const clienteId = Number(id)

  const { data: detalhe, isLoading: loadDetalhe } = useQuery({
    queryKey: ['cliente', clienteId],
    queryFn:  () => clienteApi.detalhe(clienteId),
    enabled:  !!clienteId,
  })

  const { data: status, isLoading: loadStatus } = useQuery({
    queryKey: ['elegibilidade-id', clienteId],
    queryFn:  () => clienteApi.consultarPorId(clienteId),
    enabled:  !!clienteId,
  })

  const isLoading = loadDetalhe || loadStatus

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', paddingBottom: 60 }}>
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="btn-ghost"
        style={{ marginBottom: 24, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
      >
        <ArrowLeft size={14} />
        Voltar
      </button>

      {isLoading ? (
        <LoadingSkeleton />
      ) : detalhe ? (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Profile Header Card */}
          <div className="card" style={{ padding: 28, borderLeft: '4px solid var(--accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
              <div>
                <h1 className="text-title" style={{ fontSize: 22, marginBottom: 8 }}>{detalhe.razaoSocial}</h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 12,
                    padding: '4px 10px', borderRadius: 6,
                    background: 'var(--bg-elevated)', border: '1px solid var(--border-light)',
                    color: 'var(--text-secondary)',
                  }}>
                    {formatCpfCnpj(detalhe.cnpj)}
                  </span>
                  {detalhe.nomeFantasia && (
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic', borderLeft: '1px solid var(--border-light)', paddingLeft: 10 }}>
                      {detalhe.nomeFantasia}
                    </span>
                  )}
                </div>
              </div>
              {status && <StatusAtendimentoBadge status={status.statusAtendimento} />}
            </div>

            {/* Contact Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
              <ContactInfo icon={<Mail size={14} />} label="E-mail" value={detalhe.email || '—'} />
              <ContactInfo icon={<Phone size={14} />} label="Telefone" value={detalhe.telefone || '—'} mono />
              <ContactInfo icon={<MapPin size={14} />} label="Localização" value={[detalhe.cidade, detalhe.estado].filter(Boolean).join(' · ') || '—'} />
            </div>
          </div>

          {/* Main Grid: Contracts + Financial */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {/* Contracts */}
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileText size={14} style={{ color: 'var(--accent)' }} />
                Contratos ({detalhe.contratos.length})
              </p>

              {detalhe.contratos.length === 0 ? (
                <div className="card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  Nenhum contrato registrado.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {detalhe.contratos.map((c) => (
                    <div key={c.id} className="card" style={{ padding: 20, transition: 'all 0.2s', borderLeft: '3px solid var(--accent)' }}>
                      {/* Contract Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                        <div style={{ display: 'flex', gap: 12 }}>
                          <div style={{
                            width: 40, height: 40, borderRadius: 10,
                            background: 'var(--accent-light)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            color: 'var(--accent-text)',
                          }}>
                            <Wallet size={18} />
                          </div>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{c.numeroContrato}</p>
                            <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{c.tipoContrato}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <StatusContratoBadge status={c.statusContrato} />
                          {c.empresa && (
                             <span className="badge" style={{ background: 'var(--bg-page)', border: '1px solid var(--border-light)' }}>
                               {c.empresa === 'ACTIVE' ? 'Active' : 'Ata Sistemas'}
                             </span>
                          )}
                        </div>
                      </div>

                      {/* Contract Details */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, padding: '12px 0', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
                        <DetailCell icon={<Calendar size={12} />} label="Início" value={formatData(c.dataInicio)} />
                        <DetailCell icon={<Clock size={12} />} label="Vencimento" value={formatData(c.dataFim)} bold />
                        <DetailCell icon={<FileText size={12} />} label="Faturamento" value={formatMoeda(c.valorMensal)} />
                      </div>

                      {c.observacao && (
                        <p style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic', paddingLeft: 12, borderLeft: '2px solid var(--border-light)', lineHeight: 1.6 }}>
                          &ldquo;{c.observacao}&rdquo;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Financial Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Saúde Financeira
              </p>

              {detalhe.financeiros.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {detalhe.financeiros.map((f) => (
                    <div key={f.id} className="card" style={{
                      padding: 16,
                      borderLeft: `3px solid ${f.possuiDebito ? '#ef4444' : '#22c55e'}`,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border-light)', flexWrap: 'wrap', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                           <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Nº {f.numeroContrato || 'N/A'}</span>
                           {f.empresa && (
                             <span className="badge" style={{ fontSize: 10, padding: '2px 6px', background: 'var(--bg-page)', border: '1px solid var(--border-light)' }}>
                               {f.empresa === 'ACTIVE' ? 'Active' : 'Ata'}
                             </span>
                           )}
                        </div>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: f.possuiDebito ? '#ef4444' : '#22c55e' }} className={f.possuiDebito ? 'dot-pulse' : ''} />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <FinRow 
                          label="Status" 
                          value={f.possuiDebito && f.diasAtraso > 0 ? 'Inadimplente' : f.possuiDebito ? 'Pendente' : 'Regular'} 
                          bad={f.possuiDebito && f.diasAtraso > 0} 
                          warning={f.possuiDebito && f.diasAtraso === 0}
                        />
                        <FinRow label="Em Aberto" value={formatMoeda(f.valorEmAberto)} bad={f.valorEmAberto > 0} bold />
                        <FinRow label="Dias Atraso" value={f.diasAtraso > 0 ? `${f.diasAtraso} dias` : 'Nenhum'} bad={f.diasAtraso > 0} />
                      </div>

                      {f.dataUltimoPagamento && (
                        <p style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--border-light)', fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
                          Pagto: {formatData(f.dataUltimoPagamento)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  Nenhum dado financeiro.
                </div>
              )}

              {/* Metadata */}
              <div className="card" style={{ padding: 16, background: 'var(--bg-elevated)' }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Registro</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <MetaRow label="Criado em" value={formatDataHora(detalhe.criadoEm)} />
                  <MetaRow label="Atualizado" value={formatDataHora(detalhe.atualizadoEm)} />
                  <div style={{ paddingTop: 6, display: 'flex', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--accent-text)', background: 'var(--accent-light)', padding: '4px 8px', borderRadius: 6 }}>
                      ID #{detalhe.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <AlertCircle size={36} style={{ color: '#ef4444', margin: '0 auto 12px', opacity: 0.5 }} />
          <h2 className="text-title" style={{ fontSize: 18, marginBottom: 6 }}>Cliente não encontrado</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>O registro pode ter sido removido ou não existe.</p>
          <button onClick={() => router.push('/')} className="btn-primary">Voltar ao Dashboard</button>
        </div>
      )}
    </div>
  )
}

function ContactInfo({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
        <span style={{ color: 'var(--accent)' }}>{icon}</span> {label}
      </p>
      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)', wordBreak: 'break-all' }}>
        {value}
      </p>
    </div>
  )
}

function DetailCell({ icon, label, value, bold }: { icon: React.ReactNode; label: string; value: string; bold?: boolean }) {
  return (
    <div>
      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
        {icon} {label}
      </span>
      <p style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: bold ? 700 : 500 }}>{value}</p>
    </div>
  )
}

function FinRow({ label, value, bad = false, bold = false, warning = false }: { label: string; value: string; bad?: boolean; bold?: boolean; warning?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid var(--border-light)' }}>
      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ 
        fontSize: 13, 
        fontWeight: bad || warning || bold ? 700 : 500, 
        color: bad ? '#ef4444' : warning ? '#f59e0b' : 'var(--text-primary)',
        fontFamily: 'var(--font-mono)',
        padding: bad || warning ? '2px 8px' : '0',
        borderRadius: 6,
        background: bad ? 'rgba(239,68,68,0.08)' : warning ? 'rgba(245,158,11,0.08)' : 'transparent',
      }}>
        {value}
      </span>
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
      <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</span>
      <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{value}</span>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="card" style={{ padding: 28 }}>
        <Skeleton className="h-8 w-2/3" />
        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-6 w-48 rounded-full" />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  )
}
