// ============================================================
// Selat Manufacturing — 交互逻辑
// 移动菜单 / 吸顶阴影 / 滚动显现 / 数字滚动 / 滚动高亮 / 表单校验
// 全部动效在 prefers-reduced-motion 下自动降级
// ============================================================
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 吸顶导航阴影 ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 移动端菜单 ---------- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("primaryNav");
  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // 点击链接后关闭
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
    // Esc 关闭
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    // 点击外部关闭
    document.addEventListener("click", function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) closeNav();
    });
  }

  /* ---------- 滚动显现（IntersectionObserver） ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 数字滚动 ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-target"), 10) || 0;
    if (reduceMotion) { el.textContent = String(target); return; }
    var dur = 1100, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = String(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters = Array.prototype.slice.call(document.querySelectorAll(".count"));
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- 滚动高亮当前导航 ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav a:not(.nav__cta)"));
  if ("IntersectionObserver" in window && sections.length) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (a) {
            a.style.color = a.getAttribute("href") === "#" + id ? "var(--accent-strong)" : "";
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { sio.observe(s); });
  }

  /* ---------- 页脚年份 ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- 询盘表单校验 ---------- */
  var form = document.getElementById("quoteForm");
  var status = document.getElementById("formStatus");
  function setError(input, msg) {
    var field = input.closest(".field");
    var err = field ? field.querySelector(".field__err") : null;
    if (field) field.classList.toggle("has-error", !!msg);
    if (err) err.textContent = msg || "";
  }
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("f-name");
      var company = document.getElementById("f-company");
      var email = document.getElementById("f-email");
      var msg = document.getElementById("f-msg");
      var ok = true;

      [name, company, email, msg].forEach(function (i) { setError(i, ""); });
      if (!name.value.trim()) { setError(name, "Please enter your name."); ok = false; }
      if (!company.value.trim()) { setError(company, "Please enter your company."); ok = false; }
      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email.value.trim())) { setError(email, "Please enter a valid email."); ok = false; }
      if (!msg.value.trim()) { setError(msg, "Please tell us what you need."); ok = false; }

      if (!ok) {
        status.textContent = "Please fix the highlighted fields.";
        status.className = "form__status err";
        return;
      }
      // 演示：接入真实端点（Formspree / Cloudflare Worker）后改为 fetch 提交
      status.textContent = "Thanks, " + name.value.trim() + "! Your inquiry is ready to send — connect a form endpoint to receive it.";
      status.className = "form__status ok";
      form.reset();
    });
  }
})();
