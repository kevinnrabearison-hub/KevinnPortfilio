export const createChatServices = ({
  io,
  getAllVisitors,
  getPushSubscriptions,
  removePushSubscription,
  webpush,
  pushConfigured,
  frontendUrl,
}) => {
  const adminSockets = new Set();
  let lastAdminOnlineStatus = false;
  let lastVisitorsListRefresh = 0;
  let visitorsListRefreshTimer = null;
  let visitorsListRefreshQueued = false;

  const isAdminOnline = () => adminSockets.size > 0;

  const emitAdminStatus = () => {
    const nextStatus = isAdminOnline();

    if (nextStatus === lastAdminOnlineStatus) {
      return;
    }

    lastAdminOnlineStatus = nextStatus;
    io.emit("admin_status_changed", { isAdminOnline: nextStatus });
  };

  const notifyVisitorsList = async () => {
    if (!isAdminOnline()) {
      return;
    }

    const elapsed = Date.now() - lastVisitorsListRefresh;
    if (elapsed < 500) {
      visitorsListRefreshQueued = true;

      if (!visitorsListRefreshTimer) {
        visitorsListRefreshTimer = setTimeout(() => {
          visitorsListRefreshTimer = null;

          if (visitorsListRefreshQueued) {
            visitorsListRefreshQueued = false;
            notifyVisitorsList().catch((error) => {
              console.error("❌ Erreur notifyVisitorsList différée:", error);
            });
          }
        }, 500 - elapsed);
      }

      return;
    }

    try {
      lastVisitorsListRefresh = Date.now();
      const visitors = await getAllVisitors();
      io.to("admin_room").emit("visitors_list_updated", visitors);
    } catch (error) {
      console.error("❌ Erreur notifyVisitorsList:", error);
    }
  };

  const notifyVisitorOfAdminReply = async (sessionId, message) => {
    if (!pushConfigured) return;

    const subscriptions = await getPushSubscriptions(sessionId);
    const payload = JSON.stringify({
      title: "Nouvelle réponse de Kevinn",
      body: message.content,
      url: `${frontendUrl}/?chat=open`,
    });

    await Promise.all(subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(subscription, payload);
      } catch (error) {
        if (error.statusCode === 404 || error.statusCode === 410) {
          await removePushSubscription(subscription.endpoint);
        } else {
          console.error("❌ Notification Push impossible:", error.message);
        }
      }
    }));
  };

  return {
    adminSockets,
    isAdminOnline,
    emitAdminStatus,
    notifyVisitorsList,
    notifyVisitorOfAdminReply,
  };
};
