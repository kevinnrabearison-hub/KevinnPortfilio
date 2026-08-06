export const downloadAndOpenCV = () => {
  const pdfUrl = "/CV KEVINN.pdf";

  // 1. Ouvrir le PDF dans un nouvel onglet pour l'afficher
  window.open(pdfUrl, "_blank");

  // 2. Déclencher le téléchargement du fichier PDF
  const link = document.createElement("a");
  link.href = pdfUrl;
  link.download = "CV KEVINN.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
