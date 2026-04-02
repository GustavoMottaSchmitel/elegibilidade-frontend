'use client'
import { useState, useEffect } from 'react'
import { Menu, Moon, Sun, LogOut } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [isDesktop, setIsDesktop] = useState(true)

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

    // Detect desktop
    const mq = window.matchMedia('(min-width: 1024px)')
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
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

  // Sidebar width — only apply margin on desktop
  const marginLeft = isDesktop ? (collapsed ? 72 : 260) : 0

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggle={handleToggle}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content */}
      <div
        className="flex flex-col min-h-screen"
        style={{
          marginLeft: marginLeft,
          transition: 'margin-left 0.3s ease',
        }}
      >
        {/* Topbar */}
        <header className="glass sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 shrink-0" style={{ height: 56 }}>
          {/* Left: Mobile menu + breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg transition-all"
              style={{ color: 'var(--text-muted)' }}
            >
              <Menu size={20} />
            </button>
            <span className="text-label hidden sm:block">Sistema de Atendimento</span>
          </div>

          {/* Right: Theme toggle + API Status + Logout */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all"
              style={{
                border: '1px solid var(--border-default)',
                background: 'var(--bg-elevated)',
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
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
              }}
            >
              <span className="w-2 h-2 rounded-full dot-pulse" style={{ background: '#34d399' }} />
              <span className="text-label" style={{ fontSize: '9px' }}>API Online</span>
            </div>

            <div className="h-5 w-px hidden sm:block" style={{ background: 'var(--border-default)' }} />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-xs"
              style={{ color: 'var(--text-muted)' }}
              title="Sair do Sistema"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline font-medium">Sair</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="px-4 lg:px-8 py-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 font-mono" style={{ fontSize: '10px', color: 'var(--text-faint)' }}>
            <span>© 2026 ATA Sistemas · Todos os direitos reservados</span>
            <span style={{ opacity: 0.6 }}>Elegibilidade v2.0</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
