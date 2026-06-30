/* ─────────────────────────────────────────────────
   SHINING LIGHT TRAVEL — main.js
   ───────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── 0. Hero exact viewport height + scroll-to-top on load ── */
  if (history.scrollRestoration) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  const hero = document.querySelector('.hero');
  function setHeroHeight() {
    if (hero) hero.style.height = window.innerHeight + 'px';
  }
  setHeroHeight();
  window.addEventListener('resize', setHeroHeight, { passive: true });

  /* ── 1. Sticky nav ── */
  const nav = document.getElementById('main-nav');
  function updateNav() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── 2. Parallax hero background ── */
  const heroBg = document.querySelector('.hero__bg');
  function updateParallax() {
    if (!heroBg) return;
    const offset = window.scrollY * 0.35;
    heroBg.style.transform = 'translateY(' + offset + 'px)';
  }
  window.addEventListener('scroll', updateParallax, { passive: true });

  /* ── 3. Fade-in on scroll (IntersectionObserver) ── */
  const fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    /* Fallback: show everything immediately */
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── 4. Mobile hamburger + overlay ── */
  const hamburger    = document.getElementById('hamburger');
  const navOverlay   = document.getElementById('nav-overlay');
  const overlayClose = document.getElementById('overlay-close');
  const overlayLinks = navOverlay ? navOverlay.querySelectorAll('.nav__overlay-link') : [];

  function openOverlay() {
    navOverlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeOverlay() {
    navOverlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openOverlay);
  if (overlayClose) overlayClose.addEventListener('click', closeOverlay);

  overlayLinks.forEach(function (link) {
    link.addEventListener('click', closeOverlay);
  });

  /* Close overlay on Escape key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeOverlay();
  });

  /* ── 5. Smooth scroll for nav links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });

  /* ── 6. Contact form — send to Misty's email via a form service ── */
  /* ⚙️ SETUP — paste Misty's endpoint here to go LIVE (then the form actually sends):
       • Formspree:  'https://formspree.io/f/XXXXXXXX'        (hides her email — recommended)
       • FormSubmit: 'https://formsubmit.co/her@email.com'    (no signup needed)
     While this stays empty, the form shows the thank-you message but does NOT send
     (safe placeholder so nothing breaks before it's configured). */
  const FORM_ENDPOINT = '';

  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  if (form && success) {
    const submitBtn = form.querySelector('button[type="submit"]');

    function showSuccess() {
      if (submitBtn) submitBtn.style.display = 'none';
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(function () {
        form.reset();
        if (submitBtn) { submitBtn.style.display = ''; submitBtn.disabled = false; submitBtn.textContent = 'Send My Request'; }
        success.hidden = true;
      }, 8000);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* Honeypot — if the hidden field has a value, it's a bot. Drop silently. */
      const hp = form.querySelector('.form-hp');
      if (hp && hp.value) return;

      /* Basic validation */
      const name  = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();
      if (!name || !email) {
        form.querySelector('#name').focus();
        return;
      }

      /* No endpoint configured yet → show success without sending (placeholder) */
      if (!FORM_ENDPOINT) { showSuccess(); return; }

      /* Send the submission to the form service */
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(function (res) {
          if (res.ok) {
            showSuccess();
          } else {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send My Request'; }
            alert('Sorry, something went wrong. Please try again or email Misty directly.');
          }
        })
        .catch(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send My Request'; }
          alert('Network error — please try again or email Misty directly.');
        });
    });
  }

})();
