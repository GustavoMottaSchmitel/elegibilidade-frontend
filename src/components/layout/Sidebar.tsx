'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Search, Upload,
  AlertOctagon, ShieldBan,
  ChevronLeft, X, Moon, Sun, LogOut,
} from 'lucide-react'
import clsx from 'clsx'

const nav = [
  { href: '/',              label: 'Dashboard',     icon: LayoutDashboard, section: 'GERAL' },
  { href: '/busca',         label: 'Consulta',      icon: Search,          section: 'GERAL' },
  { href: '/importacao',    label: 'Importação',    icon: Upload,          section: 'GESTÃO' },
  { href: '/inadimplentes', label: 'Inadimplentes', icon: AlertOctagon,    section: 'GESTÃO' },
  { href: '/bloqueados',    label: 'Bloqueados',    icon: ShieldBan,       section: 'GESTÃO' },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onMobileClose: () => void
  theme: 'light' | 'dark'
  onThemeToggle: () => void
  onLogout: () => void
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose, theme, onThemeToggle, onLogout }: SidebarProps) {
  const path = usePathname()
  const w = collapsed ? 68 : 250

  // Group nav items by section
  const sections: Record<string, typeof nav> = {}
  nav.forEach(item => {
    if (!sections[item.section]) sections[item.section] = []
    sections[item.section].push(item)
  })

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="lg:hidden"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)', zIndex: 998 }}
        />
      )}

      <aside
        style={{
          width: w,
          minWidth: w,
          height: '100vh',
          position: 'sticky',
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-light)',
          transition: 'width 0.25s ease, min-width 0.25s ease',
          zIndex: 999,
          flexShrink: 0,
          overflow: 'hidden',
        }}
        className={clsx(
          !mobileOpen && 'max-lg:hidden',
          mobileOpen && 'max-lg:!fixed max-lg:!left-0 max-lg:!top-0'
        )}
      >
        {/* Brand */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: collapsed ? '20px 14px 12px' : '20px 16px 12px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          flexShrink: 0,
        }}>
          <img
            src="/logo-dark.png"
            alt="ATA"
            style={{ width: 32, height: 32, objectFit: 'contain', flexShrink: 0 }}
          />
          {!collapsed && (
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Elegibilidade</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={onToggle}
              style={{
                marginLeft: 'auto', padding: 4, borderRadius: 6,
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', display: 'flex',
              }}
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Nav Sections */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: collapsed ? '8px 8px' : '4px 12px' }}>
          {Object.entries(sections).map(([section, items]) => (
            <div key={section} style={{ marginBottom: 16 }}>
              {!collapsed && (
                <p style={{
                  fontSize: 11, fontWeight: 500, letterSpacing: '0.08em',
                  color: 'var(--text-muted)', padding: '8px 8px 6px',
                  textTransform: 'uppercase',
                }}>{section}</p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {items.map(({ href, label, icon: Icon }) => {
                  const active = href === '/' ? path === '/' : path.startsWith(href)
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={onMobileClose}
                      title={collapsed ? label : undefined}
                      className={clsx('nav-item', active && 'active', collapsed && 'justify-center !px-0 !gap-0')}
                    >
                      <Icon size={collapsed ? 20 : 18} strokeWidth={active ? 2.2 : 1.8} className="shrink-0" />
                      {!collapsed && <span>{label}</span>}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom area: Theme + Logout */}
        <div style={{ padding: collapsed ? '8px' : '8px 12px', borderTop: '1px solid var(--border-light)' }}>
          {/* Theme toggle */}
          <button
            onClick={onThemeToggle}
            className={clsx(collapsed && 'justify-center')}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px', borderRadius: 10, fontSize: 13, fontWeight: 500,
              color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer',
            }}
          >
            {theme === 'dark' ? <Sun size={18} style={{ color: '#f59e0b' }} /> : <Moon size={18} style={{ color: '#6366f1' }} />}
            {!collapsed && <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>}
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className={clsx(collapsed && 'justify-center')}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px', borderRadius: 10, fontSize: 13, fontWeight: 500,
              color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer',
              marginTop: 2,
            }}
          >
            <LogOut size={18} />
            {!collapsed && <span>Sair</span>}
          </button>

          {/* Collapse (desktop only, when collapsed) */}
          {collapsed && (
            <button
              onClick={onToggle}
              className="hidden lg:flex"
              style={{
                width: '100%', justifyContent: 'center', alignItems: 'center',
                padding: '8px', borderRadius: 10, color: 'var(--text-muted)',
                background: 'none', border: 'none', cursor: 'pointer', marginTop: 4,
              }}
            >
              <ChevronLeft size={16} style={{ transform: 'rotate(180deg)' }} />
            </button>
          )}
        </div>
      </aside>
    </>
  )
}
