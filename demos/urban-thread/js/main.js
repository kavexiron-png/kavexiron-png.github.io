/* Urban Thread — portfolio demo JS
   Client-side only: toy cart counter, toast notifications, mobile nav,
   newsletter success message, scroll-reveal via IntersectionObserver,
   and header shadow-on-scroll. No backend, no real cart/checkout logic. */

(function () {
  'use strict';

  /* ---------------- Cart (client-side toy state) ---------------- */
  var cartCount = 0;
  var cartBadge = document.getElementById('cart-badge');
  var toast = document.getElementById('toast');
  var toastMsg = document.getElementById('toast-msg');
  var toastTimer = null;

  function updateBadge() {
    cartBadge.textContent = String(cartCount);
    cartBadge.classList.add('show');
    cartBadge.classList.remove('pop');
    // force reflow so animation can retrigger
    void cartBadge.offsetWidth;
    cartBadge.classList.add('pop');
  }

  function showToast(message) {
    toastMsg.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 2200);
  }

  document.querySelectorAll('.add-to-cart').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var name = btn.getAttribute('data-name') || 'Item';
      cartCount += 1;
      updateBadge();
      showToast('Added "' + name + '" to cart');

      btn.classList.add('clicked');
      var originalText = btn.textContent;
      btn.textContent = 'Added ✓';
      setTimeout(function () {
        btn.classList.remove('clicked');
        btn.textContent = originalText;
      }, 900);
    });
  });

  document.getElementById('cart-btn').addEventListener('click', function () {
    if (cartCount === 0) {
      showToast('Your cart is empty — start adding some heat');
    } else {
      showToast(cartCount + ' item' + (cartCount === 1 ? '' : 's') + ' in your cart');
    }
  });

  /* ---------------- Mobile nav toggle ---------------- */
  var menuToggle = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var menuOpen = false;

  menuToggle.addEventListener('click', function () {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
  });

  document.querySelectorAll('.mobile-link').forEach(function (link) {
    link.addEventListener('click', function () {
      menuOpen = false;
      mobileMenu.classList.remove('open');
    });
  });

  /* ---------------- Header shadow on scroll ---------------- */
  var header = document.getElementById('site-header');
  function onScroll() {
    if (window.scrollY > 12) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Newsletter form (client-side only) ---------------- */
  var newsletterForm = document.getElementById('newsletter-form');
  var newsletterSuccess = document.getElementById('newsletter-success');

  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var emailInput = document.getElementById('newsletter-email');
    if (!emailInput.checkValidity()) {
      emailInput.reportValidity();
      return;
    }
    newsletterForm.classList.add('hidden');
    newsletterSuccess.classList.remove('hidden');
    showToast('Welcome to the list!');
  });

  /* ---------------- Scroll reveal via IntersectionObserver ---------------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: just show everything
    revealEls.forEach(function (el) {
      el.classList.add('in-view');
    });
  }

  /* ---------------- Smooth anchor scroll offset for sticky header ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = anchor.getAttribute('href');
      if (targetId.length < 2) return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var headerHeight = header.offsetHeight;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();
