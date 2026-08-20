import { Router } from "express";

export const createContactRouter = ({
  contactLimiter,
  mailTransporter,
  escapeHtml,
  sanitizeHeaderValue,
}) => {
  const router = Router();

  router.post(
    "/contact",
    contactLimiter,
    async (req, res) => {
      try {
        const { name, email, message } = req.body || {};
        const contactName = typeof name === "string" ? name.trim() : "";
        const contactEmail = typeof email === "string" ? email.trim() : "";
        const contactMessage = typeof message === "string" ? message.trim() : "";

        if (
          !contactName ||
          !contactEmail ||
          !contactMessage ||
          contactName.length > 120 ||
          contactEmail.length > 254 ||
          contactMessage.length > 5000 ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)
        ) {
          return res.status(400).json({
            success: false,
            error: "Tous les champs sont requis",
          });
        }

        const escapedName = escapeHtml(contactName);
        const escapedEmail = escapeHtml(contactEmail);
        const escapedMessage = escapeHtml(contactMessage).replace(/\n/g, "<br/>");
        const mailOptions = {
          from: process.env.EMAIL_USER || "",
          to: process.env.EMAIL_USER || process.env.ADMIN_EMAIL || "",
          replyTo: sanitizeHeaderValue(contactEmail),
          subject: `Nouveau message de contact de ${sanitizeHeaderValue(contactName)}`,
          text:
            `Nom: ${contactName}\n` +
            `Email: ${contactEmail}\n\n` +
            `Message:\n${contactMessage}`,
          html:
            `<p><strong>Nom:</strong> ${escapedName}</p>` +
            `<p><strong>Email:</strong> ${escapedEmail}</p>` +
            `<p><strong>Message:</strong><br/>${escapedMessage}</p>`,
        };

        if (!mailOptions.to) {
          console.warn("⚠️ SMTP non configuré");

          return res.status(503).json({
            success: false,
            message:
              "Message reçu, mais l’e-mail n’a pas été envoyé car la configuration SMTP est manquante.",
          });
        }

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !mailTransporter) {
          console.warn("⚠️ EMAIL_PASS manquant");

          return res.status(503).json({
            success: false,
            message:
              "Message reçu, mais l’e-mail n’a pas été envoyé car la configuration SMTP est incomplète.",
          });
        }

        await mailTransporter.sendMail(mailOptions);

        return res.json({
          success: true,
          message: "Message envoyé avec succès.",
        });
      } catch (error) {
        console.error("❌ POST /api/contact:", error);

        return res.status(500).json({
          success: false,
          error: "Impossible d'envoyer le message",
        });
      }
    }
  );

  return router;
};
