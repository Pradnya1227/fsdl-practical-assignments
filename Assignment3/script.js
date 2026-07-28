const PRODUCTS = [
    { id: 1, name: "Citrus Royale", category: "citrus", notes: "Lemon • Bergamot • Neroli", price: 1299, rating: 4.8, ml: 50, tag: "Best Seller" },
    { id: 2, name: "Green Gallery", category: "green", notes: "Green Tea • Fig Leaf • Basil", price: 1199, rating: 4.6, ml: 50, tag: "Fresh" },
    { id: 3, name: "Garden Musk", category: "floral", notes: "Peony • Jasmine • Clean Musk", price: 1399, rating: 4.7, ml: 50, tag: "Soft" },
    { id: 4, name: "Mint Oud", category: "oud", notes: "Mint • Amber • Oud", price: 1699, rating: 4.9, ml: 50, tag: "Royal" },
    { id: 5, name: "Lime Courtyard", category: "citrus", notes: "Lime • Petitgrain • Cedar", price: 1099, rating: 4.5, ml: 30, tag: "Value" },
    { id: 6, name: "Rose Atrium", category: "floral", notes: "Rose • Pear • White Woods", price: 1499, rating: 4.6, ml: 50, tag: "Elegant" },
    { id: 7, name: "Verdant Mist", category: "green", notes: "Matcha • Fern • Vetiver", price: 1599, rating: 4.7, ml: 50, tag: "Modern" },
    { id: 8, name: "Amber Throne", category: "oud", notes: "Amber • Vanilla • Cedar", price: 1799, rating: 4.6, ml: 50, tag: "Warm" },
];

const state = {
    filter: "all",
    sort: "featured",
    query: "",
    cart: JSON.parse(localStorage.getItem("pp_cart") || "[]"),
};

const el = (id) => document.getElementById(id);

function formatINR(n) {
    return "₹" + n.toLocaleString("en-IN");
}

function saveCart() {
    localStorage.setItem("pp_cart", JSON.stringify(state.cart));
}

function cartCount() {
    return state.cart.reduce((sum, item) => sum + item.qty, 0);
}

function subtotal() {
    return state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function shippingCost(sub) {
    return sub >= 999 || sub === 0 ? 0 : 60;
}

function totalCost() {
    const sub = subtotal();
    return sub + shippingCost(sub);
}

function renderProducts() {
    const grid = el("productGrid");
    if (!grid) return;

    let list = [...PRODUCTS];

    // filter
    if (state.filter !== "all") {
        list = list.filter(p => p.category === state.filter);
    }

    // search
    const q = state.query.trim().toLowerCase();
    if (q) {
        list = list.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.notes.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.tag.toLowerCase().includes(q)
        );
    }

    // sort
    if (state.sort === "priceLow") list.sort((a, b) => a.price - b.price);
    if (state.sort === "priceHigh") list.sort((a, b) => b.price - a.price);
    if (state.sort === "rating") list.sort((a, b) => b.rating - a.rating);

    grid.innerHTML = list.map(p => `
    <div class="col-md-6 col-lg-3">
      <div class="product-card">
        <div class="product-media">
          <span class="product-pill">${p.tag} • ${p.ml}ml</span>
        </div>
        <div class="product-body">
          <h3 class="product-name">${p.name}</h3>
          <p class="product-notes">${p.notes}</p>
          <div class="product-meta">
            <div class="price">${formatINR(p.price)}</div>
            <div class="rating">★ ${p.rating.toFixed(1)} • ${p.category}</div>
          </div>

          <div class="product-actions">
            <button class="btn btn-gold flex-fill" data-add="${p.id}">Add to cart</button>
            <button class="btn btn-ghost" data-like="${p.id}" title="Wishlist">♡</button>
          </div>
        </div>
      </div>
    </div>
  `).join("");

    // bind buttons
    grid.querySelectorAll("[data-add]").forEach(btn => {
        btn.addEventListener("click", () => addToCart(Number(btn.dataset.add)));
    });

    grid.querySelectorAll("[data-like]").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.textContent = btn.textContent.trim() === "♡" ? "♥" : "♡";
        });
    });
}

function addToCart(productId) {
    const p = PRODUCTS.find(x => x.id === productId);
    if (!p) return;

    const existing = state.cart.find(i => i.id === productId);
    if (existing) existing.qty += 1;
    else state.cart.push({ id: p.id, name: p.name, price: p.price, qty: 1, category: p.category });

    saveCart();
    renderCart();
    pulseCartCount();
}

function updateQty(productId, delta) {
    const item = state.cart.find(i => i.id === productId);
    if (!item) return;
    item.qty += delta;

    if (item.qty <= 0) {
        state.cart = state.cart.filter(i => i.id !== productId);
    }

    saveCart();
    renderCart();
}

function clearCart() {
    state.cart = [];
    saveCart();
    renderCart();
}

function renderCart() {
    const items = el("cartItems");
    const countEl = el("cartCount");
    const subEl = el("cartSubtotal");
    const shipEl = el("cartShipping");
    const totalEl = el("cartTotal");

    if (countEl) countEl.textContent = cartCount();

    if (!items) return;

    if (state.cart.length === 0) {
        items.innerHTML = `<div class="muted">Your cart is empty. Add something royal ✨</div>`;
    } else {
        items.innerHTML = state.cart.map(i => `
      <div class="cart-item">
        <div class="cart-thumb"></div>
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between gap-2">
            <div>
              <div class="fw-semibold">${i.name}</div>
              <div class="small muted">${formatINR(i.price)} • ${i.category}</div>
            </div>
            <div class="fw-semibold">${formatINR(i.price * i.qty)}</div>
          </div>
          <div class="d-flex align-items-center gap-2 mt-2">
            <button class="btn btn-ghost btn-sm" data-dec="${i.id}">−</button>
            <div class="small fw-semibold">${i.qty}</div>
            <button class="btn btn-ghost btn-sm" data-inc="${i.id}">+</button>
            <button class="btn btn-ghost btn-sm ms-auto" data-remove="${i.id}">Remove</button>
          </div>
        </div>
      </div>
    `).join("");

        items.querySelectorAll("[data-inc]").forEach(b => b.addEventListener("click", () => updateQty(Number(b.dataset.inc), +1)));
        items.querySelectorAll("[data-dec]").forEach(b => b.addEventListener("click", () => updateQty(Number(b.dataset.dec), -1)));
        items.querySelectorAll("[data-remove]").forEach(b => b.addEventListener("click", () => {
            const id = Number(b.dataset.remove);
            state.cart = state.cart.filter(i => i.id !== id);
            saveCart();
            renderCart();
        }));
    }

    const sub = subtotal();
    const ship = shippingCost(sub);
    const total = sub + ship;

    if (subEl) subEl.textContent = formatINR(sub);
    if (shipEl) shipEl.textContent = formatINR(ship);
    if (totalEl) totalEl.textContent = formatINR(total);
}

function pulseCartCount() {
    const badge = el("cartCount");
    if (!badge) return;
    badge.animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.15)" }, { transform: "scale(1)" }],
        { duration: 260 }
    );
}

function bindFilters() {
    document.querySelectorAll(".btn-filter").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".btn-filter").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            state.filter = btn.dataset.filter;
            renderProducts();
        });
    });

    const sortSelect = el("sortSelect");
    if (sortSelect) {
        sortSelect.addEventListener("change", () => {
            state.sort = sortSelect.value;
            renderProducts();
        });
    }
}

function bindModalsAndCanvas() {
    const searchModalEl = document.getElementById("searchModal");
    const newsletterModalEl = document.getElementById("newsletterModal");
    const cartCanvasEl = document.getElementById("cartCanvas");

    const searchModal = searchModalEl ? new bootstrap.Modal(searchModalEl) : null;
    const newsletterModal = newsletterModalEl ? new bootstrap.Modal(newsletterModalEl) : null;
    const cartCanvas = cartCanvasEl ? new bootstrap.Offcanvas(cartCanvasEl) : null;

    el("openSearchBtn")?.addEventListener("click", () => searchModal?.show());
    el("openNewsletterBtn")?.addEventListener("click", () => newsletterModal?.show());
    el("openCartBtn")?.addEventListener("click", () => cartCanvas?.show());

    // Search run
    const runSearch = () => {
        state.query = el("searchInput")?.value || "";
        renderProducts();
        searchModal?.hide();
    };

    el("runSearchBtn")?.addEventListener("click", runSearch);
    el("searchInput")?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") runSearch();
    });

    // Newsletter
    el("joinNewsletterBtn")?.addEventListener("click", () => {
        const email = el("newsletterEmail")?.value?.trim();
        const status = el("newsletterStatus");
        if (!status) return;

        if (!email || !email.includes("@")) {
            status.textContent = "Please enter a valid email.";
            status.className = "small text-danger mt-2";
            return;
        }

        status.textContent = "Joined! Welcome to the palace ✨";
        status.className = "small text-success mt-2";
        setTimeout(() => newsletterModal?.hide(), 700);
    });

    // Cart actions
    el("clearCartBtn")?.addEventListener("click", clearCart);
    el("checkoutBtn")?.addEventListener("click", () => {
        const status = el("checkoutStatus");
        if (!status) return;

        if (state.cart.length === 0) {
            status.textContent = "Cart is empty.";
            return;
        }
        status.textContent = "Checkout demo: order placed (mock).";
        setTimeout(() => {
            clearCart();
            status.textContent = "";
            cartCanvas?.hide();
        }, 900);
    });
}

function bindContactForm() {
    const form = el("contactForm");
    const status = el("contactStatus");
    if (!form || !status) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        status.textContent = "Sent! We’ll reply soon.";
        setTimeout(() => (status.textContent = ""), 1500);
        form.reset();
    });
}

function init() {
    el("year").textContent = new Date().getFullYear();

    bindFilters();
    bindModalsAndCanvas();
    bindContactForm();

    renderProducts();
    renderCart();
}

document.addEventListener("DOMContentLoaded", init);