export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  // We accept any serialisable body here; conversion is handled in ApiClient.request
  body?: unknown;
  query?: Record<string, string | number | boolean | null | undefined>;
}

function buildQueryString(query: RequestOptions["query"]) {
  if (!query) return "";

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    params.append(key, String(value));
  });

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...(config.defaultHeaders ?? {}),
    };
  }

  async request<TResponse = unknown>(
    path: string,
    method: HttpMethod,
    options: RequestOptions = {}
  ): Promise<TResponse> {
    const { query, headers, body, ...rest } = options;

    const url =
      this.baseUrl.replace(/\/+$/, "") +
      "/" +
      path.replace(/^\/+/, "") +
      buildQueryString(query);

    const fetchBody: BodyInit | null | undefined =
      body === undefined || body === null
        ? undefined
        : typeof body === "string"
        ? body
        : (JSON.stringify(body) as BodyInit);

    const response = await fetch(url, {
      method,
      headers: {
        ...this.defaultHeaders,
        ...(headers as Record<string, string>),
      },
      body: fetchBody,
      ...rest,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(
        `API error ${response.status} ${response.statusText}${
          text ? `: ${text}` : ""
        }`
      );
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      return (await response.json()) as TResponse;
    }

    return (await response.text()) as TResponse;
  }

  get<TResponse = unknown>(path: string, options?: RequestOptions) {
    return this.request<TResponse>(path, "GET", options);
  }

  post<TResponse = unknown>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "body">
  ) {
    return this.request<TResponse>(path, "POST", { ...(options ?? {}), body });
  }

  put<TResponse = unknown>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "body">
  ) {
    return this.request<TResponse>(path, "PUT", { ...(options ?? {}), body });
  }

  patch<TResponse = unknown>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "body">
  ) {
    return this.request<TResponse>(path, "PATCH", { ...(options ?? {}), body });
  }

  delete<TResponse = unknown>(path: string, options?: RequestOptions) {
    return this.request<TResponse>(path, "DELETE", options);
  }
}

// Example default client instance (sesuaikan baseUrl API backend Anda)
export const apiClient = new ApiClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? "",
});
