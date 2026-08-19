self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || "Nouvelle réponse", {
      body: data.body || "Tu as reçu une nouvelle réponse.",
      icon: "/logo/vscode-alt.png",
      badge: "/logo/vscode-alt.png",
      data: { url: data.url || "/?chat=open" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      const existingWindow = windows.find((client) => "focus" in client);
      if (existingWindow) {
        existingWindow.navigate(event.notification.data.url);
        return existingWindow.focus();
      }
      return self.clients.openWindow(event.notification.data.url);
    })
  );
});
