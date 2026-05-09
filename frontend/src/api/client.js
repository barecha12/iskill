export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api'
export const TOKEN_KEY = 'iskill_token'

export async function apiRequest(path, options = {}, authToken = '') {
  const headers = new Headers(options.headers ?? {})

  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`)
  }

  if (!(options.body instanceof FormData)) {
    headers.set('Accept', 'application/json')
    if (options.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorPayload = await safeJson(response)
    const message =
      errorPayload?.errors?.email?.[0] ||
      errorPayload?.errors?.password?.[0] ||
      errorPayload?.errors?.message?.[0] ||
      errorPayload?.message ||
      'Something went wrong.'

    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response
}

export async function safeJson(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}
