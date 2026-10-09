/* ==========================================================================
   Kavexiron — vanilla JS interactions
   No dependencies, no backend. Progressive enhancement only.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------- */
  /* Sticky header shadow on scroll                                     */
  /* ---------------------------------------------------------------- */
  const header = document.getElementById('site-header');
  const onScrollHeader = () => {
    if (window.scrollY > 12) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------------------------------------------------------------- */
  /* Mobile nav toggle                                                   */
  /* ---------------------------------------------------------------- */
  const menuBtn = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
    });

    // Close mobile menu after tapping a link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------------------- */
  /* Smooth scroll for in-page anchor links                            */
  /* ---------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const offset = 84; // header height
        const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---------------------------------------------------------------- */
  /* IntersectionObserver scroll-reveal animations                      */
  /* ---------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------------------------------------------------------------- */
  /* Testimonial carousel                                                */
  /* ---------------------------------------------------------------- */
  const track = document.getElementById('carousel-track');
  const dotsWrap = document.getElementById('carousel-dots');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (track) {
    const slides = Array.from(track.children);
    let index = 0;
    let autoplayId = null;

    const dots = slides.map((_, i) => {
      const d = document.createElement('button');
      d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
      return d;
    });

    function render() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
      restartAutoplay();
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function restartAutoplay() {
      if (autoplayId) clearInterval(autoplayId);
      autoplayId = setInterval(next, 6500);
    }

    nextBtn && nextBtn.addEventListener('click', next);
    prevBtn && prevBtn.addEventListener('click', prev);

    // Touch swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    }, { passive: true });

    render();
    restartAutoplay();
  }

  /* ---------------------------------------------------------------- */
  /* Video mock "play" interaction (cosmetic — no real video needed)    */
  /* ---------------------------------------------------------------- */
  document.querySelectorAll('[data-play-video]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.video-mock')?.classList.add('ring-4', 'ring-lime');
      // In production this would swap in a live <iframe> embed.
      // Demo build keeps a styled mock to avoid shipping placeholder video IDs.
      alert('Demo build: in the live site this launches the full coaching intro video.');
    });
  });

  /* ---------------------------------------------------------------- */
  /* Booking / contact form — client-side only                          */
  /* ---------------------------------------------------------------- */
  const form = document.getElementById('booking-form');
  const successBox = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('#f-name');
      const email = form.querySelector('#f-email');
      let valid = true;

      [name, email].forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.classList.add('border-ember');
        } else {
          field.classList.remove('border-ember');
        }
      });

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email.value && !emailPattern.test(email.value)) {
        valid = false;
        email.classList.add('border-ember');
      }

      if (!valid) return;

      form.reset();
      form.classList.add('hidden');
      successBox.classList.add('show');
      successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  const resetFormBtn = document.getElementById('form-reset-btn');
  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
      successBox.classList.remove('show');
      form.classList.remove('hidden');
    });
  }

  /* ---------------------------------------------------------------- */
  /* Current year in footer                                             */
  /* ---------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
