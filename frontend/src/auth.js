import jwt_decode from 'jwt-decode';

export function saveToken(token) {
  localStorage.setItem('access', token);
}

export function getRole() {
  try {
    const token = localStorage.getItem('access');
    const decoded = jwt_decode(token);
    return decoded.rol || null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem('access');
}

export function logout() {
  localStorage.removeItem('access');
}
