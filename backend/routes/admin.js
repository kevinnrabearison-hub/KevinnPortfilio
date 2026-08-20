import { Router } from "express";

export const createAdminRouter = ({
  bcrypt,
  signAdminToken,
  verifyAdminToken,
  getAllVisitors,
  getMessages,
  loginLimiter,
}) => {
  const router = Router();

  router.post(
    "/admin/login",
    loginLimiter,
    async (req, res) => {
      try {
        const { password } = req.body || {};
        const adminPassword = process.env.ADMIN_PASSWORD || "";
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || "";

        if (!password) {
          return res.status(400).json({
            success: false,
            error: "Mot de passe requis",
          });
        }

        const valid = adminPasswordHash
          ? await bcrypt.compare(password, adminPasswordHash)
          : password === adminPassword;

        if (!valid) {
          return res.status(401).json({
            success: false,
            error: "Mot de passe invalide",
          });
        }

        const token = signAdminToken();

        console.log("✅ Connexion admin réussie");

        return res.json({
          success: true,
          token,
        });
      } catch (error) {
        console.error("❌ POST /api/admin/login:", error);

        return res.status(500).json({
          success: false,
          error: "Erreur interne",
        });
      }
    }
  );

  router.get(
    "/admin/visitors",
    async (req, res) => {
      try {
        const token = (req.headers.authorization || "")
          .replace(/^Bearer\s+/i, "")
          .trim();
        const payload = verifyAdminToken(token);

        if (!payload || payload.role !== "admin") {
          return res.status(401).json({
            success: false,
            error: "Token invalide",
          });
        }

        const visitors = await getAllVisitors();

        return res.json({
          success: true,
          visitors,
        });
      } catch (error) {
        console.error("❌ GET /api/admin/visitors:", error);

        return res.status(500).json({
          success: false,
          error: "Erreur interne",
        });
      }
    }
  );

  router.get(
    "/chat/history/:sessionId",
    async (req, res) => {
      try {
        const token = (req.headers.authorization || "")
          .replace(/^Bearer\s+/i, "")
          .trim();
        const payload = verifyAdminToken(token);

        if (!payload || payload.role !== "admin") {
          return res.status(401).json({
            success: false,
            error: "Token invalide",
          });
        }

        const { sessionId } = req.params;

        if (!sessionId) {
          return res.status(400).json({
            success: false,
            error: "SessionId manquant",
          });
        }

        const messages = await getMessages(sessionId);

        return res.json({
          success: true,
          messages,
        });
      } catch (error) {
        console.error("❌ GET /api/chat/history:", error);

        return res.status(500).json({
          success: false,
          error: "Erreur interne",
        });
      }
    }
  );

  return router;
};
