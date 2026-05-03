const BASE = import.meta.env.VITE_NOTES_API_URL
const KEY  = import.meta.env.VITE_NOTES_API_KEY

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    'X-Api-Key': KEY,
    Authorization: `Bearer ${token}`,
  }
}

async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `API fout: ${res.status}`)
  }
  // 204 No Content heeft geen body
  if (res.status === 204) return null
  return res.json()
}

export async function fetchNotes(token) {
  const res = await fetch(`${BASE}/notes`, {
    headers: authHeaders(token),
  })
  return handleResponse(res)
}

export async function fetchNote(token, id) {
  const res = await fetch(`${BASE}/notes/${id}`, {
    headers: authHeaders(token),
  })
  return handleResponse(res)
}

export async function createNote(token, note) {
  const res = await fetch(`${BASE}/notes`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(note),
  })
  return handleResponse(res)
}

export async function updateNote(token, id, note) {
  const res = await fetch(`${BASE}/notes/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(note),
  })
  return handleResponse(res)
}

export async function deleteNote(token, id) {
  const res = await fetch(`${BASE}/notes/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  return handleResponse(res)
}
