'use client'
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api'
import { formatDataHora } from '@/lib/utils'
import { Skeleton } from '@/components/ui'
import { Users, AlertCircle, ShieldX, CalendarClock, FileCheck, RefreshCw } from 'lucide-react'
import clsx from 'clsx'

interface MetricProps {
  label: string
  value?: number
  icon: React.ReactNode
  color: 'green' | 'red' | 'yellow' | 'amber' | 'blue'
  delay?: string
}

const colorMap = {
  green:  { text: 'text-status-green',  bg: 'bg-status-greenBg',  border: 'border-status-green/20' },
  red:    { text: 'text-status-red',    bg: 'bg-status-redBg',    border: 'border-status-red/20'   },
  yellow: { text: 'text-status-yellow', bg: 'bg-status-yellowBg', border: 'border-status-yellow/20'},
  amber:  { text: 'text-amber',         bg: 'bg-amber/5',         border: 'border-amber/20'        },
  blue:   { text: 'text-blue-400',      bg: 'bg-blue-950/50',     border: 'border-blue-800/30'     },
}

function MetricCard({ label, value, icon, color, delay = '' }: MetricProps) {
  const c = colorMap[color]
  return (
    <div className={clsx(
      'panel p-5 flex flex-col gap-3 animate-fade-up opacity-0-init',
      delay
    )}
    style={{ animationFillMode: 'forwards' }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-ink-600 tracking-widest uppercase">{label}</span>
        <div className={clsx('w-7 h-7 rounded flex items-center justify-center border', c.bg, c.border)}>
          <span className={c.text}>{icon}</span>
        </div>
      </div>
      {value == null ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <p className={clsx('font-mono text-3xl font-medium', c.text)}>
          {value.toLocaleString('pt-BR')}
        </p>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const { data, isLoading, refetch, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.resumo,
    refetchInterval: 60_000,
  })

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-8 animate-fade-up">
        <div>
          <h1 className="font-serif text-2xl text-ink-100 mb-1">Dashboard</h1>
          <p className="text-ink-500 text-sm font-sans">
            Visão geral do sistema de elegibilidade
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 font-mono text-[11px] text-ink-500 hover:text-amber transition-colors px-3 py-1.5 panel rounded-md"
        >
          <RefreshCw size={12} className={clsx(isFetching && 'animate-spin')} />
          atualizar
        </button>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <MetricCard label="Clientes Ativos"     value={data?.totalClientesAtivos}    icon={<Users size={14}/>}         color="green"  delay="animate-delay-100" />
        <MetricCard label="Inadimplentes"        value={data?.totalInadimplentes}      icon={<AlertCircle size={14}/>}   color="red"    delay="animate-delay-200" />
        <MetricCard label="Bloqueados"           value={data?.totalBloqueados}         icon={<ShieldX size={14}/>}       color="red"    delay="animate-delay-300" />
        <MetricCard label="Contratos Ativos"     value={data?.totalContratosAtivos}    icon={<FileCheck size={14}/>}     color="amber"  delay="animate-delay-100" />
        <MetricCard label="Vencendo em 30 dias"  value={data?.contratosVencendo30Dias} icon={<CalendarClock size={14}/>} color="yellow" delay="animate-delay-200" />
      </div>

      {/* Barra de saúde da base */}
      {data && !isLoading && (
        <div className="panel p-5 mb-4 animate-fade-up animate-delay-400" style={{ animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] text-ink-600 tracking-widest uppercase">Saúde da Base</span>
            <span className="font-mono text-[10px] text-ink-700">
              {data.totalClientesAtivos} clientes ativos
            </span>
          </div>

          {(() => {
            const total = data.totalClientesAtivos || 1
            const ok      = Math.max(0, total - data.totalInadimplentes - data.totalBloqueados)
            const inadimp = data.totalInadimplentes
            const bloq    = data.totalBloqueados
            const pOk     = (ok      / total) * 100
            const pInad   = (inadimp / total) * 100
            const pBloq   = (bloq    / total) * 100

            return (
              <>
                <div className="h-3 rounded-full overflow-hidden flex bg-ink-800">
                  <div className="bg-status-green  h-full transition-all duration-700" style={{ width: `${pOk}%` }} />
                  <div className="bg-status-yellow h-full transition-all duration-700" style={{ width: `${pInad}%` }} />
                  <div className="bg-status-red    h-full transition-all duration-700" style={{ width: `${pBloq}%` }} />
                </div>
                <div className="flex items-center gap-4 mt-2.5">
                  <Legend color="bg-status-green"  label="Regulares"    pct={pOk}   />
                  <Legend color="bg-status-yellow" label="Inadimplentes" pct={pInad} />
                  <Legend color="bg-status-red"    label="Bloqueados"    pct={pBloq} />
                </div>
              </>
            )
          })()}
        </div>
      )}

      {/* Timestamp */}
      {dataUpdatedAt > 0 && (
        <p className="font-mono text-[10px] text-ink-700 text-right">
          atualizado em {formatDataHora(new Date(dataUpdatedAt).toISOString())}
        </p>
      )}
    </div>
  )
}

function Legend({ color, label, pct }: { color: string; label: string; pct: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={clsx('w-2 h-2 rounded-full', color)} />
      <span className="font-mono text-[10px] text-ink-500">
        {label} <span className="text-ink-700">{pct.toFixed(0)}%</span>
      </span>
    </div>
  )
}
