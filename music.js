/* =========================================================
   MUSIC.JS — Fond sonore WINTERFELL38
   Lecteur caché : liste des sons dans assets/music/playlist.txt
   Pour ajouter un son : dépose le fichier dans assets/music/
   puis ajoute son nom sur une ligne dans playlist.txt.
   ========================================================= */

(() => {
  "use strict";

  const PLAYLIST_URL = "assets/music/playlist.txt";
  const STORE_KEY = "winterfell38_music";

  /* Combinaison d'ouverture du lecteur : un appui long (1,2 s)
     sur le logo de la boutique. Aucun bouton visible pour les visiteurs. */
  const HOLD_MS = 1200;

  /* Le volume est piloté par une courbe de puissance : les petits
     réglages s'entendent vraiment, au lieu d'être tassés près du maximum. */
  const CURVE = 2.2;

  let audio = null;
  let panel = null;
  let picker = null;
  let playBtn = null;
  let muteBtn = null;
  let volume = null;
  let tracks = [];
  let current = 0;

  let saved = { volume: 0.35, track: 0, muted: false, playing: false };

  try {
    saved = Object.assign(saved, JSON.parse(localStorage.getItem(STORE_KEY) || "{}"));
  } catch {
    /* préférences illisibles : on repart des valeurs par défaut */
  }

  const persist = () => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(saved));
    } catch {
      /* mode privé : les réglages restent valables pour la session */
    }
  };

  const clean = line =>
    line.trim().replace(/^[-*\u2022]\s*/, "").replace(/^["']|["']$/g, "").trim();

  const isAudio = name => /\.(mp3|m4a|aac|ogg|oga|opus|wav|webm)$/i.test(name);

  const labelOf = name =>
    name
      .replace(/^.*\//, "")
      .replace(/\.[a-z0-9]+$/i, "")
      .replace(/[_]+/g, " ")
      .trim();

  const srcOf = name =>
    /^https?:\/\//i.test(name) ? name : "assets/music/" + name.replace(/^assets\/music\//i, "");

  const clamp01 = n => Math.max(0, Math.min(1, Number(n) || 0));

  /* position du curseur (0 → 1) transformée en volume réel */
  const toLevel = v => Math.pow(clamp01(v), CURVE);

  /* Suit la page : la musique continue quand tu passes d'une rubrique
     à l'autre. */
  const updatePos = () => {
    if (!panel || panel.hidden) return;

    const dock = document.querySelector(".bottom-dock");
    const offset = dock ? Math.max(86, window.innerHeight - dock.getBoundingClientRect().top + 10) : 24;

    panel.style.bottom = offset + "px";
  };

  /* ---------------- Interface ---------------- */

  function buildUI() {
    panel = document.createElement("div");
    panel.className = "music-panel";
    panel.hidden = true;
    panel.setAttribute("role", "group");
    panel.setAttribute("aria-label", "Fond sonore");

    panel.innerHTML = `
      <div class="music-head">
        <span class="music-title">Fond sonore</span>
        <button type="button" class="music-close" data-music-close aria-label="Fermer le lecteur">✕</button>
      </div>
      <div class="music-row">
        <button type="button" class="music-play" data-music-play aria-label="Lecture ou pause">▶</button>
        <select class="music-pick" data-music-pick aria-label="Choisir un son"></select>
      </div>
      <div class="music-row">
        <button type="button" class="music-mute" data-music-mute aria-label="Couper le son">🔊</button>
        <input class="music-vol" type="range" min="0" max="100" step="1" data-music-vol aria-label="Volume" />
        <span class="music-val" data-music-val>35%</span>
      </div>
      <p class="music-note" data-music-note></p>
    `;

    document.body.appendChild(panel);

    playBtn = panel.querySelector("[data-music-play]");
    picker = panel.querySelector("[data-music-pick]");
    muteBtn = panel.querySelector("[data-music-mute]");
    volume = panel.querySelector("[data-music-vol]");

    audio = new Audio();
    audio.preload = "none";
    audio.loop = false;

    applyVolume(false);
    volume.value = String(Math.round(saved.volume * 100));

    playBtn.addEventListener("click", togglePlay);
    muteBtn.addEventListener("click", toggleMute);
    picker.addEventListener("change", () => select(Number(picker.value), true));

    volume.addEventListener("input", () => {
      saved.volume = clamp01(Number(volume.value) / 100);

      /* bouger le curseur rétablit le son : plus besoin de chercher le bouton */
      if (saved.volume > 0) {
        saved.muted = false;
        audio.muted = false;
      }

      applyVolume(true);
      persist();
    });

    panel.addEventListener("click", e => {
      if (e.target.closest("[data-music-close]")) hide();
    });

    audio.addEventListener("ended", () => {
      if (!tracks.length) return;
      select((current + 1) % tracks.length, saved.playing);
    });

    audio.addEventListener("error", () => {
      note("Ce son est introuvable. Vérifie le nom dans assets/music/playlist.txt.");
      setPlaying(false);
    });

    updatePos();
    window.addEventListener("resize", updatePos);
    window.addEventListener("orientationchange", updatePos);
  }

  /* Applique le volume réel + met à jour le pourcentage et l'icône.
     Le volume du téléphone multiplie le nôtre : on le rappelle quand il
     est très bas, plutôt que de laisser croire que le curseur ne fait rien. */
  function applyVolume(announce) {
    const level = toLevel(saved.volume);

    audio.volume = level;
    audio.muted = saved.muted;

    volume.value = String(Math.round(saved.volume * 100));
    panel.querySelector("[data-music-val]").textContent = Math.round(saved.volume * 100) + "%";
    muteBtn.textContent = saved.muted || saved.volume === 0 ? "🔇" : "🔊";

    if (!announce) return;

    if (saved.volume === 0) {
      note("Son coupé par le volume.");
    } else {
      note(tracks[current] ? tracks[current].label : "");
    }
  }

  const note = msg => {
    const box = panel && panel.querySelector("[data-music-note]");
    if (box) box.textContent = msg || "";
  };

  function setPlaying(on) {
    saved.playing = !!on;
    if (playBtn) playBtn.textContent = on ? "❙❙" : "▶";
    persist();
  }

  /* Le navigateur refuse la lecture automatique : on profite du premier
     appui de la visite pour relancer la musique là où elle s'était
     arrêtée, sans rien demander. */
  function armResume() {
    if (!saved.playing || !tracks.length) return;

    const resume = () => {
      document.removeEventListener("pointerdown", resume, true);

      audio.muted = saved.muted;
      audio.volume = toLevel(saved.volume);

      const p = audio.play();
      if (p && typeof p.catch === "function") {
        p.then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    };

    document.addEventListener("pointerdown", resume, true);
  }

  function togglePlay() {
    if (!tracks.length) return;

    if (audio.paused) {
      if (!audio.src) select(current, false);
      audio.muted = saved.muted;
      audio.volume = toLevel(saved.volume);

      const p = audio.play();

      if (p && typeof p.catch === "function") {
        p.then(() => setPlaying(true)).catch(() => {
          setPlaying(false);
          note("Appuie d'abord quelque part sur la page, puis relance la lecture.");
        });
      } else {
        setPlaying(true);
      }
    } else {
      audio.pause();
      setPlaying(false);
      updatePos();
    }
  }

  /* Coupe immédiate : le son s'arrête et le bouton revient sur lecture,
     mais la position est conservée : on reprend où on s'était arrêté. */
  function toggleMute() {
    saved.muted = !saved.muted;
    audio.muted = saved.muted;
    muteBtn.textContent = saved.muted ? "🔇" : "🔊";
    note(saved.muted ? "Son coupé — relance avec ✕ non, avec le curseur ou l'icône." : "Son rétabli.");
    persist();
  }

  function select(index, autoplay) {
    if (!tracks.length) return;

    current = Math.max(0, Math.min(tracks.length - 1, index));
    saved.track = current;

    audio.src = tracks[current].src;
    if (picker) picker.value = String(current);

    note(tracks[current].label);

    if (autoplay) {
      audio.muted = saved.muted;
      audio.volume = toLevel(saved.volume);
      audio.play().then(() => setPlaying(true)).catch(() => {
        setPlaying(false);
        note("Appuie d'abord quelque part sur la page, puis relance la lecture.");
      });
    }
  }

  const show = () => {
    if (!panel) return;
    panel.hidden = false;
    panel.classList.add("show");
    updatePos();
  };

  const hide = () => {
    if (!panel) return;
    panel.hidden = true;
    panel.classList.remove("show");
  };

  /* ---------------- Chargement de la liste ---------------- */

  async function loadTracks() {
    let text = "";

    try {
      const res = await fetch(PLAYLIST_URL, { cache: "no-store" });
      if (res.ok) text = await res.text();
    } catch {
      /* hors ligne : la liste restera vide */
    }

    tracks = text
      .split(/\r?\n/)
      .map(clean)
      .filter(line => line && !line.startsWith("#") && isAudio(line))
      .map(name => ({ src: srcOf(name), label: labelOf(name) }));

    if (!picker) return;

    picker.innerHTML = tracks.length
      ? tracks.map((t, i) => `<option value="${i}">${t.label.replace(/[<>&]/g, "")}</option>`).join("")
      : '<option value="0">Aucun son — ajoute un nom dans assets/music/playlist.txt</option>';

    picker.disabled = !tracks.length;

    if (tracks.length) select(Math.min(saved.track, tracks.length - 1), false);

    armResume();
  }

  /* ---------------- Bouton caché ---------------- */

  function bindSecretTrigger() {
    const brand = document.querySelector(".topbar .brand");
    if (!brand) return;

    let timer = null;

    const start = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        if (panel && panel.hidden) show();
        else hide();
      }, HOLD_MS);
    };

    const stop = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    brand.addEventListener("pointerdown", start);
    brand.addEventListener("pointerup", stop);
    brand.addEventListener("pointercancel", stop);
    brand.addEventListener("pointerleave", stop);
  }

  function init() {
    buildUI();
    bindSecretTrigger();
    loadTracks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
