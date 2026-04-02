'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Search, Upload,
  AlertOctagon, ShieldBan,
  ChevronLeft, X,
} from 'lucide-react'
import clsx from 'clsx'

const nav = [
  { href: '/',              label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/busca',         label: 'Consulta',      icon: Search },
  { href: '/importacao',    label: 'Importação',    icon: Upload },
  { href: '/inadimplentes', label: 'Inadimplentes', icon: AlertOctagon },
  { href: '/bloqueados',    label: 'Bloqueados',    icon: ShieldBan },
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
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={clsx(
          'sidebar fixed left-0 top-0 h-full flex flex-col z-50 transition-all duration-300 ease-in-out',
          collapsed ? 'w-[72px]' : 'w-[260px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Brand Header with Logo */}
        <div className={clsx(
          'flex items-center gap-3 shrink-0 transition-all duration-300',
          collapsed ? 'px-3 pt-5 pb-4 justify-center' : 'px-5 pt-5 pb-4'
        )}>
          <img
            src="/logo-dark.png"
            alt="ATA Sistemas"
            className={clsx(
              'object-contain shrink-0 transition-all duration-300',
              collapsed ? 'w-10 h-10' : 'w-9 h-9'
            )}
          />
          {!collapsed && (
            <div className="min-w-0" style={{ opacity: 1 }}>
              <p className="text-[14px] font-bold text-white leading-tight tracking-tight">Elegibilidade</p>
              <p className="text-[11px] leading-tight" style={{ color: '#525a78' }}>ATA Sistemas</p>
            </div>
          )}
        </div>

        {/* Section Label */}
        {!collapsed && (
          <div className="px-5 pb-2 pt-2" style={{ opacity: 1 }}>
            <p className="text-label">Navegação</p>
          </div>
        )}

        {/* Navigation */}
        <nav className={clsx(
          'flex-1 space-y-1 overflow-y-auto',
          collapsed ? 'px-2 pt-2' : 'px-3'
        )}>
          {nav.map(({ href, label, icon: Icon }) => {
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
                  className="shrink-0 transition-colors"
                  style={{ color: active ? '#818cf8' : '#525a78' }}
                />
                {!collapsed && (
                  <span className="flex-1 truncate">{label}</span>
                )}
                {!collapsed && active && (
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0 dot-pulse"
                    style={{ background: '#6366f1' }}
                  />
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
            className="lg:hidden w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all text-xs mb-2"
            style={{ color: '#525a78' }}
          >
            <X size={16} /> Fechar
          </button>

          {/* Desktop toggle */}
          <button
            onClick={onToggle}
            className="hidden lg:flex w-full items-center justify-center gap-2 py-2.5 rounded-xl transition-all text-xs"
            style={{ color: '#525a78' }}
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
