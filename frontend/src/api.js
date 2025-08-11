const API_BASE = "http://127.0.0.1:8000";

export function authHeaders(token) {
  return { Authorization: `Token ${token}` };
}

export async function login(correo, password) {
  const res = await fetch(`${API_BASE}/api/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, password }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function fetchActas(token, params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/api/actas/${qs ? `?${qs}` : ""}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function fetchActaDetail(token, id) {
  const res = await fetch(`${API_BASE}/api/actas/${id}/`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function createGestion(token, formData) {
  const res = await fetch(`${API_BASE}/api/gestiones/`, {
    method: "POST",
    headers: { Authorization: `Token ${token}` },
    body: formData,
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function fetchProtectedFile(token, filePath) {
  const res = await fetch(`${API_BASE}/media/${filePath}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("No autorizado");
  return res.blob();
}
