// LaunchPad portfolio demo — vanilla JS
// Features: mobile nav toggle, smooth scroll (native CSS handles most),
// pricing Monthly/Annual toggle, FAQ accordion, scroll-reveal via IntersectionObserver.

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Mobile nav toggle ---------------- */
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navIconOpen = document.getElementById('icon-open');
  const navIconClose = document.getElementById('icon-close');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (navIconOpen && navIconClose) {
        navIconOpen.classList.toggle('hidden', isOpen);
        navIconClose.classList.toggle('hidden', !isOpen);
      }
    });

    // Close mobile menu when a nav link is tapped
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        if (navIconOpen && navIconClose) {
          navIconOpen.classList.remove('hidden');
          navIconClose.classList.add('hidden');
        }
      });
    });
  }

  /* ---------------- Sticky header shadow on scroll ---------------- */
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 12) {
        header.classList.add('shadow-md');
      } else {
        header.classList.remove('shadow-md');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- Pricing Monthly / Annual toggle ---------------- */
  const pricingToggle = document.getElementById('pricing-toggle');
  const priceEls = document.querySelectorAll('[data-monthly][data-annual]');
  const periodLabels = document.querySelectorAll('.price-period');
  const annualSavingsEls = document.querySelectorAll('.annual-savings');
  const labelMonthly = document.getElementById('label-monthly');
  const labelAnnual = document.getElementById('label-annual');

  function setPricing(isAnnual) {
    priceEls.forEach((el) => {
      const value = isAnnual ? el.dataset.annual : el.dataset.monthly;
      el.style.opacity = '0';
      window.setTimeout(() => {
        el.textContent = value;
        el.style.opacity = '1';
      }, 120);
    });
    periodLabels.forEach((el) => {
      el.textContent = isAnnual ? '/mo, billed annually' : '/month';
    });
    annualSavingsEls.forEach((el) => {
      el.classList.toggle('hidden', !isAnnual);
    });
    if (labelMonthly && labelAnnual) {
      labelMonthly.classList.toggle('text-slate-900', !isAnnual);
      labelMonthly.classList.toggle('text-slate-400', isAnnual);
      labelAnnual.classList.toggle('text-slate-900', isAnnual);
      labelAnnual.classList.toggle('text-slate-400', !isAnnual);
    }
  }

  if (pricingToggle) {
    let annual = false;
    pricingToggle.addEventListener('click', () => {
      annual = !annual;
      pricingToggle.classList.toggle('active', annual);
      pricingToggle.setAttribute('aria-checked', annual ? 'true' : 'false');
      setPricing(annual);
    });
    // initialize at Monthly
    setPricing(false);
  }

  /* ---------------- FAQ accordion ---------------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others (single-open accordion)
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('open');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = '0px';
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = '0px';
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------------- Scroll reveal via IntersectionObserver ---------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: just show everything
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ---------------- Current year in footer ---------------- */
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
