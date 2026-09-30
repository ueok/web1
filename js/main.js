// ============ 导航：滚动加边框 ============
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ============ 移动端菜单 ============
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
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

// ============ 作品筛选 ============
const filterBtns = document.querySelectorAll('.filter');
const workCards = document.querySelectorAll('.work-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const target = btn.dataset.filter;
    workCards.forEach(card => {
      const match = target === 'all' || card.dataset.category === target;
      if (match) {
        card.classList.remove('hidden');
        card.classList.remove('fade-in');
        // 触发重绘以重播进入动画
        void card.offsetWidth;
        card.classList.add('fade-in');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ============ 滚动进入动画 ============
const revealEls = document.querySelectorAll('.section, .work-card, .about-visual');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => el.classList.add('reveal'));
observer.observe(document.getElementById('works'));
document.querySelectorAll('.work-card, .about-visual').forEach(el => observer.observe(el));
