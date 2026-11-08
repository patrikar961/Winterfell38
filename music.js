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

  /* Ouverture du lecteur : un simple clic sur la mention du pied de page
     (« © 2026 WINTERFELL38 »). Le logo, lui, ramène à l'accueil.
     Aucun bouton visible pour les visiteurs. */

  /* ---------------- Réglage du volume ----------------
     Le curseur va de 0 à 100. Position = pourcentage affiché.
     Le son reste volontairement discret : un fond, pas une sono.
     Position 0 = silence, 100 = maximum autorisé (0.70). */
  const GAIN_AT_HALF = 0.12;
  const BOOST_MAX = 0.35;

  const clamp01 = n => Math.max(0, Math.min(1, Number(n) || 0));

  /* position 0 → 1 transformée en volume réel.
     Montée régulière et plafonnée : le curseur reste utilisable sur toute
     sa course, et le son ne dépasse jamais un fond discret. */
  const toLevel = v => {
    const p = clamp01(v);

    if (p <= 0) return 0;

    if (p <= 0.5) return Math.round(GAIN_AT_HALF * (p / 0.5) * 1000) / 1000;

    return Math.round((GAIN_AT_HALF + (BOOST_MAX - GAIN_AT_HALF) * ((p - 0.5) / 0.5)) * 1000) / 1000;
  };

  let audio = null;
  let panel = null;
  let picker = null;
  let playBtn = null;
  let muteBtn = null;
  let volume = null;
  let volumeLabel = null;
  let tracks = [];
  let current = 0;
  let armed = false;
  let pausedByHide = false;

  let saved = { volume: 0.35, track: 0, muted: false, playing: false };

  try {
    saved = Object.assign(saved, JSON.parse(localStorage.getItem(STORE_KEY) || "{}"));

    /* ancienne échelle 0 → 1 : on la ramène sur la nouvelle */
    if (Number(saved.volume) <= 1) saved.volume = clamp01(Number(saved.volume) || 0.35);
    else saved.volume = clamp01(Number(saved.volume) / 100);
  } catch {
    /* préférences illisibles : on repart des valeurs par défaut */
  }

  if (!saved.volume) saved.volume = 0.35;

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

  /* Sous 3 % on considère le son coupé : c'est plus clair que « 2 % » */
  const isSilent = () => saved.volume <= 0 || toLevel(saved.volume) < 0.03;

  /* Suit la page : le panneau se replace au-dessus de la barre de navigation. */
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
      <div class="music-row music-vol-row">
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
    volumeLabel = panel.querySelector("[data-music-val]");

    audio = new Audio();
    /* "auto" au lieu de "none" : le son se télécharge dès l'ouverture
       de la page, sinon il démarre une à deux secondes après le clic. */
    audio.preload = "auto";
    audio.loop = false;

    applyVolume(false);

    playBtn.addEventListener("click", togglePlay);
    muteBtn.addEventListener("click", toggleMute);
    picker.addEventListener("change", () => select(Number(picker.value), true));

    /* Le curseur agit en direct : chaque cran se répercute tout de suite
       sur le son. On écrit le volume sans réécrire la position du curseur,
       sinon il revient en arrière pendant le glissement. */
    const onVolume = () => {
      saved.volume = clamp01(Number(volume.value) / 100);

      /* bouger le curseur rétablit le son : plus besoin de chercher le bouton */
      if (saved.volume > 0) saved.muted = false;

      audio.volume = Math.min(1, toLevel(saved.volume));
      audio.muted = saved.muted || isSilent();

      volumeLabel.textContent = Math.round(saved.volume * 100) + "%";
      muteBtn.textContent = audio.muted ? "🔇" : "🔊";

      persist();
    };

    volume.addEventListener("input", onVolume);
    volume.addEventListener("change", onVolume);

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
     Utilisé à l'ouverture : la position du curseur peut alors être écrite
     sans gêner personne. */
  function applyVolume(announce) {
    const level = toLevel(saved.volume);

    audio.volume = Math.min(1, level);
    audio.muted = saved.muted || isSilent();

    volume.value = String(Math.round(saved.volume * 100));
    volumeLabel.textContent = Math.round(saved.volume * 100) + "%";
    muteBtn.textContent = audio.muted ? "🔇" : "🔊";

    if (!announce) return;

    if (isSilent()) note("Son coupé.");
    else note(tracks[current] ? "Lecture : " + tracks[current].label : "");
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

  /* Le navigateur peut refuser la lecture automatique. On tente quand même
     tout de suite : le son étant déjà téléchargé, il part sans attente.
     Si c'est refusé, la lecture reprend au premier appui. */
  function armResume() {
    if (armed) return;
    if (!saved.playing || !tracks.length) return;

    armed = true;

    audio.muted = saved.muted || isSilent();
    audio.volume = Math.min(1, toLevel(saved.volume));

    const start = () => {
      const p = audio.play();

      if (p && typeof p.catch === "function") {
        p.then(() => setPlaying(true)).catch(() => {
          /* Refus de lecture automatique : on reprend au premier appui. */
          const resume = () => {
            document.removeEventListener("pointerdown", resume, true);
            armed = false;

            audio.muted = saved.muted || isSilent();
            audio.volume = Math.min(1, toLevel(saved.volume));

            const q = audio.play();
            if (q && typeof q.catch === "function") {
              q.then(() => setPlaying(true)).catch(() => setPlaying(false));
            }
          };

          document.addEventListener("pointerdown", resume, true);
        });
      } else {
        setPlaying(true);
      }
    };

    /* Si les métadonnées ne sont pas encore arrivées, on attend qu'elles
       le soient : la lecture démarre alors immédiatement après. */
    if (audio.readyState >= 1) start();
    else audio.addEventListener("loadedmetadata", start, { once: true });
  }

  function togglePlay() {
    if (!tracks.length) return;

    if (audio.paused) {
      if (!audio.src) select(current, false);
      audio.muted = saved.muted || isSilent();
      audio.volume = Math.min(1, toLevel(saved.volume));

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

  /* Coupe immédiate : le son s'arrête, la position est conservée. */
  function toggleMute() {
    saved.muted = !saved.muted;
    audio.muted = saved.muted || isSilent();
    muteBtn.textContent = audio.muted ? "🔇" : "🔊";
    note(audio.muted ? "Son coupé." : "Son rétabli.");
    persist();
  }

  function select(index, autoplay) {
    if (!tracks.length) return;

    current = Math.max(0, Math.min(tracks.length - 1, index));
    saved.track = current;

    audio.src = tracks[current].src;
    if (picker) picker.value = String(current);

    note("Lecture : " + tracks[current].label);

    if (autoplay) {
      audio.muted = saved.muted || isSilent();
      audio.volume = Math.min(1, toLevel(saved.volume));
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

  const togglePanel = () => {
    if (panel && panel.hidden) show();
    else hide();
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

  /* ---------------- Ouverture au clic sur le pied de page ---------------- */

  function bindTrigger() {
    const footer = document.querySelector("footer");
    if (!footer) return;

    footer.classList.add("music-trigger");
    footer.setAttribute("role", "button");
    footer.setAttribute("tabindex", "0");
    footer.setAttribute("aria-label", "Ouvrir le fond sonore");

    footer.addEventListener("click", event => {
      event.preventDefault();
      togglePanel();
    });

    footer.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      togglePanel();
    });
  }

  /* ---------------- Silence hors de l'onglet ----------------
     Dès que la page n'est plus visible, le son se coupe. Il reprend au
     retour, uniquement s'il jouait avant : une pause voulue par la
     personne qui écoute n'est jamais annulée. */
  function bindVisibility() {
    const pauseIfPlaying = () => {
      if (!audio || audio.paused) {
        pausedByHide = false;
        return;
      }

      pausedByHide = true;
      audio.pause();
    };

    const resumeIfNeeded = () => {
      if (!pausedByHide || !audio) return;

      pausedByHide = false;

      audio.muted = saved.muted || isSilent();
      audio.volume = Math.min(1, toLevel(saved.volume));

      const p = audio.play();

      if (p && typeof p.catch === "function") p.catch(() => setPlaying(false));
    };

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) pauseIfPlaying();
      else resumeIfNeeded();
    });

    /* Certains navigateurs mobiles ne déclenchent pas visibilitychange :
       la sortie de page couvre ces cas-là. */
    window.addEventListener("pagehide", pauseIfPlaying);
    window.addEventListener("blur", pauseIfPlaying);
  }

  function init() {
    buildUI();
    bindTrigger();
    bindVisibility();
    loadTracks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
