import jwt from "jsonwebtoken";

export const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET manquant dans les variables Render");
  }

  return process.env.JWT_SECRET;
};

export const verifyAdminToken = (token) => {
  try {
    if (!token) {
      return null;
    }

    return jwt.verify(token, getJwtSecret());
  } catch (err) {
    return null;
  }
};

export const signAdminToken = () => jwt.sign(
  {
    role: "admin",
  },
  getJwtSecret(),
  {
    expiresIn: "7d",
  }
);

export const escapeHtml = (value) => value.replace(
  /[&<>"']/g,
  (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[character])
);

export const sanitizeHeaderValue = (value) => value.replace(/[\r\n]/g, " ");
