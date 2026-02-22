// z-lux PARFUMERIE — smooth scroll, cart overlay, search, add/remove items

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ----- Search -----
const searchOverlay = document.getElementById("search-overlay");
const searchBtn = document.getElementById("search-btn");
const searchClose = document.getElementById("search-close");
const searchInput = document.getElementById("search-input");
const productCards = document.querySelectorAll(".product-card");

function openSearch() {
  searchOverlay.classList.add("is-open");
  searchOverlay.setAttribute("aria-hidden", "false");
  searchInput.value = "";
  filterProductsBySearch("");
  searchInput.focus();
}

function closeSearch() {
  searchOverlay.classList.remove("is-open");
  searchOverlay.setAttribute("aria-hidden", "true");
  filterProductsBySearch("");
}

function filterProductsBySearch(query) {
  const q = (query || "").trim().toLowerCase();
  productCards.forEach((card) => {
    const searchText = (card.getAttribute("data-search") || card.querySelector(".product-name")?.textContent || "").toLowerCase();
    const match = !q || searchText.includes(q);
    card.classList.toggle("is-hidden-by-search", !match);
  });
}

if (searchBtn) {
  searchBtn.addEventListener("click", openSearch);
}

if (searchClose) {
  searchClose.addEventListener("click", closeSearch);
}

if (searchInput) {
  searchInput.addEventListener("keydown", function () {
    filterProductsBySearch(this.value);
  });
  searchInput.addEventListener("input", function () {
    filterProductsBySearch(this.value);
  });
}

searchOverlay.addEventListener("click", function (e) {
  if (e.target === searchOverlay) closeSearch();
});

// ----- Nav active state (e.g. COLLECTIONS underlined when on #collections) -----
function updateNavActive() {
  const hash = window.location.hash || "#";
  document.querySelectorAll(".nav a[href^='#']").forEach((a) => {
    a.classList.toggle("nav-active", a.getAttribute("href") === hash);
  });
}
window.addEventListener("hashchange", updateNavActive);
updateNavActive();

// ----- Cart -----
const cartOverlay = document.getElementById("cart-overlay");
const cartBtn = document.getElementById("cart-btn");
const cartClose = document.getElementById("cart-close");
const cartBackBtn = document.getElementById("cart-back-btn");
const cartItemsEl = document.getElementById("cart-items");
const cartItemCountEl = document.getElementById("cart-item-count");
const headerCartCountEl = document.getElementById("header-cart-count");

let cart = [];
let cartIdCounter = 0;

function openCart() {
  cartOverlay.classList.add("is-open");
  cartOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartOverlay.classList.remove("is-open");
  cartOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function updateCartCount() {
  const total = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const label = total === 1 ? "1 item" : `${total} items`;
  if (cartItemCountEl) cartItemCountEl.textContent = label;
  if (headerCartCountEl) {
    headerCartCountEl.textContent = total;
    headerCartCountEl.classList.toggle("is-visible", total > 0);
  }
}

function renderCart() {
  if (!cartItemsEl) return;
  cartItemsEl.innerHTML = "";
  cart.forEach((item) => {
    const qty = item.qty || 1;
    const price = Number(item.price) || 0;
    const total = price * qty;
    const oldPrice = price * 1.2;
    const card = document.createElement("div");
    card.className = "cart-item";
    card.dataset.cartId = item.id;
    card.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image || ''}" alt="${item.name || 'Product'}" />
      </div>
      <div class="cart-item-details">
        <p class="cart-item-name">${item.name || "Name Product"}</p>
        <div class="cart-item-price">
          <span class="cart-item-price-old">${Math.round(oldPrice)}</span>
          <span class="cart-item-price-current">${total}</span>
        </div>
      </div>
      <button type="button" class="cart-item-remove" aria-label="Remove item" data-cart-id="${item.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;
    cartItemsEl.appendChild(card);
  });

  cartItemsEl.querySelectorAll(".cart-item-remove").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-cart-id");
      if (id) removeFromCart(id);
    });
  });

  updateCartCount();
}

function addToCart(name, price, image) {
  const id = "cart-" + ++cartIdCounter;
  cart.push({ id, name, price, image, qty: 1 });
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  renderCart();
  if (cart.length === 0) closeCart();
}

if (cartBtn) {
  cartBtn.addEventListener("click", openCart);
}

if (cartClose) {
  cartClose.addEventListener("click", closeCart);
}

if (cartBackBtn) {
  cartBackBtn.addEventListener("click", closeCart);
}

cartOverlay.addEventListener("click", function (e) {
  if (e.target === cartOverlay) closeCart();
});

document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", function () {
    const name = this.getAttribute("data-name") || "Name Product";
    const price = this.getAttribute("data-price") || "20";
    const image = this.getAttribute("data-image") || "";
    addToCart(name, price, image);
  });
});

renderCart();
