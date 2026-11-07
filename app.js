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

  const toast = msg => {
    const t = $("#toast");
    if (!t) return;

    // Annule tout ancien minuteur avant de relancer la notification
    clearTimeout(t._t);

    t.textContent = msg;
    t.classList.add("show");

    // Masque automatiquement la notification après 2 secondes
    t._t = setTimeout(() => {
      t.classList.remove("show");
      t._t = null;
    }, 2000);
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
  });

  $("#mediaPrev").addEventListener("click", () => goMedia(mediaIndex - 1));
  $("#mediaNext").addEventListener("click", () => goMedia(mediaIndex + 1));

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
    let startX = 0;
    let startY = 0;
    let tracking = false;

    gallery.addEventListener("touchstart", e => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      tracking = true;
    }, { passive: true });

    gallery.addEventListener("touchend", e => {
      if (!tracking) return;
      tracking = false;

      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        goMedia(dx < 0 ? mediaIndex + 1 : mediaIndex - 1);
      }
    }, { passive: true });
  })();

  /* quantité : boutons − / + */
  $$("[data-stepper]").forEach(box => {
    const input = $("input", box);

    $$("button", box).forEach(b => {
      b.addEventListener("click", () => {
        const step = Number(b.dataset.step) || 0;
        const next = Math.max(1, Math.min(99, (parseInt(input.value, 10) || 1) + step));
        input.value = String(next);
        updateDetailPrice();
      });
    });

    input.addEventListener("input", updateDetailPrice);
    input.addEventListener("change", () => {
      input.value = String(Math.max(1, Math.min(99, parseInt(input.value, 10) || 1)));
      updateDetailPrice();
    });
  });

  $("#closeProduct").addEventListener("click", () => productDialog.close());

  productDialog.addEventListener("click", e => {
    if (e.target === productDialog) productDialog.close();
  });

  /* ---------------- Panier ---------------- */

  let cart = {};

  try {
    cart = JSON.parse(localStorage.getItem("cart") || "{}") || {};
  } catch {
    cart = {};
  }

  const cartKey = (id, vi) => `${id}::${vi}`;

  const parseKey = key => {
    const [id, vi] = String(key).split("::");
    return { id, vi: Number(vi || 0) };
  };

  const save = () => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {
      /* stockage indisponible : le panier reste en mémoire */
    }
  };

  const cartRows = () =>
    Object.entries(cart)
      .map(([key, q]) => {
        const { id, vi } = parseKey(key);
        const p = PRODUCTS.find(x => String(x.id) === id);

        return {
          key,
          id,
          vi,
          p,
          q: Number(q),
          price: p ? variantPrice(p, vi) : 0
        };
      })
      .filter(x => x.p && x.q > 0);

  const total = () => cartRows().reduce((sum, x) => sum + x.price * x.q, 0);

  function renderCart() {
    const items = cartRows();

    $("#cartItems").innerHTML = items.length
      ? items.map(x => {
          const v = variantsOf(x.p)[x.vi] || variantsOf(x.p)[0];

          return `
            <div class="line">
              <span class="line-info">
                <strong>${esc(x.p.emoji || "")} ${esc(x.p.name)}</strong>
                <small class="muted">${esc(v.name)} · ${fmt(x.price)} / unité</small>
              </span>
              <span class="qty">
                <button type="button" data-dec="${esc(x.key)}" aria-label="Retirer un article">−</button>
                ${x.q}
                <button type="button" data-inc="${esc(x.key)}" aria-label="Ajouter un article">+</button>
              </span>
              <strong class="line-total">${fmt(x.price * x.q)}</strong>
            </div>
          `;
        }).join("")
      : '<p class="muted">Votre panier est vide.</p>';

    $("#cartCount").textContent = items.reduce((sum, x) => sum + x.q, 0);
    $("#cartTotal").textContent = fmt(total());
    $("#orderTotal").textContent = fmt(total());
  }

  function addToCart(id, vi, qty = 1) {
    const key = cartKey(id, vi);
    cart[key] = (cart[key] || 0) + qty;
    save();
    renderCart();
    toast("Ajouté au panier 🛍️");
  }

  $("#detailAdd").addEventListener("click", () => {
    if (!selectedProduct) return;

    const qty = Math.max(1, Math.min(99, parseInt($("#detailQty").value, 10) || 1));

    addToCart(selectedProduct.id, selectedVariant, qty);
    productDialog.close();
  });

  document.addEventListener("click", e => {
    const d = e.target.dataset;

    if (d.inc) {
      cart[d.inc] = (cart[d.inc] || 0) + 1;
      save();
      renderCart();
    } else if (d.dec) {
      cart[d.dec] = (cart[d.dec] || 0) - 1;
      if (cart[d.dec] <= 0) delete cart[d.dec];
      save();
      renderCart();
    }
  });

  const drawer = $("#cart");
  const overlay = $("#overlay");

  const openCart = () => {
    drawer.classList.add("open");
    overlay.classList.add("show");
    drawer.setAttribute("aria-hidden", "false");
  };

  const closeCart = () => {
    drawer.classList.remove("open");
    overlay.classList.remove("show");
    drawer.setAttribute("aria-hidden", "true");
  };

  $("#openCart").addEventListener("click", openCart);
  overlay.addEventListener("click", closeCart);

  $$("[data-close]", drawer).forEach(b => b.addEventListener("click", closeCart));

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeCart();
  });

  renderCart();

  /* ---------------- Commande ---------------- */

  const dlg = $("#orderDialog");
  const form = $("#orderForm");
  const submit = $("#submitOrder");

  $("#toOrder").addEventListener("click", () => {
    if (!cartRows().length) {
      toast("Votre panier est vide");
      return;
    }

    closeCart();
    dlg.showModal();
  });

  submit.addEventListener("click", async () => {
    if (!form.reportValidity()) return;

    if (!MAKE_WEBHOOK_URL || !/^https:\/\/hook\.[^/]+\.make\.com\//.test(MAKE_WEBHOOK_URL)) {
      toast("Configurez l'URL du webhook Make dans products.js");
      return;
    }

    const f = new FormData(form);
    const rows = cartRows();

    const payload = {
      source: "corner69-site",
      shop: SHOP.name,
      order_date: new Date().toISOString(),
      customer: {
        fullname: String(f.get("fullname") || "").trim(),
        email: String(f.get("email") || "").trim(),
        phone: String(f.get("phone") || "").trim(),
        address: String(f.get("address") || "").trim(),
        shipping: String(f.get("shipping") || ""),
        message: String(f.get("message") || "").trim()
      },
      items: rows.map(x => ({
        product_id: x.p.id,
        product_name: x.p.name,
        variant: (variantsOf(x.p)[x.vi] || {}).name || "Standard",
        quantity: x.q,
        unit_price: x.price,
        line_total: Math.round(x.price * x.q * 100) / 100
      })),
      currency: SHOP.currency,
      total: Math.round(total() * 100) / 100
    };

    submit.disabled = true;
    submit.textContent = "Envoi en cours…";

    try {
      const response = await fetch(MAKE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      dlg.close();
      form.reset();
      cart = {};
      save();
      renderCart();
      toast("Commande transmise avec succès");
    } catch (err) {
      console.error("Webhook error:", err);
      toast("Échec de l'envoi. Vérifiez le webhook Make et réessayez.");
    } finally {
      submit.disabled = false;
      submit.textContent = "Préparer la demande";
    }
  });

  /* ---------------- Avis ---------------- */

  const local = () => {
    try {
      return JSON.parse(localStorage.getItem("reviews") || "[]");
    } catch {
      return [];
    }
  };

  function renderReviews() {
    $("#reviews").innerHTML = [...SAMPLE_REVIEWS, ...local()]
      .map(r => {
        const rating = Math.max(0, Math.min(5, Number(r.rating) || 0));

        return `
          <div class="card review">
            <div class="review-head">
              <strong>${esc(r.name)}</strong>
              <span class="tag">${r.sample ? "Livré(e) 🚚" : "En cours de traitement"}</span>
            </div>
            <div class="stars" aria-label="${rating} sur 5">
              ${"★".repeat(rating)}${"☆".repeat(5 - rating)}
            </div>
            <p>${esc(r.text)}</p>
          </div>
        `;
      }).join("");
  }

  $("#reviewForm").addEventListener("submit", e => {
    e.preventDefault();

    const f = new FormData(e.target);
    const review = {
      name: String(f.get("name") || "").trim(),
      rating: Math.min(5, Math.max(1, Number(f.get("rating")) || 5)),
      text: String(f.get("text") || "").trim()
    };

    if (!review.name || !review.text) return;

    try {
      localStorage.setItem("reviews", JSON.stringify([...local(), review]));
    } catch {
      /* stockage indisponible */
    }

    e.target.reset();
    renderReviews();
    toast("Avis ajouté sur cet appareil");
  });

  renderReviews();
})();