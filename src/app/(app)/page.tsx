'use client'
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api'
import { formatDataHora } from '@/lib/utils'
import { Skeleton } from '@/components/ui'
import { Users, AlertCircle, ShieldX, CalendarClock, FileCheck, ArrowUpRight } from 'lucide-react'
import clsx from 'clsx'

interface MetricProps {
  label: string
  value?: number
  icon: React.ReactNode
  color: 'green' | 'red' | 'yellow' | 'amber' | 'blue'
}

function MetricCard({ label, value, icon, color }: MetricProps) {
  const colorMap = {
    green:  'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    red:    'text-rose-500 bg-rose-500/10 border-rose-500/20',
    yellow: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    amber:  'text-orange-500 bg-orange-500/10 border-orange-500/20',
    blue:   'text-blue-500 bg-blue-500/10 border-blue-500/20',
  }

  return (
    <div className="premium-card group relative overflow-hidden animate-fade-up">
      <div className="flex items-start justify-between mb-4">
        <div className={clsx('p-2.5 rounded-xl border transition-all duration-300 group-hover:scale-110', colorMap[color])}>
          {icon}
        </div>
        <ArrowUpRight size={14} className="text-[var(--dash-text-muted)] opacity-0 group-hover:opacity-100 transition-all" />
      </div>
      
      <div className="space-y-1">
        <span className="text-premium-muted text-[9px]">{label}</span>
        {value == null ? (
          <Skeleton className="h-9 w-24 rounded-lg" />
        ) : (
          <p className="text-3xl font-bold tracking-tight text-[var(--dash-text-primary)]">
            {value.toLocaleString('pt-BR')}
          </p>
        )}
      </div>

      {/* Decorative gradient */}
      <div className={clsx('absolute -right-4 -bottom-4 w-20 h-20 rounded-full blur-3xl opacity-20', 
        color === 'green' ? 'bg-emerald-500' : 
        color === 'red' ? 'bg-rose-500' : 
        color === 'yellow' ? 'bg-amber-500' : 
        color === 'amber' ? 'bg-orange-500' : 'bg-blue-500')} 
      />
    </div>
  )
}

export default function DashboardPage() {
  const { data, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.resumo,
    refetchInterval: 60000,
  })

  return (
    <div className="space-y-10">
      {/* Welcome & Stats Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-premium-title text-3xl mb-1">Visão Geral</h2>
          <p className="text-[var(--dash-text-secondary)] text-sm">
            Monitoramento de elegibilidade e saúde da base de clientes técnicos.
          </p>
        </div>
        
        {dataUpdatedAt > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--dash-accent-soft)] border border-[var(--dash-border)]">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-premium-muted text-[9px] lowercase italic">
               Atualizado às {new Date(dataUpdatedAt).toLocaleTimeString('pt-BR')}
             </span>
          </div>
        )}
      </div>

      {/* Métricas Princiais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <MetricCard label="Clientes Ativos"     value={data?.totalClientesAtivos}    icon={<Users size={20}/>}         color="green" />
        <MetricCard label="Inadimplentes"        value={data?.totalInadimplentes}      icon={<AlertCircle size={20}/>}   color="red"    />
        <MetricCard label="Bloqueados"           value={data?.totalBloqueados}         icon={<ShieldX size={20}/>}       color="red"    />
        <MetricCard label="Contratos Ativos"     value={data?.totalContratosAtivos}    icon={<FileCheck size={20}/>}     color="amber"  />
        <MetricCard label="Vencendo em 30 d"  value={data?.contratosVencendo30Dias} icon={<CalendarClock size={20}/>} color="yellow" />
      </div>

      {/* Seção de Análise Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 premium-card">
              <div className="flex items-center justify-between mb-8">
                  <h3 className="text-premium-title text-lg font-semibold">Análise de Saúde da Base</h3>
                  <div className="flex gap-4">
                     <Legend color="bg-emerald-500" label="Regulares" />
                     <Legend color="bg-amber-500"   label="Em atraso" />
                     <Legend color="bg-rose-500"    label="Bloqueados" />
                  </div>
              </div>

              {data && !isLoading ? (
                <div className="space-y-6">
                   <div className="h-6 w-full rounded-2xl overflow-hidden flex bg-[var(--dash-bg)] shadow-inner">
                      {(() => {
                        const total = data.totalClientesAtivos || 1
                        const pInad = (data.totalInadimplentes / total) * 100
                        const pBloq = (data.totalBloqueados / total) * 100
                        const pOk = 100 - pInad - pBloq
                        return (
                          <>
                            <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${pOk}%` }} />
                            <div className="bg-amber-500 h-full transition-all duration-1000" style={{ width: `${pInad}%` }} />
                            <div className="bg-rose-500 h-full transition-all duration-1000" style={{ width: `${pBloq}%` }} />
                          </>
                        )
                      })()}
                   </div>

                   <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                         <span className="text-premium-muted">Regular</span>
                         <p className="text-xl font-bold font-mono">{(100 - ((data.totalInadimplentes + data.totalBloqueados) / (data.totalClientesAtivos || 1)) * 100).toFixed(1)}%</p>
                      </div>
                      <div className="text-center">
                         <span className="text-premium-muted">Inadimplência</span>
                         <p className="text-xl font-bold font-mono text-amber-500">{((data.totalInadimplentes / (data.totalClientesAtivos || 1)) * 100).toFixed(1)}%</p>
                      </div>
                      <div className="text-center">
                         <span className="text-premium-muted">Bloqueio</span>
                         <p className="text-xl font-bold font-mono text-rose-500">{((data.totalBloqueados / (data.totalClientesAtivos || 1)) * 100).toFixed(1)}%</p>
                      </div>
                   </div>
                </div>
              ) : <Skeleton className="h-32 w-full rounded-xl" />}
          </div>

          <div className="premium-card bg-gradient-to-br from-blue-600 to-indigo-700 border-none">
              <div className="h-full flex flex-col justify-between text-white">
                  <div>
                    <h3 className="text-premium-title text-white text-lg mb-4">Módulo de Importação</h3>
                    <p className="text-blue-100 text-sm leading-relaxed mb-6">
                      Mantenha sua base atualizada processando os arquivos CSV dos sistemas de faturamento.
                    </p>
                  </div>
                  
                  <button className="w-full py-4 rounded-xl bg-white text-blue-600 font-bold text-sm tracking-wide shadow-xl hover:bg-blue-50 transition-all uppercase">
                    Nova Importação
                  </button>
              </div>
          </div>
      </div>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={clsx('w-2 h-2 rounded-full', color)} />
      <span className="text-premium-muted text-[10px]">{label}</span>
    </div>
  )
}
