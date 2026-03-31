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