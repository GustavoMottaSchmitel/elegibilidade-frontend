'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Search, Upload,
  AlertOctagon, ShieldBan, Activity,
  ChevronLeft, X,
} from 'lucide-react'
import clsx from 'clsx'

const nav = [
  { href: '/',              label: 'Dashboard',     icon: LayoutDashboard, desc: 'Visão geral' },
  { href: '/busca',         label: 'Consulta',      icon: Search,          desc: 'Buscar clientes' },
  { href: '/importacao',    label: 'Importação',    icon: Upload,          desc: 'Upload CSV' },
  { href: '/inadimplentes', label: 'Inadimplentes', icon: AlertOctagon,    desc: 'Em atraso' },
  { href: '/bloqueados',    label: 'Bloqueados',    icon: ShieldBan,       desc: 'Atendimento bloqueado' },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const path = usePathname()

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay lg:hidden" onClick={onMobileClose} />
      )}

      <aside
        className={clsx(
          'sidebar fixed left-0 top-0 h-full flex flex-col z-40 transition-all duration-300 ease-in-out',
          collapsed ? 'w-[72px]' : 'w-[260px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Brand Header */}
        <div className={clsx(
          'flex items-center gap-3 shrink-0 transition-all duration-300',
          collapsed ? 'px-4 pt-5 pb-4 justify-center' : 'px-5 pt-5 pb-4'
        )}>
          <div className="gradient-accent w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg glow-accent">
            <Activity size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in min-w-0">
              <p className="text-[14px] font-bold text-white leading-tight tracking-tight">Elegibilidade</p>
              <p className="text-[11px] text-base-400 leading-tight">ATA Sistemas</p>
            </div>
          )}
        </div>

        {/* Section Label */}
        {!collapsed && (
          <div className="px-5 pb-2 pt-2 animate-fade-in">
            <p className="text-label">Navegação</p>
          </div>
        )}

        {/* Navigation */}
        <nav className={clsx(
          'flex-1 space-y-1 overflow-y-auto custom-scroll',
          collapsed ? 'px-2 pt-2' : 'px-3'
        )}>
          {nav.map(({ href, label, icon: Icon, desc }) => {
            const active = href === '/' ? path === '/' : path.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={onMobileClose}
                title={collapsed ? label : undefined}
                className={clsx(
                  'nav-item',
                  active && 'active',
                  collapsed && 'justify-center !px-0 !gap-0'
                )}
              >
                <Icon
                  size={collapsed ? 20 : 17}
                  strokeWidth={active ? 2.4 : 1.8}
                  className={clsx(
                    'shrink-0 transition-colors',
                    active ? 'text-accent-400' : 'text-base-400'
                  )}
                />
                {!collapsed && (
                  <span className="flex-1 truncate">{label}</span>
                )}
                {!collapsed && active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0 dot-pulse" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Collapse Toggle (desktop) & Close (mobile) */}
        <div className={clsx('p-3', collapsed && 'px-2')}>
          {/* Mobile close */}
          <button
            onClick={onMobileClose}
            className="lg:hidden w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-base-400 hover:text-white hover:bg-base-800 transition-all text-xs mb-2"
          >
            <X size={16} /> Fechar
          </button>

          {/* Desktop toggle */}
          <button
            onClick={onToggle}
            className={clsx(
              'hidden lg:flex w-full items-center justify-center gap-2 py-2.5 rounded-xl text-base-400 hover:text-white hover:bg-base-800 transition-all text-xs'
            )}
          >
            <ChevronLeft
              size={16}
              className={clsx('transition-transform duration-300', collapsed && 'rotate-180')}
            />
            {!collapsed && <span>Recolher</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
