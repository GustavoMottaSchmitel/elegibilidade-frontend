'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Search, Upload,
  AlertOctagon, ShieldBan, Activity,
} from 'lucide-react'
import clsx from 'clsx'

const nav = [
  { href: '/',              label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/busca',         label: 'Consulta',      icon: Search },
  { href: '/importacao',    label: 'Importação',    icon: Upload },
  { href: '/inadimplentes', label: 'Inadimplentes', icon: AlertOctagon },
  { href: '/bloqueados',    label: 'Bloqueados',    icon: ShieldBan },
]

export function Sidebar() {
  const path = usePathname()

  return (
    <aside
      className="fixed left-0 top-0 h-full w-60 flex flex-col z-30"
      style={{
        background: 'rgba(13,14,23,0.98)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg,#bd93f9,#ff79c6)' }}
          >
            <Activity size={15} className="text-white" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-white leading-tight">Elegibilidade</p>
            <p className="text-[11px] text-[#6272a4] leading-tight">ATA Sistemas</p>
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="px-5 pb-2">
        <p className="text-[10px] font-semibold text-[#6272a4] tracking-widest uppercase">Menu</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? path === '/' : path.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={clsx('nav-item', active && 'active')}
            >
              <Icon
                size={16}
                strokeWidth={active ? 2.5 : 1.8}
                style={{ color: active ? '#bd93f9' : undefined }}
              />
              <span className="flex-1">{label}</span>
              {active && (
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: '#bd93f9' }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="p-3">
        <div
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background: 'linear-gradient(135deg,#bd93f9,#ff79c6)' }}
          >
            A
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-white truncate leading-tight">Administrador</p>
            <p className="text-[11px] text-[#6272a4] leading-tight">Sistema</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
