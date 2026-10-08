// ============ 导航：滚动时显示边框 + 移动端菜单 ============
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ============ 首屏错峰入场序列 ============
const heroReveals = document.querySelectorAll('.hero .reveal');
heroReveals.forEach((el, i) => {
  el.style.transitionDelay = (i * 90) + 'ms';
  requestAnimationFrame(() => el.classList.add('in'));
});

// ============ 滚动入场（IntersectionObserver） ============
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      // 同屏元素错峰
      const delay = (entry.target.dataset.delay || (idx % 4) * 80);
      entry.target.style.transitionDelay = delay + 'ms';
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal:not(.hero .reveal)').forEach(el => observer.observe(el));

// ============ 数字滚动计数 ============
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const decimals = (el.dataset.count.split('.')[1] || '').length;
  const dur = 1400;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
    const val = (target * eased).toFixed(decimals);
    el.textContent = val + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target.toFixed(decimals) + suffix;
  }
  requestAnimationFrame(tick);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

// ============ 跟随光标光点（触屏 / 降级动效下禁用） ============
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none)').matches;
const glow = document.querySelector('.cursor-glow');

if (glow && !reduceMotion && !isTouch) {
  let rx = 0, ry = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', (e) => {
    rx = e.clientX; ry = e.clientY;
    glow.style.opacity = '1';
  });
  (function loop() {
    cx += (rx - cx) * 0.18;
    cy += (ry - cy) * 0.18;
    glow.style.left = cx + 'px';
    glow.style.top = cy + 'px';
    requestAnimationFrame(loop);
  })();
  document.addEventListener('mouseleave', () => glow.style.opacity = '0');
}

// ============ 联系表单（前端校验 + 反馈，无后端） ============
const form = document.getElementById('ctaForm');
const hint = document.getElementById('ctaHint');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) {
      hint.style.color = 'var(--accent-3)';
      hint.textContent = '> 邮箱格式有误，请检查后重试';
      return;
    }
    hint.style.color = 'var(--accent)';
    hint.textContent = '> 已收到 ' + email + '，架构师将在 1 个工作日内联系你';
    form.reset();
  });
}
