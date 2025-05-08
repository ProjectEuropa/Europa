const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://local.europa.com";
const BASIC_AUTH_USER = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const BASIC_AUTH_PASSWORD = process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD;

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  let baseHeaders: Record<string, string> = {};
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        baseHeaders[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        baseHeaders[key] = value;
      });
    } else {
      baseHeaders = { ...options.headers } as Record<string, string>;
    }
  }
  const headers: Record<string, string> = {
    ...baseHeaders,
    "Content-Type": "application/json",
  };
  // APIリクエストは常にBearer（API以外のみBasic）
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (
    API_BASE_URL.includes("stg.project-europa.work") &&
    BASIC_AUTH_USER && BASIC_AUTH_PASSWORD &&
    !endpoint.startsWith("/api/")
  ) {
    headers["Authorization"] = "Basic " + btoa(`${BASIC_AUTH_USER}:${BASIC_AUTH_PASSWORD}`);
  }
  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });
};


export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/api/v1/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

// チーム検索API
export const searchTeams = async (keyword: string, page: number = 1) => {
  const res = await apiRequest(`/api/v1/search/team?keyword=${encodeURIComponent(keyword)}&page=${page}`);
  if (!res.ok) throw new Error('検索失敗');
  return res.json();
};

// ユーザー名更新API
export const updateUserName = async (name: string) => {
  const res = await apiRequest('/api/v1/user/update', {
    method: 'POST',
    body: JSON.stringify({ name })
  });
  if (!res.ok) throw new Error('更新失敗');
  await console.log(await res);
  return await res.json();
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
