'use client'
import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const savedSidebar = localStorage.getItem('ata_sidebar')
    if (savedSidebar === 'collapsed') setCollapsed(true)

    const savedTheme = localStorage.getItem('ata_theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
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
    window.location.href = 'https://central-atasistemas.duckdns.org/login?logout=1'
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        collapsed={collapsed}
        onToggle={handleToggle}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        theme={theme}
        onThemeToggle={toggleTheme}
        onLogout={handleLogout}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Minimal topbar — only for mobile menu + page context */}
        <header
          style={{
            position: 'sticky', top: 0, zIndex: 30, height: 52,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 24px', background: 'var(--bg-page)',
            borderBottom: '1px solid var(--border-light)', flexShrink: 0,
          }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden"
            style={{ padding: 8, borderRadius: 8, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Menu size={20} />
          </button>

          {/* API Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
            <span className="dot-pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' as const, color: 'var(--text-muted)' }}>API Online</span>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '24px 24px 32px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {children}
          </div>
        </main>

        <footer style={{ padding: '12px 24px', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
            <span>© 2026 ATA Sistemas</span>
            <span>Elegibilidade v3.0</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
