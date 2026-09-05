(function () {
  'use strict';
  function currentOfferText() {
    var months = [
      'январе', 'феврале', 'марте', 'апреле', 'мае', 'июне',
      'июле', 'августе', 'сентябре', 'октябре', 'ноябре', 'декабре'
    ];
    var monthNumber = Number(new Intl.DateTimeFormat('en', {
      month: 'numeric',
      timeZone: 'Asia/Jerusalem'
    }).format(new Date()));
    return '2 семьи в ' + months[monthNumber - 1];
  }
  function keepCurrentOfferMonth() {
    var label = document.querySelector('.offer-note span');
    var currentText = currentOfferText();
    if (label && label.textContent !== currentText) {
      label.textContent = currentText;
    }
  }
  keepCurrentOfferMonth();
  new MutationObserver(keepCurrentOfferMonth).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });
  function sendEvent(name, parameters) {
    if (typeof window.gtag === 'function') window.gtag('event', name, parameters || {});
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
  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-section-name], section[id]'));
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
  sections.forEach(function (section) { observer.observe(section); });
})();
