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
            background: '#18181c',
            color: '#e8e8ed',
            border: '1px solid #2e2e38',
            fontFamily: '"DM Mono", monospace',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#052e16' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#2d0606' } },
        }}
      />
    </QueryClientProvider>
  )
}
