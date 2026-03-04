/* ============================================================
   VIDHYA PARTHI HIGHER SECONDARY SCHOOL
   script.js — Complete Final Version (All Phases)
   ============================================================ */

(function () {
  'use strict';

  /* ── Utility: throttle ───────────────────────────────────── */
  function throttle(fn, wait) {
    var last = 0;
    return function () {
      var now = Date.now();
      if (now - last >= wait) { last = now; fn.apply(this, arguments); }
    };
  }

  /* ── Utility: debounce ───────────────────────────────────── */
  function debounce(fn, wait) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn.bind(this, arguments), wait);
    };
  }

  /* ======================================================== */
  /*  1. PAGE LOAD FADE                                        */
  /* ======================================================== */
  function initPageLoadFade() {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.body.classList.add('page-ready');
      });
    });
  }

  /* ======================================================== */
  /*  2. NAVBAR — scroll effect + hamburger                    */
  /* ======================================================== */
  function initNavbar() {
    var navbar   = document.getElementById('navbar');
    var hamburger = document.getElementById('hamburger-btn');
    var mobileMenu = document.getElementById('nav-mobile');
    if (!navbar) return;

    /* Scroll effect */
    var onScroll = throttle(function () {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, 100);
    window.addEventListener('scroll', onScroll, { passive: true });

    /* Hamburger toggle */
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', function () {
        var isOpen = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', String(!isOpen));
        hamburger.classList.toggle('is-active', !isOpen);
        mobileMenu.classList.toggle('is-open', !isOpen);
        document.body.style.overflow = !isOpen ? 'hidden' : '';
      });

      /* Close on Escape */
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
          hamburger.setAttribute('aria-expanded', 'false');
          hamburger.classList.remove('is-active');
          mobileMenu.classList.remove('is-open');
          document.body.style.overflow = '';
        }
      });

      /* Close on link click */
      mobileMenu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          hamburger.setAttribute('aria-expanded', 'false');
          hamburger.classList.remove('is-active');
          mobileMenu.classList.remove('is-open');
          document.body.style.overflow = '';
        });
      });
    }
  }

  /* ======================================================== */
  /*  3. SMOOTH SCROLL                                         */
  /* ======================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href');
        if (id === '#') return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '80', 10);
        var top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ======================================================== */
  /*  4. ACTIVE NAV LINK (IntersectionObserver)               */
  /* ======================================================== */
  function initActiveNav() {
    var sections = document.querySelectorAll('section[id], footer[id]');
    var navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;
    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            link.classList.toggle('active', href === '#' + id);
          });
        }
      });
    }, { threshold: 0.35, rootMargin: '-60px 0px -40% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ======================================================== */
  /*  5. PARALLAX HERO                                         */
  /* ======================================================== */
  function initParallax() {
    var container = document.getElementById('hero-parallax');
    if (!container) return;
    var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReduced) return;

    var SPEED = 0.35;
    var hero  = document.getElementById('hero');

    var onScroll = throttle(function () {
      if (!hero) return;
      var rect = hero.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      container.style.transform = 'translateY(' + (window.scrollY * SPEED) + 'px)';
    }, 16);

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ======================================================== */
  /*  6. HERO STAT COUNTERS                                    */
  /* ======================================================== */
  function initHeroCounters() {
    var stats = document.querySelectorAll('.hero-stat-value[data-count]');
    if (!stats.length) return;

    var triggered = false;
    var hero = document.getElementById('hero');
    if (!hero) return;

    function runCounters() {
      if (triggered) return;
      triggered = true;
      stats.forEach(function (el) {
        animateCount(el, 1400);
      });
    }

    /* Run after page load when hero is visible */
    setTimeout(runCounters, 1200);
  }

  /* ======================================================== */
  /*  7. SCROLL REVEAL                                         */
  /* ======================================================== */
  function initScrollReveal() {
    var elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ======================================================== */
  /*  8. 3D TILT CARDS                                         */
  /* ======================================================== */
  function initTiltCards() {
    var cards = document.querySelectorAll('.tilt-card');
    if (!cards.length) return;
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (prefersReduced || isTouch) return;

    var MAX_TILT = 14;

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
        var dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
        card.style.transform = 'perspective(900px) rotateX(' + (-dy * MAX_TILT) + 'deg) rotateY(' + (dx * MAX_TILT) + 'deg) scale3d(1.03,1.03,1.03)';
        card.style.transition = 'transform .08s ease,box-shadow .25s ease,border-color .25s ease';
        card.style.setProperty('--mouse-x', ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
        card.style.setProperty('--mouse-y', ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%');
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
        card.style.transition = 'transform .45s cubic-bezier(.34,1.56,.64,1),box-shadow .25s ease,border-color .25s ease';
      });
    });
  }

  /* ======================================================== */
  /*  9. MEDIUM FILTER (ACADEMICS)                             */
  /* ======================================================== */
  function initMediumFilter() {
    var tabs  = document.querySelectorAll('.medium-tab');
    var cards = document.querySelectorAll('.acad-card[data-medium]');
    if (!tabs.length || !cards.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
        tab.classList.add('active');
        tab.setAttribute('aria-selected','true');
        var sel = tab.dataset.medium;
        cards.forEach(function (card) {
          var show = sel === 'all' || (card.dataset.medium || '').indexOf(sel) !== -1;
          card.classList.toggle('hidden-medium', !show);
        });
      });
    });
  }

  /* ======================================================== */
  /* 10. ACHIEVEMENT COUNTERS                                  */
  /* ======================================================== */
  function initAchievementCounters() {
    var numbers = document.querySelectorAll('.ach-number[data-target]');
    if (!numbers.length) return;

    if (!('IntersectionObserver' in window)) {
      numbers.forEach(function (el) {
        el.textContent = Number(el.dataset.target).toLocaleString() + (el.dataset.suffix || '+');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        animateCount(entry.target, 2000);
      });
    }, { threshold: 0.40 });

    numbers.forEach(function (el) { observer.observe(el); });
  }

  /* ======================================================== */
  /* 11. PROGRESS BARS                                         */
  /* ======================================================== */
  function initProgressBars() {
    var bars = document.querySelectorAll('.ach-progress-fill[data-width]');
    if (!bars.length) return;

    if (!('IntersectionObserver' in window)) {
      bars.forEach(function (b) { b.style.width = b.dataset.width + '%'; });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        setTimeout(function () { entry.target.style.width = entry.target.dataset.width + '%'; }, 300);
      });
    }, { threshold: 0.50 });

    bars.forEach(function (b) { observer.observe(b); });
  }

  /* ======================================================== */
  /* 12. GALLERY FILTER + LIGHTBOX                             */
  /* ======================================================== */
  function initGallery() {
    initGalleryFilter();
    initLightbox();
  }

  function initGalleryFilter() {
    var btns  = document.querySelectorAll('.gal-filter-btn');
    var items = document.querySelectorAll('.gal-item[data-category]');
    if (!btns.length || !items.length) return;

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-selected','true');
        var filter = btn.dataset.filter;
        items.forEach(function (item) {
          var show = filter === 'all' || item.dataset.category === filter;
          item.classList.toggle('hidden-gallery', !show);
        });
      });
    });
  }

  /* Lightbox */
  var lbImages   = [];
  var lbCurrent  = 0;

  function initLightbox() {
    var lb        = document.getElementById('lightbox');
    var lbImg     = document.getElementById('lightbox-img');
    var lbCaption = document.getElementById('lightbox-caption');
    var lbCounter = document.getElementById('lightbox-counter');
    var lbLoader  = document.getElementById('lightbox-loader');
    var lbClose   = document.getElementById('lightbox-close');
    var lbPrev    = document.getElementById('lightbox-prev');
    var lbNext    = document.getElementById('lightbox-next');
    var lbBackdrop = document.getElementById('lightbox-backdrop');

    if (!lb || !lbImg) return;

    /* Collect all gallery buttons */
    var galBtns = document.querySelectorAll('.gal-btn[data-src]');

    function buildImageList() {
      lbImages = [];
      document.querySelectorAll('.gal-item:not(.hidden-gallery) .gal-btn[data-src]').forEach(function (btn) {
        lbImages.push({ src: btn.dataset.src, caption: btn.dataset.caption || '' });
      });
    }

    function openLightbox(src, caption) {
      buildImageList();
      lbCurrent = lbImages.findIndex(function (img) { return img.src === src; });
      if (lbCurrent < 0) lbCurrent = 0;
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
      showImage(lbCurrent);
    }

    function closeLightbox() {
      lb.hidden = true;
      document.body.style.overflow = '';
      lbImg.src = '';
    }

    function showImage(idx) {
      if (!lbImages.length) return;
      idx = (idx + lbImages.length) % lbImages.length;
      lbCurrent = idx;
      var item = lbImages[idx];

      /* Show loader */
      lbImg.classList.add('loading');
      if (lbLoader) { lbLoader.classList.add('visible'); }

      var newImg = new Image();
      newImg.onload = function () {
        lbImg.src = item.src;
        lbImg.alt = item.caption;
        lbImg.classList.remove('loading');
        if (lbLoader) lbLoader.classList.remove('visible');
      };
      newImg.onerror = function () {
        lbImg.classList.remove('loading');
        if (lbLoader) lbLoader.classList.remove('visible');
      };
      newImg.src = item.src;

      if (lbCaption) lbCaption.textContent = item.caption;
      if (lbCounter) lbCounter.textContent = (idx + 1) + ' / ' + lbImages.length;

      /* Hide prev/next if only one image */
      if (lbPrev) lbPrev.style.display = lbImages.length < 2 ? 'none' : '';
      if (lbNext) lbNext.style.display = lbImages.length < 2 ? 'none' : '';
    }

    /* Attach open events */
    galBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        openLightbox(btn.dataset.src, btn.dataset.caption || '');
      });
    });

    /* Controls */
    if (lbClose)   lbClose.addEventListener('click',   closeLightbox);
    if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);
    if (lbPrev)    lbPrev.addEventListener('click', function () { showImage(lbCurrent - 1); });
    if (lbNext)    lbNext.addEventListener('click', function () { showImage(lbCurrent + 1); });

    /* Keyboard */
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape')      { closeLightbox(); }
      if (e.key === 'ArrowLeft')   { showImage(lbCurrent - 1); }
      if (e.key === 'ArrowRight')  { showImage(lbCurrent + 1); }
    });

    /* Touch swipe */
    var touchStartX = 0;
    lb.addEventListener('touchstart', function (e) { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { showImage(diff > 0 ? lbCurrent + 1 : lbCurrent - 1); }
    }, { passive: true });
  }

  /* ======================================================== */
  /* 13. CONTACT FORM VALIDATION                               */
  /* ======================================================== */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var successMsg = document.getElementById('form-success');
    var submitBtn  = form.querySelector('.form-submit-btn');

    function validateField(input) {
      var errorEl = input.closest('.form-group') && input.closest('.form-group').querySelector('.form-error');
      var val = input.value.trim();
      var valid = true;
      var msg   = '';

      if (input.required && !val) {
        valid = false; msg = 'This field is required.';
      } else if (input.type === 'email' && val && val.indexOf('@') < 1) {
        valid = false; msg = 'Please enter a valid email address.';
      }

      input.classList.toggle('error', !valid);
      if (errorEl) errorEl.textContent = msg;
      return valid;
    }

    /* Real-time validation */
    form.querySelectorAll('.form-input').forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        if (input.classList.contains('error')) validateField(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var inputs = form.querySelectorAll('.form-input[required]');
      var allValid = true;
      inputs.forEach(function (inp) { if (!validateField(inp)) allValid = false; });
      if (!allValid) return;

      /* Simulate submission */
      if (submitBtn) submitBtn.classList.add('loading');
      setTimeout(function () {
        if (submitBtn) submitBtn.classList.remove('loading');
        if (successMsg) { successMsg.hidden = false; }
        form.reset();
        setTimeout(function () {
          if (successMsg) successMsg.hidden = true;
        }, 6000);
      }, 1400);
    });
  }

  /* ======================================================== */
  /* 14. SCROLL TO TOP BUTTON                                  */
  /* ======================================================== */
  function initScrollTop() {
    var btn = document.getElementById('scroll-top');
    if (!btn) return;

    var onScroll = throttle(function () {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, 100);

    window.addEventListener('scroll', onScroll, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ======================================================== */
  /* HELPER: animateCount                                      */
  /* ======================================================== */
  function animateCount(el, duration) {
    var target  = parseInt(el.dataset.target || el.dataset.count, 10);
    var suffix  = el.dataset.suffix || '+';
    if (isNaN(target)) return;
    var start = performance.now();

    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function frame(now) {
      var progress = Math.min((now - start) / duration, 1);
      var value    = Math.floor(easeOut(progress) * target);
      el.textContent = value.toLocaleString() + (progress < 1 ? '' : suffix);
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ======================================================== */
  /* INIT ALL                                                  */
  /* ======================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initPageLoadFade();
    initNavbar();
    initSmoothScroll();
    initActiveNav();
    initParallax();
    initHeroCounters();
    initScrollReveal();
    initTiltCards();
    initMediumFilter();
    initAchievementCounters();
    initProgressBars();
    initGallery();
    initContactForm();
    initScrollTop();
  });

})();
