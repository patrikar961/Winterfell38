/* =========================================================
   THEME.JS — Palette et ambiance de la boutique
   Les couleurs sont posées en variables CSS au plus tôt,
   avant l'affichage, pour éviter tout flash de couleur.
   ========================================================= */

(() => {
  "use strict";

  const THEME = {
    bg: "#12061f",
    surface: "#1d0b30",
    text: "#f4f0ff",
    muted: "#b9a7d6",
    border: "rgba(255,255,255,.12)",
    primary: "#ff3d8b",
    secondary: "#ff8a3d",
    accent: "#7c4dff",
    gradient: "linear-gradient(135deg,#ff3d8b 0%,#ff8a3d 100%)",
    glow: "rgba(255,61,139,.45)",
    glow2: "rgba(255,138,61,.55)"
  };

  const root = document.documentElement;

  Object.entries(THEME).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);

    /* Alias utile : --glow-2 est utilisé dans le CSS de la grille */
    if (key === "glow2") root.style.setProperty("--glow-2", value);
  });
})();
