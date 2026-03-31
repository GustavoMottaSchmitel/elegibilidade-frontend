'use client'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { clienteApi } from '@/lib/api'
import { formatCpfCnpj, formatMoeda, formatData, formatDataHora, statusContratoLabel, statusContratoColor } from '@/lib/utils'
import { StatusAtendimentoBadge, StatusContratoBadge, Skeleton, Divider } from '@/components/ui'
import { ArrowLeft, Building2, Phone, Mail, MapPin, FileText, Wallet, RefreshCw } from 'lucide-react'
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
    <div className="max-w-3xl mx-auto">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 font-mono text-[11px] text-ink-500 hover:text-amber transition-colors mb-6 animate-fade-up"
      >
        <ArrowLeft size={13} /> voltar
      </button>

      {isLoading ? (
        <LoadingSkeleton />
      ) : detalhe ? (
        <>
          {/* Header do cliente */}
          <div className="panel p-5 mb-4 animate-fade-up">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="font-serif text-xl text-ink-100 mb-0.5">{detalhe.razaoSocial}</h1>
                {detalhe.nomeFantasia && (
                  <p className="text-ink-500 text-sm font-sans">{detalhe.nomeFantasia}</p>
                )}
              </div>
              {status && <StatusAtendimentoBadge status={status.statusAtendimento} />}
            </div>

            {status?.motivo && (
              <p className="text-ink-500 text-xs font-sans mb-4 pl-0.5">{status.motivo}</p>
            )}

            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              <InfoRow icon={<FileText size={11} />}  label="CNPJ"     value={formatCpfCnpj(detalhe.cnpj)} mono />
              {detalhe.email    && <InfoRow icon={<Mail size={11} />}     label="E-mail"   value={detalhe.email} />}
              {detalhe.telefone && <InfoRow icon={<Phone size={11} />}    label="Telefone" value={detalhe.telefone} mono />}
              {(detalhe.cidade || detalhe.estado) && (
                <InfoRow icon={<MapPin size={11} />} label="Cidade"
                  value={[detalhe.cidade, detalhe.estado].filter(Boolean).join(' · ')} />
              )}
            </div>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-ink-800">
              <p className="font-mono text-[10px] text-ink-700">
                Cadastro: {formatDataHora(detalhe.criadoEm)}
              </p>
              <p className="font-mono text-[10px] text-ink-700">
                Atualizado: {formatDataHora(detalhe.atualizadoEm)}
              </p>
            </div>
          </div>

          {/* Contratos */}
          <div className="mb-4 animate-fade-up animate-delay-100">
            <p className="font-mono text-[10px] text-ink-600 tracking-widest uppercase mb-2">
              Contratos ({detalhe.contratos.length})
            </p>
            {detalhe.contratos.length === 0 ? (
              <div className="panel px-4 py-6 text-center">
                <p className="font-mono text-xs text-ink-700">Sem contratos cadastrados</p>
              </div>
            ) : (
              <div className="space-y-2">
                {detalhe.contratos.map((c) => (
                  <div key={c.id} className="panel p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-mono text-sm text-ink-100">{c.numeroContrato}</p>
                        <p className="text-ink-500 text-xs mt-0.5 font-sans">{c.tipoContrato}</p>
                      </div>
                      <StatusContratoBadge status={c.statusContrato} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <MiniField label="Início"  value={formatData(c.dataInicio)} />
                      <MiniField label="Venc."   value={formatData(c.dataFim)} />
                      <MiniField label="Mensal"  value={formatMoeda(c.valorMensal)} />
                    </div>
                    {c.observacao && (
                      <p className="font-mono text-[10px] text-ink-600 mt-2.5 pt-2.5 border-t border-ink-800">
                        {c.observacao}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Financeiro */}
          {detalhe.financeiros.length > 0 && (
            <div className="animate-fade-up animate-delay-200">
              <p className="font-mono text-[10px] text-ink-600 tracking-widest uppercase mb-2">
                Situação Financeira
              </p>
              <div className="space-y-2">
                {detalhe.financeiros.map((f) => (
                  <div key={f.id} className="panel p-4">
                    {f.numeroContrato && (
                      <p className="font-mono text-[10px] text-ink-600 mb-3">
                        Contrato: {f.numeroContrato}
                      </p>
                    )}
                    <div className="grid grid-cols-3 gap-3">
                      <MiniField
                        label="Débito"
                        value={f.possuiDebito ? 'Sim' : 'Não'}
                        danger={f.possuiDebito}
                      />
                      <MiniField
                        label="Em Aberto"
                        value={formatMoeda(f.valorEmAberto)}
                        danger={f.valorEmAberto > 0}
                      />
                      <MiniField
                        label="Dias Atraso"
                        value={f.diasAtraso > 0 ? `${f.diasAtraso}d` : '—'}
                        danger={f.diasAtraso > 0}
                      />
                    </div>
                    {f.dataUltimoPagamento && (
                      <p className="font-mono text-[10px] text-ink-600 mt-2.5 pt-2.5 border-t border-ink-800">
                        Último pagamento: {formatData(f.dataUltimoPagamento)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="panel px-5 py-8 text-center">
          <p className="font-mono text-xs text-ink-700">Cliente não encontrado</p>
        </div>
      )}
    </div>
  )
}

function InfoRow({ icon, label, value, mono }: {
  icon: React.ReactNode; label: string; value: string; mono?: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-ink-600">{icon}</span>
      <span className="font-mono text-[10px] text-ink-600 w-14 shrink-0">{label}</span>
      <span className={clsx('text-xs text-ink-300', mono ? 'font-mono' : 'font-sans')}>{value}</span>
    </div>
  )
}

function MiniField({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div>
      <p className="font-mono text-[10px] text-ink-600 uppercase tracking-wider mb-0.5">{label}</p>
      <p className={clsx('font-mono text-sm', danger ? 'text-status-red' : 'text-ink-200')}>{value}</p>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="panel p-5 space-y-3">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="panel p-4 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}
