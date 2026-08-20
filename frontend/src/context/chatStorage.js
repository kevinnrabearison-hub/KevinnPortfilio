const SESSION_KEY = "kevinn_chat_session_id";
const PSEUDO_KEY = "kevinn_chat_pseudo";
const ADMIN_TOKEN_KEY = "kevinn_admin_token";

export const getOrCreateSessionId = () => {
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = "visitor_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
};

export const getStoredPseudo = () => (
  localStorage.getItem(PSEUDO_KEY) || "Visiteur"
);

export const storePseudo = (pseudo) => {
  localStorage.setItem(PSEUDO_KEY, pseudo);
};

export const getStoredAdminToken = () => (
  localStorage.getItem(ADMIN_TOKEN_KEY)
);

export const storeAdminToken = (token) => {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

export const clearStoredAdminToken = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};
