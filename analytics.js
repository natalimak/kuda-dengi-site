(function () {
  'use strict';

  /*
   * In-page navigation fix:
   * The Vinext client router treats hash-only links as RSC navigations and
   * repeatedly requests /.rsc?_rsc, which returns 404 on GitHub Pages.
   * Intercept those links before the router and perform a normal section
   * scroll without a server request.
   */
  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link) return;

    var hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    var target;
    try {
      target = document.querySelector(hash);
    } catch (error) {
      return;
    }
    if (!target) return;

    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === 'function') {
      event.stopImmediatePropagation();
    }

    var root = document.documentElement;
    var body = document.body;
    root.style.removeProperty('overflow');
    root.style.removeProperty('overflow-y');
    root.style.removeProperty('height');
    root.style.removeProperty('touch-action');
    body.style.removeProperty('overflow');
    body.style.removeProperty('overflow-y');
    body.style.removeProperty('height');
    body.style.removeProperty('position');
    body.style.removeProperty('touch-action');

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.location.hash !== hash) {
      window.history.pushState(null, '', hash);
    }
  }, true);

  function removeOfferLimit() {
    var label = document.querySelector('.offer-note span');
    if (label) label.remove();
  }

  removeOfferLimit();
  new MutationObserver(removeOfferLimit).observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  function sendEvent(name, parameters) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, parameters || {});
    }
  }

  function sectionName(element) {
    var section = element.closest('[data-section-name], section[id]');
    if (section) return section.getAttribute('data-section-name') || section.id;
    if (element.closest('header')) return 'header';
    if (element.classList.contains('mobile-cta')) return 'mobile-fixed';
    return 'unknown';
  }

  function buttonLocation(element) {
    if (element.classList.contains('mobile-cta')) return 'mobile-fixed';
    if (element.closest('header')) return 'header';
    var section = sectionName(element);
    return section === 'unknown' ? 'other' : section;
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href*="wa.me"], a[href*="whatsapp.com"]');
    if (!link) return;
    sendEvent('whatsapp_click', {
      section_name: sectionName(link),
      button_location: buttonLocation(link),
      link_url: link.href,
      link_text: (link.textContent || '').trim().slice(0, 100)
    });
  });

  var sections = Array.prototype.slice.call(
    document.querySelectorAll('[data-section-name], section[id]')
  );
  var seen = Object.create(null);

  if (!('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var name = entry.target.getAttribute('data-section-name') || entry.target.id;
      if (!name || seen[name]) return;
      seen[name] = true;
      sendEvent('section_view', {
        section_name: name,
        section_order: sections.indexOf(entry.target) + 1
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.35 });

  sections.forEach(function (section) {
    observer.observe(section);
  });
})();
