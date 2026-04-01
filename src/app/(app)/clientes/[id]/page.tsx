'use client'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { clienteApi } from '@/lib/api'
import { formatCpfCnpj, formatMoeda, formatData, formatDataHora } from '@/lib/utils'
import { StatusAtendimentoBadge, StatusContratoBadge, Skeleton } from '@/components/ui'
import { ArrowLeft, Building2, Phone, Mail, MapPin, FileText, Wallet, Calendar, Clock, AlertCircle } from 'lucide-react'
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
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="btn-ghost text-[11px] font-mono uppercase tracking-widest mb-8 group"
      >
        <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
        Voltar para lista
      </button>

      {isLoading ? (
        <LoadingSkeleton />
      ) : detalhe ? (
        <div className="space-y-6 animate-fade-in">
          {/* Profile Header */}
          <div className="premium-card p-8 border-l-4 border-l-accent-500 relative overflow-hidden">
            <Building2 size={120} className="absolute -right-6 -bottom-6 text-accent-500 opacity-[0.04] rotate-12" />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-title text-2xl md:text-3xl mb-2 tracking-tight">{detalhe.razaoSocial}</h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-base-850 border border-base-700 text-base-200">
                      {formatCpfCnpj(detalhe.cnpj)}
                    </span>
                    {detalhe.nomeFantasia && (
                      <span className="text-base-400 text-[13px] italic border-l border-base-700 pl-3">
                        {detalhe.nomeFantasia}
                      </span>
                    )}
                  </div>
                </div>
                {status && <StatusAtendimentoBadge status={status.statusAtendimento} />}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-5 border-t border-base-700/50">
                <ContactBadge icon={<Mail size={14} />} label="E-mail" value={detalhe.email || '—'} />
                <ContactBadge icon={<Phone size={14} />} label="Telefone" value={detalhe.telefone || '—'} mono />
                <ContactBadge icon={<MapPin size={14} />} label="Localização" value={[detalhe.cidade, detalhe.estado].filter(Boolean).join(' · ') || '—'} />
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contracts Column */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-label mb-2 flex items-center gap-2">
                <FileText size={14} className="text-accent-400" />
                Contratos ({detalhe.contratos.length})
              </h3>

              {detalhe.contratos.length === 0 ? (
                <div className="premium-card p-10 text-center opacity-60">
                  <p className="text-sm font-mono text-base-400 italic">Nenhum contrato registrado.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {detalhe.contratos.map((c) => (
                    <div key={c.id} className="premium-card group hover:!border-accent-500/40 transition-all duration-300">
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-xl bg-base-850 border border-base-700 flex items-center justify-center text-accent-400">
                            <Wallet size={18} />
                          </div>
                          <div>
                            <p className="font-mono text-[14px] text-white font-bold">{c.numeroContrato}</p>
                            <p className="text-label text-[9px]">{c.tipoContrato}</p>
                          </div>
                        </div>
                        <StatusContratoBadge status={c.statusContrato} />
                      </div>

                      <div className="grid grid-cols-3 gap-4 py-4 border-y border-base-700/40">
                        <ContractStat label="Início" value={formatData(c.dataInicio)} icon={<Calendar size={12}/>} />
                        <ContractStat label="Vencimento" value={formatData(c.dataFim)} icon={<Clock size={12}/>} isBold />
                        <ContractStat label="Faturamento" value={formatMoeda(c.valorMensal)} icon={<FileText size={12}/>} />
                      </div>

                      {c.observacao && (
                        <p className="mt-4 text-[12px] leading-relaxed text-base-300 italic pl-4 border-l-2 border-base-700">
                          &ldquo;{c.observacao}&rdquo;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Financial Sidebar */}
            <div className="space-y-6">
              <section>
                <h3 className="text-label mb-3">Saúde Financeira</h3>
                {detalhe.financeiros.length > 0 ? (
                  <div className="space-y-3">
                    {detalhe.financeiros.map((f) => (
                      <div key={f.id} className={clsx(
                        "premium-card p-5 border-l-2",
                        f.possuiDebito ? "border-l-danger" : "border-l-ok"
                      )}>
                        <div className="flex justify-between items-center mb-3 pb-2 border-b border-base-750">
                          <span className="text-label text-[9px]">Nº {f.numeroContrato || 'N/A'}</span>
                          <span className={clsx(
                            "w-2 h-2 rounded-full",
                            f.possuiDebito ? "bg-danger dot-pulse" : "bg-ok"
                          )} />
                        </div>

                        <div className="space-y-2.5">
                          <FinanceRow label="Status" value={f.possuiDebito ? 'Inadimplente' : 'Regular'} highlight={f.possuiDebito} />
                          <FinanceRow label="Em Aberto" value={formatMoeda(f.valorEmAberto)} bold highlight={f.valorEmAberto > 0} />
                          <FinanceRow label="Dias Atraso" value={f.diasAtraso > 0 ? `${f.diasAtraso} dias` : 'Nenhum'} highlight={f.diasAtraso > 0} />
                        </div>

                        {f.dataUltimoPagamento && (
                          <p className="mt-3 pt-2 border-t border-base-750 text-[10px] text-right text-base-400 italic font-mono">
                            Pagto: {formatData(f.dataUltimoPagamento)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="premium-card p-10 text-center opacity-60">
                    <p className="text-xs font-mono text-base-400 italic">Nenhum dado financeiro.</p>
                  </div>
                )}
              </section>

              {/* Metadata */}
              <div className="premium-card !bg-base-850 !border-base-750 p-5">
                <h3 className="text-label text-[9px] mb-3">Metadata do Registro</h3>
                <div className="space-y-2.5">
                  <MetaRow label="Criado em" value={formatDataHora(detalhe.criadoEm)} />
                  <MetaRow label="Atualizado" value={formatDataHora(detalhe.atualizadoEm)} />
                  <div className="pt-2 flex justify-end">
                    <span className="text-[9px] font-mono text-accent-300 bg-accent-glow p-2 rounded-lg">
                      ID #{detalhe.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="premium-card py-24 text-center">
          <AlertCircle size={40} className="text-danger mx-auto mb-4 opacity-40" />
          <h2 className="text-title text-xl mb-2">Cliente não encontrado</h2>
          <p className="text-base-400 text-sm mb-6">O registro solicitado pode ter sido removido ou não existe.</p>
          <button onClick={() => router.push('/')} className="btn-primary">
            Voltar ao Dashboard
          </button>
        </div>
      )}
    </div>
  )
}

// ── Helper components ──────────────────────────────────────────────────────

function ContactBadge({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="flex items-center gap-2 text-label text-[9px]">
        <span className="text-accent-400">{icon}</span> {label}
      </p>
      <p className={clsx("text-[13px] text-white font-medium break-all", mono ? "font-mono" : "font-sans")}>
        {value}
      </p>
    </div>
  )
}

function ContractStat({ icon, label, value, isBold }: { icon: React.ReactNode; label: string; value: string; isBold?: boolean }) {
  return (
    <div className="space-y-1">
      <span className="flex items-center gap-1.5 text-label text-[8px]">
        <span className="text-base-400">{icon}</span> {label}
      </span>
      <p className={clsx("text-[12px] text-white leading-none", isBold ? "font-bold" : "font-medium")}>
        {value}
      </p>
    </div>
  )
}

function FinanceRow({ label, value, highlight, bold }: { label: string; value: string; highlight?: boolean; bold?: boolean }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-base-400 text-[11px]">{label}</span>
      <span className={clsx(
        "font-mono rounded-md px-2 py-0.5 border",
        highlight ? "text-danger bg-danger-dim border-danger/10" : "text-ok bg-ok-dim border-ok/10",
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
      <span className="text-base-400 font-mono">{label}</span>
      <span className="text-base-200 font-mono">{value}</span>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="premium-card p-10 space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <div className="flex gap-4">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-6 w-48 rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  )
}
