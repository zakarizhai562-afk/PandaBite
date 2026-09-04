// Tiny localStorage wrapper — JSON parse/stringify + try/catch, never throws

export function getItem(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // silently ignore storage failures
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // silently ignore
  }
}
