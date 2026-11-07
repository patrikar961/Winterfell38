/* =========================================================
   THEME.JS — VOS COULEURS (vous seul pouvez les changer)
   ---------------------------------------------------------
   Les visiteurs n'ont AUCUN bouton pour changer les couleurs.
   Pour changer : modifiez ACTIVE_THEME ci-dessous, enregistrez,
   puis poussez sur GitHub (git commit + git push).
   ========================================================= */

const ACTIVE_THEME = "neonNuit"; // <-- changez ce nom, ou créez la vôtre plus bas

const THEMES = {
  neonSunset:   { bg:"#12061f", surface:"#1f0b33", text:"#fff4fb", muted:"#c9a8d9", primary:"#ff2e88", secondary:"#ffb400", accent:"#00e5ff", gradient:"linear-gradient(135deg,#ff2e88 0%,#ff7a00 50%,#ffd000 100%)" },
  tropical:     { bg:"#03201f", surface:"#073833", text:"#f0fffb", muted:"#9fd8cc", primary:"#00f5a0", secondary:"#ff6b6b", accent:"#ffe66d", gradient:"linear-gradient(135deg,#00f5a0,#00d9f5,#ffe66d)" },
  cyberpunk:    { bg:"#0a0a12", surface:"#16162a", text:"#f5f5ff", muted:"#a0a0c8", primary:"#fcee0a", secondary:"#ff003c", accent:"#00f0ff", gradient:"linear-gradient(135deg,#fcee0a,#ff003c,#00f0ff)" },
  candyPop:     { bg:"#fff0f8", surface:"#ffffff", text:"#3a0a2e", muted:"#8a5a7e", primary:"#ff3ea5", secondary:"#7b2ff7", accent:"#00c2ff", gradient:"linear-gradient(135deg,#ff3ea5,#ff9a3e,#7b2ff7)" },
  oceanDeep:    { bg:"#020c1b", surface:"#0a1f3a", text:"#e6f4ff", muted:"#8fb3d9", primary:"#00b4ff", secondary:"#7af0ff", accent:"#ff8a00", gradient:"linear-gradient(135deg,#0052d4,#4364f7,#6fb1fc)" },
  royalGold:    { bg:"#140f05", surface:"#251c0b", text:"#fff8e7", muted:"#d6c49a", primary:"#ffc947", secondary:"#b8860b", accent:"#ff4d6d", gradient:"linear-gradient(135deg,#f7971e,#ffd200,#fff1a8)" },
  aurora:       { bg:"#050816", surface:"#111735", text:"#f2f6ff", muted:"#a6b0d6", primary:"#7cff6b", secondary:"#b06bff", accent:"#ff6bd6", gradient:"linear-gradient(135deg,#7cff6b,#00e1ff,#b06bff,#ff6bd6)" },
  lavaFire:     { bg:"#1a0500", surface:"#2e0c02", text:"#fff3ec", muted:"#e0a990", primary:"#ff4500", secondary:"#ffae00", accent:"#ffe14d", gradient:"linear-gradient(135deg,#8e0e00,#ff4500,#ffae00)" },
  electricViolet:{ bg:"#0d0221", surface:"#1b0a3d", text:"#f6efff", muted:"#b8a3e0", primary:"#9d4edd", secondary:"#f72585", accent:"#4cc9f0", gradient:"linear-gradient(135deg,#f72585,#7209b7,#4cc9f0)" },
  mintFresh:    { bg:"#f2fffa", surface:"#ffffff", text:"#0b3b2e", muted:"#5f8a7c", primary:"#00c896", secondary:"#ff7aa2", accent:"#ffb800", gradient:"linear-gradient(135deg,#00c896,#7af5c6,#ffe27a)" },
  peachy:       { bg:"#fff6f0", surface:"#ffffff", text:"#3d1d10", muted:"#9a6a55", primary:"#ff7e5f", secondary:"#feb47b", accent:"#6a5cff", gradient:"linear-gradient(135deg,#ff7e5f,#feb47b,#ffd6a5)" },
  rainbow:      { bg:"#0b0b0f", surface:"#18181f", text:"#ffffff", muted:"#b5b5c5", primary:"#ff0080", secondary:"#7928ca", accent:"#00dfd8", gradient:"linear-gradient(90deg,#ff0000,#ff8000,#ffee00,#00d03a,#00a8ff,#7a00ff,#ff00c8)" },
  emerald:      { bg:"#021a10", surface:"#06301e", text:"#eafff4", muted:"#93cfb0", primary:"#00e676", secondary:"#ffd740", accent:"#40c4ff", gradient:"linear-gradient(135deg,#00b09b,#96c93d)" },
  sakura:       { bg:"#fff5f8", surface:"#ffffff", text:"#401426", muted:"#a06a80", primary:"#ff5c8a", secondary:"#ffa6c1", accent:"#3ec1d3", gradient:"linear-gradient(135deg,#ff5c8a,#ffa6c1,#ffd1dc)" },
  midnightBlue: { bg:"#000814", surface:"#001d3d", text:"#eaf2ff", muted:"#8aa4c8", primary:"#ffc300", secondary:"#ffd60a", accent:"#4ea8de", gradient:"linear-gradient(135deg,#003566,#ffc300)" },
  miami:        { bg:"#170026", surface:"#2b0145", text:"#fff0ff", muted:"#d8a6e6", primary:"#ff3cac", secondary:"#2b86c5", accent:"#00fff0", gradient:"linear-gradient(135deg,#ff3cac,#784ba0,#2b86c5)" },

  /* -------------------------------------------------------
     NOUVELLES PALETTES — dans l'esprit néon « tape à l'œil »
     ------------------------------------------------------- */
  neonNuit:     { bg:"#0a0618", surface:"#170e2e", text:"#f4f0ff", muted:"#a99cd6", primary:"#8a2be2", secondary:"#ff7a00", accent:"#00f0ff", gradient:"linear-gradient(135deg,#8a2be2 0%,#ff2e88 45%,#ff7a00 100%)" },
  bubblegum:    { bg:"#1a0620", surface:"#2d0b38", text:"#fff2ff", muted:"#d9a6e0", primary:"#ff5fd2", secondary:"#ffe066", accent:"#41e0ff", gradient:"linear-gradient(135deg,#ff5fd2,#ff9a3e 55%,#ffe066)" },
  sunsetMiami:  { bg:"#150726", surface:"#26103f", text:"#fff0fa", muted:"#cfa3dd", primary:"#ff8a3d", secondary:"#ff2e63", accent:"#00e0d0", gradient:"linear-gradient(135deg,#ff2e63,#ff8a3d 50%,#ffd166)" },
  toxicGreen:   { bg:"#04120a", surface:"#0a2416", text:"#eefff5", muted:"#8fd8b0", primary:"#39ff14", secondary:"#ffd400", accent:"#00d9ff", gradient:"linear-gradient(135deg,#39ff14,#b6ff00 55%,#ffd400)" },
  royalPurple:  { bg:"#0b0420", surface:"#1a0a3a", text:"#f3eaff", muted:"#b49ada", primary:"#a832ff", secondary:"#ff3d81", accent:"#ffd400", gradient:"linear-gradient(135deg,#a832ff 0%,#ff3d81 55%,#ffd400 100%)" },
  neonCyan:     { bg:"#04121a", surface:"#0a2436", text:"#eafaff", muted:"#8dc4d8", primary:"#00e5ff", secondary:"#7c4dff", accent:"#ff2e88", gradient:"linear-gradient(135deg,#00e5ff,#7c4dff 55%,#ff2e88)" },
  hotCoral:     { bg:"#1c0710", surface:"#330f1f", text:"#fff3f6", muted:"#e0a3b4", primary:"#ff4d6d", secondary:"#ff9a3e", accent:"#4de1ff", gradient:"linear-gradient(135deg,#ff4d6d,#ff9a3e 55%,#ffe066)" },
  sunsetGold:   { bg:"#150b06", surface:"#2a160d", text:"#fff8ee", muted:"#dcc0a2", primary:"#ff9e00", secondary:"#ff6b35", accent:"#ffd60a", gradient:"linear-gradient(135deg,#ff6b35,#ff9e00 50%,#ffd60a)" },
  tropicalNeon: { bg:"#04201c", surface:"#0a3a33", text:"#f0fffc", muted:"#93dbcb", primary:"#00f5a0", secondary:"#ff4d9d", accent:"#ffe066", gradient:"linear-gradient(135deg,#00f5a0,#00d9f5 50%,#ff4d9d)" },

  /* Votre propre palette : remplissez puis mettez ACTIVE_THEME = "custom" */
  custom:       { bg:"#101010", surface:"#1c1c1c", text:"#ffffff", muted:"#aaaaaa", primary:"#ff00aa", secondary:"#00ffaa", accent:"#ffaa00", gradient:"linear-gradient(135deg,#ff00aa,#00ffaa)" }
};

(function applyTheme(){
  const t = THEMES[ACTIVE_THEME] || THEMES.neonSunset;
  const r = document.documentElement.style;
  Object.entries(t).forEach(([k, v]) => r.setProperty("--" + k, v));

  /* Couleurs dérivées : elles suivent automatiquement votre palette. */
  r.setProperty("--on-primary", "#ffffff");
  r.setProperty("--glow", `color-mix(in srgb, ${t.primary} 55%, transparent)`);
  r.setProperty("--glow-2", `color-mix(in srgb, ${t.secondary} 45%, transparent)`);
  r.setProperty("--border", `color-mix(in srgb, ${t.primary} 35%, transparent)`);
  r.setProperty("--ok", "#22d07a");
  r.setProperty("--warn", "#ffb020");
  r.setProperty("--danger", "#ff4d5e");

  /* Mode clair ou sombre, déduit de la luminosité du fond. */
  const hex = String(t.bg).replace("#", "");
  const full = hex.length === 3 ? hex.split("").map(c => c + c).join("") : hex;
  const r0 = parseInt(full.slice(0, 2), 16) || 0;
  const g0 = parseInt(full.slice(2, 4), 16) || 0;
  const b0 = parseInt(full.slice(4, 6), 16) || 0;
  const lum = (0.299 * r0 + 0.587 * g0 + 0.114 * b0) / 255;

  r.setProperty("--shadow-strength", lum > 0.55 ? "0.18" : "0.55");
  document.documentElement.dataset.scheme = lum > 0.55 ? "light" : "dark";
})();
