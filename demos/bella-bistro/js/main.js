/* ============================================================
   Bella Bistro — vanilla JS interactivity
   - Sticky header style on scroll
   - Mobile nav toggle
   - Menu category tabs
   - IntersectionObserver scroll reveal
   - Fake client-side reservation form submission
   - Footer year
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Sticky header ---------- */
  var header = document.getElementById('site-header');
  function handleScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('nav-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var navIconOpen = document.getElementById('icon-open');
  var navIconClose = document.getElementById('icon-close');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (navIconOpen && navIconClose) {
        navIconOpen.classList.toggle('hidden', isOpen);
        navIconClose.classList.toggle('hidden', !isOpen);
      }
    });

    // Close mobile menu after tapping a link
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        if (navIconOpen && navIconClose) {
          navIconOpen.classList.remove('hidden');
          navIconClose.classList.add('hidden');
        }
      });
    });
  }

  /* ---------- Menu category tabs ---------- */
  var tabs = document.querySelectorAll('.menu-tab');
  var panels = document.querySelectorAll('.menu-panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-target');

      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');

      panels.forEach(function (panel) {
        panel.classList.toggle('active', panel.id === target);
      });
    });
  });

  /* ---------- Scroll reveal via IntersectionObserver ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: just show everything
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Fake reservation form submission ---------- */
  var reservationForm = document.getElementById('reservation-form');
  var successBox = document.getElementById('reservation-success');
  var successName = document.getElementById('success-name');
  var successDetails = document.getElementById('success-details');

  if (reservationForm) {
    reservationForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('res-name').value.trim() || 'Guest';
      var date = document.getElementById('res-date').value;
      var time = document.getElementById('res-time').value;
      var guests = document.getElementById('res-guests').value;

      var prettyDate = date
        ? new Date(date + 'T00:00:00').toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : 'your selected date';

      if (successName) {
        successName.textContent = name.split(' ')[0];
      }
      if (successDetails) {
        successDetails.textContent =
          'Table for ' + guests + ' on ' + prettyDate + ' at ' + time + '. ' +
          'A confirmation would normally be emailed to you — this demo form does not send real reservations.';
      }

      if (successBox) {
        successBox.classList.add('show');
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      reservationForm.reset();
      reservationForm.classList.add('hidden');
    });
  }

  var newReservationBtn = document.getElementById('new-reservation-btn');
  if (newReservationBtn) {
    newReservationBtn.addEventListener('click', function () {
      if (successBox) successBox.classList.remove('show');
      if (reservationForm) {
        reservationForm.classList.remove('hidden');
        reservationForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
