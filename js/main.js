// ============ Batam Vape Manufacturing — 交互逻辑 ============

// 移动端菜单
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
navToggle.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// FAQ 手风琴
document.querySelectorAll('.faq__q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const a = item.querySelector('.faq__a');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq__item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq__a').style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

// 数字滚动动画
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const dur = 1200;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => io.observe(el));

// 联系表单校验
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('cEmail').value.trim();
  const name = document.getElementById('cName').value.trim();
  const msg = document.getElementById('cMsg').value.trim();
  const note = document.getElementById('contactNote');
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !msg) {
    note.style.color = '#e2551a';
    note.textContent = '✗ Please complete name, a valid email and your message.';
    return;
  }
  note.style.color = '#19b3a6';
  note.textContent = '✓ Thanks! We will reply within 1 business day.';
  form.reset();
});

// 页头滚动阴影
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 10 ? '0 6px 22px rgba(13,32,58,.08)' : 'none';
}, { passive: true });
