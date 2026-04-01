'use client'
import { useState, useEffect } from 'react'
import { Moon, Sun, LogOut } from 'lucide-react'

export function LayoutWrapper({ children, nome }: { children: React.ReactNode, nome?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('ata_theme') as 'light' | 'dark' | null
    if (saved) {
      setTheme(saved)
      document.documentElement.setAttribute('data-theme', saved)
    } else {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

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
    <div className="min-h-screen flex flex-col animate-fade-in transition-all duration-500">
      {/* Premium Header */}
      <header className="premium-glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src={theme === 'dark' ? '/logo-dark.png' : '/logo-light.png'} 
            alt="ATA Sistemas Logo" 
            className="h-10 w-auto transition-all duration-300 transform hover:scale-105"
            onError={(e) => {
               // Fallback se o logo novo ainda não estiver no public
               (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
          <div className="flex flex-col">
            <h1 className="text-premium-title text-xl">Elegibilidade</h1>
            <span className="text-premium-muted">Sistema de Atendimento</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-[var(--dash-border)] hover:border-[var(--dash-accent)] transition-all bg-[var(--dash-surface)]"
          >
            {theme === 'light' ? <Moon size={20} className="text-blue-500" /> : <Sun size={20} className="text-amber-400" />}
          </button>

          <div className="h-8 w-px bg-[var(--dash-border)]" />

          <div className="flex items-center gap-3">
             <div className="flex flex-col items-end">
                <span className="text-xs font-semibold text-[var(--dash-text-primary)]">{nome || 'Usuário'}</span>
                <span className="text-[10px] text-[var(--dash-text-muted)] uppercase">Atendimento</span>
             </div>
             <button 
               onClick={handleLogout}
               className="p-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
             >
               <LogOut size={20} />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-10 px-6">
        {children}
      </main>

      <footer className="py-8 px-6 border-t border-[var(--dash-border)]">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-premium-muted">
          <span>© 2026 ATA Sistemas · Todos os direitos reservados.</span>
          <div className="flex gap-4">
            <span className="opacity-60">v1.2.0-stable</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
