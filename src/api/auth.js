const BASE       = import.meta.env.VITE_API_URL
const PROJECT_ID = import.meta.env.VITE_PROJECT_ID

function baseHeaders() {
  return {
    'Content-Type':              'application/json',
    'novi-education-project-id': PROJECT_ID,
  }
}

export async function signup({ email, password }) {
  const res = await fetch(`${BASE}/api/users`, {
    method:  'POST',
    headers: baseHeaders(),
    body:    JSON.stringify({ email, password, roles: ['user'] }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || 'Registratie mislukt. Controleer je gegevens.')
  }
  return res.json()
}

export async function signin({ email, password }) {
  const res = await fetch(`${BASE}/api/login`, {
    method:  'POST',
    headers: baseHeaders(),
    body:    JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error('E-mailadres of wachtwoord is onjuist.')
  const data = await res.json()
  return { ...data, accessToken: data.token ?? data.accessToken }
}
