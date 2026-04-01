'use client'
import { useState, useEffect } from 'react'
import { Menu, Moon, Sun, LogOut, Activity } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'
import clsx from 'clsx'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [theme, setTheme] = useState<'dark'>('dark')

  // Load collapse state from storage
  useEffect(() => {
    const saved = localStorage.getItem('ata_sidebar')
    if (saved === 'collapsed') setCollapsed(true)
  }, [])

  const handleToggle = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('ata_sidebar', next ? 'collapsed' : 'expanded')
  }

  const handleLogout = () => {
    document.cookie = 'ata_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    window.location.href = 'https://central-atasistemas.duckdns.org/login'
  }

  return (
    <div className="min-h-screen flex transition-all duration-300">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggle={handleToggle}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={clsx(
          'flex-1 flex flex-col min-h-screen transition-all duration-300',
          collapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'
        )}
      >
        {/* Topbar */}
        <header className="glass sticky top-0 z-30 h-14 flex items-center justify-between px-4 lg:px-6 shrink-0">
          {/* Left: Mobile menu + Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-base-400 hover:text-white hover:bg-base-800 transition-all"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-label">Sistema de Atendimento</span>
            </div>
          </div>

          {/* Right: Status + Actions */}
          <div className="flex items-center gap-3">
            {/* API Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-base-800 border border-base-700">
              <span className="w-2 h-2 rounded-full bg-ok dot-pulse" />
              <span className="text-label text-[9px]">API Online</span>
            </div>

            <div className="h-5 w-px bg-base-700 hidden sm:block" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-base-400 hover:text-danger hover:bg-danger-dim transition-all text-xs"
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
        <footer className="px-4 lg:px-8 py-4 border-t border-base-800">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] text-base-500 font-mono">
            <span>© 2026 ATA Sistemas · Todos os direitos reservados</span>
            <span className="opacity-60">Elegibilidade v2.0</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
