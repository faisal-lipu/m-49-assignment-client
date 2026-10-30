// ==============================================================
// Maitri API Helper
// Handles cross-origin requests, JWT attachment, and base URL resolution
// ==============================================================

export const getServerUrl = (): string => {
  return (
    process.env.NEXT_PUBLIC_SERVER_URL ||
    "https://m-49-assignment-server.onrender.com"
  );
};

// Store JWT token locally for Authorization header support
export const saveToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("maitri_token", token);
  }
};

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("maitri_token");
  }
  return null;
};

export const clearToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("maitri_token");
  }
};

// Request JWT token from backend for the given user email
export const issueServerJwt = async (email: string) => {
  try {
    const serverUrl = getServerUrl();
    const res = await fetch(`${serverUrl}/api/auth/jwt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      credentials: "include",
    });
    const data = await res.json();
    if (data.token) {
      saveToken(data.token);
    }
    return data;
  } catch (error) {
    console.error("Failed to issue server JWT:", error);
    return null;
  }
};

// Authenticated fetch wrapper
export const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const serverUrl = getServerUrl();
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith("http") ? endpoint : `${serverUrl}${endpoint}`;

  return fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
};
