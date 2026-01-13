import { useAuthStore } from '../store/authStore'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiClientConfig {
  baseUrl: string
  defaultHeaders?: Record<string, string>
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  query?: Record<string, string | number | boolean | null | undefined>
}

function buildQueryString(query: RequestOptions['query']) {
  if (!query) return ''

  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value === null || value === undefined) return
    params.append(key, String(value))
  })

  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, '')
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(config.defaultHeaders ?? {}),
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const token = useAuthStore.getState().token
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      }
    }
    return {}
  }

  async request<TResponse = unknown>(
    path: string,
    method: HttpMethod,
    options: RequestOptions = {}
  ): Promise<TResponse> {
    const { query, headers, body, ...rest } = options

    const url =
      this.baseUrl.replace(/\/+$/, '') +
      '/' +
      path.replace(/^\/+/, '') +
      buildQueryString(query)

    const authHeaders = this.getAuthHeaders()

    const fetchBody: BodyInit | null | undefined =
      body === undefined || body === null
        ? undefined
        : typeof body === 'string'
          ? body
          : (JSON.stringify(body) as BodyInit)

    try {
      const response = await fetch(url, {
        method,
        mode: 'cors',
        headers: {
          ...this.defaultHeaders,
          ...authHeaders,
          ...(headers as Record<string, string>),
        },
        body: fetchBody,
        ...rest,
      })

      if (!response.ok) {
        if (response.status === 401) {
          const token = useAuthStore.getState().token
          if (token) {
            useAuthStore.getState().logout()
          }
        }
        const text = await response.text().catch(() => '')
        const errorMessage = text || response.statusText
        throw new Error(`API error ${response.status}: ${errorMessage}`)
      }

      const contentType = response.headers.get('content-type') ?? ''
      if (contentType.includes('application/json')) {
        return (await response.json()) as TResponse
      }

      return (await response.text()) as TResponse
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        throw new Error(
          'Network error: Unable to connect to the server. Please check if the server is running and CORS is properly configured.'
        )
      }
      if (err instanceof Error && err.message.includes('CORS')) {
        throw new Error(
          'CORS error: The server is not allowing requests from this origin. Please configure CORS on the backend or use a proxy.'
        )
      }
      throw err
    }
  }

  get<TResponse = unknown>(path: string, options?: RequestOptions) {
    return this.request<TResponse>(path, 'GET', options)
  }

  post<TResponse = unknown>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'body'>
  ) {
    return this.request<TResponse>(path, 'POST', { ...(options ?? {}), body })
  }

  put<TResponse = unknown>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'body'>
  ) {
    return this.request<TResponse>(path, 'PUT', { ...(options ?? {}), body })
  }

  patch<TResponse = unknown>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'body'>
  ) {
    return this.request<TResponse>(path, 'PATCH', { ...(options ?? {}), body })
  }

  delete<TResponse = unknown>(path: string, options?: RequestOptions) {
    return this.request<TResponse>(path, 'DELETE', options)
  }
}

const getBaseUrl = (): string => {
  const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development'

  if (isDev) {
    return '/api'
  }

  return import.meta.env.VITE_API_BASE_URL || ''
}
export const apiClient = new ApiClient({
  baseUrl: getBaseUrl(),
})
