'use client'
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api'
import { Skeleton } from '@/components/ui'
import {
  Users, AlertCircle, ShieldX, CalendarClock, FileCheck,
  TrendingUp, TrendingDown, Upload, ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

interface MetricProps {
  label: string
  value?: number
  icon: React.ReactNode
  trend?: { value: string; up: boolean }
  delay?: string
}

function MetricCard({ label, value, icon, trend, delay }: MetricProps) {
  return (
    <div className={`premium-card animate-fade-up ${delay || ''}`}>
      {/* Icon + Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ color: 'var(--text-muted)' }}>
          {icon}
        </div>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
          {label}
        </span>
      </div>

      {/* Value + Trend */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        {value == null ? (
          <Skeleton className="h-9 w-24" />
        ) : (
          <p className="animate-count-up" style={{
            fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em',
            color: 'var(--text-primary)', fontFamily: 'var(--font-sans)',
            lineHeight: 1,
          }}>
            {value.toLocaleString('pt-BR')}
          </p>
        )}
        {trend && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            fontSize: 12, fontWeight: 600,
            color: trend.up ? '#16a34a' : '#ef4444',
          }}>
            {trend.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {trend.value}
          </span>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { data, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.resumo,
    refetchInterval: 60000,
  })

  // Calc percentages
  const total = data?.totalClientesAtivos || 1
  const pInad = data ? (data.totalInadimplentes / total) * 100 : 0
  const pBloq = data ? (data.totalBloqueados / total) * 100 : 0
  const pOk = Math.max(0, 100 - pInad - pBloq)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div className="animate-fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="text-title" style={{ fontSize: 24, marginBottom: 4 }}>Dashboard</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Monitoramento de elegibilidade e saúde da base de clientes.
          </p>
        </div>

        {dataUpdatedAt > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 6,
            background: 'var(--bg-card)', border: '1px solid var(--border-light)',
            fontSize: 11, color: 'var(--text-muted)',
          }}>
            <span className="dot-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            {new Date(dataUpdatedAt).toLocaleTimeString('pt-BR')}
          </div>
        )}
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <MetricCard
          label="Total Clientes"
          value={data?.totalClientesAtivos}
          icon={<Users size={16} />}
          trend={{ value: `${pOk.toFixed(1)}%`, up: true }}
          delay="animate-delay-100"
        />
        <MetricCard
          label="Inadimplentes"
          value={data?.totalInadimplentes}
          icon={<AlertCircle size={16} />}
          trend={{ value: `${pInad.toFixed(1)}%`, up: false }}
          delay="animate-delay-200"
        />
        <MetricCard
          label="Bloqueados"
          value={data?.totalBloqueados}
          icon={<ShieldX size={16} />}
          delay="animate-delay-200"
        />
        <MetricCard
          label="Contratos Ativos"
          value={data?.totalContratosAtivos}
          icon={<FileCheck size={16} />}
          delay="animate-delay-300"
        />
        <MetricCard
          label="Vencendo 30d"
          value={data?.contratosVencendo30Dias}
          icon={<CalendarClock size={16} />}
          delay="animate-delay-300"
        />
      </div>

      {/* Second Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Health Card */}
        <div className="card animate-fade-up animate-delay-300" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 className="text-title" style={{ fontSize: 16 }}>Saúde da Base</h3>
            <div style={{ display: 'flex', gap: 16 }}>
              <Legend color="#22c55e" label="Regulares" />
              <Legend color="#f59e0b" label="Em atraso" />
              <Legend color="#ef4444" label="Bloqueados" />
            </div>
          </div>

          {data && !isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Progress bar */}
              <div style={{ height: 10, width: '100%', borderRadius: 999, overflow: 'hidden', display: 'flex', background: 'var(--bg-elevated)' }}>
                <div style={{ width: `${pOk}%`, height: '100%', background: '#22c55e', transition: 'width 1s', borderRadius: '999px 0 0 999px' }} />
                <div style={{ width: `${pInad}%`, height: '100%', background: '#f59e0b', transition: 'width 1s' }} />
                <div style={{ width: `${pBloq}%`, height: '100%', background: '#ef4444', transition: 'width 1s', borderRadius: '0 999px 999px 0' }} />
              </div>

              {/* Stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                <StatBox label="Regular" value={pOk} color="#22c55e" icon={<TrendingUp size={13} />} />
                <StatBox label="Inadimplência" value={pInad} color="#f59e0b" icon={<TrendingDown size={13} />} />
                <StatBox label="Bloqueio" value={pBloq} color="#ef4444" icon={<ShieldX size={13} />} />
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Skeleton className="h-3 w-full rounded-full" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                <Skeleton className="h-20 rounded-xl" />
                <Skeleton className="h-20 rounded-xl" />
                <Skeleton className="h-20 rounded-xl" />
              </div>
            </div>
          )}
        </div>

        {/* Quick Action */}
        <Link href="/importacao" className="animate-fade-up animate-delay-400" style={{ textDecoration: 'none' }}>
          <div style={{
            height: '100%', borderRadius: 14, padding: 24,
            background: 'linear-gradient(135deg, #16a34a, #22c55e)',
            color: 'white', display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between', cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 16px rgba(22,163,74,0.25)',
          }}>
            <div>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'rgba(255,255,255,0.15)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', marginBottom: 16,
              }}>
                <Upload size={20} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, letterSpacing: '-0.02em' }}>Importação</h3>
              <p style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.5 }}>
                Atualize a base de clientes processando CSVs do sistema de faturamento.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20, fontSize: 13, fontWeight: 600, opacity: 0.9 }}>
              <span>Nova Importação</span>
              <ArrowRight size={15} />
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
    </div>
  )
}

function StatBox({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <div style={{
      padding: 16, borderRadius: 12, textAlign: 'center',
      background: 'var(--bg-elevated)', border: '1px solid var(--border-light)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 8, color }}>
        {icon}
        <span style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'var(--text-muted)' }}>{label}</span>
      </div>
      <p style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color }}>
        {value.toFixed(1)}%
      </p>
    </div>
  )
}
