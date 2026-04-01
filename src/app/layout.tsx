import type { Metadata } from 'next'
import { DM_Mono, DM_Sans, Fraunces } from 'next/font/google'
import { Providers } from './providers'
import { LayoutWrapper } from '@/components/layout-wrapper'
import './globals.css'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const dmMono = DM_Mono({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  axes: ['SOFT', 'WONK'],
})

export const metadata: Metadata = {
  title: 'Elegibilidade · Sistema de Atendimento',
  description: 'Consulta de elegibilidade de atendimento técnico',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${dmMono.variable} ${dmSans.variable} ${fraunces.variable}`}>
      <body className="antialiased">
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  )
}
