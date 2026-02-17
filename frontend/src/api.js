/**
 * API service - all backend API calls
 * Backend runs at http://localhost:5000
 * Vite proxy forwards /api to backend
 */

const API_BASE = '/api'

// Helper for fetch with JSON
async function fetchJson(url, options = {}) {
  let res
  try {
    res = await fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers }
    })
  } catch (err) {
    throw new Error('Cannot connect to backend. Start it with: cd backend && python app.py')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    let msg = data.message || data.error || 'Request failed'
    if (res.status >= 500 && msg === 'Request failed') msg = 'Backend error - check MongoDB in backend/.env'
    throw new Error(msg)
  }
  return data
}

// Auth
export async function login(username, password) {
  return fetchJson(`${API_BASE}/login`, {
    method: 'POST',
    body: JSON.stringify({ username, password })
  })
}

export async function register(username, password) {
  return fetchJson(`${API_BASE}/register`, {
    method: 'POST',
    body: JSON.stringify({ username, password })
  })
}

// Dashboard
export async function getDashboard() {
  return fetchJson(`${API_BASE}/dashboard`)
}

// Animals
export async function getAnimals() {
  return fetchJson(`${API_BASE}/animals`)
}

export async function addAnimal(animal) {
  return fetchJson(`${API_BASE}/animals`, {
    method: 'POST',
    body: JSON.stringify(animal)
  })
}

export async function updateAnimal(id, animal) {
  return fetchJson(`${API_BASE}/animals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(animal)
  })
}

export async function getAnimalByTag(tagId) {
  return fetchJson(`${API_BASE}/animals/tag/${tagId}`)
}

// Sales
export async function getSales() {
  return fetchJson(`${API_BASE}/sales`)
}

export async function addSale(sale) {
  return fetchJson(`${API_BASE}/sales`, {
    method: 'POST',
    body: JSON.stringify(sale)
  })
}

// Profit
export async function getProfit() {
  return fetchJson(`${API_BASE}/profit`)
}

// Reports
export async function getReports() {
  return fetchJson(`${API_BASE}/reports`)
}
