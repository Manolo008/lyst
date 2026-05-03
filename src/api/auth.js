const BASE = import.meta.env.VITE_AUTH_URL || 'https://frontend-educational-backend.herokuapp.com'

export async function signup({ username, email, password }) {
  const res = await fetch(`${BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, role: ['user'] }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || 'Registratie mislukt. Controleer je gegevens.')
  }
  return res.json()
}

export async function signin({ username, password }) {
  const res = await fetch(`${BASE}/api/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error('Gebruikersnaam of wachtwoord is onjuist.')
  return res.json() // { id, username, email, accessToken, tokenType }
}

export async function getProfile(token) {
  const res = await fetch(`${BASE}/api/user`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Kon profiel niet ophalen.')
  return res.json() // { id, username, email, info, roles }
}

export async function updateProfile(token, data) {
  const res = await fetch(`${BASE}/api/user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Kon profiel niet bijwerken.')
  return res.json()
}
