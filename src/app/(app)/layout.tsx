import { Sidebar } from '@/components/layout/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: '#13141f' }}>
      <Sidebar />
      <div className="ml-60 flex flex-col min-h-screen">
        {/* Topbar */}
        <header
          className="sticky top-0 z-20 h-12 flex items-center justify-end px-8 gap-3 shrink-0"
          style={{
            background: 'rgba(13,14,23,0.85)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <span className="text-[11px] text-[#6272a4] font-mono">API → :8081</span>
          <span className="w-2 h-2 rounded-full bg-[#50fa7b] animate-pulse" />
        </header>

        {/* Conteúdo */}
        <main className="flex-1 px-8 py-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
