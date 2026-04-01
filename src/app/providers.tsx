'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
      },
    },
  }))

  return (
    <QueryClientProvider client={client}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#131620',
            color: '#c5cade',
            border: '1px solid #1b1f2e',
            fontFamily: '"DM Mono", monospace',
            fontSize: '13px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          },
          success: { iconTheme: { primary: '#34d399', secondary: '#06070a' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#06070a' } },
        }}
      />
    </QueryClientProvider>
  )
}
