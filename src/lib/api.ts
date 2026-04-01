import axios from 'axios'
import type {
  StatusAtendimentoResponse,
  ClienteDetalheResponse,
  DashboardResponse,
  ImportacaoCsv,
  PageResponse,
} from '@/types/api'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Adiciona o token de autenticação em todas as requisições
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const name = 'ata_token='
    const decodedCookie = decodeURIComponent(document.cookie)
    const ca = decodedCookie.split(';')
    let token = ''
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) === 0) {
            token = c.substring(name.length, c.length)
        }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const msg =
      err.response?.data?.mensagem ||
      err.response?.data?.message ||
      err.message ||
      'Erro desconhecido'
    return Promise.reject(new Error(msg))
  }
)

// ── Clientes ──────────────────────────────────────────────────────────────

export const clienteApi = {
  buscarPorTermo: async (q: string): Promise<ClienteDetalheResponse[]> => {
    const { data } = await api.get('/clientes/busca', { params: { q } })
    return data
  },

  /** Aceita CNPJ (14 dígitos) ou CPF (11 dígitos) */
  consultarPorDocumento: async (doc: string): Promise<StatusAtendimentoResponse> => {
    const limpo = doc.replace(/\D/g, '')
    const { data } = await api.get(`/clientes/documento/${limpo}/status-atendimento`)
    return data
  },

  /** @deprecated use consultarPorDocumento */
  consultarPorCnpj: async (cnpj: string): Promise<StatusAtendimentoResponse> => {
    const limpo = cnpj.replace(/\D/g, '')
    const { data } = await api.get(`/clientes/documento/${limpo}/status-atendimento`)
    return data
  },

  consultarPorId: async (id: number): Promise<StatusAtendimentoResponse> => {
    const { data } = await api.get(`/clientes/${id}/status-atendimento`)
    return data
  },

  detalhe: async (id: number): Promise<ClienteDetalheResponse> => {
    const { data } = await api.get(`/clientes/${id}`)
    return data
  },

  inadimplentes: async (page = 0, size = 20): Promise<PageResponse<ClienteDetalheResponse>> => {
    const { data } = await api.get('/clientes/inadimplentes', { params: { page, size } })
    return data
  },

  bloqueados: async (page = 0, size = 20): Promise<PageResponse<ClienteDetalheResponse>> => {
    const { data } = await api.get('/clientes/bloqueados', { params: { page, size } })
    return data
  },
}

// ── Dashboard ─────────────────────────────────────────────────────────────

export const dashboardApi = {
  resumo: async (): Promise<DashboardResponse> => {
    const { data } = await api.get('/dashboard/resumo')
    return data
  },
}

// ── Importação ────────────────────────────────────────────────────────────

export const importacaoApi = {
  enviar: async (arquivo: File): Promise<ImportacaoCsv> => {
    const form = new FormData()
    form.append('arquivo', arquivo)
    const { data } = await api.post('/importacoes/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  listar: async (page = 0, size = 20): Promise<PageResponse<ImportacaoCsv>> => {
    const { data } = await api.get('/importacoes', { params: { page, size } })
    return data
  },

  detalhe: async (id: number): Promise<ImportacaoCsv> => {
    const { data } = await api.get(`/importacoes/${id}`)
    return data
  },
}