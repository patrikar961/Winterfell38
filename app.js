/* =========================================================
   APP.JS — Boutique Corner69
   Catalogue, carrousel produit, variantes, panier, avis
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  const fmt = n =>
  Math.round(Number(n || 0)).toLocaleString("fr-FR") + "€";

  const esc = s =>
    String(s ?? "").replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));

  const TOAST_DURATION = 1500;

  const toast = msg => {
    const t = $("#toast");
    if (!t) return;

    // Annule tout ancien minuteur avant de relancer la notification
    clearTimeout(t._t);

    t.textContent = msg;
    t.classList.add("show");

    // Masque automatiquement la notification
    t._t = setTimeout(() => {
      t.classList.remove("show");
      t._t = null;
    }, TOAST_DURATION);
  };

  const mediaList = p => (Array.isArray(p.media) ? p.media.filter(Boolean) : []);

  const variantsOf = p =>
    Array.isArray(p.variants) && p.variants.length
      ? p.variants
      : [{ name: "Standard", price: null }];

  const variantPrice = (p, index) => {
    const v = variantsOf(p)[index] || variantsOf(p)[0];
    const raw = v ? v.price : null;

    return raw !== null && raw !== "" && Number.isFinite(Number(raw))
      ? Number(raw)
      : Number(p.price || 0);
  };

  const minPrice = p =>
    Math.min(...variantsOf(p).map((_, i) => variantPrice(p, i)));

  /* ---------------- Infos boutique ---------------- */

  const shopName = $("#shopName");
  if (shopName) shopName.textContent = SHOP.name;

  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const tgLink = $("#telegramLink");
  if (tgLink) tgLink.href = SHOP.telegram || "#contact";

  const wa = String(SHOP.whatsapp || "").replace(/\D/g, "");
  const waLink = $("#whatsappLink");

  if (waLink) {
    waLink.href = wa ? `https://wa.me/${wa}` : "#contact";
    waLink.addEventListener("click", e => {
      if (!wa) {
        e.preventDefault();
        toast("Ajoutez votre numéro WhatsApp dans products.js");
      }
    });
  }

  const waNote = $("#whatsappNote");
  if (waNote && wa) waNote.hidden = true;

  /* ---------------- Lecteur vidéo ---------------- */

  function buildPlayer() {
    const box = $("#player");
    if (!box) return;

    const titleEl = $("#videoTitle");
    if (titleEl) titleEl.textContent = VIDEO.title || "Vidéo";

    if (VIDEO.type === "youtube" || VIDEO.type === "vimeo") {
      const url = VIDEO.type === "youtube"
        ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(VIDEO.src)}?rel=0`
        : `https://player.vimeo.com/video/${encodeURIComponent(VIDEO.src)}`;

      box.innerHTML = `<iframe src="${url}" title="${esc(VIDEO.title || "Vidéo")}" loading="lazy" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
      return;
    }

    box.innerHTML = `<video playsinline preload="metadata" controls ${VIDEO.poster ? `poster="${esc(VIDEO.poster)}"` : ""}></video>`;

    const v = $("video", box);
    if (!v) return;

    /* Le lecteur suit les dimensions réelles du fichier vidéo.
       Cela évite de forcer une vidéo carrée dans un cadre 16:9. */
    const adaptPlayerRatio = () => {
      if (!v.videoWidth || !v.videoHeight) return;

      const ratio = v.videoWidth / v.videoHeight;
      box.style.aspectRatio = `${v.videoWidth} / ${v.videoHeight}`;
      box.classList.toggle("is-square", ratio >= 0.95 && ratio <= 1.05);
    };

    v.addEventListener("loadedmetadata", adaptPlayerRatio);
    v.addEventListener("resize", adaptPlayerRatio);

    const sources = [VIDEO.src, VIDEO.fallback].filter(Boolean);
    let idx = 0;
    let failed = false;

    const load = () => {
      if (idx < sources.length) {
        v.src = sources[idx];
        v.load();
      } else if (!failed) {
        failed = true;
        box.insertAdjacentHTML(
          "beforeend",
          '<p class="vp-error">Vidéo indisponible. Vérifiez VIDEO.src et VIDEO.fallback dans products.js.</p>'
        );
      }
    };

    v.addEventListener("error", () => {
      idx++;
      load();
    });

    load();
  }

  buildPlayer();

  /* ---------------- Catalogue ---------------- */

  const catSel = $("#category");

  (Array.isArray(CATEGORIES) ? CATEGORIES : []).forEach(c => {
    const o = document.createElement("option");
    o.value = c;
    o.textContent = c;
    catSel.appendChild(o);
  });

  function coverFor(p) {
    const first = mediaList(p)[0];

    /* cover : image dédiée à la vignette du catalogue (format portrait 3/4).
       Sans cover, on retombe sur la première photo, puis sur poster. */
    const src = p.cover
      || (first
        ? first.type === "image"
          ? first.src
          : first.poster || p.poster || ""
        : p.poster || "");

    if (src) {
      /* style : la même photo sert de fond flouté derrière elle, pour combler
         les bandes quand son format diffère de celui du cadre.
         Nouvelle tentative si le chargement échoue, puis repli sur l'emoji :
         plus jamais de carré noir vide à la place d'un produit. */
      return `<img src="${esc(src)}" alt="${esc(p.name)}" data-fallback="${esc(p.emoji || "✨")}" data-retry="0" decoding="async" style="--thumb-bg:url('${esc(src)}')" />`;
    }

    if (first && first.type === "video") {
      return `<video src="${esc(first.src)}" muted playsinline preload="metadata" aria-label="${esc(p.name)}"></video>`;
    }

    return `<span class="thumb-emoji" aria-hidden="true">${esc(p.emoji || "✨")}</span>`;
  }

  /* Si une vignette échoue, on retente une fois ; si ça échoue encore,
     l'emoji du produit prend sa place : plus jamais de carré noir. */
  function watchThumbs(root) {
    $$(".thumb img", root).forEach(img => {
      img.addEventListener("error", () => {
        if (img.dataset.retry === "0") {
          img.dataset.retry = "1";
          setTimeout(() => {
            const src = img.src.split("?")[0];
            img.src = src + "?r=" + Date.now();
          }, 800);
          return;
        }

        img.outerHTML = `<span class="thumb-emoji" aria-hidden="true">${esc(img.dataset.fallback || "✨")}</span>`;
      });
    });
  }

  function render() {
    const cat = catSel.value;

    const list = PRODUCTS.filter(p => !cat || p.category === cat).slice();

    /* Ordre fixe : « À la une », du plus petit numéro au plus grand. */
    list.sort((a, b) => (a.featured || 999) - (b.featured || 999));

    const grid = $("#grid");

    grid.innerHTML = list.length
      ? list.map(p => {
          const multi = variantsOf(p).length > 1;

          return `
            <article class="card product">
              <button class="product-open" data-detail="${p.id}" aria-label="Voir le détail de ${esc(p.name)}">
                <div class="thumb">${coverFor(p)}</div>
                <span class="cat">${esc(p.category)}</span>
                <h3>${esc(p.name)}</h3>
                <p class="muted">${esc(p.desc)}</p>
              </button>
              <span class="price">
                ${multi ? "À partir de " : ""}${fmt(minPrice(p))}
              </span>
              <button class="btn" data-detail="${p.id}" type="button">
                ${multi ? "Voir produit" : "Ajouter au panier"}
              </button>
            </article>
          `;
        }).join("")
      : '<p class="muted">Aucun produit dans cette catégorie.</p>';

    watchThumbs($("#grid"));
  }

  if (catSel) catSel.addEventListener("change", render);

  render();

  /* ---------------- Fiche produit + carrousel ---------------- */

  const productDialog = $("#productDialog");
  const track = $("#carouselTrack");
  const thumbsBox = $("#detailThumbs");
  const counter = $("#mediaCounter");

  let selectedProduct = null;
  let selectedVariant = 0;
  let mediaIndex = 0;

  const isEmbed = m => m && (m.type === "youtube" || m.type === "vimeo");

  const embedUrl = m =>
    m.type === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(m.src)}?rel=0`
      : `https://player.vimeo.com/video/${encodeURIComponent(m.src)}`;

  const mediaPoster = (p, m) => m.poster || p.poster || "";

  function slideFor(p, m) {
    if (!m) {
      return `
        <div class="carousel-slide">
          <div class="detail-placeholder">
            <span class="ph-emoji">${esc(p.emoji || "✨")}</span>
            <span>Ajoutez des photos ou vidéos dans products.js</span>
          </div>
        </div>
      `;
    }

    if (isEmbed(m)) {
      return `
        <div class="carousel-slide">
          <iframe
            src="${embedUrl(m)}"
            title="${esc(p.name)}"
            loading="lazy"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowfullscreen></iframe>
        </div>
      `;
    }

    if (m.type === "video") {
      const poster = mediaPoster(p, m);
      return `
        <div class="carousel-slide">
          <video controls playsinline preload="metadata" ${poster ? `poster="${esc(poster)}"` : ""}>
            <source src="${esc(m.src)}" type="video/mp4" />
            <source src="${esc(m.src)}" />
          </video>
        </div>
      `;
    }

    return `
      <div class="carousel-slide">
        <img src="${esc(m.src)}" alt="${esc(m.alt || p.name)}" loading="lazy" decoding="async" />
      </div>
    `;
  }

  /* Adapte la hauteur du cadre au format du média affiché.
     Une vidéo n'impose jamais sa forme : elle garde le cadre standard,
     sinon la fiche sursaute à chaque changement de média. */
  function fitCarousel() {
    const box = $("#detailGallery");
    const media = $("img", track) || $("video", track);
    if (!media) return;

    if (media.tagName === "VIDEO") {
      box.classList.remove("is-portrait");
      return;
    }

    const apply = () => {
      const w = media.naturalWidth;
      const h = media.naturalHeight;
      if (!w || !h) return;

      box.classList.toggle("is-portrait", h > w);
    };

    if (media.complete) {
      apply();
    } else {
      media.addEventListener("load", apply, { once: true });
    }
  }

  function paintCarousel() {
    const items = mediaList(selectedProduct);
    const total = items.length || 1;

    mediaIndex = Math.max(0, Math.min(total - 1, mediaIndex));

    track.innerHTML = total ? slideFor(selectedProduct, items[mediaIndex]) : "";

    /* Fond flouté du carrousel : uniquement pour les PHOTOS.
       Une vidéo ne doit jamais servir d'arrière-plan à elle-même :
       son cadre reste sombre, comme avant. */
    const m = items[mediaIndex];
    const slide = $(".carousel-slide", track);

    if (slide && m) {
      if (m.type === "image") {
        slide.style.setProperty("--slide-bg", `url('${esc(m.src)}')`);
      } else {
        slide.style.removeProperty("--slide-bg");
      }
    }

    fitCarousel();

    if (counter) counter.textContent = `${mediaIndex + 1} / ${total}`;

    $$(".carousel-nav").forEach(b => {
      b.hidden = total < 2;
    });

    $$(".detail-thumb", thumbsBox).forEach((t, i) => {
      const active = i === mediaIndex;
      t.classList.toggle("active", active);
      t.setAttribute("aria-current", active ? "true" : "false");
    });

    /* recentre la vignette active sans faire défiler la page */
    const activeThumb = $(".detail-thumb.active", thumbsBox);
    if (activeThumb && activeThumb.scrollIntoView) {
      try {
        activeThumb.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
      } catch {
        /* navigateurs anciens : on ignore */
      }
    }
  }

  function goMedia(index) {
    const items = mediaList(selectedProduct);
    const total = items.length;
    if (!total) return;

    mediaIndex = (index + total) % total;
    paintCarousel();
  }

  function buildThumbs() {
    const items = mediaList(selectedProduct);

    thumbsBox.innerHTML = items.map((m, i) => {
      const poster = mediaPoster(selectedProduct, m);

      const inner = m.type === "image"
        ? `<img src="${esc(m.src)}" alt="" loading="lazy" />`
        : poster
          ? `<img src="${esc(poster)}" alt="" loading="lazy" /><span class="thumb-play">▶</span>`
          : `<span class="thumb-play only">▶</span>`;

      return `
        <button class="detail-thumb" type="button" data-media-index="${i}" aria-label="Afficher le média ${i + 1}">
          ${inner}
        </button>
      `;
    }).join("");

    thumbsBox.hidden = items.length < 2;
  }

  function renderVariants() {
    const p = selectedProduct;
    const vars = variantsOf(p);
    const box = $("#detailVariants");

    box.innerHTML = vars.map((v, i) => `
      <button class="chip ${i === selectedVariant ? "active" : ""}" type="button"
              data-variant="${i}" aria-pressed="${i === selectedVariant}">
        <span class="chip-name">${esc(v.name)}</span>
        <span class="chip-price">${fmt(variantPrice(p, i))}</span>
      </button>
    `).join("");

    $("#variantWrap").hidden = vars.length < 2;
  }

  function updateDetailPrice() {
    if (!selectedProduct) return;

    const unit = variantPrice(selectedProduct, selectedVariant);
    const qty = Math.max(1, Math.min(99, parseInt($("#detailQty").value, 10) || 1));

    $("#detailPrice").innerHTML =
      `${fmt(unit)} <small class="muted">l'unité · total ${fmt(unit * qty)}</small>`;
  }

  /* Arrête toute vidéo du carrousel : sans ça, une vidéo de produit
     continue de jouer derrière la page après la fermeture de la fiche. */
  function pauseCarouselMedia() {
    $$("video", track).forEach(v => {
      try {
        v.pause();
      } catch {
        /* média déjà arrêté : on ignore */
      }
    });
  }

  function closeProduct() {
    if (productDialog && productDialog.open) productDialog.close();
  }

  function openProduct(id) {
    const p = PRODUCTS.find(x => String(x.id) === String(id));
    if (!p) return;

    selectedProduct = p;
    selectedVariant = 0;
    mediaIndex = 0;

    $("#detailTitle").textContent = p.name;
    $("#detailCategory").textContent = p.category;
    $("#detailDescription").textContent = p.desc || "";
    $("#detailQty").value = "1";

    buildThumbs();
    renderVariants();
    paintCarousel();
    updateDetailPrice();

    productDialog.showModal();
  }

  document.addEventListener("click", e => {
    const openBtn = e.target.closest("[data-detail]");
    if (openBtn) {
      openProduct(openBtn.dataset.detail);
      return;
    }

    const thumb = e.target.closest("[data-media-index]");
    if (thumb && selectedProduct) {
      goMedia(Number(thumb.dataset.mediaIndex));
      return;
    }

    const chip = e.target.closest("[data-variant]");
    if (chip && selectedProduct) {
      selectedVariant = Number(chip.dataset.variant);
      renderVariants();
      updateDetailPrice();
    }

    const closeBtn = e.target.closest("#closeProduct");
    if (closeBtn) {
      closeProduct();
      return;
    }

    /* Une vidéo du produit joue pendant la fermeture : on l'arrête,
       pour qu'elle ne continue pas derrière la page. */
    const addBtn = e.target.closest("#detailAdd");
    if (addBtn) pauseCarouselMedia();
  });

  if (productDialog) {
    productDialog.addEventListener("close", pauseCarouselMedia);

    /* Clic à côté de la fiche : on la referme aussi. */
    productDialog.addEventListener("click", e => {
      if (e.target === productDialog) closeProduct();
    });
  }

  $( "#mediaPrev" ).addEventListener("click", () => goMedia(mediaIndex - 1));
  $( "#mediaNext" ).addEventListener("click", () => goMedia(mediaIndex + 1));

  document.addEventListener("keydown", e => {
    if (!productDialog.open) return;

    if (e.key === "ArrowLeft") {
      goMedia(mediaIndex - 1);
    } else if (e.key === "ArrowRight") {
      goMedia(mediaIndex + 1);
    }
  });

  /* glissement du doigt sur le carrousel */
  (() => {
    const gallery = $("#detailGallery");
    if (!gallery) return;

    let startX = 0;
    let startY = 0;
    let tracking = false;

    gallery.addEventListener("touchstart", e => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      tracking = true;
    }, { passive: true });

    gallery.addEventListener("touchend", e => {
      if (!tracking) return;
      tracking = false;

      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      /* seuil horizontal : évite de changer de média pendant un scroll vertical */
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        goMedia(dx < 0 ? mediaIndex + 1 : mediaIndex - 1);
      }
    }, { passive: true });
  })();

  /* ---------------- Variantes & quantité : boutons ---------------- */

  document.addEventListener("click", e => {
    const step = e.target.closest("[data-step]");
    if (!step) return;

    const input = step.parentElement.querySelector("input[type=number]");
    if (!input) return;

    const min = parseInt(input.min || "1", 10);
    const max = parseInt(input.max || "99", 10);
    const next = (parseInt(input.value, 10) || 1) + Number(step.dataset.step);

    input.value = Math.max(min, Math.min(max, next));
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });

  document.addEventListener("input", e => {
    if (e.target.id === "detailQty") updateDetailPrice();
  });

  /* ---------------- Envoi de la commande a Make ----------------
     Envoi "fire and forget" : on ne bloque jamais le client, et un echec
     du webhook ne prive pas la commande de son canal WhatsApp. */
  function postOrderToMake(payload) {
    const url = String(SHOP.makeWebhook || "").trim();
    if (!url) return;

    try {
      /* Envoi en arriere-plan : la requete part, mais on n'attend pas la
         reponse avant d'ouvrir WhatsApp. Le client n'est jamais ralenti,
         et un echec de Make ne lui est jamais montre. */
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        mode: "cors"
      }).catch(() => {
        /* webhook injoignable : WhatsApp reste la garantie */
      });
    } catch {
      /* requete impossible : WhatsApp reste la garantie */
    }
  }

  /* ---------------- Panier ---------------- */

  const CART_KEY = "winterfell38_cart";

  const cart = new Map();

  const loadCart = () => {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

      (Array.isArray(raw) ? raw : []).forEach(item => {
        if (!item || !item.id || !item.qty) return;

        cart.set(String(item.id) + "|" + String(item.variant ?? 0), {
          id: String(item.id),
          variant: Number(item.variant ?? 0),
          qty: Math.max(1, Math.min(99, Number(item.qty) || 1))
        });
      });
    } catch {
      /* données locales illisibles : on repart d'un panier vide */
    }
  };

  const saveCart = () => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(Array.from(cart.values())));
    } catch {
      /* mode privé : le panier reste en mémoire */
    }
  };

  const findProduct = id => PRODUCTS.find(p => String(p.id) === String(id));

  const cartCount = () => Array.from(cart.values()).reduce((n, i) => n + i.qty, 0);

  const cartTotal = () =>
    Array.from(cart.values()).reduce((sum, i) => {
      const p = findProduct(i.id);
      if (!p) return sum;

      return sum + variantPrice(p, i.variant) * i.qty;
    }, 0);

  function addToCart(id, variant, qty) {
    const p = findProduct(id);
    if (!p) return;

    const key = String(id) + "|" + String(variant);
    const line = cart.get(key) || { id: String(id), variant: Number(variant), qty: 0 };

    line.qty = Math.max(1, Math.min(99, line.qty + qty));
    cart.set(key, line);

    saveCart();
    paintCart();

    toast("Ajouté au panier 🛒");
  }

  function paintCart() {
    const count = $("#cartCount");
    if (count) count.textContent = cartCount();

    const box = $("#cartItems");

    if (box) {
      box.innerHTML = cart.size
        ? Array.from(cart.values()).map(line => {
            const p = findProduct(line.id);
            if (!p) return "";

            const v = variantsOf(p)[line.variant] || variantsOf(p)[0];
            const unit = variantPrice(p, line.variant);

            return `
              <div class="line">
                <div class="line-info">
                  <strong>${esc(p.name)}</strong>
                  <small class="muted">${esc(v.name)} — ${fmt(unit)}</small>
                </div>
                <div class="qty">
                  <button type="button" data-line-minus="${esc(line.id)}|${line.variant}" aria-label="Diminuer">−</button>
                  <span>${line.qty}</span>
                  <button type="button" data-line-plus="${esc(line.id)}|${line.variant}" aria-label="Augmenter">+</button>
                </div>
                <span class="line-total">${fmt(unit * line.qty)}</span>
              </div>
            `;
          }).join("")
        : '<p class="muted">Votre panier est vide.</p>';
    }

    const total = $("#cartTotal");
    if (total) total.textContent = fmt(cartTotal());

    const orderTotal = $("#orderTotal");
    if (orderTotal) orderTotal.textContent = fmt(cartTotal());
  }

  function changeLine(payload, delta) {
    const line = cart.get(payload);
    if (!line) return;

    line.qty += delta;

    if (line.qty < 1) cart.delete(payload);
    else line.qty = Math.min(99, line.qty);

    saveCart();
    paintCart();
  }

  loadCart();
  paintCart();

  document.addEventListener("click", e => {
    const minus = e.target.closest("[data-line-minus]");
    const plus = e.target.closest("[data-line-plus]");

    if (minus) changeLine(minus.dataset.lineMinus, -1);
    if (plus) changeLine(plus.dataset.linePlus, 1);
  });

  /* Bouton « Ajouter au panier » de la fiche produit */

  const detailAdd = $("#detailAdd");

  if (detailAdd) {
    detailAdd.addEventListener("click", () => {
      if (!selectedProduct) return;

      const qty = Math.max(1, Math.min(99, parseInt($("#detailQty").value, 10) || 1));

      addToCart(selectedProduct.id, selectedVariant, qty);
    });
  }

  /* ---------------- Ouverture / fermeture du panier ---------------- */

  const drawer = $("#cart");
  const overlay = $("#overlay");

  function openCart() {
    if (!drawer) return;

    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    if (overlay) overlay.classList.add("show");
  }

  function closeCart() {
    if (!drawer) return;

    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    if (overlay) overlay.classList.remove("show");
  }

  const openCartBtn = $("#openCart");
  if (openCartBtn) openCartBtn.addEventListener("click", openCart);

  if (overlay) overlay.addEventListener("click", closeCart);

  $$("[data-close]").forEach(b => b.addEventListener("click", closeCart));

  /* ---------------- Commande ---------------- */

  const orderDialog = $("#orderDialog");
  const toOrder = $("#toOrder");

  if (toOrder && orderDialog) {
    toOrder.addEventListener("click", () => {
      if (!cart.size) {
        toast("Votre panier est vide");
        return;
      }

      closeCart();
      orderDialog.showModal();
    });
  }

  const orderForm = $("#orderForm");
  const submitOrder = $("#submitOrder");

  if (submitOrder && orderForm && orderDialog) {
    submitOrder.addEventListener("click", async () => {
      if (!orderForm.reportValidity()) return;

      const data = new FormData(orderForm);

      const lines = Array.from(cart.values()).map(line => {
        const p = findProduct(line.id);
        if (!p) return "";

        const v = variantsOf(p)[line.variant] || variantsOf(p)[0];
        const unit = variantPrice(p, line.variant);

        return `• ${p.name} (${v.name}) × ${line.qty} = ${fmt(unit * line.qty)}`;
      }).filter(Boolean).join("\n");

      const message = [
        "Nouvelle commande — " + SHOP.name,
        "",
        lines,
        "",
        "Total estimé : " + fmt(cartTotal()),
        "",
        "Nom / pseudo : " + (data.get("fullname") || "-"),
        "Téléphone : " + (data.get("phone") || "-"),
        "Adresse : " + (data.get("address") || "-"),
        "Mode de livraison : " + (data.get("shipping") || "-"),
        "Informations : " + (data.get("message") || "-")
      ].join("\n");

      /* ---------------- Commande vers Make ----------------
         Le site poste la commande sur le webhook Make, puis WhatsApp s'ouvre
         dans tous les cas : le client ne voit jamais d'echec, et la commande
         arrive sur les deux canaux. */

      const orderPayload = {
        source: "site",
        shop: SHOP.name,
        order_date: new Date().toLocaleString("fr-FR"),
        customer: {
          fullname: data.get("fullname") || "",
          email: data.get("email") || "",
          phone: data.get("phone") || "",
          address: data.get("address") || "",
          shipping: data.get("shipping") || "",
          message: data.get("message") || ""
        },
        items: Array.from(cart.values()).map(line => {
          const p = findProduct(line.id);
          if (!p) return null;

          const v = variantsOf(p)[line.variant] || variantsOf(p)[0];
          const unit = variantPrice(p, line.variant);

          return {
            product_id: Number(p.id),
            product_name: p.name,
            variant: v.name,
            quantity: line.qty,
            unit_price: unit,
            line_total: unit * line.qty
          };
        }).filter(Boolean),
        currency: SHOP.currency || "EUR",
        total: cartTotal()
      };

      postOrderToMake(orderPayload);

      const wa2 = String(SHOP.whatsapp || "").replace(/\D/g, "");

      const target = wa2
        ? `https://wa.me/${wa2}?text=${encodeURIComponent(message)}`
        : (SHOP.telegram ? `${SHOP.telegram}` : "");

      if (target) {
        window.open(target, "_blank", "noopener,noreferrer");
      }

      toast("Demande envoyée ✅");

      cart.clear();
      saveCart();
      paintCart();

      orderDialog.close();
      orderForm.reset();
    });
  }
})();
