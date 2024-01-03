export const baseUrlServeur = "http://localhost:5678/api/";

export function redirect(chemin) {
  const cheminRedirection = chemin;
  window.location.href = cheminRedirection;
}
