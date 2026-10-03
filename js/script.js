/* =========================================================================
   JUNIOR COURT COUNSEL — SITE SCRIPT
   Handles: mobile nav, active link highlight, scroll reveals,
   back-to-top button, accordion (Get Involved page), and the
   contact form (front-end validation + mailto handoff).
   ========================================================================= */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      links.classList.toggle('open');
    });
    // close menu after a link is tapped (mobile)
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Highlight current page in nav ---------- */
  var here = (window.location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var target = a.getAttribute('href');
    if (target === here || (here === '' && target === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Back to top button ---------- */
  var toTop = document.querySelector('.to-top');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('show', window.scrollY > 480);
    });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Accordion (Get Involved / FAQ) ---------- */
  document.querySelectorAll('.accordion-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      // close siblings within the same accordion group
      var group = btn.closest('.accordion');
      if (group) {
        group.querySelectorAll('.accordion-trigger').forEach(function (other) {
          if (other !== btn) {
            other.setAttribute('aria-expanded', 'false');
            var otherPanel = document.getElementById(other.getAttribute('aria-controls'));
            if (otherPanel) otherPanel.style.maxHeight = null;
          }
        });
      }

      btn.setAttribute('aria-expanded', String(!isOpen));
      if (!isOpen) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      } else {
        panel.style.maxHeight = null;
      }
    });
  });

  /* ---------- Team page: click any photo to view it full-size ----------
     Reuses the same #lightbox element as the Activities gallery. Clicking
     a team photo opens it full-size, with prev/next cycling through the
     whole leadership tree in order. */
  var teamPhotos = document.querySelectorAll('.team-photo');
  var teamLightbox = document.getElementById('lightbox');
  if (teamLightbox && teamPhotos.length) {
    var tlImg = teamLightbox.querySelector('img');
    var tlCaption = teamLightbox.querySelector('.lightbox-caption');
    var tlIndex = 0;

    function showTeamPhoto(index) {
      tlIndex = (index + teamPhotos.length) % teamPhotos.length;
      var img = teamPhotos[tlIndex].querySelector('img');
      if (!img) return;
      tlImg.src = img.src;
      tlImg.alt = img.alt;
      tlCaption.textContent = img.alt;
    }
    function openTeamLightbox(index) {
      showTeamPhoto(index);
      teamLightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function closeTeamLightbox() {
      teamLightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    teamPhotos.forEach(function (photo, i) {
      photo.addEventListener('click', function () { openTeamLightbox(i); });
    });
    teamLightbox.querySelector('.lightbox-close').addEventListener('click', closeTeamLightbox);
    teamLightbox.querySelector('.lightbox-nav.prev').addEventListener('click', function () { showTeamPhoto(tlIndex - 1); });
    teamLightbox.querySelector('.lightbox-nav.next').addEventListener('click', function () { showTeamPhoto(tlIndex + 1); });
    teamLightbox.addEventListener('click', function (e) {
      if (e.target === teamLightbox) closeTeamLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (!teamLightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeTeamLightbox();
      if (e.key === 'ArrowRight') showTeamPhoto(tlIndex + 1);
      if (e.key === 'ArrowLeft') showTeamPhoto(tlIndex - 1);
    });
  }

  /* ---------- Hero slider ---------- */
  var slider = document.querySelector('.hero-slider');
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dotsWrap = slider.querySelector('.hero-dots');
    var current = slides.findIndex(function (s) { return s.classList.contains('is-active'); });
    if (current < 0) current = 0;
    var timer = null;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function renderDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      slides.forEach(function (_, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Show slide ' + (i + 1));
        if (i === current) b.classList.add('is-active');
        b.addEventListener('click', function () { goTo(i); });
        dotsWrap.appendChild(b);
      });
    }

    function goTo(index) {
      slides[current].classList.remove('is-active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      renderDots();
      restart();
    }

    function restart() {
      if (reduceMotion) return;
      clearInterval(timer);
      timer = setInterval(function () { goTo(current + 1); }, 6500);
    }

    var prevBtn = slider.querySelector('.hero-arrow.prev');
    var nextBtn = slider.querySelector('.hero-arrow.next');
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

    slider.addEventListener('mouseenter', function () { clearInterval(timer); });
    slider.addEventListener('mouseleave', restart);

    if (slides.length > 1) {
      renderDots();
      restart();
    }
  }

  /* ---------- Activities gallery: filtering ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');
  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var cat = btn.getAttribute('data-filter');
        galleryItems.forEach(function (item) {
          var show = cat === 'all' || item.getAttribute('data-category') === cat;
          item.classList.toggle('is-hidden', !show);
        });
      });
    });
  }

  /* ---------- Activities gallery: lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  if (lightbox && galleryItems.length) {
    var lbImg = lightbox.querySelector('img');
    var lbCaption = lightbox.querySelector('.lightbox-caption');
    var visibleItems = function () {
      return Array.prototype.slice.call(galleryItems).filter(function (i) {
        return !i.classList.contains('is-hidden');
      });
    };
    var lbIndex = 0;

    function openLightbox(index) {
      var items = visibleItems();
      lbIndex = index;
      var item = items[lbIndex];
      if (!item) return;
      var img = item.querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCaption.textContent = img.alt;
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    function step(delta) {
      var items = visibleItems();
      if (!items.length) return;
      lbIndex = (lbIndex + delta + items.length) % items.length;
      var img = items[lbIndex].querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCaption.textContent = img.alt;
    }

    galleryItems.forEach(function (item, i) {
      item.addEventListener('click', function () {
        openLightbox(visibleItems().indexOf(item));
      });
    });
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-nav.prev').addEventListener('click', function () { step(-1); });
    lightbox.querySelector('.lightbox-nav.next').addEventListener('click', function () { step(1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    });
  }

  /* ---------- Contact form ----------
     Submits to FormSubmit (https://formsubmit.co) via fetch, so the
     visitor never leaves the page. FormSubmit forwards the message to
     Junior Court Counsel's inbox and sets the Reply-To header to the
     visitor's own email, so replying from Gmail/Outlook works normally.
     See the HTML comment under the form in contact.html for the
     one-time activation step this requires. */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.getElementById('form-status');
      var valid = true;

      form.querySelectorAll('[required]').forEach(function (field) {
        var wrap = field.closest('.field');
        var value = field.value.trim();
        var ok = value.length > 0;
        if (field.type === 'email' && ok) {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }
        if (wrap) wrap.classList.toggle('error', !ok);
        if (!ok) valid = false;
      });

      if (!valid) {
        status.textContent = 'Please fill in all required fields correctly before sending.';
        status.className = 'form-status show error';
        return;
      }

      var name = form.querySelector('#name').value.trim();
      var email = form.querySelector('#email').value.trim();
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalBtnText = submitBtn ? submitBtn.textContent : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }
      status.textContent = '';
      status.className = 'form-status';

      var mailtoFallback = function (reason) {
        var subject = form.querySelector('#subject') ? form.querySelector('#subject').value.trim() : 'Website enquiry';
        var message = form.querySelector('#message').value.trim();
        var mailto = 'mailto:juniorcourtcounsel26@gmail.com' +
          '?subject=' + encodeURIComponent('[JCC Website] ' + subject) +
          '&body=' + encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
        status.textContent = reason + ' Opening your email app instead so you can send it directly.';
        status.className = 'form-status show error';
        window.location.href = mailto;
      };

      fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Request failed');
          return response.json();
        })
        .then(function () {
          status.textContent = 'Thank you, ' + name.split(' ')[0] + '. Your message has been sent to Junior Court Counsel — we\'ll reply to ' + email + ' as soon as we can.';
          status.className = 'form-status show success';
          form.reset();
        })
        .catch(function () {
          mailtoFallback('We could not confirm delivery just now (this form may need its one-time activation — see the setup note in contact.html).');
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
        });
    });

    // clear error state as the visitor types
    form.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        var wrap = field.closest('.field');
        if (wrap) wrap.classList.remove('error');
      });
    });
  }

});
