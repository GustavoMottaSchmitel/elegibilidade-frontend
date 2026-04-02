'use client'
import { useState, useEffect } from 'react'
import { Menu, Moon, Sun, LogOut } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const savedSidebar = localStorage.getItem('ata_sidebar')
    if (savedSidebar === 'collapsed') setCollapsed(true)

    const savedTheme = localStorage.getItem('ata_theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  const handleToggle = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('ata_sidebar', next ? 'collapsed' : 'expanded')
  }

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('ata_theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  const handleLogout = () => {
    document.cookie = 'ata_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    window.location.href = 'https://central-atasistemas.duckdns.org/login'
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar — uses static flow on desktop, overlay on mobile */}
      <Sidebar
        collapsed={collapsed}
        onToggle={handleToggle}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main — takes remaining space */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <header
          className="glass"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 30,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            flexShrink: 0,
          }}
        >
          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden"
              style={{ padding: 8, borderRadius: 8, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <Menu size={20} />
            </button>
            <span className="text-label" style={{ display: 'none' }}>Sistema de Atendimento</span>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                padding: 8,
                borderRadius: 8,
                border: '1px solid var(--border-default)',
                background: 'var(--bg-elevated)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
            >
              {theme === 'dark'
                ? <Sun size={15} style={{ color: '#fbbf24' }} />
                : <Moon size={15} style={{ color: '#6366f1' }} />
              }
            </button>

            {/* API Status */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                borderRadius: 8,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
              }}
            >
              <span className="dot-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399' }} />
              <span className="text-label" style={{ fontSize: 9 }}>API Online</span>
            </div>

            <div style={{ width: 1, height: 20, background: 'var(--border-default)' }} />

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: 8,
                color: 'var(--text-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
              }}
              title="Sair do Sistema"
            >
              <LogOut size={16} />
              <span style={{ fontWeight: 500 }}>Sair</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '24px 16px' }}>
          <div style={{ maxWidth: 1152, margin: '0 auto' }}>
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ maxWidth: 1152, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
            <span>© 2026 ATA Sistemas · Todos os direitos reservados</span>
            <span style={{ opacity: 0.6 }}>Elegibilidade v2.0</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
