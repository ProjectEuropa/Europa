const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://local.europa.com";

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};

// XSSリスク軽減のためsessionStorageでトークンを管理
export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/api/v1/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.token) {
    sessionStorage.setItem('token', data.token);
  }
  return data;
};

// チーム検索API
export const searchTeams = async (keyword: string) => {
  const res = await apiRequest(`/api/v1/search/team?keyword=${encodeURIComponent(keyword)}`);
  if (!res.ok) throw new Error('検索失敗');
  return res.json();
};

export const register = async (
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
) => {
  const res = await fetch(`${API_BASE_URL}/api/v1/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};
