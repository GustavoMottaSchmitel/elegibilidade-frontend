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
  const sidebarWidth = collapsed ? 72 : 260

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
          }}
          className="lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar — sticky on desktop, fixed overlay on mobile */}
      <aside
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          height: '100vh',
          position: 'sticky',
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-subtle)',
          transition: 'width 0.3s ease, min-width 0.3s ease',
          zIndex: 999,
          flexShrink: 0,
          overflow: 'hidden',
        }}
        className={clsx(
          // On mobile: hide by default, show as fixed overlay when open
          !mobileOpen && 'max-lg:hidden',
          mobileOpen && 'max-lg:!fixed max-lg:!left-0 max-lg:!top-0'
        )}
      >
        {/* Brand Header with Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: collapsed ? '20px 12px 16px' : '20px 20px 16px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            flexShrink: 0,
          }}
        >
          <img
            src="/logo-dark.png"
            alt="ATA Sistemas"
            style={{
              width: collapsed ? 40 : 36,
              height: collapsed ? 40 : 36,
              objectFit: 'contain',
              flexShrink: 0,
              transition: 'all 0.3s',
            }}
          />
          {!collapsed && (
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>Elegibilidade</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.2 }}>ATA Sistemas</p>
            </div>
          )}
        </div>

        {/* Section Label */}
        {!collapsed && (
          <div style={{ padding: '8px 20px' }}>
            <p className="text-label">Navegação</p>
          </div>
        )}

        {/* Navigation */}
        <nav style={{ flex: 1, padding: collapsed ? '8px 8px' : '0 12px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
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
                  className="shrink-0"
                  style={{ color: active ? '#818cf8' : 'var(--text-muted)' }}
                />
                {!collapsed && (
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
                )}
                {!collapsed && active && (
                  <span
                    className="dot-pulse"
                    style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', flexShrink: 0 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Controls */}
        <div style={{ padding: 12 }}>
          {/* Mobile close */}
          <button
            onClick={onMobileClose}
            className="lg:hidden"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 0',
              borderRadius: 12,
              color: 'var(--text-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              marginBottom: 8,
            }}
          >
            <X size={16} /> Fechar
          </button>

          {/* Desktop toggle */}
          <button
            onClick={onToggle}
            className="hidden lg:flex"
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 0',
              borderRadius: 12,
              color: 'var(--text-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            <ChevronLeft
              size={16}
              style={{
                transition: 'transform 0.3s',
                transform: collapsed ? 'rotate(180deg)' : 'none',
              }}
            />
            {!collapsed && <span>Recolher</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
