'use client'
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api'
import { Skeleton } from '@/components/ui'
import {
  Users, AlertCircle, ShieldX, CalendarClock, FileCheck,
  ArrowUpRight, TrendingUp, TrendingDown, Upload,
} from 'lucide-react'
import clsx from 'clsx'
import Link from 'next/link'

interface MetricProps {
  label: string
  value?: number
  icon: React.ReactNode
  color: 'ok' | 'danger' | 'warn' | 'info' | 'accent'
  delay?: string
}

const colorConfig = {
  ok:     { icon: 'text-ok bg-ok-dim',           glow: 'glow-ok',     text: 'text-ok' },
  danger: { icon: 'text-danger bg-danger-dim',     glow: 'glow-danger', text: 'text-danger' },
  warn:   { icon: 'text-warn bg-warn-dim',         glow: '',            text: 'text-warn' },
  info:   { icon: 'text-info bg-info-dim',         glow: '',            text: 'text-info' },
  accent: { icon: 'text-accent-400 bg-accent-glow', glow: 'glow-accent', text: 'text-accent-400' },
}

function MetricCard({ label, value, icon, color, delay }: MetricProps) {
  const c = colorConfig[color]

  return (
    <div className={clsx(
      'premium-card group relative overflow-hidden animate-fade-up',
      delay
    )}>
      <div className="flex items-start justify-between mb-5">
        <div className={clsx('p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110', c.icon)}>
          {icon}
        </div>
        <ArrowUpRight size={14} className="text-base-500 opacity-0 group-hover:opacity-100 transition-all" />
      </div>

      <div className="space-y-1.5">
        <span className="text-label">{label}</span>
        {value == null ? (
          <Skeleton className="h-9 w-24" />
        ) : (
          <p className="text-3xl font-bold tracking-tighter text-white animate-count-up font-mono">
            {value.toLocaleString('pt-BR')}
          </p>
        )}
      </div>

      {/* Subtle decorative gradient */}
      <div className={clsx(
        'absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-3xl opacity-15 transition-opacity duration-500 group-hover:opacity-25',
        color === 'ok' ? 'bg-ok' :
        color === 'danger' ? 'bg-danger' :
        color === 'warn' ? 'bg-warn' :
        color === 'info' ? 'bg-info' : 'bg-accent-500'
      )} />
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="text-title text-3xl mb-1">Visão Geral</h1>
          <p className="text-base-400 text-sm">
            Monitoramento de elegibilidade e saúde da base de clientes.
          </p>
        </div>

        {dataUpdatedAt > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-base-800 border border-base-700">
            <span className="w-2 h-2 rounded-full bg-ok dot-pulse" />
            <span className="text-label text-[9px] lowercase italic">
              {new Date(dataUpdatedAt).toLocaleTimeString('pt-BR')}
            </span>
          </div>
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <MetricCard label="Clientes Ativos"  value={data?.totalClientesAtivos}    icon={<Users size={20}/>}         color="ok"     delay="animate-delay-100" />
        <MetricCard label="Inadimplentes"    value={data?.totalInadimplentes}      icon={<AlertCircle size={20}/>}   color="warn"   delay="animate-delay-200" />
        <MetricCard label="Bloqueados"       value={data?.totalBloqueados}         icon={<ShieldX size={20}/>}       color="danger" delay="animate-delay-200" />
        <MetricCard label="Contratos Ativos" value={data?.totalContratosAtivos}    icon={<FileCheck size={20}/>}     color="accent" delay="animate-delay-300" />
        <MetricCard label="Vencendo 30d"     value={data?.contratosVencendo30Dias} icon={<CalendarClock size={20}/>} color="info"   delay="animate-delay-300" />
      </div>

      {/* Analysis Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Health Analysis */}
        <div className="lg:col-span-2 premium-card animate-fade-up animate-delay-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h3 className="text-title text-lg">Saúde da Base</h3>
            <div className="flex gap-4">
              <Legend color="bg-ok" label="Regulares" />
              <Legend color="bg-warn" label="Em atraso" />
              <Legend color="bg-danger" label="Bloqueados" />
            </div>
          </div>

          {data && !isLoading ? (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="h-3 w-full rounded-full overflow-hidden flex bg-base-850">
                {(() => {
                  const total = data.totalClientesAtivos || 1
                  const pInad = (data.totalInadimplentes / total) * 100
                  const pBloq = (data.totalBloqueados / total) * 100
                  const pOk = Math.max(0, 100 - pInad - pBloq)
                  return (
                    <>
                      <div className="bg-ok h-full transition-all duration-1000 rounded-l-full" style={{ width: `${pOk}%` }} />
                      <div className="bg-warn h-full transition-all duration-1000" style={{ width: `${pInad}%` }} />
                      <div className="bg-danger h-full transition-all duration-1000 rounded-r-full" style={{ width: `${pBloq}%` }} />
                    </>
                  )
                })()}
              </div>

              {/* Percentage Grid */}
              <div className="grid grid-cols-3 gap-4">
                <PercentBox
                  label="Regular"
                  value={(100 - ((data.totalInadimplentes + data.totalBloqueados) / (data.totalClientesAtivos || 1)) * 100)}
                  color="text-ok"
                  icon={<TrendingUp size={14} />}
                />
                <PercentBox
                  label="Inadimplência"
                  value={((data.totalInadimplentes / (data.totalClientesAtivos || 1)) * 100)}
                  color="text-warn"
                  icon={<TrendingDown size={14} />}
                />
                <PercentBox
                  label="Bloqueio"
                  value={((data.totalBloqueados / (data.totalClientesAtivos || 1)) * 100)}
                  color="text-danger"
                  icon={<ShieldX size={14} />}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Skeleton className="h-3 w-full rounded-full" />
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-20 rounded-xl" />
                <Skeleton className="h-20 rounded-xl" />
                <Skeleton className="h-20 rounded-xl" />
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Card */}
        <Link href="/importacao" className="block animate-fade-up animate-delay-400">
          <div className="h-full rounded-2xl p-6 relative overflow-hidden gradient-accent glow-accent group cursor-pointer transition-all hover:scale-[1.02]">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: '20px 20px',
            }} />

            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm border border-white/10">
                  <Upload size={22} className="text-white" />
                </div>
                <h3 className="text-title text-white text-lg mb-2">Importação</h3>
                <p className="text-indigo-200 text-sm leading-relaxed">
                  Atualize a base de clientes processando os CSVs do sistema de faturamento.
                </p>
              </div>

              <div className="flex items-center gap-2 mt-6 text-white/80 group-hover:text-white text-sm font-semibold transition-all">
                <span>Nova Importação</span>
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={clsx('w-2.5 h-2.5 rounded-full', color)} />
      <span className="text-label text-[10px]">{label}</span>
    </div>
  )
}

function PercentBox({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-base-850 p-4 text-center border border-base-750">
      <div className={clsx('flex items-center justify-center gap-1.5 mb-2', color)}>
        {icon}
        <span className="text-label text-[9px]">{label}</span>
      </div>
      <p className={clsx('text-2xl font-bold font-mono tracking-tighter', color)}>
        {value.toFixed(1)}%
      </p>
    </div>
  )
}
