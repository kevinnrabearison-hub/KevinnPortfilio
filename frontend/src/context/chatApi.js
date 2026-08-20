const getJson = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error || "Requête impossible");
    error.response = { data, status: response.status };
    throw error;
  }

  return data;
};

export const fetchVisitors = async (backendUrl, token) => {
  if (!token) return null;

  const response = await fetch(`${backendUrl}/api/admin/visitors`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return getJson(response);
};

export const fetchChatHistory = async (backendUrl, sessionId, token) => {
  const response = await fetch(`${backendUrl}/api/chat/history/${sessionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return getJson(response);
};

export const loginAdminRequest = async (backendUrl, password) => {
  const response = await fetch(`${backendUrl}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  return getJson(response);
};
