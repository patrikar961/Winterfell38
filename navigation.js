
/* =========================================================
   NAVIGATION CORNER69
   Pages séparées — conserve les éléments et fonctions existants
   ========================================================= */

(() => {
  "use strict";

  const main = document.querySelector("main");
  if (!main) return;

  const hero = main.querySelector(".hero");
  const video = main.querySelector("#video");
  const catalogue = main.querySelector("#catalogue");
  const avis = main.querySelector("#avis");
  const contact = main.querySelector("#contact");

  if (!hero || !video || !catalogue || !avis || !contact) return;

  /* Création des pages */
  const homePage = document.createElement("div");
  homePage.id = "page-home";
  homePage.className = "page-view";

  const avisPage = document.createElement("div");
  avisPage.id = "page-avis";
  avisPage.className = "page-view";
  
  const aboutPage = document.createElement("div");
  aboutPage.id = "page-about";
  aboutPage.className = "page-view";

  const contactPage = document.createElement("div");
  contactPage.id = "page-contact";
  contactPage.className = "page-view";

  /* Déplacement des sections originales : aucun contenu supprimé */
  homePage.append(hero, video, catalogue);
  avisPage.append(avis);
  contactPage.append(contact);

  /* Nouvelle rubrique À propos */
  aboutPage.innerHTML = `
    <section class="section about-section">
      <h2>À propos de WINTERFELL38 ❄️</h2>

      <article class="card about-card">
        <p class="badge">👇 A PROPOS DE NOUS</p>
        <h3>WNTFELL 38 🥇 — LA RÉF DU MOMENT</h3>
        <p class="muted">
          La famille, bienvenue dans la planque. 🤝🏴‍☠️
        </p>
        <p class="muted">
          📲 <strong>Menu actualisé quotidiennement</strong> — retrouvez chaque
          jour les dernières nouveautés directement dans le menu.
        </p>
        <p class="muted">
          🚘 <strong>Livraison sur L'isle d'Abeau,Bourgoin-Jallieux, Villefontaine et alentours</strong> — un service
          rapide et discret, selon disponibilité.
        </p>
        <p class="muted">
          🕛 <strong>Ouvert de 12h à 01h</strong> — 7/7.
        </p>
        <p class="muted">
          🔔 Restez connecté pour ne rien manquer.
        </p>
      </article>

      <article class="card about-card">
        <h3>🚚 Livraison</h3>
        <p class="muted">
          Nous livrons sur L'isle d'Abeau,Bourgoin-Jallieux, Villefontaine et alentours, de 12h à 01h. Les frais
          éventuels dépendent de votre zone : ils vous sont indiqués avant la
          validation de la commande, jamais après.
        </p>
        <p class="muted">
          Chaque demande est traitée individuellement. Vous êtes recontacté
          par le canal de votre choix pour convenir du créneau et du lieu.
        </p>
      </article>

      <article class="card about-card">
        <p class="badge">COMMENT COMMANDER ? </p>
        <h3>💬 Commander en quelques clics</h3>

        <ol class="about-steps">
          <li>Parcourez le menu et ouvrez la fiche du produit qui vous intéresse.</li>
          <li>Choisissez votre produit et la quantité, puis ajoutez au panier.</li>
          <li>Renseignez vos informations dans la demande de commande.</li>
          <li>Validez : votre demande nous est transmise immédiatement.</li>
        </ol>

        <p class="about-warning">
          ⚠️ Vérifiez bien les informations renseignées : nom, téléphone,
          adresse et produit choisi. Une erreur de saisie peut retarder votre
          livraison.
        </p>

        <p class="muted">
          ✅ Ensuite, <strong>attendez notre message de confirmation</strong>
          sur Telegram ou WhatsApp. Votre commande n'est validée qu'à partir
          de ce message.
        </p>

        <p class="muted">
          📲 Pour commander sans difficulté, installez les deux applications :
          <strong>Telegram</strong> et <strong>WhatsApp</strong>. Certaines
          demandes passent par l'une ou l'autre selon la disponibilité.
        </p>

        <a class="btn about-cta" href="#contact" data-goto="contact">
          📲 Ouvrir les contacts
        </a>
      </article>

      <article class="card about-card">
        <h3>🔐 VERIFICATION NOUVEAU CLIENT</h3>
        <p class="muted">
          Si une vérification est nécessaire, ses modalités doivent vous
          être communiquées individuellement par un canal privé adapté.
        </p>
        <p class="muted">
          Ne publiez jamais de pièce d'identité, de selfie ou de document
          personnel dans un canal ou un groupe public.
        </p>
        <p class="muted">
          Avant toute transmission de données personnelles, demandez
          quelles informations sont nécessaires, comment elles sont
          protégées et combien de temps elles sont conservées.
        </p>
      </article>
    </section>
  `;

  

  /* Installation des pages dans le main */
  main.replaceChildren(homePage, avisPage, aboutPage, contactPage);

  /* Barre de navigation */
  const dock = document.createElement("nav");
  dock.className = "bottom-dock";
  dock.setAttribute("aria-label", "Navigation principale");

  dock.innerHTML = `
    <button type="button" class="dock-link active" data-page="home">
      <span class="dock-icon">⌂</span>
      <span>Accueil</span>
    </button>

    <button type="button" class="dock-link" data-page="avis">
      <span class="dock-icon">★</span>
      <span>Avis</span>
    </button>

    <button type="button" class="dock-link" data-page="about">
      <span class="dock-icon">ⓘ</span>
      <span>À propos</span>
    </button>

    <button type="button" class="dock-link" data-page="contact">
      <span class="dock-icon">✉</span>
      <span>Contact</span>
    </button>

    <button type="button" class="dock-link" data-cart>
      <span class="dock-icon">🛒</span>
      <span>Panier</span>
    </button>
  `;

  document.body.appendChild(dock);

  const pages = {
    home: homePage,
    avis: avisPage,
    about: aboutPage,
    contact: contactPage
  };

  function showPage(name, target) {
    if (!pages[name]) return;

    Object.entries(pages).forEach(([key, page]) => {
      page.hidden = key !== name;
    });

    dock.querySelectorAll("[data-page]").forEach(button => {
      const active = button.dataset.page === name;
      button.classList.toggle("active", active);
      button.setAttribute("aria-current", active ? "page" : "false");
    });

    if (target) {
      const element = document.querySelector(target);
      if (element) {
        requestAnimationFrame(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  /* Navigation du menu inférieur */
  dock.addEventListener("click", event => {
    const pageButton = event.target.closest("[data-page]");
    const cartButton = event.target.closest("[data-cart]");

    if (pageButton) {
      showPage(pageButton.dataset.page);
    }

    if (cartButton) {
      const existingCartButton = document.getElementById("openCart");
      if (existingCartButton) existingCartButton.click();
    }
  });

  /* Liens du menu supérieur */
  document.querySelectorAll(".topbar nav a").forEach(link => {
    link.addEventListener("click", event => {
      const href = link.getAttribute("href");

      if (href === "#avis") {
        event.preventDefault();
        showPage("avis");
      } else if (href === "#contact") {
        event.preventDefault();
        showPage("contact");
      } else if (href === "#video" || href === "#catalogue") {
        event.preventDefault();
        showPage("home", href);
      }
    });
  });

  /* Boutons de la page À propos : renvoi vers une autre page */
  document.querySelectorAll("[data-goto]").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      showPage(button.dataset.goto);
    });
  }); 

  /* Bouton Voir le menu */
  document.querySelectorAll('.hero a[href="#catalogue"]').forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      showPage("home", "#catalogue");
    });
  });

  /* Logo : retour à l'accueil */
  const brand = document.querySelector(".topbar .brand");
  if (brand) {
    brand.addEventListener("click", event => {
      event.preventDefault();
      showPage("home");
    });
  }

  /* Première ouverture */
  showPage("home");
})();
