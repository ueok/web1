// ============ Element Vape 克隆 — 交互逻辑 ============

// ---------- 数据 ----------
const categories = [
  { name: "Disposables",   c1: "#e11d2a", c2: "#7a0f16" },
  { name: "Starter Kits",  c1: "#2c3340", c2: "#11151c" },
  { name: "E-Liquids",     c1: "#f5a623", c2: "#b86b00" },
  { name: "Pod Systems",   c1: "#3b82f6", c2: "#1e3a8a" },
  { name: "Tanks",         c1: "#10b981", c2: "#065f46" },
  { name: "Mods",          c1: "#8b5cf6", c2: "#4c1d95" },
  { name: "Coils",         c1: "#ec4899", c2: "#9d174d" },
  { name: "Accessories",   c1: "#0ea5e9", c2: "#075985" },
];

const products = {
  trending: [
    { t: "Foger Switch Pro 30K Disposable", p: 16.99, r: 415, b: "HOT" },
    { t: "Strawberry Dream Gelato · Liquid Assets 100mL", p: 9.99, r: 3 },
    { t: "Puffco PEAK PRO", p: 419.99, r: 215 },
    { t: "Vaporesso ARMOUR OCTA 220W Kit", p: 67.99, r: 88 },
    { t: "VIHO Shadow 75K Disposable", p: 18.99, r: 54 },
    { t: "iJoy XP50000 Disposable", p: 13.99, r: 87 },
    { t: "BD Vape Rayden 100 Box Mod", p: 54.99, r: 32 },
    { t: "Blinkers Flip Dual Chamber 2G", p: 19.99, r: 49 },
  ],
  new: [
    { t: "Uwell Valyrian IV Tank", p: 31.99, r: 42, b: "NEW" },
    { t: "VOOPOO Argus G4 35W Pod", p: 24.99, r: 10 },
    { t: "Geek Bar Pulse X2 50K Disposable", p: 19.99, r: 67 },
    { t: "Dr. Dabber Switch GO", p: 269.99, r: 6 },
    { t: "Geek Bar Pulse 2 25K Disposable", p: 14.99, r: 51 },
    { t: "SMOK NOVO 6 ULTRA Pod", p: 25.99, r: 43 },
    { t: "Lookah Mini Dragon Egg Kit", p: 59.99, r: 10 },
    { t: "VOOPOO DRAG 6 220W Kit", p: 69.99, r: 29 },
  ],
  best: [
    { t: "Dr. Dabber SWITCH 2", p: 299.99, r: 130, b: "TOP" },
    { t: "Geek Vape Aegis Legend 5 200W", p: 69.99, r: 97 },
    { t: "Puffco PEAK PRO", p: 419.99, r: 215 },
    { t: "Uwell Caliburn G5 35W Pod", p: 27.99, r: 48 },
    { t: "Boutiq SWITCH V5 THCA 2G", p: 44.99, r: 57 },
    { t: "Vaporesso XROS 6 30W Pod", p: 29.99, r: 20 },
    { t: "Foger Switch Pro 30K Disposable", p: 16.99, r: 415 },
    { t: "Geek Bar Pulse 50K Disposable", p: 21.99, r: 73 },
  ],
};

const brands = ["FOGER", "PUFFCO", "VOOPOO", "GEEK BAR", "UWELL", "SMOK", "VAPORESSO", "DR. DABBER", "LOOKAH", "IJOY", "CALIBURN", "GEEKVAPE"];

// ---------- 渲染 ----------
const $ = (s) => document.querySelector(s);
const money = (n) => "$" + n.toFixed(2);
const stars = (n) => "★".repeat(Math.min(5, Math.round(n / 100))) + "☆".repeat(5 - Math.min(5, Math.round(n / 100)));

function renderCategories() {
  $("#catGrid").innerHTML = categories.map(c => `
    <a class="cat-tile" href="#" style="--c1:${c.c1};--c2:${c.c2}"><span>${c.name}</span></a>
  `).join("");
}

function card(p) {
  return `
  <article class="prod-card">
    <div class="prod-card__media">
      ${p.b ? `<span class="prod-card__badge">${p.b}</span>` : ""}
      <div class="ph"></div>
      <button class="prod-card__quick" data-title="${p.t}" data-price="${p.p}" data-reviews="${p.r}">QUICK VIEW</button>
    </div>
    <div class="prod-card__body">
      <h3 class="prod-card__title">${p.t}</h3>
      <div class="prod-card__rating">${"★".repeat(5)} <em>${p.r} reviews</em></div>
      <div class="prod-card__foot">
        <span class="prod-card__price">${money(p.p)}</span>
        <button class="prod-card__add" data-title="${p.t}">+ Add</button>
      </div>
    </div>
  </article>`;
}

function renderProducts() {
  $("#trendingGrid").innerHTML = products.trending.map(card).join("");
  $("#newGrid").innerHTML = products.new.map(card).join("");
  $("#bestGrid").innerHTML = products.best.map(card).join("");
}

function renderBrands() {
  const row = brands.concat(brands).map(b => `<span class="brand-pill">${b}</span>`).join("");
  $("#brandTrack").innerHTML = row;
}

// ---------- 购物车 ----------
let cart = 0;
function addToCart(title) {
  cart++;
  $("#cartBadge").textContent = cart;
  $("#cartBadge").animate(
    [{ transform: "translate(35%,-30%) scale(1.4)" }, { transform: "translate(35%,-30%) scale(1)" }],
    { duration: 260, easing: "ease-out" }
  );
}

// ---------- 快速查看 ----------
function openModal(title, price, reviews) {
  $("#modalBody").innerHTML = `
    <div class="modal__media"><div class="ph"></div></div>
    <div class="modal__info">
      <h3>${title}</h3>
      <div class="stars">${"★".repeat(5)} <em>${reviews} reviews</em></div>
      <div class="price">${money(price)}</div>
      <p class="desc">Authentic product with full manufacturer warranty. Ships within 24h with trackable delivery. (Demo content — replace with real description.)</p>
      <button class="btn btn--primary" id="modalAdd">Add to Cart</button>
    </div>`;
  $("#modal").hidden = false;
  document.body.style.overflow = "hidden";
  $("#modalAdd").addEventListener("click", () => { addToCart(title); closeModal(); });
}
function closeModal() {
  $("#modal").hidden = true;
  document.body.style.overflow = "";
}

// ---------- 事件 ----------
function bindEvents() {
  // 移动端菜单
  $("#navToggle").addEventListener("click", () => $("#catnav").classList.toggle("open"));

  // 委托：加购 / 快速查看
  document.body.addEventListener("click", (e) => {
    const add = e.target.closest(".prod-card__add");
    if (add) { addToCart(add.dataset.title); return; }
    const qv = e.target.closest(".prod-card__quick");
    if (qv) { openModal(qv.dataset.title, parseFloat(qv.dataset.price), parseInt(qv.dataset.reviews, 10)); return; }
    if (e.target.matches("[data-close]")) closeModal();
  });

  // Esc 关闭弹窗
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  // 订阅
  $("#newsletterForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#newsletterEmail").value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    $("#newsletterNote").textContent = ok ? "✓ Subscribed! Check your inbox for a welcome deal." : "✗ Please enter a valid email address.";
    if (ok) $("#newsletterEmail").value = "";
  });
}

// ---------- 启动 ----------
document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderProducts();
  renderBrands();
  bindEvents();
});
