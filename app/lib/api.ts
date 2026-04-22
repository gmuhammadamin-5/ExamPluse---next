const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
}

async function apiFetch(url: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Request failed');
  }
  return response.json();
}

export const authApi = {
  register: (email: string, fullName: string, password: string) =>
    apiFetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ email, full_name: fullName, password }),
    }),

  login: (email: string, password: string) =>
    apiFetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => apiFetch(`${API_URL}/api/auth/me`),
};

export const dashboardApi = {
  stats: () => apiFetch(`${API_URL}/api/dashboard/stats`),
  leaderboard: () => apiFetch(`${API_URL}/api/dashboard/leaderboard`),
};

export const resultsApi = {
  list: (params?: { exam_type?: string; section?: string; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.exam_type) qs.set('exam_type', params.exam_type);
    if (params?.section)   qs.set('section', params.section);
    if (params?.limit)     qs.set('limit', String(params.limit));
    return apiFetch(`${API_URL}/api/results?${qs}`);
  },
  stats: () => apiFetch(`${API_URL}/api/results/stats`),
  submit: (body: Record<string, unknown>) =>
    apiFetch(`${API_URL}/api/results`, { method: 'POST', body: JSON.stringify(body) }),
};

export const aiApi = {
  chat: (message: string, history: { role: string; content: string }[], context?: string) =>
    apiFetch(`${API_URL}/api/ai/tutor/chat`, {
      method: 'POST',
      body: JSON.stringify({ message, history, context }),
    }),
  evaluateWriting: (text: string, prompt: string, exam_type = 'IELTS') =>
    apiFetch(`${API_URL}/api/ai/evaluate/writing`, {
      method: 'POST',
      body: JSON.stringify({ text, prompt, exam_type }),
    }),
  evaluateSpeaking: (transcript: string, exam_type = 'IELTS', task_type = 'General') =>
    apiFetch(`${API_URL}/api/ai/evaluate/speaking`, {
      method: 'POST',
      body: JSON.stringify({ transcript, exam_type, task_type }),
    }),
  personalizedAdvice: (exam_type = 'IELTS') =>
    apiFetch(`${API_URL}/api/ai/personalized-advice?exam_type=${exam_type}`),
};
