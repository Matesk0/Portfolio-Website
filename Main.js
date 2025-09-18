document.addEventListener('DOMContentLoaded', () => {

  // ===== Section Reveal =====
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.2 });
  sections.forEach(sec => observer.observe(sec));

  // ===== Tabs =====
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-content').forEach(tc => tc.classList.add('hidden'));
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.remove('hidden');
    });
  });

  // ===== Smooth scroll system =====
  let scrollTarget = window.scrollY;
  let isScrolling = false;

  function smoothScrollStep() {
    const current = window.scrollY;
    const distance = scrollTarget - current;
    if (Math.abs(distance) > 1) {
      window.scrollTo(0, current + distance * 0.15);
      requestAnimationFrame(smoothScrollStep);
    } else {
      window.scrollTo(0, scrollTarget);
      isScrolling = false;
    }
  }

  // ===== Nav link click =====
  document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const href = link.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;

      const navHeight = document.querySelector('nav')?.offsetHeight || 0;
      scrollTarget = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;

      if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(smoothScrollStep);
      }
    });
  });

  // ===== Wheel scroll (only for wheel, not scrollbar drag) =====
  let isPointerDown = false;

  window.addEventListener('pointerdown', e => {
    // Detect if user clicks or drags scrollbar
    isPointerDown = e.target === document.body || e.target === document.documentElement;
  });

  window.addEventListener('pointerup', () => {
    isPointerDown = false;
  });

  window.addEventListener('wheel', e => {
    // Only smooth scroll if not dragging scrollbar
    if (isPointerDown) return; // allow native scroll
    e.preventDefault();
    scrollTarget += e.deltaY;
    scrollTarget = Math.max(0, Math.min(scrollTarget, document.body.scrollHeight - window.innerHeight));
    if (!isScrolling) {
      isScrolling = true;
      requestAnimationFrame(smoothScrollStep);
    }
  }, { passive: false });

});
