export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_1;

export type User = {
  id: string;
  email: string;
};

export type Note = {
  id: number;
  name: string;
  note: string;
};

type NotesPayload = {
  notes?: Array<Record<string, unknown>>;
  data?: Array<Record<string, unknown>>;
};

function buildUrl(path: string) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
}

async function requestJson<T>(path: string, options: RequestInit = {}) {
  const response = await fetch(buildUrl(path), {
    ...options,
    headers: {
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

function normalizeNote(item: Record<string, unknown>): Note {
  const idValue =
    (item.id as number | undefined) ??
    (item.note_id as number | undefined) ??
    (item.noteId as number | undefined);
  const nameValue = (item.name as string | undefined) ?? (item.title as string | undefined);
  const noteValue = (item.note as string | undefined) ?? (item.content as string | undefined);

  return {
    id: idValue ?? 0,
    name: nameValue ?? 'Untitled',
    note: noteValue ?? '',
  };
}

export async function signIn(email: string, password: string) {
  return requestJson<{ access_token: string }>(`/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export async function signUp(email: string, password: string) {
  return requestJson(`/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export async function getMe(token: string) {
  return requestJson<{ user: User }>(`/auth/me`, {
    headers: { authorization: `Bearer ${token}` },
  });
}

export async function listNotes(userId: string, token: string) {
  const payload = await requestJson<NotesPayload | Array<Record<string, unknown>>>(
    `/api/users/${userId}/notes`,
    { headers: { authorization: `Bearer ${token}` } }
  );

  const items = Array.isArray(payload) ? payload : payload?.notes ?? payload?.data ?? [];
  return items.map(normalizeNote);
}

export async function getNote(userId: string, noteId: number, token: string) {
  const payload = await requestJson<Record<string, unknown>>(
    `/api/users/${userId}/notes/${noteId}`,
    { headers: { authorization: `Bearer ${token}` } }
  );
  return normalizeNote(payload as Record<string, unknown>);
}

export async function addNote(userId: string, token: string, payload: { name: string; note: string }) {
  return requestJson(`/api/users/${userId}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function updateNote(
  userId: string,
  noteId: number,
  token: string,
  payload: { note: string }
) {
  return requestJson(`/api/users/${userId}/notes/${noteId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteNote(userId: string, noteId: number, token: string) {
  return requestJson(`/api/users/${userId}/notes/${noteId}`, {
    method: 'DELETE',
    headers: { authorization: `Bearer ${token}` },
  });
}

export async function fetchHealth() {
  return requestJson<{ status: string }>(`/health`);
}
