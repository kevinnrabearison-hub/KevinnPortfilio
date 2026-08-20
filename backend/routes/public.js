import { Router } from "express";

export const createPublicRouter = ({
  pushConfigured,
  visitorCountLimiter,
  getVisitorCount,
  getOrCreateVisitor,
  savePushSubscription,
  publicVisitorCountCache,
}) => {
  const router = Router();

  router.get("/push/public-key", (req, res) => {
    if (!pushConfigured) {
      return res.status(503).json({
        success: false,
        error: "Notifications Push non configurées",
      });
    }

    return res.json({
      success: true,
      publicKey: process.env.VAPID_PUBLIC_KEY,
    });
  });

  router.post("/push/subscribe", async (req, res) => {
    try {
      const { sessionId, subscription } = req.body || {};

      if (!sessionId || !subscription?.endpoint || !subscription?.keys) {
        return res.status(400).json({
          success: false,
          error: "Abonnement Push invalide",
        });
      }

      await getOrCreateVisitor(sessionId);
      await savePushSubscription(sessionId, subscription);

      return res.json({ success: true });
    } catch (error) {
      console.error("❌ POST /api/push/subscribe:", error);
      return res.status(500).json({
        success: false,
        error: "Impossible d'enregistrer les notifications",
      });
    }
  });

  router.get(
    "/visitors/count",
    visitorCountLimiter,
    async (req, res) => {
      try {
        const now = Date.now();

        if (publicVisitorCountCache.expiresAt <= now) {
          const count = await getVisitorCount();
          publicVisitorCountCache.value = count === 0
            ? 0
            : Math.max(10, Math.round(count / 10) * 10);
          publicVisitorCountCache.expiresAt = now + 60 * 1000;
        }

        return res.json({
          success: true,
          count: publicVisitorCountCache.value,
        });
      } catch (error) {
        console.error("❌ GET /api/visitors/count:", error);
        return res.status(500).json({
          success: false,
          error: "Impossible de récupérer le nombre de visiteurs",
        });
      }
    }
  );

  return router;
};
