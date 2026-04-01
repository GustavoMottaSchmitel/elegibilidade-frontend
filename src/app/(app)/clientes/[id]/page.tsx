'use client'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { clienteApi } from '@/lib/api'
import { formatCpfCnpj, formatMoeda, formatData, formatDataHora } from '@/lib/utils'
import { StatusAtendimentoBadge, StatusContratoBadge, Skeleton } from '@/components/ui'
import { ArrowLeft, Building2, Phone, Mail, MapPin, FileText, Wallet, Calendar, Clock, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

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
    <div className="max-w-4xl mx-auto pb-20">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 font-mono text-[11px] text-[var(--dash-text-muted)] hover:text-[var(--dash-accent-text)] transition-all mb-8 bg-[var(--dash-accent-soft)] px-3 py-1.5 rounded-lg border border-[var(--dash-border)] group"
      >
        <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" /> 
        <span className="uppercase tracking-widest">voltar para lista</span>
      </button>

      {isLoading ? (
        <LoadingSkeleton />
      ) : detalhe ? (
        <div className="space-y-8 animate-fade-in">
          {/* Header Profile */}
          <div className="premium-card p-8 border-l-4 border-l-[var(--dash-accent)] shadow-2xl relative overflow-hidden">
             {/* Decorative Background Icon */}
             <Building2 size={120} className="absolute -right-6 -bottom-6 text-[var(--dash-accent)] opacity-[0.03] rotate-12" />

             <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div>
                    <h1 className="text-3xl text-premium-title mb-2 tracking-tight">{detalhe.razaoSocial}</h1>
                    <div className="flex items-center gap-3">
                       <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-[var(--dash-bg)] border border-[var(--dash-border)] text-[var(--dash-text-secondary)]">
                          {formatCpfCnpj(detalhe.cnpj)}
                       </span>
                       {detalhe.nomeFantasia && (
                         <span className="text-[var(--dash-text-muted)] text-[13px] font-sans italic border-l border-[var(--dash-border)] pl-3">
                           {detalhe.nomeFantasia}
                         </span>
                       )}
                    </div>
                  </div>
                  {status && <StatusAtendimentoBadge status={status.statusAtendimento} />}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-[var(--dash-border)]/50">
                   <ContactBadge icon={<Mail size={14} />} label="E-mail de Contato" value={detalhe.email || '—'} />
                   <ContactBadge icon={<Phone size={14} />} label="Telefone / WhatsApp" value={detalhe.telefone || '—'} mono />
                   <ContactBadge icon={<MapPin size={14} />} label="Localização Principal" value={[detalhe.cidade, detalhe.estado].filter(Boolean).join(' · ') || '—'} />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Main Column: Contratos */}
             <div className="lg:col-span-2 space-y-4">
                <h3 className="flex items-center gap-2 text-premium-muted text-[10px] tracking-[0.2em] mb-4">
                  <FileText size={14} className="text-[var(--dash-accent)]" /> Contratos Vigentes ({detalhe.contratos.length})
                </h3>
                
                {detalhe.contratos.length === 0 ? (
                  <div className="premium-card p-10 text-center opacity-60">
                    <p className="text-sm font-mono text-[var(--dash-text-muted)] italic">Nenhum contrato ativo registrado.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {detalhe.contratos.map((c) => (
                      <div key={c.id} className="premium-card group hover:border-[var(--dash-accent)] p-6 transition-all duration-500">
                        <div className="flex items-start justify-between mb-6">
                           <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-xl bg-[var(--dash-bg)] border border-[var(--dash-border)] flex items-center justify-center text-[var(--dash-accent-text)]">
                                 <Wallet size={18} />
                              </div>
                              <div>
                                <p className="font-mono text-[15px] text-[var(--dash-text-primary)] font-bold">{c.numeroContrato}</p>
                                <p className="text-[11px] text-[var(--dash-text-muted)] uppercase tracking-wider">{c.tipoContrato}</p>
                              </div>
                           </div>
                           <StatusContratoBadge status={c.statusContrato} />
                        </div>

                        <div className="grid grid-cols-3 gap-4 py-4 border-y border-[var(--dash-border)]/30">
                           <ContractStat label="Início" value={formatData(c.dataInicio)} icon={<Calendar size={12}/>} />
                           <ContractStat label="Vencimento" value={formatData(c.dataFim)} icon={<Clock size={12}/>} isBold />
                           <ContractStat label="Faturamento" value={formatMoeda(c.valorMensal)} icon={<FileText size={12}/>} />
                        </div>

                        {c.observacao && (
                           <p className="mt-4 text-[12px] leading-relaxed text-[var(--dash-text-secondary)] italic pl-4 border-l-2 border-[var(--dash-border)]">
                              "{c.observacao}"
                           </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
             </div>

             {/* Sidebar: Financeiro & Metadata */}
             <div className="space-y-8">
                <section>
                   <h3 className="flex items-center gap-2 text-premium-muted text-[10px] tracking-[0.2em] mb-4 uppercase">
                     Saúde Financeira
                   </h3>
                   {detalhe.financeiros.length > 0 ? (
                      <div className="space-y-3">
                        {detalhe.financeiros.map((f) => (
                          <div key={f.id} className={clsx(
                            "premium-card p-5 border-l-2",
                            f.possuiDebito ? "border-l-status-red" : "border-l-status-green"
                          )}>
                             <div className="flex justify-between items-center mb-4 pb-2 border-b border-[var(--dash-border)]/20">
                                <span className="text-[10px] font-mono text-[var(--dash-text-muted)] uppercase tracking-tighter">Nº {f.numeroContrato || 'N/A'}</span>
                                <span className={clsx(
                                  "w-2 h-2 rounded-full",
                                  f.possuiDebito ? "bg-status-red animate-pulse" : "bg-status-green"
                                )} />
                             </div>
                             
                             <div className="space-y-3">
                                <FinanceRow label="Status" value={f.possuiDebito ? 'Inadimplente' : 'Regular'} highlight={f.possuiDebito} />
                                <FinanceRow label="Total em Aberto" value={formatMoeda(f.valorEmAberto)} bold highlight={f.valorEmAberto > 0} />
                                <FinanceRow label="Dias de Atraso" value={f.diasAtraso > 0 ? `${f.diasAtraso} dias` : 'Nenhum'} highlight={f.diasAtraso > 0} />
                             </div>

                             {f.dataUltimoPagamento && (
                               <p className="mt-4 pt-3 border-t border-[var(--dash-border)]/20 text-[10px] text-right text-[var(--dash-text-muted)] italic font-mono lowercase">
                                 Pagto: {formatData(f.dataUltimoPagamento)}
                               </p>
                             )}
                          </div>
                        ))}
                      </div>
                   ) : (
                      <div className="premium-card p-10 text-center opacity-60">
                        <p className="text-xs font-mono text-[var(--dash-text-muted)] italic">Nenhum dado financeiro.</p>
                      </div>
                   )}
                </section>

                <section className="premium-card bg-[var(--dash-bg)] border-none p-5">
                   <h3 className="text-premium-muted text-[9px] mb-4 uppercase tracking-widest">Metadata do Registro</h3>
                   <div className="space-y-3">
                      <MetaRow label="Registro" value={formatDataHora(detalhe.criadoEm)} />
                      <MetaRow label="Sincronia" value={formatDataHora(detalhe.atualizadoEm)} />
                      <div className="pt-3 flex justify-end">
                         <div className="inline-flex items-center gap-1.5 text-[9px] font-mono text-[var(--dash-accent-text)] bg-[var(--dash-surface)] p-2 rounded-lg border border-[var(--dash-border)]">
                            ID INTERNO #{detalhe.id}
                         </div>
                      </div>
                   </div>
                </section>
             </div>
          </div>
        </div>
      ) : (
        <div className="premium-card py-24 text-center">
          <AlertCircle size={40} className="text-status-red mx-auto mb-4 opacity-40" />
          <h2 className="text-premium-title text-xl mb-1">Cliente não encontrado</h2>
          <p className="text-[var(--dash-text-muted)] text-sm mb-6">O registro solicitado pode ter sido removido ou não existe.</p>
          <button onClick={() => router.push('/')} className="px-6 py-2.5 bg-[var(--dash-accent)] text-white font-bold rounded-xl hover:bg-[var(--dash-accent-text)] transition-all text-sm shadow-lg shadow-[var(--dash-accent-soft)]">
            Voltar ao Dashboard
          </button>
        </div>
      )}
    </div>
  )
}

function ContactBadge({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="flex items-center gap-2 text-premium-muted text-[9px] mb-1">
        <span className="text-[var(--dash-accent)]">{icon}</span> {label}
      </p>
      <p className={clsx(
        "text-[13px] text-[var(--dash-text-primary)] font-medium break-all",
        mono ? "font-mono" : "font-sans"
      )}>
        {value}
      </p>
    </div>
  )
}

function ContractStat({ icon, label, value, isBold }: { icon: React.ReactNode; label: string; value: string; isBold?: boolean }) {
  return (
    <div className="space-y-1">
      <span className="flex items-center gap-1.5 text-premium-muted text-[8px] uppercase tracking-tighter">
        <span className="text-[var(--dash-text-muted)]">{icon}</span> {label}
      </span>
      <p className={clsx(
        "text-[12px] text-[var(--dash-text-primary)] leading-none",
        isBold ? "font-bold" : "font-medium"
      )}>
        {value}
      </p>
    </div>
  )
}

function FinanceRow({ label, value, highlight, bold }: { label: string; value: string; highlight?: boolean; bold?: boolean }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-[var(--dash-text-muted)] text-[11px] h-full flex items-center">{label}</span>
      <span className={clsx(
        "font-mono rounded-md px-2 py-0.5 border",
        highlight ? "text-status-red bg-status-red-bg border-status-red/10" : "text-emerald-500 bg-emerald-500/10 border-emerald-500/10",
        bold && "font-bold text-[14px]"
      )}>
        {value}
      </span>
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-[10px]">
      <span className="text-[var(--dash-text-muted)] font-mono">{label}</span>
      <span className="text-[var(--dash-text-secondary)] font-mono">{value}</span>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="premium-card p-10 space-y-6">
        <Skeleton className="h-10 w-2/3 bg-[var(--dash-bg)]" />
        <div className="flex gap-4">
           <Skeleton className="h-6 w-32 bg-[var(--dash-bg)] rounded-full" />
           <Skeleton className="h-6 w-48 bg-[var(--dash-bg)] rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
           <Skeleton className="h-32 w-full bg-[var(--dash-surface)] border border-[var(--dash-border)]" />
           <Skeleton className="h-32 w-full bg-[var(--dash-surface)] border border-[var(--dash-border)]" />
        </div>
        <div className="space-y-4">
           <Skeleton className="h-64 w-full bg-[var(--dash-surface)] border border-[var(--dash-border)]" />
        </div>
      </div>
    </div>
  )
}
