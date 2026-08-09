/* ─────────────────────────────────────────────────
   SHINING LIGHT TRAVEL — main.js
   ───────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── 0. Scroll-to-top on load — but ONLY when there's no deep-link hash,
     so shared anchors like #experiences still land on the right section.
     Hero height is handled purely in CSS (100svh) to avoid mobile
     address-bar jump — no JS height code here. ── */
  if (history.scrollRestoration) history.scrollRestoration = 'manual';
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }

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
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function updateParallax() {
    if (!heroBg) return;
    /* clamp so the image never drifts far enough to expose an edge */
    const offset = Math.min(window.scrollY * 0.35, window.innerHeight * 0.4);
    heroBg.style.transform = 'translateY(' + offset + 'px)';
  }
  if (!prefersReducedMotion) {
    window.addEventListener('scroll', updateParallax, { passive: true });
  }

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

  function getFocusable() {
    if (!navOverlay) return [];
    return Array.prototype.slice.call(
      navOverlay.querySelectorAll('a[href], button:not([disabled])')
    );
  }

  function openOverlay() {
    if (!navOverlay) return;
    navOverlay.classList.add('open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    /* Move focus into the overlay so Tab is trapped inside it */
    if (overlayClose) overlayClose.focus();
  }

  function closeOverlay() {
    if (!navOverlay) return;
    const wasOpen = navOverlay.classList.contains('open');
    navOverlay.classList.remove('open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    /* Return focus to the hamburger that opened the menu */
    if (wasOpen && hamburger) hamburger.focus();
  }

  if (hamburger) hamburger.addEventListener('click', openOverlay);
  if (overlayClose) overlayClose.addEventListener('click', closeOverlay);

  overlayLinks.forEach(function (link) {
    link.addEventListener('click', closeOverlay);
  });

  /* Focus trap — while the overlay is open, keep Tab cycling within it */
  if (navOverlay) {
    navOverlay.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !navOverlay.classList.contains('open')) return;
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

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

  /* ── 6. Contact form — sends to Misty's inbox via Web3Forms (clean, no ads; her email stays hidden) ── */
  const FORM_ENDPOINT = 'https://api.web3forms.com/submit';

  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  if (form && success) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const nameInput  = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const nameError  = form.querySelector('#name-error');
    const emailError = form.querySelector('#email-error');
    const formError  = form.querySelector('#form-error');
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setFieldError(input, errorEl, message) {
      if (errorEl) errorEl.textContent = message || '';
      if (input) input.classList.toggle('is-invalid', !!message);
    }
    function clearFieldError(input, errorEl) { setFieldError(input, errorEl, ''); }

    function showFormError(message) {
      if (!formError) return;
      formError.textContent = message;
      formError.hidden = false;
    }
    function clearFormError() {
      if (!formError) return;
      formError.textContent = '';
      formError.hidden = true;
    }

    /* Clear a field's error the moment the user starts fixing it */
    if (nameInput)  nameInput.addEventListener('input', function () { clearFieldError(nameInput, nameError); });
    if (emailInput) emailInput.addEventListener('input', function () { clearFieldError(emailInput, emailError); });

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

      /* Honeypot — if the hidden botcheck box got ticked, it's a bot. Drop silently. */
      const hp = form.querySelector('input[name="botcheck"]');
      if (hp && hp.checked) return;

      /* Inline validation */
      clearFormError();
      clearFieldError(nameInput, nameError);
      clearFieldError(emailInput, emailError);

      const name  = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      let firstInvalid = null;

      if (!name) {
        setFieldError(nameInput, nameError, 'Please enter your name.');
        firstInvalid = firstInvalid || nameInput;
      }
      if (!email) {
        setFieldError(emailInput, emailError, 'Please enter your email address.');
        firstInvalid = firstInvalid || emailInput;
      } else if (!EMAIL_RE.test(email)) {
        setFieldError(emailInput, emailError, 'Please enter a valid email address.');
        firstInvalid = firstInvalid || emailInput;
      }

      if (firstInvalid) { firstInvalid.focus(); return; }

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
            showFormError('Sorry, something went wrong. Please try again or email us directly at misty@shininglighttravel.com.');
          }
        })
        .catch(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send My Request'; }
          showFormError('Network error — please try again or email us directly at misty@shininglighttravel.com.');
        });
    });
  }

  /* ── 7. Sticky mobile CTA — hidden while the hero or contact section is in view ── */
  const mobileCta = document.querySelector('.mobile-cta');
  const heroSection = document.getElementById('home');
  const contactSection = document.getElementById('contact');
  if (mobileCta && 'IntersectionObserver' in window) {
    let heroVisible = true;
    let contactVisible = false;
    const ctaObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.target.id === 'home') heroVisible = entry.isIntersecting;
        if (entry.target.id === 'contact') contactVisible = entry.isIntersecting;
      });
      if (heroVisible || contactVisible) {
        mobileCta.classList.remove('is-visible');
      } else {
        mobileCta.classList.add('is-visible');
      }
    }, { threshold: 0.12 });
    if (heroSection) ctaObserver.observe(heroSection);
    if (contactSection) ctaObserver.observe(contactSection);
  }

  /* ── 8. Process step numbers count up (01 → 05) when the section enters ── */
  const processSection = document.getElementById('process');
  if (processSection && 'IntersectionObserver' in window && !prefersReducedMotion) {
    const nums = processSection.querySelectorAll('.process__step-num');
    const targets = Array.prototype.map.call(nums, function (n) { return parseInt(n.textContent, 10) || 0; });
    let counted = false;
    const countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || counted) return;
        counted = true;
        Array.prototype.forEach.call(nums, function (n, i) {
          const target = targets[i];
          let cur = 0;
          n.textContent = '00';
          const tick = function () {
            cur++;
            n.textContent = String(Math.min(cur, target)).padStart(2, '0');
            if (cur < target) setTimeout(tick, 130);
          };
          setTimeout(tick, 200 + i * 120);
        });
        countObserver.disconnect();
      });
    }, { threshold: 0.3 });
    countObserver.observe(processSection);
  }

})();
